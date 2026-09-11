// Store candidate info on start exam
const loginForm = document.querySelector("form");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        const nameInput = document.getElementById("candidateName");
        const subjectSelect = document.querySelector("select[name='subject']");
        if (nameInput && nameInput.value.trim()) {
            localStorage.setItem("cbt_candidate_name", nameInput.value.trim());
        }
        if (subjectSelect && subjectSelect.value) {
            const selected = subjectSelect.value;
            localStorage.setItem("cbt_selected_subject", selected);

            // Clear previous exam state if starting a different subject
            try {
                const saved = localStorage.getItem("cbt_exam_state");
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.subject !== selected) {
                        localStorage.removeItem("cbt_exam_state");
                    }
                }
            } catch (err) {
                localStorage.removeItem("cbt_exam_state");
            }
        }
    });
}