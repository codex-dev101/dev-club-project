export function escapeText(value) {
  if (!value) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function updateNavigationButtons({ btnPrev, btnNext, btnMark, currentIndex, questions, userAnswers, markedQuestions }) {
  if (btnPrev) {
    btnPrev.disabled = currentIndex === 0;
    btnPrev.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Previous <kbd class="kbd-shortcut">P</kbd>`;
  }

  if (btnNext) {
    const allAnswered = questions.length > 0 && Object.keys(userAnswers).length >= questions.length;
    const isLast = currentIndex === questions.length - 1;

    if (allAnswered) {
      btnNext.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit Exam <kbd class="kbd-shortcut">S</kbd>`;
      btnNext.classList.add("btn-all-answered");
      btnNext.title = "All questions answered! Click or press S to submit your exam.";
    } else if (isLast) {
      btnNext.innerHTML = `Finish & Submit <kbd class="kbd-shortcut">N</kbd> <i class="fa-solid fa-arrow-right"></i>`;
      btnNext.classList.remove("btn-all-answered");
      btnNext.title = "On last question";
    } else {
      btnNext.innerHTML = `Next <kbd class="kbd-shortcut">N</kbd> <i class="fa-solid fa-arrow-right"></i>`;
      btnNext.classList.remove("btn-all-answered");
      btnNext.title = "Go to next question (or press N)";
    }
  }

  const isMarked = markedQuestions.includes(currentIndex);
  if (btnMark) {
    btnMark.classList.toggle("is-marked", isMarked);
    btnMark.innerHTML = `
      <svg class="flag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
        <line x1="4" y1="22" x2="4" y2="15"></line>
      </svg>
      <span id="markBtnText">${isMarked ? "Unmark Question" : "Mark for Review"}</span>
      <kbd class="kbd-shortcut">M</kbd>
    `;
  }
}

export function renderQuestionGrid({
  questionGrid,
  questions,
  userAnswers,
  markedQuestions,
  currentIndex,
  reviewMarkedText,
  onSelectQuestion
}) {
  if (!questionGrid) return;
  questionGrid.innerHTML = "";

  questions.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "q-btn";
    button.textContent = index + 1;

    if (userAnswers[index] !== undefined) button.classList.add("state-answered");
    if (markedQuestions.includes(index)) button.classList.add("state-marked");
    if (index === currentIndex) button.classList.add("state-current");

    button.addEventListener("click", () => {
      onSelectQuestion(index);
      const sidebarNav = document.querySelector(".sidebar-navigation");
      if (sidebarNav?.classList.contains("mobile-open")) {
        sidebarNav.classList.remove("mobile-open");
        document.getElementById("btnTogglePalette")?.classList.remove("active");
      }
    });

    questionGrid.appendChild(button);
  });

  if (reviewMarkedText) reviewMarkedText.textContent = `Review Marked (${markedQuestions.length})`;

  const answeredCount = document.getElementById("paletteAnsweredCount");
  const totalCount = document.getElementById("paletteTotalCount");
  if (answeredCount) answeredCount.textContent = Object.keys(userAnswers).length;
  if (totalCount) totalCount.textContent = questions.length;
}

export function renderQuestionView({
  elements,
  questions,
  currentIndex,
  attemptNumber,
  userAnswers,
  markedQuestions,
  onSelectOption,
  onSelectQuestion
}) {
  const { questionCount, questionMarks, questionPrompt, optionsList } = elements;
  const question = questions[currentIndex];
  if (!question) return;

  if (questionCount) {
    questionCount.innerHTML = `Question ${currentIndex + 1} of ${questions.length} <span class="attempt-indicator">(Attempt #${attemptNumber})</span>`;
  }
  if (questionMarks) questionMarks.textContent = "2 Marks";
  if (questionPrompt) questionPrompt.textContent = question.question;

  if (optionsList) {
    optionsList.innerHTML = "";
    question.options.forEach((optionText, optionIndex) => {
      const isSelected = userAnswers[currentIndex] === optionIndex;
      const card = document.createElement("div");
      card.className = `option-card ${isSelected ? "selected" : ""}`;

      const optionLetter = String.fromCharCode(65 + optionIndex);
      card.innerHTML = `
        <div class="custom-radio"><div class="radio-dot"></div></div>
        <span class="option-badge">${optionLetter}</span>
        <span class="option-text">${escapeText(optionText)}</span>
      `;
      card.addEventListener("click", () => onSelectOption(optionIndex));
      optionsList.appendChild(card);
    });
  }

  updateNavigationButtons({
    btnPrev: elements.btnPrev,
    btnNext: elements.btnNext,
    btnMark: elements.btnMark,
    currentIndex,
    questions,
    userAnswers,
    markedQuestions
  });

  renderQuestionGrid({
    questionGrid: elements.questionGrid,
    questions,
    userAnswers,
    markedQuestions,
    currentIndex,
    reviewMarkedText: elements.reviewMarkedText,
    onSelectQuestion
  });
}
