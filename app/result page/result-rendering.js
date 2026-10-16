import { escapeHtml, formatTime, getGradeDetails, getSubjectTitle, saveToHenryHistory } from "./result-data.js";

let activeReviewQuestions = [];

/**
 * Populates all UI elements and renders the detailed questions breakdown
 */
export function renderResults(data) {
  if (!data) return;

  const candidateName = data.candidate_name || data.name || data.studentName || localStorage.getItem("cbt_candidate_name") || "Student";
  const candidateId = data.candidate_id || data.candidateId || localStorage.getItem("cbt_candidate_id") || "CBT-2026";
  const attemptNum = data.attempt_number || data.attemptNumber || parseInt(localStorage.getItem("cbt_current_attempt_number")) || 1;
  const subjectKey = data.subject || "general_knowledge";
  const subjectTitle = data.subject_title || getSubjectTitle(subjectKey);
  const creatorTag = data.creator_tag || localStorage.getItem("cbt_creator_tag") || "";
  const durationMinutes = data.duration_minutes || parseInt(localStorage.getItem("cbt_selected_duration_minutes")) || 30;

  const totalQuestions = Number(data.total_questions || data.totalQuestions) || (data.review_breakdown ? data.review_breakdown.length : 20);
  
  const correctCount = Number(data.correct_questions ?? data.correct_answers ?? data.correctAnswers ?? data.correctCount ?? data.correct) || 0;
  const incorrectCount = Number(data.wrong_questions ?? data.wrong_answers ?? data.wrongAnswers ?? data.incorrectCount ?? data.wrong) || 0;
  const unansweredCount = Number(data.unattempted ?? data.unansweredCount ?? data.unanswered) || Math.max(0, totalQuestions - (correctCount + incorrectCount));
  
  const score = Number(data.score ?? (correctCount * 2));
  const totalMarks = Number(data.total_marks ?? data.totalMarks ?? (totalQuestions * 2)) || (totalQuestions * 2);
  const percentage = Number(data.percentage ?? (totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0));
  const timeSpentSeconds = Number(data.timeSpentSeconds ?? data.time_spent_seconds) || 0;

  // Format date and time
  const submittedDate = data.submitted_at ? new Date(data.submitted_at) : new Date();
  const formattedDateTime = submittedDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // Calculate percentages for progress bars
  const correctPercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const incorrectPercent = totalQuestions > 0 ? Math.round((incorrectCount / totalQuestions) * 100) : 0;
  const unansweredPercent = totalQuestions > 0 ? Math.max(0, 100 - correctPercent - incorrectPercent) : 0;

  // Determine Grade
  const gradeInfo = getGradeDetails(percentage);

  // Helper functions
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const setWidth = (id, percent) => {
    const el = document.getElementById(id);
    if (el) el.style.width = `${percent}%`;
  };

  // 1. Metadata Bar
  setText("meta-candidate-name", candidateName);
  setText("meta-candidate-id", candidateId);
  setText("meta-subject-name", subjectTitle);
  setText("meta-exam-duration", `${durationMinutes} Minutes`);
  setText("meta-exam-date", formattedDateTime);

  const creatorBadge = document.getElementById("meta-creator-tag");
  if (creatorBadge) {
    if (creatorTag) {
      creatorBadge.textContent = `by ${creatorTag}`;
      creatorBadge.style.display = "inline-block";
    } else {
      creatorBadge.style.display = "none";
    }
  }

  const attemptBadge = document.getElementById("meta-attempt-badge");
  if (attemptBadge) {
    attemptBadge.textContent = `Attempt #${attemptNum}${attemptNum > 1 ? " (Retake)" : ""}`;
    if (attemptNum > 1) {
      attemptBadge.style.background = "#ffedd5";
      attemptBadge.style.color = "#9a3412";
    }
  }

  // 2. Student Hero
  setText("student-name", candidateName);

  // 3. Metrics Cards
  setText("score-percentage", `${percentage}%`);
  setText("score-count", `(${correctCount} out of ${totalQuestions} correct)`);
  setText("total-marks", `${score} / ${totalMarks}`);
  setText("time-taken", formatTime(timeSpentSeconds));
  setText("grade-letter", gradeInfo.letter);
  setText("grade-text", gradeInfo.text);

  // 4. Stacked Progress Bar Widths
  setWidth("bar-correct", correctPercent);
  setWidth("bar-incorrect", incorrectPercent);
  setWidth("bar-unanswered", unansweredPercent);

  // 5. Legend Breakdown
  setText("correct-stats", `${correctCount} (${correctPercent}%)`);
  setText("incorrect-stats", `${incorrectCount} (${incorrectPercent}%)`);
  setText("unanswered-stats", `${unansweredCount} (${unansweredPercent}%)`);

  // Save active questions for detailed review modal
  activeReviewQuestions = Array.isArray(data.review_breakdown) ? data.review_breakdown : [];

  // Record into History
  saveToHenryHistory({
    candidate_id: candidateId,
    candidateId: candidateId,
    name: candidateName,
    candidate_name: candidateName,
    exam: subjectTitle,
    subject: subjectKey,
    subject_title: subjectTitle,
    creator_tag: creatorTag,
    attempt_number: attemptNum,
    attemptNumber: attemptNum,
    score: score,
    total_questions: totalQuestions,
    totalMarks: totalMarks,
    percentage: percentage,
    grade: gradeInfo.letter,
    correctAnswers: correctCount,
    correct_questions: correctCount,
    wrong_questions: incorrectCount,
    unattempted: unansweredCount,
    duration_minutes: durationMinutes,
    timeSpentSeconds: timeSpentSeconds,
    dateTaken: submittedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    submitted_at: data.submitted_at || new Date().toISOString(),
    review_breakdown: activeReviewQuestions
  });
}

