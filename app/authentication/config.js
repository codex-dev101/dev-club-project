import { PASSWORD_RECOVERY_SESSION_KEY } from "./storage.js";

// Smart CBT - Authentication & User Session Module
// Integrates Supabase Auth with secure local session management

export const SUPABASE_AUTH_URL = "https://cjqnrpbctqblxfpspxzq.supabase.co";
export const SUPABASE_AUTH_KEY = "sb_publishable_WoZjELCqdbbMtSBJAYAe7A_mv3PmKe_";
// Supabase Edge Functions base URL (deploy the server-side username signin/lookup function and set this to your functions endpoint)
// Example: https://<project>.functions.supabase.co
export const SUPABASE_FUNCTIONS_URL = "https://cjqnrpbctqblxfpspxzq.functions.supabase.co"; // <-- deploy function and update if different

let cbtSupabase = null;
export function getCbtSupabase() {
  if (!cbtSupabase && globalThis.supabase?.createClient) {
    try {
      cbtSupabase = globalThis.supabase.createClient(SUPABASE_AUTH_URL, SUPABASE_AUTH_KEY);
      cbtSupabase.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY" && session?.user?.id) {
          sessionStorage.setItem(PASSWORD_RECOVERY_SESSION_KEY, session.user.id);
        } else if (event === "SIGNED_OUT") {
          sessionStorage.removeItem(PASSWORD_RECOVERY_SESSION_KEY);
        }
      });
    } catch (e) {
      console.warn("Could not initialize Supabase client in auth client:", e);
    }
  }
  return cbtSupabase;
}

