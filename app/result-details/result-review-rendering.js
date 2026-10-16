import { escapeHtml } from "./result-history-format.js";

export function renderAnswerReviewModal(item, { reviewModal, modalExamTitle, modalQuestionsList }) {
    if (!reviewModal || !modalQuestionsList) return;

    const title = item.subject_title || item.exam || "Exam";
    const author = item.creator_tag ? ` (by ${item.creator_tag})` : "";
    if (modalExamTitle) {
        modalExamTitle.innerHTML = `<i class="fa-solid fa-list-check"></i> Answers Review: ${escapeHtml(title)}${author} - ${item.name || "Student"}`;
    }

    modalQuestionsList.innerHTML = "";
    item.review_breakdown.forEach(question => {
        const card = document.createElement("div");
        card.style.cssText = "background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-bottom: 14px;";
        let statusBadge = `<span style="background: #ffedd5; color: #9a3412; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Unanswered</span>`;

        if (question.isCorrect) {
            statusBadge = `<span style="background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;"><i class="fa-solid fa-check"></i> Correct</span>`;
        } else if (!question.isUnanswered) {
            statusBadge = `<span style="background: #fee2e2; color: #991b1b; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;"><i class="fa-solid fa-xmark"></i> Incorrect</span>`;
        }

        const optionsHtml = question.options.map((option, optionIndex) => {
            const isCorrect = optionIndex === question.correctAnswerIndex;
            const isUserChoice = optionIndex === question.userAnswerIndex;
            const letter = String.fromCharCode(65 + optionIndex);
            let background = "#ffffff";
            let border = "#e2e8f0";
            let color = "#334155";
            let tag = "";

            if (isCorrect && isUserChoice) {
                background = "#ecfdf5";
                border = "#10b981";
                color = "#065f46";
                tag = `<span style="font-size: 11px; background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; font-weight: 700;">✓ Your Choice (Correct)</span>`;
            } else if (isCorrect) {
                background = "#ecfdf5";
                border = "#10b981";
                color = "#065f46";
                tag = `<span style="font-size: 11px; background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; font-weight: 700;">✓ Correct Option</span>`;
            } else if (isUserChoice) {
                background = "#fef2f2";
                border = "#ef4444";
                color = "#991b1b";
                tag = `<span style="font-size: 11px; background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px; font-weight: 700;">✗ Your Choice</span>`;
            }

            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin-top: 6px; background: ${background}; border: 1.5px solid ${border}; border-radius: 6px; color: ${color}; font-size: 13.5px;">
                    <div><strong>${letter}.</strong> ${escapeHtml(option)}</div>
                    ${tag}
                </div>
            `;
        }).join("");

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <strong style="color: #0b1e36; font-size: 14px;">Question ${question.index || 1}</strong>
                ${statusBadge}
            </div>
            <p style="font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 10px;">${escapeHtml(question.question)}</p>
            <div>${optionsHtml}</div>
            ${question.explanation ? `<div style="margin-top: 8px; font-size: 12.5px; color: #1e40af; background: #eff6ff; padding: 6px 10px; border-radius: 5px;"><em>Note: ${escapeHtml(question.explanation)}</em></div>` : ""}
        `;
        modalQuestionsList.appendChild(card);
    });

    reviewModal.style.display = "flex";
}
