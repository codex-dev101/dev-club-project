document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("#resultsTable") || document.querySelector("#resultTable");
  const btnClearHistory = document.getElementById("btnClearHistory");
  const reviewModal = document.getElementById("reviewModal");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const modalExamTitle = document.getElementById("modalExamTitle");
  const modalQuestionsList = document.getElementById("modalQuestionsList");

  if (btnCloseModal && reviewModal) {
    btnCloseModal.addEventListener("click", () => {
      reviewModal.style.display = "none";
    });
  }

  if (btnClearHistory) {
    btnClearHistory.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all exam history?")) {
        localStorage.removeItem("cbt_exam_history");
        localStorage.removeItem("cbt_all_results");
        localStorage.removeItem("cbt_exam_results");
        renderTable();
      }
    });
  }

  renderTable();

  function renderTable() {
    if (!table) return;

    let historyList = [];
    try {
      historyList = JSON.parse(localStorage.getItem("cbt_exam_history")) || 
                    JSON.parse(localStorage.getItem("cbt_all_results")) || [];
    } catch (e) {
      historyList = [];
    }

    table.innerHTML = "";

    if (historyList.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="7" style="text-align: center; color: #888; padding: 30px;">
        <i class="fa-solid fa-file-circle-xmark" style="font-size: 2rem; color: #cbd5e1; margin-bottom: 8px; display: block;"></i>
        No exam results found yet. Take an exam to see your records here!
      </td>`;
      table.appendChild(emptyRow);
      return;
    }

    historyList.forEach((result, idx) => {
      const examTitle = result.subject_title || result.exam || result.subject || "CBT Examination";
      const candidateName = result.name || result.candidate_name || "Student";
      const candidateId = result.candidate_id || result.candidateId || "CBT-ID";
      const creatorTag = result.creator_tag || "";
      const attemptNum = result.attempt_number || result.attemptNumber || 1;
      
      const dateTaken = result.dateTaken || (result.submitted_at ? new Date(result.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString());
      const percentage = Number(result.percentage ?? result.score) || 0;
      const totalQ = Number(result.total_questions) || 50;
      const correctCount = Number(result.correctAnswers ?? result.correct_questions ?? result.correct_answers) || 0;
      const incorrectCount = Number(result.wrong_questions ?? result.wrongAnswers ?? result.wrong_answers ?? Math.max(0, totalQ - correctCount)) || 0;
      
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
          ${creatorTag ? `<span style="display: inline-block; background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">by ${escapeHtml(creatorTag)}</span>` : ''}
        </td>
        <td>
          <span style="display: inline-block; background: ${attemptNum > 1 ? '#ffedd5' : '#dcfce7'}; color: ${attemptNum > 1 ? '#9a3412' : '#166534'}; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">
            Attempt #${attemptNum}${attemptNum > 1 ? ' (Retake)' : ''}
          </span>
        </td>
        <td style="color: #475569; font-size: 13.5px;">${dateTaken}</td>
        <td>
          <span style="font-size: 1.05rem; font-weight: 700; color: #0b1e36;">${percentage}%</span>
          <span style="display: inline-block; margin-left: 6px; font-weight: 800; color: ${grade === 'F' ? '#ef4444' : '#16a34a'}">(${grade})</span>
        </td>
        <td style="font-size: 13px;">
          <span style="color: #16a34a; font-weight: 600;"><i class="fa-solid fa-check"></i> ${correctCount}</span> /
          <span style="color: #dc2626; font-weight: 600;"><i class="fa-solid fa-xmark"></i> ${incorrectCount}</span>
        </td>
        <td>
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            <a href="../result page/index.html" class="btn-summary-link" style="color: #2563eb; font-size: 12px; font-weight: 600; text-decoration: none; padding: 5px 10px; border-radius: 4px; background: #eff6ff; border: 1px solid #bfdbfe;">
              <i class="fa-solid fa-eye"></i> Summary
            </a>
            ${hasBreakdown ? `
              <button type="button" class="btn-review-modal-trigger" data-idx="${idx}" style="color: #0b1e36; font-size: 12px; font-weight: 600; padding: 5px 10px; border-radius: 4px; background: #f8fafc; border: 1px solid #cbd5e1; cursor: pointer;">
                <i class="fa-solid fa-list-check"></i> Answers
              </button>
            ` : ''}
          </div>
        </td>
      `;

      table.appendChild(row);
    });

    // Attach review modal click listeners
    document.querySelectorAll(".btn-review-modal-trigger").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"));
        const item = historyList[idx];
        if (item && item.review_breakdown) {
          openReviewModal(item);
        }
      });
    });
  }

  function openReviewModal(item) {
    if (!reviewModal || !modalQuestionsList) return;
    const title = item.subject_title || item.exam || "Exam";
    const author = item.creator_tag ? ` (by ${item.creator_tag})` : "";
    if (modalExamTitle) {
      modalExamTitle.innerHTML = `<i class="fa-solid fa-list-check"></i> Answers Review: ${escapeHtml(title)}${author} - ${item.name || "Student"}`;
    }

    modalQuestionsList.innerHTML = "";
    item.review_breakdown.forEach(q => {
      const card = document.createElement("div");
      card.style.cssText = "background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-bottom: 14px;";
      
      let statusBadge = `<span style="background: #ffedd5; color: #9a3412; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Unanswered</span>`;
      if (q.isCorrect) {
        statusBadge = `<span style="background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;"><i class="fa-solid fa-check"></i> Correct</span>`;
      } else if (!q.isUnanswered) {
        statusBadge = `<span style="background: #fee2e2; color: #991b1b; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;"><i class="fa-solid fa-xmark"></i> Incorrect</span>`;
      }

      const optionsHtml = q.options.map((opt, optIdx) => {
        const isCorrect = optIdx === q.correctAnswerIndex;
        const isUserChoice = optIdx === q.userAnswerIndex;
        const letter = String.fromCharCode(65 + optIdx);

        let bg = "#ffffff";
        let border = "#e2e8f0";
        let text = "#334155";
        let tag = "";

        if (isCorrect && isUserChoice) {
          bg = "#ecfdf5";
          border = "#10b981";
          text = "#065f46";
          tag = `<span style="font-size: 11px; background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; font-weight: 700;">✓ Your Choice (Correct)</span>`;
        } else if (isCorrect) {
          bg = "#ecfdf5";
          border = "#10b981";
          text = "#065f46";
          tag = `<span style="font-size: 11px; background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; font-weight: 700;">✓ Correct Option</span>`;
        } else if (isUserChoice) {
          bg = "#fef2f2";
          border = "#ef4444";
          text = "#991b1b";
          tag = `<span style="font-size: 11px; background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px; font-weight: 700;">✗ Your Choice</span>`;
        }

        return `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin-top: 6px; background: ${bg}; border: 1.5px solid ${border}; border-radius: 6px; color: ${text}; font-size: 13.5px;">
            <div><strong>${letter}.</strong> ${escapeHtml(opt)}</div>
            ${tag}
          </div>
        `;
      }).join("");

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #0b1e36; font-size: 14px;">Question ${q.index || 1}</strong>
          ${statusBadge}
        </div>
        <p style="font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 10px;">${escapeHtml(q.question)}</p>
        <div>${optionsHtml}</div>
        ${q.explanation ? `<div style="margin-top: 8px; font-size: 12.5px; color: #1e40af; background: #eff6ff; padding: 6px 10px; border-radius: 5px;"><em>Note: ${escapeHtml(q.explanation)}</em></div>` : ''}
      `;

      modalQuestionsList.appendChild(card);
    });

    reviewModal.style.display = "flex";
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
