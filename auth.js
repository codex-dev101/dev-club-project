// ============================================================
// Smart CBT - Authentication & User Session Module
// Integrates Supabase Auth with secure local session management
// ============================================================

const SUPABASE_AUTH_URL = "https://cjqnrpbctqblxfpspxzq.supabase.co";
const SUPABASE_AUTH_KEY = "sb_publishable_WoZjELCqdbbMtSBJAYAe7A_mv3PmKe_";
// Supabase Edge Functions base URL (deploy the server-side username signin/lookup function and set this to your functions endpoint)
// Example: https://<project>.functions.supabase.co
const SUPABASE_FUNCTIONS_URL = "https://cjqnrpbctqblxfpspxzq.functions.supabase.co"; // <-- deploy function and update if different

const CURRENT_USER_KEY = "cbt_current_user";
const REGISTERED_ACCOUNTS_KEY = "cbt_registered_users";
const PASSWORD_RECOVERY_SESSION_KEY = "cbt_password_recovery_user";

// Initialize Supabase Client
let cbtSupabase = null;
function getCbtSupabase() {
  if (!cbtSupabase && typeof supabase !== "undefined" && supabase.createClient) {
    try {
      cbtSupabase = supabase.createClient(SUPABASE_AUTH_URL, SUPABASE_AUTH_KEY);
      cbtSupabase.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY" && session?.user?.id) {
          sessionStorage.setItem(PASSWORD_RECOVERY_SESSION_KEY, session.user.id);
        } else if (event === "SIGNED_OUT") {
          sessionStorage.removeItem(PASSWORD_RECOVERY_SESSION_KEY);
        }
      });
    } catch (e) {
      console.warn("Could not initialize Supabase client in auth.js:", e);
    }
  }
  return cbtSupabase;
}

// SHA-256 Password Hashing via Web Crypto API (Never stores plain text)
async function hashPassword(str) {
  if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback simple hash for older environments
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return "h_" + Math.abs(hash);
}

// Generate Unique Candidate Matric / Exam ID
function generateMatricId() {
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `CBT/${year}/${randNum}`;
}

// Local accounts cache helpers
function getRegisteredAccounts() {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_ACCOUNTS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveRegisteredAccounts(accounts) {
  localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
}

// Validate Email Format
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(email).trim().toLowerCase());
}

// Validate Password Strength
function validatePassword(password) {
  if (!password || password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters long." };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return { valid: false, message: "Password must contain both letters and numbers." };
  }
  return { valid: true };
}

async function requestPasswordRecovery(email) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const client = getCbtSupabase();
  if (!client) {
    return { success: false, message: "Password recovery is temporarily unavailable. Please try again later." };
  }

  const redirectTo = new URL("reset-password.html", window.location.href).href;
  try {
    const { error } = await client.auth.resetPasswordForEmail(cleanEmail, { redirectTo });
    if (error) {
      console.error("Supabase password recovery request failed:", error.message);
      return { success: false, message: "We could not send a recovery link right now. Please try again later." };
    }
    return {
      success: true,
      message: "If an account exists with that email, you will receive a password reset link shortly. Please check your inbox and spam folder."
    };
  } catch (error) {
    console.error("Password recovery request failed:", error);
    return { success: false, message: "We could not send a recovery link right now. Please try again later." };
  }
}

async function getPasswordRecoverySession() {
  const client = getCbtSupabase();
  if (!client) return { valid: false, message: "Password recovery is temporarily unavailable. Please try again later." };

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(window.location.search);
  const hasRecoveryCallback = hashParams.get("type") === "recovery" ||
    queryParams.get("type") === "recovery";

  try {
    const { data, error } = await client.auth.getSession();
    if (error) {
      console.error("Could not verify password recovery session:", error.message);
      return { valid: false, message: "This password reset link is invalid or has expired. Request a new recovery link to continue." };
    }

    const userId = data.session?.user?.id;
    if (!userId) {
      sessionStorage.removeItem(PASSWORD_RECOVERY_SESSION_KEY);
      return { valid: false, message: "This password reset link is invalid or has expired. Request a new recovery link to continue." };
    }

    if (hasRecoveryCallback) {
      sessionStorage.setItem(PASSWORD_RECOVERY_SESSION_KEY, userId);
    }

    const recoveryUserId = sessionStorage.getItem(PASSWORD_RECOVERY_SESSION_KEY);
    if (!recoveryUserId || recoveryUserId !== userId) {
      return { valid: false, message: "Open the password reset link from your email, or request a new recovery link." };
    }
    return { valid: true };
  } catch (error) {
    console.error("Could not verify password recovery session:", error);
    return { valid: false, message: "This password reset link is invalid or has expired. Request a new recovery link to continue." };
  }
}

