export const CURRENT_USER_KEY = "cbt_current_user";
export const REGISTERED_ACCOUNTS_KEY = "cbt_registered_users";
export const PASSWORD_RECOVERY_SESSION_KEY = "cbt_password_recovery_user";

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

function validateRecoveryPassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    return { valid: false, message: "Your password must be at least 8 characters long." };
  }
  return { valid: true };
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


export { hashPassword, generateMatricId, getRegisteredAccounts, saveRegisteredAccounts, isValidEmail, validatePassword, validateRecoveryPassword, setCurrentUser, getCurrentUser };
