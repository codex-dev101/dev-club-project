// ============================================================
// Smart CBT - Step 3: Exam Instructions Controller
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    // Route protection
    const user = window.requireAuth ? window.requireAuth("../index.html") : null;

    const urlParams = new URLSearchParams(window.location.search);
    const candidateName = user?.fullName || urlParams.get("fullname") || localStorage.getItem("cbt_candidate_name") || "Student";
    const candidateId = user?.matricNo || urlParams.get("candidateId") || localStorage.getItem("cbt_candidate_id") || "CBT-2026";
    const storedSubject = localStorage.getItem("cbt_selected_subject");
    
    let examConfig = null;
    try {
        examConfig = JSON.parse(localStorage.getItem("cbt_exam_config") || "null");
    } catch (e) {}

    const subject = urlParams.get("subject") || examConfig?.subjectId || storedSubject || "general_knowledge";
    const attempt = urlParams.get("attempt") || localStorage.getItem("cbt_current_attempt_number") || "1";
    const qCount = parseInt(urlParams.get("qcount")) || examConfig?.questionCount || parseInt(localStorage.getItem("cbt_selected_question_count")) || 50;
    const durationMins = parseInt(urlParams.get("duration")) || examConfig?.durationMinutes || parseInt(localStorage.getItem("cbt_selected_duration_minutes")) || 60;

    const nameEl = document.getElementById("infoCandidateName");
    const idEl = document.getElementById("infoCandidateId");
    const subjectEl = document.getElementById("infoSubjectName");
    const creatorTagEl = document.getElementById("infoCreatorTag");
    const attemptBadgeEl = document.getElementById("infoAttemptBadge");
    const ruleQEl = document.getElementById("ruleQuestionCount");
    const ruleDurEl = document.getElementById("ruleDuration");

    if (nameEl) nameEl.textContent = candidateName;
    if (idEl) idEl.textContent = candidateId;
    if (ruleQEl) ruleQEl.textContent = qCount;
    if (ruleDurEl) ruleDurEl.textContent = `${durationMins} minutes`;

    // Subject label & custom pack details
    const standardNames = {
        math: "Mathematics",
        english: "English Language",
        science: "Basic Science",
        art: "Art & Culture",
        current_affairs: "Current Affairs",
        general_knowledge: "General Knowledge"
    };

    let subjectTitle = examConfig?.subjectTitle || standardNames[subject] || subject;
    let creatorTag = localStorage.getItem("cbt_creator_tag") || "";

    try {
        const customPacks = JSON.parse(localStorage.getItem("cbt_custom_packs") || "[]");
        const foundPack = customPacks.find(p => p.id === subject);
        if (foundPack) {
            subjectTitle = foundPack.title;
            creatorTag = foundPack.creatorTag || "@creator";
        }
    } catch (e) {}

    if (subjectEl) subjectEl.textContent = subjectTitle;
    if (creatorTagEl) {
        if (creatorTag) {
            creatorTagEl.textContent = `by ${creatorTag}`;
            creatorTagEl.style.display = "inline-block";
        } else {
            creatorTagEl.style.display = "none";
        }
    }

    if (attemptBadgeEl) {
        const attemptNum = parseInt(attempt) || 1;
        attemptBadgeEl.textContent = `Attempt #${attemptNum}${attemptNum > 1 ? " (Retake)" : ""}`;
        if (attemptNum > 1) {
            attemptBadgeEl.style.background = "#ffedd5";
            attemptBadgeEl.style.color = "#9a3412";
        }
    }

    // Form handler
    const instructForm = document.getElementById("instructForm");
    if (instructForm) {
        instructForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const checkbox = document.getElementById("checkbox");
            if (!checkbox || !checkbox.checked) {
                alert("Please check the confirmation box to proceed.");
                return;
            }

            // Forward all parameters to exams page
            const targetParams = new URLSearchParams();
            targetParams.set("fullname", candidateName);
            targetParams.set("candidateId", candidateId);
            targetParams.set("subject", subject);
            targetParams.set("attempt", attempt);
            targetParams.set("qcount", qCount);
            targetParams.set("duration", durationMins);
            targetParams.set("start", "true");

            window.location.href = "../exams/index.html?" + targetParams.toString();
        });
    }
});