async function updateRecoveredPassword(password) {
  const passVal = validateRecoveryPassword(password);
  if (!passVal.valid) return { success: false, message: passVal.message };

  const recovery = await getPasswordRecoverySession();
  if (!recovery.valid) return { success: false, message: recovery.message };

  const client = getCbtSupabase();
  const { error } = await client.auth.updateUser({ password });
  if (error) {
    console.error("Supabase password update failed:", error.message);
    return { success: false, message: "We could not update your password. Your recovery link may have expired; request a new one and try again." };
  }

  sessionStorage.removeItem(PASSWORD_RECOVERY_SESSION_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  try {
    const { error: signOutError } = await client.auth.signOut();
    if (signOutError) console.error("Could not end the password recovery session:", signOutError.message);
  } catch (signOutError) {
    console.error("Could not end the password recovery session:", signOutError);
  }
  return { success: true, message: "Your password has been reset successfully. You can now sign in with your new password." };
}

function validateRecoveryPassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    return { valid: false, message: "Your password must be at least 8 characters long." };
  }
  return { valid: true };
}

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

  // 2. Call Supabase Auth. Include username in user_metadata so it is available server-side.  // Note: Enforcing username uniqueness and storing username in a dedicated profiles table should be done server-side (see migrations and Edge Function provided in README/instructions).
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

// --- USER SIGN IN ---
// Accepts either a username OR an email via the single param `usernameOrEmail`.
// If a username is provided, the client contacts a server-side Supabase Edge Function
// which performs the username -> email lookup and signs in server-side using a service key.
// This prevents exposing emails or the service role key to the frontend.
async function signInStudent({ usernameOrEmail, password }) {
  const input = String(usernameOrEmail || "").trim();
  if (!input) return { success: false, message: "Please enter your username." };
  if (!password) return { success: false, message: "Password is required." };

  const isEmail = input.includes("@");
  const localAccounts = getRegisteredAccounts();
  const inputHash = await hashPassword(password);
n  // If input looks like an email, use the existing email sign-in flow for compatibility.  if (isEmail) {
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

  // If Supabase Edge Function URL is configured, call it to perform secure username sign-in on the server.
  if (SUPABASE_FUNCTIONS_URL) {
    try {
      const resp = await fetch(`${SUPABASE_FUNCTIONS_URL}/username-signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUsername, password })
      });
      const json = await resp.json().catch(() => null);
      // Do not reveal whether username exists. Edge Function should also return generic errors.      if (resp.ok && json && json.success && json.user) {
        // json.user should contain non-sensitive profile info (id, fullName, username, matricNo)        const u = json.user;
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
      return { success: false, message: json?.message || "Invalid username or password." };
    } catch (err) {
      console.warn("Error calling username-signin function:", err);
      return { success: false, message: "Unable to sign in with username at this time. Please try again." };
    }
  }
n  // If there is no server-side function configured, optionally allow local username lookup (only for accounts created locally)  const localMatch = localAccounts.find(a => (a.username || "").toLowerCase() === cleanUsername);
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

// --- SIGN OUT ---
async function signOutStudent() {
  const client = getCbtSupabase();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn("Supabase signOut error:", e);
    }
  }
  localStorage.removeItem(CURRENT_USER_KEY);
  // Also clear legacy session keys
  localStorage.removeItem("cbt_exam_state");
}

// --- CURRENT USER SESSION ---
function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  // Sync with existing candidate storage keys for backward compatibility
  localStorage.setItem("cbt_candidate_name", user.fullName || "Candidate");
  localStorage.setItem("cbt_candidate_id", user.matricNo || "CBT-2026");
  localStorage.setItem("cbt_candidate_email", user.email || "");
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading current user session:", e);
  }
  return null;
}

// Route Protection: redirects unauthenticated visitors to login
function requireAuth(redirectBackUrl) {
  const user = getCurrentUser();
  if (!user) {
    const target = redirectBackUrl || window.location.pathname;
    const pathPrefix = window.location.pathname.includes("/exams/") ||
                       window.location.pathname.includes("/exam instruct/") ||
                       window.location.pathname.includes("/result page/") ||
                       window.location.pathname.includes("/henry's-part/") ? "../" : "./";
    window.location.href = `${pathPrefix}index.html?auth=required&redirect=${encodeURIComponent(target)}`;
    return null;
  }
  return user;
}

// Render Header User Bar on pages
function renderUserNavbar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const user = getCurrentUser();
  if (user) {
    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; font-size: 13px;">
        <span style="color: #64748b;"><i class="fa-solid fa-user-graduate" style="color: #2563eb;"></i> <strong>${escapeAuthHtml(user.fullName)}</strong> (${escapeAuthHtml(user.matricNo)})</span>
        <button type="button" id="btnAuthSignOut" style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
          <i class="fa-solid fa-right-from-bracket"></i> Sign Out
        </button>
      </div>
    `;
    const btn = document.getElementById("btnAuthSignOut");
    if (btn) {
      btn.addEventListener("click", async () => {
        await signOutStudent();
        window.location.href = window.location.pathname.includes("/exams/") ||
                              window.location.pathname.includes("/exam instruct/") ||
                              window.location.pathname.includes("/result page/") ||
                              window.location.pathname.includes("/henry's-part/") ? "../index.html" : "index.html";
      });
    }
  }
}

function escapeAuthHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Expose globally
window.registerStudent = registerStudent;
window.signInStudent = signInStudent;
window.signOutStudent = signOutStudent;
window.getCurrentUser = getCurrentUser;
window.setCurrentUser = setCurrentUser;
window.requireAuth = requireAuth;
window.renderUserNavbar = renderUserNavbar;
window.getCbtSupabase = getCbtSupabase;
window.requestPasswordRecovery = requestPasswordRecovery;
window.getPasswordRecoverySession = getPasswordRecoverySession;
window.updateRecoveredPassword = updateRecoveredPassword;
