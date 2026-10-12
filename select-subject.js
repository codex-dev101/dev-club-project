// ============================================================
// Smart CBT - Step 1: Choose Subject Controller
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    // Protect Route: Require logged in user
    const user = window.requireAuth ? window.requireAuth() : null;
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
            await window.signOutStudent();
            window.location.href = "index.html?signed_out=true";
        });
    }

    const subjectGrid = document.getElementById("subjectGrid");
    const btnContinue = document.getElementById("btnContinue");
    let selectedSubjectId = localStorage.getItem("cbt_selected_subject") || null;

    // Render subjects dynamically
    function renderSubjects() {
        if (!window.getCbtAllSubjects) return;
        const subjects = window.getCbtAllSubjects();

        subjectGrid.innerHTML = "";

        if (subjects.length === 0) {
            subjectGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 32px; color: #f59e0b; margin-bottom: 12px; display: block;"></i>
                    No examination subjects currently available in database.
                </div>
            `;
            return;
        }

        subjects.forEach(sub => {
            const isSelected = selectedSubjectId === sub.id;
            const card = document.createElement("div");
            card.className = `subject-card ${isSelected ? "selected" : ""}`;
            card.dataset.id = sub.id;

            card.innerHTML = `
                <div>
                    <div class="subject-card-header">
                        <div class="subject-icon-box">
                            <i class="fa-solid ${sub.icon || 'fa-book'}"></i>
                        </div>
                        <div class="check-indicator">
                            <i class="fa-solid fa-check"></i>
                        </div>
                    </div>
                    <div class="subject-title">${escapeHtml(sub.title)}</div>
                    <div class="subject-desc">${escapeHtml(sub.desc)}</div>
                </div>

                <div class="subject-footer">
                    <span class="badge-count">
                        <i class="fa-solid fa-list-check"></i> ${sub.questionCount} Questions
                    </span>
                    <span class="badge-category">${escapeHtml(sub.category)}</span>
                </div>
            `;

            card.addEventListener("click", () => {
                document.querySelectorAll(".subject-card").forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");
                selectedSubjectId = sub.id;
                btnContinue.disabled = false;
            });

            subjectGrid.appendChild(card);
        });

        if (selectedSubjectId) {
            btnContinue.disabled = false;
        }
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

            const subInfo = window.getCbtSubjectById(selectedSubjectId);
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
            window.location.href = "customize-exam.html";
        });
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
