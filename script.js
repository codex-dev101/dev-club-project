// ============================================================
// Smart CBT - Home & Authentication Controller
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const authAlert = document.getElementById("authAlert");
    const authenticatedView = document.getElementById("authenticatedView");
    const guestAuthView = document.getElementById("guestAuthView");

    // Authenticated Card
    const welcomeUserName = document.getElementById("welcomeUserName");
    const welcomeUserEmail = document.getElementById("welcomeUserEmail");
    const welcomeUserMatric = document.getElementById("welcomeUserMatric");
    const userAvatar = document.getElementById("userAvatar");
    const btnSignOutHome = document.getElementById("btnSignOutHome");

    // Tabs
    const tabSignIn = document.getElementById("tabSignIn");
    const tabRegister = document.getElementById("tabRegister");
    const panelSignIn = document.getElementById("panelSignIn");
    const panelRegister = document.getElementById("panelRegister");

    // Forms
    const signInForm = document.getElementById("signInForm");
    const registerForm = document.getElementById("registerForm");

    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const toggleLoginPassword = document.getElementById("toggleLoginPassword");

    const regFullName = document.getElementById("regFullName");
    const regEmail = document.getElementById("regEmail");
    const regPassword = document.getElementById("regPassword");
    const regConfirmPassword = document.getElementById("regConfirmPassword");
    const toggleRegPassword = document.getElementById("toggleRegPassword");
    const toggleRegConfirmPassword = document.getElementById("toggleRegConfirmPassword");

    // Check URL parameters for notices
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("auth") === "required") {
        showAlert("Please sign in or create an account to start your examination.", "info");
    } else if (urlParams.get("signed_out") === "true") {
        showAlert("You have signed out successfully.", "info");
    }

    // Initialize UI based on session
    renderAuthState();

    // Tab Switching
    if (tabSignIn && tabRegister) {
        tabSignIn.addEventListener("click", () => switchTab("signin"));
        tabRegister.addEventListener("click", () => switchTab("register"));
    }

    function switchTab(tab) {
        clearAlert();
        if (tab === "signin") {
            tabSignIn.classList.add("active");
            tabRegister.classList.remove("active");
            panelSignIn.classList.add("active");
            panelRegister.classList.remove("active");
        } else {
            tabRegister.classList.add("active");
            tabSignIn.classList.remove("active");
            panelRegister.classList.add("active");
            panelSignIn.classList.remove("active");
        }
    }

    // Password Visibility Toggles
    setupPasswordToggle(toggleLoginPassword, loginPassword);
    setupPasswordToggle(toggleRegPassword, regPassword);
    setupPasswordToggle(toggleRegConfirmPassword, regConfirmPassword);

    function setupPasswordToggle(btn, input) {
        if (!btn || !input) return;
        btn.addEventListener("click", () => {
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            btn.innerHTML = isPassword ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
        });
    }

    // --- FORM 1: SIGN IN SUBMISSION ---
    if (signInForm) {
        signInForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearAlert();

            const email = loginEmail.value.trim();
            const password = loginPassword.value;

            const submitBtn = document.getElementById("btnSubmitSignIn");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Signing In...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            }

            try {
                const res = await window.signInStudent({ email, password });
                if (res.success) {
                    showAlert(res.message || "Signed in successfully!", "success");
                    setTimeout(() => {
                        renderAuthState();
                        // Redirect to choose subject or return url
                        const redirectUrl = urlParams.get("redirect") || "select-subject.html";
                        window.location.href = redirectUrl;
                    }, 500);
                } else {
                    showAlert(res.message || "Failed to sign in. Please verify your credentials.", "error");
                }
            } catch (err) {
                showAlert("An unexpected error occurred. Please try again.", "error");
                console.error(err);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Sign In</span> <i class="fa-solid fa-arrow-right arrow"></i>`;
                }
            }
        });
    }

    // --- FORM 2: REGISTRATION SUBMISSION ---
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearAlert();

            const fullName = regFullName.value.trim();
            const email = regEmail.value.trim();
            const password = regPassword.value;
            const confirmPassword = regConfirmPassword.value;

            const submitBtn = document.getElementById("btnSubmitRegister");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Creating Account...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            }

            try {
                const res = await window.registerStudent({ fullName, email, password, confirmPassword });
                if (res.success) {
                    showAlert(res.message || "Account created successfully!", "success");
                    setTimeout(() => {
                        renderAuthState();
                        // Direct to Step 1: Choose Subject!
                        window.location.href = "select-subject.html";
                    }, 900);
                } else {
                    showAlert(res.message || "Registration failed. Please review your details.", "error");
                }
            } catch (err) {
                showAlert("An error occurred during registration. Please try again.", "error");
                console.error(err);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Create Account</span> <i class="fa-solid fa-user-plus arrow"></i>`;
                }
            }
        });
    }

    // Sign Out Button on Authenticated Home Card
    if (btnSignOutHome) {
        btnSignOutHome.addEventListener("click", async () => {
            await window.signOutStudent();
            renderAuthState();
            showAlert("You have signed out securely.", "info");
        });
    }

    // Render Auth View State
    function renderAuthState() {
        const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;

        if (currentUser) {
            if (authenticatedView) authenticatedView.style.display = "block";
            if (guestAuthView) guestAuthView.style.display = "none";

            if (welcomeUserName) welcomeUserName.textContent = `Welcome, ${currentUser.fullName}!`;
            if (welcomeUserEmail) welcomeUserEmail.textContent = currentUser.email;
            if (welcomeUserMatric) welcomeUserMatric.textContent = currentUser.matricNo;
            if (userAvatar) {
                const initial = (currentUser.fullName || "S").charAt(0).toUpperCase();
                userAvatar.textContent = initial;
            }
        } else {
            if (authenticatedView) authenticatedView.style.display = "none";
            if (guestAuthView) guestAuthView.style.display = "block";
        }
    }

    // Helper: Show Alert Banner
    function showAlert(message, type = "error") {
        if (!authAlert) return;
        authAlert.className = `auth-alert ${type}`;
        const icon = type === "success" 
            ? '<i class="fa-solid fa-circle-check"></i>' 
            : type === "info" 
            ? '<i class="fa-solid fa-circle-info"></i>' 
            : '<i class="fa-solid fa-triangle-exclamation"></i>';
        authAlert.innerHTML = `${icon} <span>${message}</span>`;
        authAlert.style.display = "flex";
    }

    function clearAlert() {
        if (!authAlert) return;
        authAlert.style.display = "none";
        authAlert.innerHTML = "";
    }
});