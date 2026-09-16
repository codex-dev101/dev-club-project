// Creator Dashboard JS Logic

const CUSTOM_PACKS_KEY = "cbt_custom_packs";
const CREATOR_PROFILE_KEY = "cbt_creator_profile";

// Staged questions for current pack in creation
let stagedQuestions = [];
let editingPackId = null;

// Initialize Creator Profile
function loadCreatorProfile() {
    try {
        const saved = JSON.parse(localStorage.getItem(CREATOR_PROFILE_KEY) || "null");
        if (saved) {
            const nameEl = document.getElementById("creatorName");
            const tagEl = document.getElementById("creatorTag");
            if (nameEl && saved.name) nameEl.value = saved.name;
            if (tagEl && saved.tag) tagEl.value = saved.tag;
        }
    } catch (e) {
        console.error("Error loading creator profile:", e);
    }
}

function saveCreatorProfile() {
    const nameEl = document.getElementById("creatorName");
    const tagEl = document.getElementById("creatorTag");
    const profile = {
        name: nameEl?.value.trim() || "Instructor",
        tag: tagEl?.value.trim() || "@teacher"
    };
    if (!profile.tag.startsWith("@")) profile.tag = "@" + profile.tag;
    localStorage.setItem(CREATOR_PROFILE_KEY, JSON.stringify(profile));
    return profile;
}

// Get all custom packs
function getCustomPacks() {
    try {
        const packs = JSON.parse(localStorage.getItem(CUSTOM_PACKS_KEY) || "[]");
        const cleanPacks = Array.isArray(packs)
            ? packs.filter(pack => pack && pack.id !== "custom_web_dev_101")
            : [];

        if (JSON.stringify(cleanPacks) !== JSON.stringify(packs)) {
            localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(cleanPacks));
        }

        return cleanPacks;
    } catch (e) {
        console.error("Error loading custom packs:", e);
        return [];
    }
}

function saveCustomPack(pack) {
    const packs = getCustomPacks();
    const existingIdx = packs.findIndex(p => p.id === pack.id);
    if (existingIdx >= 0) {
        packs[existingIdx] = pack;
    } else {
        packs.unshift(pack);
    }
    localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(packs));
}

function deleteCustomPack(packId) {
    let packs = getCustomPacks();
    packs = packs.filter(p => p.id !== packId);
    localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(packs));
    renderPacksList();
    showToast("Question pack deleted successfully.");
}

// Render Staged Questions in Builder
function renderStagedQuestions() {
    const container = document.getElementById("stagedQuestionsList");
    const countBadge = document.getElementById("stagedCount");
    if (!container) return;

    if (countBadge) countBadge.textContent = stagedQuestions.length;

    if (stagedQuestions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2.5rem 1rem; color: #94a3b8;">
                <i class="fa-solid fa-clipboard-question" style="font-size: 2.5rem; margin-bottom: 0.75rem; color: #cbd5e1;"></i>
                <p>No questions added yet to this pack.</p>
                <p style="font-size: 0.85rem; margin-top: 0.3rem;">Use the form on the left or paste bulk JSON to add questions.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";
    stagedQuestions.forEach((q, idx) => {
        const item = document.createElement("div");
        item.className = "staged-item";
        item.innerHTML = `
            <div class="staged-header">
                <span class="staged-q-num">Question ${idx + 1}</span>
                <button type="button" class="btn btn-sm btn-danger remove-q-btn" data-idx="${idx}" title="Delete Question">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
            <div class="staged-prompt">${escapeHtml(q.question)}</div>
            <div class="staged-opts">
                ${q.options.map((opt, optIdx) => `
                    <div class="staged-opt ${optIdx === q.answer ? 'correct' : ''}">
                        <strong>${String.fromCharCode(65 + optIdx)}:</strong> ${escapeHtml(opt)}
                        ${optIdx === q.answer ? ' <i class="fa-solid fa-check" style="margin-left: 4px;"></i>' : ''}
                    </div>
                `).join("")}
            </div>
            ${q.explanation ? `<div style="margin-top: 0.5rem; font-size: 0.8rem; color: #64748b;"><em>Note: ${escapeHtml(q.explanation)}</em></div>` : ''}
        `;
        container.appendChild(item);
    });

    container.querySelectorAll(".remove-q-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = parseInt(btn.getAttribute("data-idx"));
            stagedQuestions.splice(idx, 1);
            renderStagedQuestions();
        });
    });
}

