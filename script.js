// Store candidate info, handle custom packs & duplicate attempt detection

document.addEventListener("DOMContentLoaded", () => {
    const candidateIdInput = document.getElementById("candidateId");
    const candidateNameInput = document.getElementById("candidateName");
    const subjectSelect = document.getElementById("subjectSelect") || document.querySelector("select[name='subject']");
    const customOptgroup = document.getElementById("customSubjectsOptgroup");
    const btnGenId = document.getElementById("btnGenId");
    const attemptNotice = document.getElementById("attemptNoticeBanner");
    const attemptNoticeTitle = document.getElementById("attemptNoticeTitle");
    const attemptNoticeDesc = document.getElementById("attemptNoticeDesc");

    // 1. Initialize & populate Custom Question Packs
    populateCustomSubjects();

    // 2. Load stored candidate ID and Name if available
    const savedId = localStorage.getItem("cbt_candidate_id");
    const savedName = localStorage.getItem("cbt_candidate_name");
    const savedSubject = localStorage.getItem("cbt_selected_subject");

    if (candidateIdInput) {
        if (savedId) {
            candidateIdInput.value = savedId;
        } else {
            // Generate a default ID if none exists
            candidateIdInput.value = generateCandidateId();
        }
    }

    if (candidateNameInput && savedName) {
        candidateNameInput.value = savedName;
    }

    // Check URL parameters for pre-selected subject or custom pack
    const urlParams = new URLSearchParams(window.location.search);
    const urlSubject = urlParams.get("subject");
    if (urlSubject && subjectSelect) {
        subjectSelect.value = urlSubject;
    } else if (savedSubject && subjectSelect) {
        subjectSelect.value = savedSubject;
    }

    // 3. Auto ID Generator button
    if (btnGenId && candidateIdInput) {
        btnGenId.addEventListener("click", () => {
            candidateIdInput.value = generateCandidateId();
            checkForDuplicateAttempts();
        });
    }

    // 4. Listeners for duplicate attempt check
    if (candidateIdInput) candidateIdInput.addEventListener("input", checkForDuplicateAttempts);
    if (candidateNameInput) candidateNameInput.addEventListener("input", checkForDuplicateAttempts);
    if (subjectSelect) subjectSelect.addEventListener("change", checkForDuplicateAttempts);

    // Initial check on load
    checkForDuplicateAttempts();

    // 5. Form submission handler
    const loginForm = document.querySelector("form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            const candidateId = candidateIdInput ? candidateIdInput.value.trim() : generateCandidateId();
            const candidateName = candidateNameInput ? candidateNameInput.value.trim() : "Candidate";
            const selectedSubject = subjectSelect ? subjectSelect.value : "general_knowledge";

            localStorage.setItem("cbt_candidate_id", candidateId);
            localStorage.setItem("cbt_candidate_name", candidateName);
            localStorage.setItem("cbt_selected_subject", selectedSubject);

            // Determine attempt count
            const attemptInfo = getAttemptCount(candidateId, candidateName, selectedSubject);
            const currentAttempt = attemptInfo.count + 1;
            localStorage.setItem("cbt_current_attempt_number", String(currentAttempt));

            // Save subject title & creator tag if custom
            const customPack = getCustomPackById(selectedSubject);
            if (customPack) {
                localStorage.setItem("cbt_creator_tag", customPack.creatorTag || "@creator");
                localStorage.setItem("cbt_creator_name", customPack.creatorName || "Instructor");
                localStorage.setItem("cbt_selected_subject_title", customPack.title);
            } else {
                localStorage.removeItem("cbt_creator_tag");
                localStorage.removeItem("cbt_creator_name");
                localStorage.removeItem("cbt_selected_subject_title");
            }

            // Clear previous exam state if starting a different subject or new attempt
            try {
                const saved = localStorage.getItem("cbt_exam_state");
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.subject !== selectedSubject) {
                        localStorage.removeItem("cbt_exam_state");
                    }
                }
            } catch (err) {
                localStorage.removeItem("cbt_exam_state");
            }
        });
    }

    // Helper: Populate custom subjects from localStorage
    function populateCustomSubjects() {
        if (!customOptgroup) return;
        try {
            const rawPacks = localStorage.getItem("cbt_custom_packs");
            let packs = [];
            if (rawPacks) {
                packs = JSON.parse(rawPacks);
            } else {
                // Preload default sample pack if none exists
                packs = [
                    {
                        id: "custom_web_dev_101",
                        title: "Web Development Fundamentals",
                        subjectKey: "custom_web_dev_101",
                        creatorName: "Alex Dev",
                        creatorTag: "@alexdev",
                        category: "Computer Science",
                        durationMinutes: 15,
                        questions: [
                            {
                                question: "What does HTML stand for?",
                                options: [
                                    "Hyper Text Markup Language",
                                    "High Tech Modern Language",
                                    "Hyperlink and Text Management Language",
                                    "Home Tool Markup Language"
                                ],
                                answer: 0,
                                explanation: "HTML stands for Hyper Text Markup Language."
                            },
                            {
                                question: "Which CSS property changes the background color?",
                                options: ["color", "background-color", "bgcolor", "canvas-color"],
                                answer: 1,
                                explanation: "background-color defines background color in CSS."
                            },
                            {
                                question: "Which JavaScript keyword declares a block-scoped variable?",
                                options: ["var", "let", "def", "dim"],
                                answer: 1,
                                explanation: "'let' and 'const' are block-scoped in modern JS."
                            },
                            {
                                question: "What is the primary function of JavaScript?",
                                options: [
                                    "Database hosting",
                                    "Adding interactivity to web pages",
                                    "Physical circuit design",
                                    "Printing hardcopy documents"
                                ],
                                answer: 1,
                                explanation: "JavaScript adds dynamic behavior and interactivity."
                            },
                            {
                                question: "Which tag is used to include external JavaScript?",
                                options: ["<link>", "<script>", "<js>", "<src>"],
                                answer: 1,
                                explanation: "<script src='...'> is the standard HTML tag for JS."
                            }
                        ]
                    }
                ];
                localStorage.setItem("cbt_custom_packs", JSON.stringify(packs));
            }

            customOptgroup.innerHTML = "";
            if (packs.length === 0) {
                const opt = document.createElement("option");
                opt.value = "";
                opt.disabled = true;
                opt.textContent = "No custom packs yet (Create in Studio)";
                customOptgroup.appendChild(opt);
                return;
            }

            packs.forEach(pack => {
                const opt = document.createElement("option");
                opt.value = pack.id;
                opt.textContent = `⭐ ${pack.title} (by ${pack.creatorTag || '@author'})`;
                customOptgroup.appendChild(opt);
            });
        } catch (e) {
            console.error("Error populating custom subjects:", e);
        }
    }

    // Helper: Duplicate Attempt Detection
    function checkForDuplicateAttempts() {
        if (!attemptNotice) return;

        const candidateId = candidateIdInput ? candidateIdInput.value.trim() : "";
        const candidateName = candidateNameInput ? candidateNameInput.value.trim() : "";
        const selectedSubject = subjectSelect ? subjectSelect.value : "";

        if (!selectedSubject || (!candidateId && !candidateName)) {
            attemptNotice.style.display = "none";
            return;
        }

        const attemptInfo = getAttemptCount(candidateId, candidateName, selectedSubject);
        if (attemptInfo.count > 0) {
            attemptNotice.style.display = "block";
            const subjectLabel = getSubjectName(selectedSubject);
            if (attemptNoticeTitle) {
                attemptNoticeTitle.textContent = `Retake Notice: Attempt #${attemptInfo.count + 1}`;
            }
            if (attemptNoticeDesc) {
                attemptNoticeDesc.innerHTML = `Candidate <strong>${escapeHtml(candidateName || candidateId)}</strong> has taken <strong>${escapeHtml(subjectLabel)}</strong> ${attemptInfo.count} time(s) before.<br>Previous Best Score: <strong>${attemptInfo.bestScore}%</strong> (${attemptInfo.lastDate}).`;
            }
        } else {
            attemptNotice.style.display = "none";
        }
    }

    function getAttemptCount(candidateId, candidateName, subject) {
        let history = [];
        try {
            history = JSON.parse(localStorage.getItem("cbt_exam_history") || "[]");
            const allResults = JSON.parse(localStorage.getItem("cbt_all_results") || "[]");
            history = [...history, ...allResults];
        } catch (e) {
            history = [];
        }

        const normalizedSubject = (subject || "").toLowerCase();
        const matches = history.filter(item => {
            const itemSubject = (item.subject || item.exam || "").toLowerCase();
            const itemId = item.candidate_id || item.candidateId || "";
            const itemName = (item.name || item.candidate_name || "").toLowerCase();

            const subjectMatches = itemSubject === normalizedSubject || (subject.startsWith("custom_") && itemSubject.includes(subject));
            const idMatches = candidateId && itemId && itemId.toLowerCase() === candidateId.toLowerCase();
            const nameMatches = candidateName && itemName && itemName === candidateName.toLowerCase();

            return subjectMatches && (idMatches || nameMatches);
        });

        if (matches.length === 0) return { count: 0, bestScore: 0, lastDate: "" };

        let maxScore = 0;
        let lastDate = "";
        matches.forEach(m => {
            const score = Number(m.percentage ?? m.score) || 0;
            if (score > maxScore) maxScore = score;
            if (m.dateTaken || m.submitted_at) {
                lastDate = m.dateTaken || new Date(m.submitted_at).toLocaleDateString();
            }
        });

        return {
            count: matches.length,
            bestScore: maxScore,
            lastDate: lastDate || "Recently"
        };
    }

    function getCustomPackById(id) {
        try {
            const packs = JSON.parse(localStorage.getItem("cbt_custom_packs") || "[]");
            return packs.find(p => p.id === id);
        } catch (e) {
            return null;
        }
    }

    function getSubjectName(subjectKey) {
        const standard = {
            math: "Mathematics",
            english: "English",
            science: "Science",
            art: "Art",
            current_affairs: "Current Affairs",
            general_knowledge: "General Knowledge"
        };
        if (standard[subjectKey]) return standard[subjectKey];
        const custom = getCustomPackById(subjectKey);
        if (custom) return custom.title;
        return subjectKey;
    }

    function generateCandidateId() {
        const year = new Date().getFullYear();
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `CBT-${year}-${rand}`;
    }

    function escapeHtml(text) {
        if (!text) return "";
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});