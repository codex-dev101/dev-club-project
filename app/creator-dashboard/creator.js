import { saveCreatorProfile, saveCustomPack, stagedQuestions, loadCreatorProfile } from "./creator-data.js";
import { renderPacksList, renderStagedQuestions, showToast } from "./creator-rendering.js";

// DOM Setup
document.addEventListener("DOMContentLoaded", () => {
    loadCreatorProfile();
    renderStagedQuestions();
    renderPacksList();

    // Profile inputs save on change
    const nameEl = document.getElementById("creatorName");
    const tagEl = document.getElementById("creatorTag");
    if (nameEl) nameEl.addEventListener("change", saveCreatorProfile);
    if (tagEl) tagEl.addEventListener("change", saveCreatorProfile);

    // Tab Navigation
    const tabStudio = document.getElementById("tabStudioBtn");
    const tabPacks = document.getElementById("tabPacksBtn");
    const viewStudio = document.getElementById("viewStudio");
    const viewPacks = document.getElementById("viewPacks");

    if (tabStudio && tabPacks) {
        tabStudio.addEventListener("click", () => {
            tabStudio.classList.add("active");
            tabPacks.classList.remove("active");
            if (viewStudio) {
                viewStudio.classList.remove("hidden");
                viewStudio.style.display = "block";
            }
            if (viewPacks) {
                viewPacks.classList.add("hidden");
                viewPacks.style.display = "none";
            }
        });

        tabPacks.addEventListener("click", () => {
            tabPacks.classList.add("active");
            tabStudio.classList.remove("active");
            if (viewStudio) {
                viewStudio.classList.add("hidden");
                viewStudio.style.display = "none";
            }
            if (viewPacks) {
                viewPacks.classList.remove("hidden");
                viewPacks.style.display = "block";
            }
            renderPacksList();
        });
    }

    // Add single question to staged list
    const addQBtn = document.getElementById("btnAddQuestion");
    if (addQBtn) {
        addQBtn.addEventListener("click", () => {
            const promptEl = document.getElementById("qPrompt");
            const optA = document.getElementById("qOptA")?.value.trim();
            const optB = document.getElementById("qOptB")?.value.trim();
            const optC = document.getElementById("qOptC")?.value.trim();
            const optD = document.getElementById("qOptD")?.value.trim();
            const explanation = document.getElementById("qExplanation")?.value.trim();

            const prompt = promptEl?.value.trim();
            const selectedAnswerRadio = document.querySelector("input[name='correctOpt']:checked");

            if (!prompt) {
                alert("Please enter a question prompt.");
                promptEl?.focus();
                return;
            }

            if (!optA || !optB || !optC || !optD) {
                alert("Please fill in all 4 options (A, B, C, and D).");
                return;
            }

            if (!selectedAnswerRadio) {
                alert("Please mark which option (A, B, C, or D) is the correct answer.");
                return;
            }

            const answerIdx = parseInt(selectedAnswerRadio.value);

            stagedQuestions.push({
                question: prompt,
                options: [optA, optB, optC, optD],
                answer: answerIdx,
                explanation: explanation || ""
            });

            // Reset question form
            promptEl.value = "";
            document.getElementById("qOptA").value = "";
            document.getElementById("qOptB").value = "";
            document.getElementById("qOptC").value = "";
            document.getElementById("qOptD").value = "";
            if (document.getElementById("qExplanation")) document.getElementById("qExplanation").value = "";

            renderStagedQuestions();
            showToast("Question added to stage!");
            promptEl.focus();
        });
    }

    // Bulk Upload JSON modal / textarea
    const btnBulkPaste = document.getElementById("btnBulkPaste");
    const bulkModal = document.getElementById("bulkModal");
    const btnCloseBulk = document.getElementById("btnCloseBulk");
    const btnApplyBulk = document.getElementById("btnApplyBulk");
    const bulkJsonInput = document.getElementById("bulkJsonInput");

    const btnCancelBulk = document.getElementById("btnCancelBulk");

    if (btnBulkPaste && bulkModal) {
        btnBulkPaste.addEventListener("click", () => {
            bulkModal.style.display = "flex";
        });
    }

    if (btnCloseBulk && bulkModal) {
        btnCloseBulk.addEventListener("click", () => {
            bulkModal.style.display = "none";
        });
    }

    if (btnCancelBulk && bulkModal) {
        btnCancelBulk.addEventListener("click", () => {
            bulkModal.style.display = "none";
        });
    }

    if (btnApplyBulk && bulkJsonInput) {
        btnApplyBulk.addEventListener("click", () => {
            const raw = bulkJsonInput.value.trim();
            if (!raw) {
                alert("Please paste JSON question data.");
                return;
            }

            try {
                const parsed = JSON.parse(raw);
                const list = Array.isArray(parsed) ? parsed : (parsed.questions || []);
                if (!Array.isArray(list) || list.length === 0) {
                    alert("Invalid JSON format. Expected an array of questions.");
                    return;
                }

                let count = 0;
                list.forEach(item => {
                    if (item.question && Array.isArray(item.options) && item.options.length >= 2) {
                        stagedQuestions.push({
                            question: item.question,
                            options: item.options,
                            answer: typeof item.answer === "number" ? item.answer : 0,
                            explanation: item.explanation || ""
                        });
                        count++;
                    }
                });

                bulkModal.style.display = "none";
                bulkJsonInput.value = "";
                renderStagedQuestions();
                showToast(`Successfully imported ${count} questions!`);
            } catch (err) {
                alert("Could not parse JSON. Please check syntax.\n\nError: " + err.message);
            }
        });
    }

    // Save Complete Question Pack
    const btnSavePack = document.getElementById("btnSavePack");
    if (btnSavePack) {
        btnSavePack.addEventListener("click", () => {
            const profile = saveCreatorProfile();
            const titleEl = document.getElementById("packTitle");
            const durationEl = document.getElementById("packDuration");
            const categoryEl = document.getElementById("packCategory");

            const title = titleEl?.value.trim();
            const duration = parseInt(durationEl?.value) || 30;
            const category = categoryEl?.value || "General";

            if (!title) {
                alert("Please enter a title for this question pack.");
                titleEl?.focus();
                return;
            }

            if (stagedQuestions.length === 0) {
                alert("Please add at least 1 question to this pack before saving.");
                return;
            }

            const packId = "custom_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
            const newPack = {
                id: packId,
                title: title,
                subjectKey: packId,
                creatorName: profile.name,
                creatorTag: profile.tag,
                category: category,
                durationMinutes: duration,
                createdAt: new Date().toISOString(),
                questions: [...stagedQuestions]
            };

            saveCustomPack(newPack);

            // Reset builder
            stagedQuestions.splice(0, stagedQuestions.length);
            if (titleEl) titleEl.value = "";
            renderStagedQuestions();
            renderPacksList();

            showToast("Question Pack saved & published successfully!");

            // Switch to packs tab
            if (tabPacks) tabPacks.click();
        });
    }
});
