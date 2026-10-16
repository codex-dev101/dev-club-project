import { getCbtSupabase } from "./config.js";
import { PASSWORD_RECOVERY_SESSION_KEY, CURRENT_USER_KEY, isValidEmail, validateRecoveryPassword } from "./storage.js";

async function requestPasswordRecovery(email) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const client = getCbtSupabase();
  if (!client) {
    return { success: false, message: "Password recovery is temporarily unavailable. Please try again later." };
  }

  const projectRoot = window.location.pathname.split("/app/")[0];
  const redirectTo = new URL(
    `${projectRoot}/app/authentication/reset-password/reset-password.html`,
    window.location.origin
  ).href;
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


export { requestPasswordRecovery, getPasswordRecoverySession, updateRecoveredPassword };
