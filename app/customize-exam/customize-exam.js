// ============================================================
// Smart CBT - Step 2: Customize Examination Controller
// ============================================================

import { requireAuth, signOutStudent } from "../authentication/auth.js";
import { getCbtSubjectById } from "../exams/questions-data.js";
import { validateExamOptions } from "./exam-validation.js";

document.addEventListener("DOMContentLoaded", () => {
    // Require authentication
    const user = requireAuth();
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
            await signOutStudent();
            window.location.href = "../../index.html?signed_out=true";
        });
    }

    // Check selected subject
    const selectedSubject = localStorage.getItem("cbt_selected_subject");
    if (!selectedSubject) {
        window.location.href = "../select-subject/select-subject.html";
        return;
    }

    const subjectInfo = getCbtSubjectById(selectedSubject);
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
        return validateExamOptions({
            questionCount: selectedQCount,
            availableQuestions,
            durationMinutes: selectedDuration,
            questionMessage: qValidationMsg,
            questionMessageText: qValidationText,
            durationMessage: durationValidationMsg,
            durationMessageText: durationValidationText,
            continueButton: btnProceed
        });
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

        window.location.href = "../exam instruct/einstruct.html";
    });
});
