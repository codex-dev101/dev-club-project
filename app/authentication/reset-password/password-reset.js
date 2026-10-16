import { getCbtSupabase, getPasswordRecoverySession, updateRecoveredPassword } from "../auth.js";
import { hideRecoveryMessage, showRecoveryMessage } from "./recovery-ui.js";

document.addEventListener("DOMContentLoaded", () => {
    const resetForm = document.getElementById("resetPasswordForm");
    if (resetForm) setupPasswordReset(resetForm);
});

function setupPasswordReset(form) {
    const checking = document.getElementById("resetChecking");
    const invalid = document.getElementById("resetInvalid");
    const success = document.getElementById("resetSuccess");
    const alert = document.getElementById("resetAlert");
    const password = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmNewPassword");
    const submitButton = document.getElementById("submitPasswordReset");

    document.querySelectorAll("[data-password-target]").forEach((button) => {
        button.addEventListener("click", () => {
            const input = document.getElementById(button.dataset.passwordTarget);
            const showPassword = input.type === "password";
            input.type = showPassword ? "text" : "password";
            button.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
            button.innerHTML = showPassword
                ? '<i class="fa-solid fa-eye-slash"></i>'
                : '<i class="fa-solid fa-eye"></i>';
        });
    });

    async function verifyAndShowForm() {
        try {
            const result = await getPasswordRecoverySession();
            checking.classList.add("hidden");
            if (result.valid) {
                invalid.classList.add("hidden");
                form.classList.remove("hidden");
            } else {
                form.classList.add("hidden");
                invalid.classList.remove("hidden");
                showRecoveryMessage(alert, result.message, "error");
            }
        } catch (error) {
            console.error("Could not verify password reset link:", error);
            checking.classList.add("hidden");
            form.classList.add("hidden");
            invalid.classList.remove("hidden");
            showRecoveryMessage(alert, "This password reset link is invalid or has expired. Request a new recovery link to continue.", "error");
        }
    }

    const client = getCbtSupabase();
    if (client) {
        client.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                window.setTimeout(verifyAndShowForm, 0);
            }
        });
    }
    verifyAndShowForm();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideRecoveryMessage(alert);
        if (password.value.length < 8) {
            showRecoveryMessage(alert, "Your password must be at least 8 characters long.", "error");
            password.focus();
            return;
        }
        if (password.value !== confirmPassword.value) {
            showRecoveryMessage(alert, "The passwords do not match. Please try again.", "error");
            confirmPassword.focus();
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Updating Password...</span><i class="fa-solid fa-spinner fa-spin"></i>';
        try {
            const result = await updateRecoveredPassword(password.value);
            if (result.success) {
                form.classList.add("hidden");
                success.classList.remove("hidden");
                showRecoveryMessage(alert, result.message, "success");
            } else {
                showRecoveryMessage(alert, result.message, "error");
                if (result.message.toLowerCase().includes("link")) {
                    form.classList.add("hidden");
                    invalid.classList.remove("hidden");
                }
            }
        } catch (error) {
            console.error("Password reset could not be completed:", error);
            showRecoveryMessage(alert, "We could not update your password. Your recovery link may have expired; request a new one and try again.", "error");
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '<span>Reset Password</span><i class="fa-solid fa-arrow-right arrow"></i>';
        }
    });
}