// Render Saved Packs
function renderPacksList() {
    const grid = document.getElementById("packsCardsGrid");
    if (!grid) return;

    const packs = getCustomPacks();
    if (packs.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: white; border-radius: 12px; border: 1px dashed #cbd5e1;">
                <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: #94a3b8; margin-bottom: 1rem;"></i>
                <h3 style="color: #334155; margin-bottom: 0.5rem;">No Custom Question Packs Yet</h3>
                <p style="color: #64748b; font-size: 0.95rem;">Create your first question pack using the Creator Studio tab above!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = "";
    packs.forEach(pack => {
        const card = document.createElement("div");
        card.className = "pack-card";
        const dateStr = pack.createdAt ? new Date(pack.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent";
        
        card.innerHTML = `
            <div class="pack-header">
                <h3 class="pack-title">${escapeHtml(pack.title)}</h3>
                <span class="pack-tag-badge"><i class="fa-solid fa-user-tag"></i> ${escapeHtml(pack.creatorTag || "@creator")}</span>
            </div>
            <div style="font-size: 0.85rem; color: #475569; margin-bottom: 0.75rem;">
                <strong>Author:</strong> ${escapeHtml(pack.creatorName || "Instructor")}
            </div>
            <div class="pack-meta">
                <span><i class="fa-solid fa-list-check"></i> ${pack.questions.length} Questions</span>
                <span><i class="fa-solid fa-clock"></i> ${pack.durationMinutes || 30} Mins</span>
                <span><i class="fa-regular fa-calendar"></i> ${dateStr}</span>
            </div>
            <div class="pack-actions">
                <a href="exams/index.html?subject=${encodeURIComponent(pack.id)}" class="btn btn-sm btn-emerald" title="Practice or test this exam now">
                    <i class="fa-solid fa-play"></i> Practice Now
                </a>
                <button type="button" class="btn btn-sm btn-outline copy-link-btn" data-subject="${encodeURIComponent(pack.id)}" title="Copy shareable exam link">
                    <i class="fa-solid fa-share-nodes"></i> Share Link
                </button>
                <button type="button" class="btn btn-sm btn-outline download-json-btn" data-id="${pack.id}" title="Export Pack as JSON">
                    <i class="fa-solid fa-download"></i> JSON
                </button>
                <button type="button" class="btn btn-sm btn-danger delete-pack-btn" data-id="${pack.id}" title="Delete Pack">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Attach card listeners
    grid.querySelectorAll(".copy-link-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const subject = btn.getAttribute("data-subject");
            const shareUrl = `${window.location.origin}${window.location.pathname.replace('creator-dashboard.html', '')}index.html?subject=${subject}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                showToast("Exam share link copied to clipboard!");
            }).catch(() => {
                prompt("Copy this exam link:", shareUrl);
            });
        });
    });

    grid.querySelectorAll(".download-json-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const packId = btn.getAttribute("data-id");
            const pack = packs.find(p => p.id === packId);
            if (pack) {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pack, null, 2));
                const downloadAnchor = document.createElement("a");
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `${pack.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_questions.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
            }
        });
    });

    grid.querySelectorAll(".delete-pack-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const packId = btn.getAttribute("data-id");
            if (confirm("Are you sure you want to delete this question pack?")) {
                deleteCustomPack(packId);
            }
        });
    });
}

// Toast notification helper
function showToast(msg) {
    const toast = document.getElementById("toastMsg");
    if (!toast) return;
    toast.querySelector(".toast-text").textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
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
            viewStudio.style.display = "block";
            viewPacks.style.display = "none";
        });

        tabPacks.addEventListener("click", () => {
            tabPacks.classList.add("active");
            tabStudio.classList.remove("active");
            viewStudio.style.display = "none";
            viewPacks.style.display = "block";
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
            stagedQuestions = [];
            if (titleEl) titleEl.value = "";
            renderStagedQuestions();
            renderPacksList();

            showToast("Question Pack saved & published successfully!");

            // Switch to packs tab
            if (tabPacks) tabPacks.click();
        });
    }
});
