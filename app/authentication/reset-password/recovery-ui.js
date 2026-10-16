export function showRecoveryMessage(element, message, type) {
    element.textContent = message;
    element.className = `auth-alert ${type}`;
}

export function hideRecoveryMessage(element) {
    element.textContent = "";
    element.className = "auth-alert hidden";
}
