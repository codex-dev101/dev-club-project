import { requestPasswordRecovery } from "../auth.js";
import { hideRecoveryMessage, showRecoveryMessage } from "./recovery-ui.js";

document.addEventListener("DOMContentLoaded", () => {
    const requestForm = document.getElementById("recoveryRequestForm");
    if (requestForm) setupRecoveryRequest(requestForm);
});

function setupRecoveryRequest(form) {
    const emailInput = document.getElementById("recoveryEmail");
    const alert = document.getElementById("recoveryAlert");
    const submitButton = document.getElementById("sendRecoveryLink");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideRecoveryMessage(alert);
        if (!emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Sending Link...</span><i class="fa-solid fa-spinner fa-spin"></i>';
        try {
            const result = await requestPasswordRecovery(emailInput.value);
            showRecoveryMessage(alert, result.message, result.success ? "success" : "error");
        } catch (error) {
            console.error("Password recovery request could not be completed:", error);
            showRecoveryMessage(alert, "We could not send a recovery link right now. Please try again later.", "error");
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '<span>Send Recovery Link</span><i class="fa-solid fa-arrow-right arrow"></i>';
        }
    });
}

