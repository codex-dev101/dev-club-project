import { getCbtSupabase } from "./config.js";
import { hashPassword, generateMatricId, getRegisteredAccounts, saveRegisteredAccounts, isValidEmail, validatePassword, setCurrentUser } from "./storage.js";

// --- USER REGISTRATION ---
async function registerStudent({ fullName, username, email, password, confirmPassword }) {
  const cleanName = String(fullName || "").trim();
  const cleanUsername = String(username || "").trim().toLowerCase();
  const cleanEmail = String(email || "").trim().toLowerCase();

  // 1. Validation checks
  if (!cleanName) {
    return { success: false, message: "Full Name is required." };
  }
  // Username: required, 3-30 chars, letters/numbers/underscore/dot
  const usernameRegex = /^[a-z0-9_.]{3,30}$/;
  if (!cleanUsername || !usernameRegex.test(cleanUsername)) {
    return { success: false, message: "Please enter a valid username (3-30 chars; letters, numbers, underscore, dot)." };
  }
  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    return { success: false, message: "Please enter a valid email address (e.g., student@example.com)." };
  }
  if (!password) {
    return { success: false, message: "Password is required." };
  }
  const passVal = validatePassword(password);
  if (!passVal.valid) {
    return { success: false, message: passVal.message };
  }
  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match. Please re-enter." };
  }

  // Check if username or email already registered in local cache (case-insensitive)
  const localAccounts = getRegisteredAccounts();
  const existingEmail = localAccounts.find(a => a.email === cleanEmail);
  if (existingEmail) {
    return { success: false, message: "An account with this email address already exists. Please sign in instead." };
  }
  const existingUsername = localAccounts.find(a => (a.username || "").toLowerCase() === cleanUsername);
  if (existingUsername) {
    return { success: false, message: "This username is already taken. Please choose another." };
  }

  const hashedPassword = await hashPassword(password);
  const matricNo = generateMatricId();
  let supabaseUserId = null;
  let supabaseMessage = "";

  // 2. Call Supabase Auth. Include username in user_metadata so it is available server-side.
  // Note: Enforcing username uniqueness and storing username in a dedicated profiles table should be done server-side (see migrations and Edge Function provided in README/instructions).
  const client = getCbtSupabase();
  if (client) {
    try {
      const { data, error } = await client.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanName,
            matric_no: matricNo,
            username: cleanUsername
          }
        }
      });

      if (error) {
        // If Supabase returned an error like user already registered
        if (error.message?.toLowerCase().includes("already registered") || error.code === "user_already_exists") {
          return { success: false, message: "This email is already registered in the system. Please sign in." };
        }
        console.warn("Supabase auth signUp warning:", error.message);
        supabaseMessage = error.message;
      } else if (data?.user) {
        supabaseUserId = data.user.id;
      }
    } catch (err) {
      console.warn("Exception during Supabase signup:", err);
    }
  }

  // 3. Store in local registered accounts cache (kept for backward compatibility only)
  const newAccount = {
    id: supabaseUserId || "usr_" + Date.now(),
    fullName: cleanName,
    username: cleanUsername,
    email: cleanEmail,
    passwordHash: hashedPassword,
    matricNo: matricNo,
    createdAt: new Date().toISOString()
  };
  localAccounts.push(newAccount);
  saveRegisteredAccounts(localAccounts);

  // 4. Automatically create active session for seamless workflow (session will be updated when server-side session exists)
  const activeUser = {
    id: newAccount.id,
    fullName: newAccount.fullName,
    username: newAccount.username,
    email: newAccount.email,
    matricNo: newAccount.matricNo
  };
  setCurrentUser(activeUser);

  return {
    success: true,
    user: activeUser,
    message: "Account created successfully! You are now logged in."
  };
}


export { registerStudent };
