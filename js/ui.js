/**
 * UI Rendering & DOM Manipulation Module (ui.js)
 * Responsible for updating the HTML view based on the current state.
 */

// Cached DOM Elements
export const elements = {
  timerDisplay: document.getElementById("timerDisplay"),
  timerContainer: document.getElementById("timerContainer"),
  questionGrid: document.getElementById("questionGrid"),
  questionCount: document.getElementById("questionCount"),
  questionMarks: document.getElementById("questionMarks"),
  questionPrompt: document.getElementById("questionPrompt"),
  optionsList: document.getElementById("optionsList"),
  btnPrev: document.getElementById("btnPrev"),
  btnNext: document.getElementById("btnNext"),
  btnMark: document.getElementById("btnMark"),
  markBtnText: document.getElementById("markBtnText"),
  btnReviewMarked: document.getElementById("btnReviewMarked"),
  reviewMarkedText: document.getElementById("reviewMarkedText"),
  btnSubmitExam: document.getElementById("btnSubmitExam"),

  // Confirmation Modal
  submitModal: document.getElementById("submitModal"),
  btnCancelSubmit: document.getElementById("btnCancelSubmit"),
  btnConfirmSubmit: document.getElementById("btnConfirmSubmit"),
  statAnswered: document.getElementById("statAnswered"),
  statUnanswered: document.getElementById("statUnanswered"),
  statMarked: document.getElementById("statMarked"),

  // Results Modal
  resultsModal: document.getElementById("resultsModal"),
  resultPercentage: document.getElementById("resultPercentage"),
  resultGrade: document.getElementById("resultGrade"),
  resultTotalQuestions: document.getElementById("resultTotalQuestions"),
  resultCorrect: document.getElementById("resultCorrect"),
  resultWrong: document.getElementById("resultWrong"),
  resultUnattempted: document.getElementById("resultUnattempted"),
  resultTotalScore: document.getElementById("resultTotalScore"),
  btnRestartExam: document.getElementById("btnRestartExam")
};

/**
 * Generates the 50 numbered buttons in the navigation grid.
 */
export function renderQuestionGrid(totalQuestions, onQuestionClick) {
  elements.questionGrid.innerHTML = "";
  for (let i = 0; i < totalQuestions; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "q-btn";
    btn.textContent = i + 1;
    btn.id = `q-btn-${i}`;
    btn.addEventListener("click", () => onQuestionClick(i));
    elements.questionGrid.appendChild(btn);
  }
}

/**
 * Updates the appearance and text of the current question.
 */
export function renderQuestion(question, currentIndex, totalQuestions, userChoice, isMarked, onOptionSelect) {
  // 1. Meta information
  elements.questionCount.textContent = `Question ${currentIndex + 1} of ${totalQuestions}`;
  elements.questionMarks.textContent = `${question.marks} Marks`;
  elements.questionPrompt.textContent = question.prompt;

  // 2. Render options A, B, C, D
  elements.optionsList.innerHTML = "";
  const prefixes = ["A", "B", "C", "D"];

  question.options.forEach((optText, optIndex) => {
    const isSelected = userChoice === optIndex;

    const card = document.createElement("div");
    card.className = `option-card ${isSelected ? "selected" : ""}`;
    card.addEventListener("click", () => onOptionSelect(optIndex));

    // Custom Radio Icon
    const radio = document.createElement("div");
    radio.className = "custom-radio";
    const dot = document.createElement("div");
    dot.className = "radio-dot";
    radio.appendChild(dot);

    // Option Label
    const label = document.createElement("span");
    label.className = "option-text";
    label.textContent = `${prefixes[optIndex]}. ${optText}`;

    card.appendChild(radio);
    card.appendChild(label);
    elements.optionsList.appendChild(card);
  });

  // 3. Navigation buttons state
  elements.btnPrev.disabled = currentIndex === 0;
  elements.btnNext.textContent = currentIndex === totalQuestions - 1 ? "Finish Exam" : "Next \u2192";

  // 4. Mark button appearance
  if (isMarked) {
    elements.btnMark.classList.add("is-marked");
    elements.markBtnText.textContent = "Unmark Review";
  } else {
    elements.btnMark.classList.remove("is-marked");
    elements.markBtnText.textContent = "Mark for Review";
  }
}

/**
 * Synchronizes the color badges on the 50 sidebar buttons.
 */
export function updateGridState(totalQuestions, userAnswers, markedSet, currentIndex) {
  for (let i = 0; i < totalQuestions; i++) {
    const btn = document.getElementById(`q-btn-${i}`);
    if (!btn) continue;

    btn.className = "q-btn";

    const isAnswered = userAnswers[i] !== null;
    const isMarked = markedSet.has(i);
    const isCurrent = currentIndex === i;

    if (isMarked) {
      btn.classList.add("state-marked");
    } else if (isAnswered) {
      btn.classList.add("state-answered");
    }

    if (isCurrent) {
      btn.classList.add("state-current");
    }
  }
}

/**
 * Updates the review marked button counter.
 */
export function updateMarkedCount(count) {
  elements.reviewMarkedText.textContent = `Review Marked (${count})`;
}

/**
 * Shows the submission confirmation dialog with stats.
 */
export function showSubmitModal(answeredCount, totalCount, markedCount) {
  elements.statAnswered.textContent = answeredCount;
  elements.statUnanswered.textContent = totalCount - answeredCount;
  elements.statMarked.textContent = markedCount;
  elements.submitModal.classList.add("active");
}

export function hideSubmitModal() {
  elements.submitModal.classList.remove("active");
}

/**
 * Displays the final results dialog with calculated score metrics.
 */
export function showResultsModal(results) {
  hideSubmitModal();
  elements.resultPercentage.textContent = `${results.percentage}%`;
  elements.resultGrade.textContent = results.grade;
  elements.resultTotalQuestions.textContent = results.totalQuestions;
  elements.resultCorrect.textContent = results.correctCount;
  elements.resultWrong.textContent = results.wrongCount;
  elements.resultUnattempted.textContent = results.unattemptedCount;
  elements.resultTotalScore.textContent = `${results.totalScoreEarned} / ${results.maxPossibleScore} Marks`;
  elements.resultsModal.classList.add("active");
}

export function hideResultsModal() {
  elements.resultsModal.classList.remove("active");
}
