export function setupPasswordToggle(button, input) {
    if (!button || !input) return;

    button.addEventListener("click", () => {
        const showPassword = input.type === "password";
        input.type = showPassword ? "text" : "password";
        button.innerHTML = showPassword
            ? '<i class="fa-solid fa-eye-slash"></i>'
            : '<i class="fa-solid fa-eye"></i>';
    });
}

export function renderAuthState(elements, currentUser) {
    const {
        authenticatedView,
        guestAuthView,
        welcomeUserName,
        welcomeUserEmail,
        welcomeUserMatric,
        userAvatar
    } = elements;

    if (currentUser) {
        if (authenticatedView) {
            authenticatedView.classList.remove("hidden");
            authenticatedView.style.display = "block";
        }
        if (guestAuthView && authenticatedView) {
            guestAuthView.classList.add("hidden");
            guestAuthView.style.display = "none";
        }

        if (welcomeUserName) welcomeUserName.textContent = `Welcome, ${currentUser.fullName}!`;
        if (welcomeUserEmail) welcomeUserEmail.textContent = currentUser.email;
        if (welcomeUserMatric) welcomeUserMatric.textContent = currentUser.matricNo;
        if (userAvatar) {
            userAvatar.textContent = (currentUser.fullName || "S").charAt(0).toUpperCase();
        }
        return;
    }

    if (authenticatedView) {
        authenticatedView.classList.add("hidden");
        authenticatedView.style.display = "none";
    }
    if (guestAuthView) {
        guestAuthView.classList.remove("hidden");
        guestAuthView.style.display = "block";
    }
}

export function showAuthAlert(element, message, type = "error") {
    if (!element) return;

    element.className = `auth-alert ${type}`;
    element.classList.remove("hidden");
    const icon = type === "success"
        ? '<i class="fa-solid fa-circle-check"></i>'
        : type === "info"
            ? '<i class="fa-solid fa-circle-info"></i>'
            : '<i class="fa-solid fa-triangle-exclamation"></i>';
    element.innerHTML = `${icon} <span>${message}</span>`;
    element.style.display = "flex";
}

export function clearAuthAlert(element) {
    if (!element) return;
    element.classList.add("hidden");
    element.style.display = "none";
    element.innerHTML = "";
}
