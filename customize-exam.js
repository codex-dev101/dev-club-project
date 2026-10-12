// ============================================================
// Smart CBT - Step 2: Customize Examination Controller
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    // Require authentication
    const user = window.requireAuth ? window.requireAuth() : null;
    if (!user) return;

    // Display user info
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

    // Check selected subject
    const selectedSubject = localStorage.getItem("cbt_selected_subject");
    if (!selectedSubject) {
        window.location.href = "select-subject.html";
        return;
    }

    const subjectInfo = window.getCbtSubjectById ? window.getCbtSubjectById(selectedSubject) : null;
    const availableQuestions = subjectInfo ? subjectInfo.questionCount : 50;

    // Update Subject Summary Banner
    const summaryTitle = document.getElementById("summarySubjectTitle");
    const summaryCategory = document.getElementById("summarySubjectCategory");
    const summaryCount = document.getElementById("summaryAvailableCount");
    const explanationText = document.getElementById("questionExplanationText");
    const customMaxLabel = document.getElementById("customMaxLabel");

    if (summaryTitle && subjectInfo) summaryTitle.textContent = subjectInfo.title;
    if (summaryCategory && subjectInfo) summaryCategory.textContent = `Category: ${subjectInfo.category}`;
    if (summaryCount) summaryCount.textContent = `${availableQuestions} Eligible Available`;
    if (explanationText) {
        explanationText.innerHTML = `Select how many questions you want to answer. Maximum available for this subject: <strong>${availableQuestions} questions</strong>.`;
    }
    if (customMaxLabel) customMaxLabel.textContent = `/ ${availableQuestions} max`;

    // State
    let selectedQCount = Math.min(20, availableQuestions);
    let selectedDuration = 30; // minutes

    const customQInput = document.getElementById("customQInput");
    const customDurationInput = document.getElementById("customDurationInput");
    const qValidationMsg = document.getElementById("qValidationMsg");
    const qValidationText = document.getElementById("qValidationText");
    const durationValidationMsg = document.getElementById("durationValidationMsg");
    const durationValidationText = document.getElementById("durationValidationText");
    const btnProceed = document.getElementById("btnProceedToInstruct");

    // Disable 50 chip if available questions < 50
    const chip50 = document.getElementById("chip50");
    if (chip50 && availableQuestions < 50) {
        chip50.disabled = true;
        chip50.title = `Only ${availableQuestions} questions available for this subject`;
    }

    // Setup Question Count chips
    const qChips = document.querySelectorAll("#questionChips .option-chip");
    qChips.forEach(chip => {
        const count = parseInt(chip.dataset.qcount);
        if (count > availableQuestions) {
            chip.disabled = true;
            chip.title = `Only ${availableQuestions} questions available`;
        }

        chip.addEventListener("click", () => {
            if (chip.disabled) return;
            qChips.forEach(c => c.classList.remove("selected"));
            chip.classList.add("selected");
            selectedQCount = count;
            customQInput.value = count;
            validate();
        });
    });

    // Set initial selected chip
    qChips.forEach(chip => {
        const count = parseInt(chip.dataset.qcount);
        chip.classList.toggle("selected", count === selectedQCount);
    });
    customQInput.max = availableQuestions;
    customQInput.value = selectedQCount;

    // Custom Question Input Handler
    customQInput.addEventListener("input", () => {
        const val = parseInt(customQInput.value);
        selectedQCount = isNaN(val) ? 0 : val;

        // Sync chips
        qChips.forEach(chip => {
            chip.classList.toggle("selected", parseInt(chip.dataset.qcount) === selectedQCount);
        });
        validate();
    });

    // Setup Duration chips
    const dChips = document.querySelectorAll("#durationChips .option-chip");
    dChips.forEach(chip => {
        const dur = parseInt(chip.dataset.duration);
        chip.addEventListener("click", () => {
            dChips.forEach(c => c.classList.remove("selected"));
            chip.classList.add("selected");
            selectedDuration = dur;
            customDurationInput.value = dur;
            validate();
        });
    });

    customDurationInput.value = selectedDuration;

    // Custom Duration Input Handler
    customDurationInput.addEventListener("input", () => {
        const val = parseInt(customDurationInput.value);
        selectedDuration = isNaN(val) ? 0 : val;

        // Sync chips
        dChips.forEach(chip => {
            chip.classList.toggle("selected", parseInt(chip.dataset.duration) === selectedDuration);
        });
        validate();
    });

    // Validation function
    function validate() {
        let isValid = true;

        // 1. Validate Question Count
        if (!selectedQCount || selectedQCount < 1) {
            qValidationMsg.style.display = "flex";
            qValidationText.textContent = "Please select at least 1 question.";
            isValid = false;
        } else if (selectedQCount > availableQuestions) {
            qValidationMsg.style.display = "flex";
            qValidationText.textContent = `Cannot select more than ${availableQuestions} questions (the maximum available for this subject).`;
            isValid = false;
        } else if (selectedQCount > 50) {
            qValidationMsg.style.display = "flex";
            qValidationText.textContent = "Maximum allowed question count is 50.";
            isValid = false;
        } else {
            qValidationMsg.style.display = "none";
        }

        // 2. Validate Duration
        if (!selectedDuration || selectedDuration < 1) {
            durationValidationMsg.style.display = "flex";
            durationValidationText.textContent = "Please specify a duration of at least 1 minute.";
            isValid = false;
        } else if (selectedDuration > 60) {
            durationValidationMsg.style.display = "flex";
            durationValidationText.textContent = "Maximum allowed examination duration is strictly 60 minutes.";
            isValid = false;
        } else {
            durationValidationMsg.style.display = "none";
        }

        btnProceed.disabled = !isValid;
        return isValid;
    }

    validate();

    // Proceed Handler -> Navigate to Step 3: Exam Instructions
    btnProceed.addEventListener("click", () => {
        if (!validate()) return;

        // Save configuration
        const examConfig = {
            subjectId: selectedSubject,
            subjectTitle: subjectInfo ? subjectInfo.title : selectedSubject,
            questionCount: selectedQCount,
            durationMinutes: selectedDuration,
            maxAvailable: availableQuestions
        };

        localStorage.setItem("cbt_exam_config", JSON.stringify(examConfig));
        localStorage.setItem("cbt_selected_question_count", String(selectedQCount));
        localStorage.setItem("cbt_selected_duration_minutes", String(selectedDuration));

        // Clear any stale prior in-progress state to ensure clean start
        localStorage.removeItem("cbt_exam_state");

        window.location.href = "exam instruct/einstruct.html";
    });
});
