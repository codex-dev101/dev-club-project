import { getCbtSupabase } from "./config.js";
import { CURRENT_USER_KEY, getCurrentUser } from "./storage.js";

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

// Route Protection: redirects unauthenticated visitors to login
function requireAuth(redirectBackUrl) {
  const user = getCurrentUser();
  if (!user) {
    const target = redirectBackUrl
      ? new URL(redirectBackUrl, window.location.href).pathname
      : `${window.location.pathname}${window.location.search}`;
    const projectRoot = window.location.pathname.split("/app/")[0].replace(/\/index\.html$/, "");
    window.location.href = `${projectRoot}/index.html?auth=required&redirect=${encodeURIComponent(target)}`;
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
        const projectRoot = window.location.pathname.split("/app/")[0].replace(/\/index\.html$/, "");
        window.location.href = `${projectRoot}/index.html`;
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



export { signOutStudent, requireAuth, renderUserNavbar };
