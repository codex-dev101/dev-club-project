import { escapeHtml } from "./result-history-format.js";

export function renderResultsTable({ table, historyList, currentUser, onReview }) {
    table.innerHTML = "";

    if (historyList.length === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `<td colspan="7" style="text-align: center; color: #888; padding: 30px;">
            <i class="fa-solid fa-file-circle-xmark" style="font-size: 2rem; color: #cbd5e1; margin-bottom: 8px; display: block;"></i>
            No exam results found for ${currentUser ? escapeHtml(currentUser.fullName) : "you"} yet. Take an exam to see your records here!
        </td>`;
        table.appendChild(emptyRow);
        return;
    }

    historyList.forEach((result, index) => {
        const examTitle = result.subject_title || result.exam || result.subject || "CBT Examination";
        const candidateName = result.name || result.candidate_name || "Student";
        const candidateId = result.candidate_id || result.candidateId || "CBT-ID";
        const creatorTag = result.creator_tag || "";
        const attemptNum = result.attempt_number || result.attemptNumber || 1;
        const dateTaken = result.dateTaken || (result.submitted_at
            ? new Date(result.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : new Date().toLocaleDateString());
        const percentage = Number(result.percentage ?? result.score) || 0;
        const totalQuestions = Number(result.total_questions) || 50;
        const correctCount = Number(result.correctAnswers ?? result.correct_questions ?? result.correct_answers) || 0;
        const incorrectCount = Number(result.wrong_questions ?? result.wrongAnswers ?? result.wrong_answers ?? Math.max(0, totalQuestions - correctCount)) || 0;

        let grade = result.grade;
        if (!grade) {
            if (percentage >= 70) grade = "A";
            else if (percentage >= 60) grade = "B";
            else if (percentage >= 50) grade = "C";
            else if (percentage >= 40) grade = "D";
            else grade = "F";
        }

        const hasBreakdown = Array.isArray(result.review_breakdown) && result.review_breakdown.length > 0;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <div style="font-weight: 700; color: #0b1e36;">${escapeHtml(candidateName)}</div>
                <span style="font-size: 11.5px; font-family: monospace; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${escapeHtml(candidateId)}</span>
            </td>
            <td>
                <strong>${escapeHtml(examTitle)}</strong>
                ${creatorTag ? `<span style="display: inline-block; background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">by ${escapeHtml(creatorTag)}</span>` : ""}
            </td>
            <td>
                <span style="display: inline-block; background: ${attemptNum > 1 ? "#ffedd5" : "#dcfce7"}; color: ${attemptNum > 1 ? "#9a3412" : "#166534"}; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">
                    Attempt #${attemptNum}${attemptNum > 1 ? " (Retake)" : ""}
                </span>
            </td>
            <td style="color: #475569; font-size: 13.5px;">${dateTaken}</td>
            <td>
                <span style="font-size: 1.05rem; font-weight: 700; color: #0b1e36;">${percentage}%</span>
                <span style="display: inline-block; margin-left: 6px; font-weight: 800; color: ${grade === "F" ? "#ef4444" : "#16a34a"}">(${grade})</span>
            </td>
            <td style="font-size: 13px;">
                <span style="color: #16a34a; font-weight: 600;"><i class="fa-solid fa-check"></i> ${correctCount}</span> /
                <span style="color: #dc2626; font-weight: 600;"><i class="fa-solid fa-xmark"></i> ${incorrectCount}</span>
            </td>
            <td>
                <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                    <a href="../result page/index.html" class="btn-summary-link" style="color: #2563eb; font-size: 12px; font-weight: 600; text-decoration: none; padding: 6px 12px; border-radius: 6px; background: #eff6ff; border: 1px solid #bfdbfe; display: inline-flex; align-items: center; gap: 4px;">
                        <i class="fa-solid fa-trophy"></i> Congrats
                    </a>
                    ${hasBreakdown ? `
                        <button type="button" class="btn-review-modal-trigger" data-idx="${index}" style="color: #ffffff; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 6px; background: #0b1e36; border: 1px solid #0b1e36; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                            <i class="fa-solid fa-list-check"></i> View Answers
                        </button>
                    ` : ""}
                </div>
            </td>
        `;
        table.appendChild(row);
    });

    table.querySelectorAll(".btn-review-modal-trigger").forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.getAttribute("data-idx"));
            const item = historyList[index];
            if (item?.review_breakdown) onReview(item);
        });
    });
}
