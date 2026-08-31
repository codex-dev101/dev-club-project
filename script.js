/**
 * Smart CBT Examination - Main Application Entry (script.js)
 * Modular orchestrator coordinating State, UI, Timer, Questions, and Grading.
 */

import { questions } from "./js/questions.js";
import { 
  state, 
  setUserAnswer, 
  toggleMarkQuestion, 
  setCurrentIndex, 
  resetState 
} from "./js/state.js";
import { 
  startTimer, 
  stopTimer, 
  resetTimer 
} from "./js/timer.js";
import { calculateResults } from "./js/grading.js";
import { 
  elements, 
  renderQuestionGrid, 
  renderQuestion, 
  updateGridState, 
  updateMarkedCount, 
  showSubmitModal, 
  hideSubmitModal, 
  showResultsModal, 
  hideResultsModal 
} from "./js/ui.js";

// ==========================================================================
// App Controller & View Sync
// ==========================================================================

function updateView() {
  const currentQ = questions[state.currentQuestionIndex];
  const userChoice = state.userAnswers[state.currentQuestionIndex];
  const isMarked = state.markedQuestionSet.has(state.currentQuestionIndex);

  // 1. Render active question
  renderQuestion(
    currentQ,
    state.currentQuestionIndex,
    questions.length,
    userChoice,
    isMarked,
    handleOptionSelect
  );

  // 2. Synchronize navigation matrix & marked counter
  updateGridState(
    questions.length,
    state.userAnswers,
    state.markedQuestionSet,
    state.currentQuestionIndex
  );
  updateMarkedCount(state.markedQuestionSet.size);
}

// ==========================================================================
// User Interaction Handlers
// ==========================================================================

function handleOptionSelect(optionIndex) {
  setUserAnswer(state.currentQuestionIndex, optionIndex);
  updateView();
}

function handleToggleMark() {
  toggleMarkQuestion(state.currentQuestionIndex);
  updateView();
}

function handleNavigate(index) {
  if (setCurrentIndex(index)) {
    updateView();
  }
}

function handleNext() {
  if (state.currentQuestionIndex < questions.length - 1) {
    handleNavigate(state.currentQuestionIndex + 1);
  } else {
    handleOpenSubmitModal();
  }
}

function handlePrev() {
  if (state.currentQuestionIndex > 0) {
    handleNavigate(state.currentQuestionIndex - 1);
  }
}

function handleReviewMarked() {
  if (state.markedQuestionSet.size === 0) {
    alert("You have no questions marked for review.");
    return;
  }

  const markedList = Array.from(state.markedQuestionSet).sort((a, b) => a - b);
  let nextMarked = markedList.find(idx => idx > state.currentQuestionIndex);

  if (nextMarked === undefined) {
    nextMarked = markedList[0];
  }

  handleNavigate(nextMarked);
}

// ==========================================================================
// Submission & Results
// ==========================================================================

function handleOpenSubmitModal() {
  if (state.isExamSubmitted) return;

  const answeredCount = state.userAnswers.filter(ans => ans !== null).length;
  showSubmitModal(answeredCount, questions.length, state.markedQuestionSet.size);
}

function handleFinishExam() {
  stopTimer();
  state.isExamSubmitted = true;

  const results = calculateResults(questions, state.userAnswers);
  showResultsModal(results);
}

function handleRestartExam() {
  hideResultsModal();
  resetState();
  resetTimer();
  initApp();
}

// ==========================================================================
// Initialization
// ==========================================================================

function initApp() {
  renderQuestionGrid(questions.length, handleNavigate);
  updateView();

  // Start timer with tick and timeout callbacks
  startTimer(
    (formattedTime, secondsLeft) => {
      elements.timerDisplay.textContent = formattedTime;
      if (secondsLeft <= 300) {
        elements.timerContainer.classList.add("warning");
      } else {
        elements.timerContainer.classList.remove("warning");
      }
    },
    () => {
      alert("Time is up! Your exam is being submitted automatically.");
      handleFinishExam();
    }
  );
}

// ==========================================================================
// Event Listeners Registration
// ==========================================================================
elements.btnNext.addEventListener("click", handleNext);
elements.btnPrev.addEventListener("click", handlePrev);
elements.btnMark.addEventListener("click", handleToggleMark);
elements.btnReviewMarked.addEventListener("click", handleReviewMarked);
elements.btnSubmitExam.addEventListener("click", handleOpenSubmitModal);
elements.btnCancelSubmit.addEventListener("click", hideSubmitModal);
elements.btnConfirmSubmit.addEventListener("click", handleFinishExam);
elements.btnRestartExam.addEventListener("click", handleRestartExam);

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  if (state.isExamSubmitted || elements.submitModal.classList.contains("active")) return;

  if (e.key === "ArrowRight") {
    handleNext();
  } else if (e.key === "ArrowLeft") {
    handlePrev();
  } else if (e.key === "m" || e.key === "M") {
    handleToggleMark();
  } else if (["1", "2", "3", "4"].includes(e.key)) {
    const optIndex = parseInt(e.key, 10) - 1;
    handleOptionSelect(optIndex);
  }
});

// Boot the application
document.addEventListener("DOMContentLoaded", initApp);