/**
 * Render Question-by-Question Review in Modal
 */
export function renderReviewModal() {
  const container = document.getElementById("modalResultQuestionsList");
  if (!container) return;

  container.innerHTML = "";

  if (activeReviewQuestions.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #64748b;">
        <i class="fa-solid fa-file-circle-question" style="font-size: 32px; color: #94a3b8; margin-bottom: 12px; display: block;"></i>
        Detailed question breakdown is not available for this session.
      </div>
    `;
    return;
  }

  activeReviewQuestions.forEach((q, idx) => {
    const isCorrect = q.isCorrect;
    const isUnanswered = q.isUnanswered;

    const badgeColor = isCorrect ? "#16a34a" : isUnanswered ? "#64748b" : "#dc2626";
    const badgeBg = isCorrect ? "#dcfce7" : isUnanswered ? "#f1f5f9" : "#fee2e2";
    const badgeText = isCorrect ? "CORRECT" : isUnanswered ? "UNANSWERED" : "INCORRECT";

    const card = document.createElement("div");
    card.style.cssText = "border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 14px; background: white;";

    let optionsHtml = "";
    if (Array.isArray(q.options)) {
      optionsHtml = q.options.map((opt, oIdx) => {
        const isUserChoice = q.userAnswerIndex === oIdx;
        const isCorrectChoice = q.correctAnswerIndex === oIdx;

        let optStyle = "background: #f8fafc; border: 1px solid #e2e8f0; color: #334155;";
        let iconHtml = "";

        if (isCorrectChoice) {
          optStyle = "background: #f0fdf4; border: 1.5px solid #86efac; color: #166534; font-weight: 600;";
          iconHtml = ' <i class="fa-solid fa-check" style="color: #16a34a; margin-left: 6px;"></i> <span style="font-size: 11px; color: #16a34a;">(Correct Answer)</span>';
        } else if (isUserChoice && !isCorrect) {
          optStyle = "background: #fef2f2; border: 1.5px solid #fca5a5; color: #991b1b; font-weight: 600;";
          iconHtml = ' <i class="fa-solid fa-xmark" style="color: #dc2626; margin-left: 6px;"></i> <span style="font-size: 11px; color: #dc2626;">(Your Answer)</span>';
        }

        const letter = String.fromCharCode(65 + oIdx);
        return `
          <div style="padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; font-size: 13.5px; ${optStyle}">
            <strong>${letter}.</strong> ${escapeHtml(opt)}${iconHtml}
          </div>
        `;
      }).join("");
    }

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 700; color: #0f172a; font-size: 14px;">Question ${q.index || (idx + 1)}</span>
        <span style="background: ${badgeBg}; color: ${badgeColor}; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 9999px;">
          ${badgeText}
        </span>
      </div>
      <p style="font-size: 14px; color: #1e293b; margin-bottom: 12px; font-weight: 500; line-height: 1.45;">
        ${escapeHtml(q.question)}
      </p>
      <div style="margin-bottom: 10px;">
        ${optionsHtml}
      </div>
      <div style="font-size: 12.5px; color: #475569; background: #f1f5f9; padding: 8px 12px; border-radius: 6px;">
        <strong>Explanation:</strong> ${escapeHtml(q.explanation || "No explanation provided.")}
      </div>
    `;

    container.appendChild(card);
  });
}
