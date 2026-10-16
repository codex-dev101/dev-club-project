// ============================================================
// Smart CBT - Home & Authentication Controller
// ============================================================

import {
    getCurrentUser,
    registerStudent,
    signInStudent,
    signOutStudent
} from "../authentication/auth.js";
import {
    clearAuthAlert,
    renderAuthState,
    setupPasswordToggle,
    showAuthAlert
} from "./auth-ui.js";

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
    const authView = {
        authenticatedView,
        guestAuthView,
        welcomeUserName,
        welcomeUserEmail,
        welcomeUserMatric,
        userAvatar
    };
    const updateAuthView = () => renderAuthState(authView, getCurrentUser());
    const showAlert = (message, type) => showAuthAlert(authAlert, message, type);
    const clearAlert = () => clearAuthAlert(authAlert);

    // Forms
    const signInForm = document.getElementById("signInForm");
    const registerForm = document.getElementById("registerForm");

    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    const toggleLoginPassword = document.getElementById("toggleLoginPassword");

    const regFullName = document.getElementById("regFullName");
    const regUsername = document.getElementById("regUsername");
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
    updateAuthView();

    // Password Visibility Toggles
    setupPasswordToggle(toggleLoginPassword, loginPassword);
    setupPasswordToggle(toggleRegPassword, regPassword);
    setupPasswordToggle(toggleRegConfirmPassword, regConfirmPassword);

    // --- FORM 1: SIGN IN SUBMISSION ---
    if (signInForm) {
        signInForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearAlert();

            const usernameOrEmail = loginUsername.value.trim();
            const password = loginPassword.value;

            const submitBtn = document.getElementById("btnSubmitSignIn");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Signing In...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            }

            try {
                const res = await signInStudent({ usernameOrEmail, password });
                if (res.success) {
                    showAlert(res.message || "Signed in successfully!", "success");
                    setTimeout(() => {
                        updateAuthView();
                        // Redirect to choose subject or return url
                        const projectRoot = window.location.pathname.split("/app/")[0].replace(/\/index\.html$/, "");
                        const redirectUrl = urlParams.get("redirect") || `${projectRoot}/app/select-subject/select-subject.html`;
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
            const username = regUsername.value.trim();
            const email = regEmail.value.trim();
            const password = regPassword.value;
            const confirmPassword = regConfirmPassword.value;

            const submitBtn = document.getElementById("btnSubmitRegister");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Creating Account...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            }

            try {
                const res = await registerStudent({ fullName, username, email, password, confirmPassword });
                if (res.success) {
                    showAlert(res.message || "Account created successfully!", "success");
                    setTimeout(() => {
                        updateAuthView();
                        // Direct to Step 1: Choose Subject!
                        const projectRoot = window.location.pathname.split("/app/")[0].replace(/\/index\.html$/, "");
                        window.location.href = `${projectRoot}/app/select-subject/select-subject.html`;
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
            await signOutStudent();
            updateAuthView();
            showAlert("You have signed out securely.", "info");
        });
    }

});