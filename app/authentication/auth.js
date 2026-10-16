import { registerStudent, signInStudent, signOutStudent, requireAuth, renderUserNavbar } from "./accounts.js";
import { getCurrentUser, setCurrentUser } from "./storage.js";
import { getCbtSupabase } from "./config.js";
import { requestPasswordRecovery, getPasswordRecoverySession, updateRecoveredPassword } from "./recovery.js";

export {
  registerStudent,
  signInStudent,
  signOutStudent,
  getCurrentUser,
  setCurrentUser,
  requireAuth,
  renderUserNavbar,
  getCbtSupabase,
  requestPasswordRecovery,
  getPasswordRecoverySession,
  updateRecoveredPassword
};

if (typeof window !== "undefined") {
  Object.assign(window, {
    registerStudent,
    signInStudent,
    signOutStudent,
    getCurrentUser,
    setCurrentUser,
    requireAuth,
    renderUserNavbar,
    getCbtSupabase,
    requestPasswordRecovery,
    getPasswordRecoverySession,
    updateRecoveredPassword
  });
}
