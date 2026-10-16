// ============================================================
// Smart CBT - Step 1: Choose Subject Controller
// ============================================================

import { requireAuth, signOutStudent } from "../authentication/auth.js";
import { getCbtAllSubjects, getCbtSubjectById } from "../exams/questions-data.js";
import { renderSubjectGrid } from "./subject-grid.js";

document.addEventListener("DOMContentLoaded", () => {
    // Protect Route: Require logged in user
    const user = requireAuth();
    if (!user) return;

    // Display candidate info
    const nameEl = document.getElementById("userNameDisplay");
    const matricEl = document.getElementById("userMatricDisplay");
    if (nameEl) nameEl.textContent = user.fullName;
    if (matricEl) matricEl.textContent = user.matricNo;

    // Sign out button
    const signOutBtn = document.getElementById("btnPageSignOut");
    if (signOutBtn) {
        signOutBtn.addEventListener("click", async () => {
            await signOutStudent();
            window.location.href = "../../index.html?signed_out=true";
        });
    }

    const subjectGrid = document.getElementById("subjectGrid");
    const btnContinue = document.getElementById("btnContinue");
    let selectedSubjectId = localStorage.getItem("cbt_selected_subject") || null;

    // Render subjects dynamically
    function renderSubjects() {
        renderSubjectGrid({
            container: subjectGrid,
            subjects: getCbtAllSubjects(),
            selectedSubjectId,
            onSelect: subjectId => {
                selectedSubjectId = subjectId;
                btnContinue.disabled = false;
            }
        });

        if (selectedSubjectId) btnContinue.disabled = false;
    }

    renderSubjects();

    // Continue Button Handler -> Proceed to Step 2: Customize Examination
    if (btnContinue) {
        btnContinue.addEventListener("click", () => {
            if (!selectedSubjectId) {
                alert("Please select a subject to continue.");
                return;
            }

            // Save selected subject
            localStorage.setItem("cbt_selected_subject", selectedSubjectId);

            const subInfo = getCbtSubjectById(selectedSubjectId);
            if (subInfo) {
                localStorage.setItem("cbt_selected_subject_title", subInfo.title);
                if (subInfo.creatorTag) {
                    localStorage.setItem("cbt_creator_tag", subInfo.creatorTag);
                    localStorage.setItem("cbt_creator_name", subInfo.creatorName);
                } else {
                    localStorage.removeItem("cbt_creator_tag");
                    localStorage.removeItem("cbt_creator_name");
                }
            }

            // Navigate to Step 2
            window.location.href = "../customize-exam/customize-exam.html";
        });
    }

});
