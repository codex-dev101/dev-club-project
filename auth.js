// ============================================================
// Smart CBT - Authentication & User Session Module
// Integrates Supabase Auth with secure local session management
// ============================================================

const SUPABASE_AUTH_URL = "https://cjqnrpbctqblxfpspxzq.supabase.co";
const SUPABASE_AUTH_KEY = "sb_publishable_WoZjELCqdbbMtSBJAYAe7A_mv3PmKe_";

const CURRENT_USER_KEY = "cbt_current_user";
const REGISTERED_ACCOUNTS_KEY = "cbt_registered_users";

// Initialize Supabase Client
let cbtSupabase = null;
function getCbtSupabase() {
  if (!cbtSupabase && typeof supabase !== "undefined" && supabase.createClient) {
    try {
      cbtSupabase = supabase.createClient(SUPABASE_AUTH_URL, SUPABASE_AUTH_KEY);
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

// --- USER REGISTRATION ---
async function registerStudent({ fullName, email, password, confirmPassword }) {
  const cleanName = String(fullName || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();

  // 1. Validation checks
  if (!cleanName) {
    return { success: false, message: "Full Name is required." };
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

  // Check if email already registered in local cache
  const localAccounts = getRegisteredAccounts();
  const existing = localAccounts.find(a => a.email === cleanEmail);
  if (existing) {
    return { success: false, message: "An account with this email address already exists. Please sign in instead." };
  }

  const hashedPassword = await hashPassword(password);
  const matricNo = generateMatricId();
  let supabaseUserId = null;
  let supabaseMessage = "";

  // 2. Call Supabase Auth
  const client = getCbtSupabase();
  if (client) {
    try {
      const { data, error } = await client.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanName,
            matric_no: matricNo
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

  // 3. Store in local registered accounts cache
  const newAccount = {
    id: supabaseUserId || "usr_" + Date.now(),
    fullName: cleanName,
    email: cleanEmail,
    passwordHash: hashedPassword,
    matricNo: matricNo,
    createdAt: new Date().toISOString()
  };
  localAccounts.push(newAccount);
  saveRegisteredAccounts(localAccounts);

  // 4. Automatically create active session for seamless workflow
  const activeUser = {
    id: newAccount.id,
    fullName: newAccount.fullName,
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
async function signInStudent({ email, password }) {
  const cleanEmail = String(email || "").trim().toLowerCase();

  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    return { success: false, message: "Please enter a valid email address." };
  }
  if (!password) {
    return { success: false, message: "Password is required." };
  }

  const localAccounts = getRegisteredAccounts();
  const localMatch = localAccounts.find(a => a.email === cleanEmail);
  const inputHash = await hashPassword(password);

  // 1. Try Supabase Auth
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

      // If Supabase gave "Invalid login credentials", check if local cache has a registered student
      if (error && (error.code === "invalid_credentials" || error.message?.includes("Invalid login"))) {
        // Check local match
        if (localMatch) {
          if (localMatch.passwordHash === inputHash) {
            const userObj = {
              id: localMatch.id,
              fullName: localMatch.fullName,
              email: localMatch.email,
              matricNo: localMatch.matricNo
            };
            setCurrentUser(userObj);
            return { success: true, user: userObj, message: "Signed in successfully!" };
          } else {
            return { success: false, message: "Incorrect password. Please verify your credentials and try again." };
          }
        }
        return { success: false, message: "Invalid email or password. Please check your credentials or create an account." };
      }

      // If Supabase returned "Email not confirmed", allow login if password matches local registration
      if (error && (error.code === "email_not_confirmed" || error.message?.includes("Email not confirmed"))) {
        if (localMatch && localMatch.passwordHash === inputHash) {
          const userObj = {
            id: localMatch.id,
            fullName: localMatch.fullName,
            email: localMatch.email,
            matricNo: localMatch.matricNo
          };
          setCurrentUser(userObj);
          return {
            success: true,
            user: userObj,
            message: "Signed in successfully!"
          };
        }
      }
    } catch (err) {
      console.warn("Exception during Supabase signin:", err);
    }
  }

  // 2. Check local registered accounts
  if (localMatch) {
    if (localMatch.passwordHash === inputHash) {
      const userObj = {
        id: localMatch.id,
        fullName: localMatch.fullName,
        email: localMatch.email,
        matricNo: localMatch.matricNo
      };
      setCurrentUser(userObj);
      return { success: true, user: userObj, message: "Signed in successfully!" };
    } else {
      return { success: false, message: "Incorrect password. Please verify your credentials and try again." };
    }
  }

  return { success: false, message: "No account found with this email. Please check your email or create a new account." };
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
