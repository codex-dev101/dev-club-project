import { SUPABASE_FUNCTIONS_URL, getCbtSupabase } from "./config.js";
import { hashPassword, generateMatricId, getRegisteredAccounts, setCurrentUser } from "./storage.js";

// --- USER SIGN IN ---
// Accepts either a username OR an email via the single param `usernameOrEmail`.
// If a username is provided, the client contacts a server-side Supabase Edge Function
// which performs the username -> email lookup and signs in server-side using a service key.
// This prevents exposing emails or the service role key to the frontend.
async function signInStudent({ usernameOrEmail, password }) {
  const input = String(usernameOrEmail || "").trim();
  if (!input) return { success: false, message: "Please enter your username or email." };
  if (!password) return { success: false, message: "Password is required." };

  const isEmail = input.includes("@");
  const localAccounts = getRegisteredAccounts();
  const inputHash = await hashPassword(password);

  // If input looks like an email, use the existing email sign-in flow for compatibility.
  if (isEmail) {
    const cleanEmail = input.toLowerCase();
    const localMatch = localAccounts.find(a => a.email === cleanEmail);
    const client = getCbtSupabase();
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });
        if (!error && data?.user) {
          const userObj = {
            id: data.user.id,
            fullName: data.user.user_metadata?.full_name || localMatch?.fullName || "Student",
            email: data.user.email || cleanEmail,
            matricNo: data.user.user_metadata?.matric_no || localMatch?.matricNo || generateMatricId()
          };
          setCurrentUser(userObj);
          return { success: true, user: userObj, message: "Signed in successfully via Supabase Auth!" };
        }
      } catch (err) {
        console.warn("Exception during Supabase signin:", err);
      }
    }

    // Fallback to local cache if available (backwards compatibility)
    const localMatchFallback = localAccounts.find(a => a.email === cleanEmail);
    if (localMatchFallback && localMatchFallback.passwordHash === inputHash) {
      setCurrentUser({ id: localMatchFallback.id, fullName: localMatchFallback.fullName, email: localMatchFallback.email, matricNo: localMatchFallback.matricNo });
      return { success: true, user: localMatchFallback, message: "Signed in (local fallback)." };
    }
    return { success: false, message: "Invalid username or password." };
  }

  // Username flow: normalize username (case-insensitive uniqueness enforced server-side)
  const cleanUsername = input.toLowerCase();
  const cachedUsernameAccount = localAccounts.find(a => (a.username || "").toLowerCase() === cleanUsername);
  const signInFromLocalCache = () => {
    if (!cachedUsernameAccount || cachedUsernameAccount.passwordHash !== inputHash) return null;

    const userObj = {
      id: cachedUsernameAccount.id,
      fullName: cachedUsernameAccount.fullName,
      username: cachedUsernameAccount.username,
      email: cachedUsernameAccount.email,
      matricNo: cachedUsernameAccount.matricNo
    };
    setCurrentUser(userObj);
    return { success: true, user: userObj, message: "Signed in successfully (local)." };
  };
  const unavailableMessage = "Username sign-in is unavailable right now. Try signing in with your email or try again later.";

  // If Supabase Edge Function URL is configured, call it to perform secure username sign-in on the server.
  if (SUPABASE_FUNCTIONS_URL) {
    try {
      const resp = await fetch(`${SUPABASE_FUNCTIONS_URL}/username-signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUsername, password })
      });
      const json = await resp.json().catch(() => null);
      // Do not reveal whether username exists. Edge Function should also return generic errors.
      if (resp.ok && json && json.success && json.user) {
        // json.user should contain non-sensitive profile info (id, fullName, username, matricNo)
        const u = json.user;
        const userObj = {
          id: u.id,
          fullName: u.fullName || u.full_name || "Student",
          username: u.username || cleanUsername,
          email: u.email || "",
          matricNo: u.matricNo || u.matric_no || generateMatricId()
        };
        setCurrentUser(userObj);
        return { success: true, user: userObj, message: "Signed in successfully!" };
      }
      // Generic error message - do not expose existence of username/email
      if (resp.status === 404 || resp.status >= 500) {
        console.error("Username sign-in service is unavailable:", resp.status);
        return signInFromLocalCache() || { success: false, message: unavailableMessage };
      }
      return { success: false, message: json?.message || "Invalid username or password." };
    } catch (err) {
      console.warn("Error calling username-signin function:", err);
      return signInFromLocalCache() || { success: false, message: unavailableMessage };
    }
  }

  // If there is no server-side function configured, optionally allow local username lookup (only for accounts created locally)
  const localMatch = localAccounts.find(a => (a.username || "").toLowerCase() === cleanUsername);
  if (localMatch) {
    if (localMatch.passwordHash === inputHash) {
      const userObj = {
        id: localMatch.id,
        fullName: localMatch.fullName,
        username: localMatch.username,
        email: localMatch.email,
        matricNo: localMatch.matricNo
      };
      setCurrentUser(userObj);
      return { success: true, user: userObj, message: "Signed in successfully (local)." };
    } else {
      return { success: false, message: "Incorrect password. Please verify your credentials and try again." };
    }
  }

  // No server function and no local match: instruct admin to deploy the Edge Function to use username sign-in.
  return { success: false, message: "Username login is not available. Please contact support or try email login." };
}


export { signInStudent };
