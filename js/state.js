/**
 * State Management Module (state.js)
 * Manages the examination state and user responses.
 */
import { questions } from "./questions.js";

export const state = {
  currentQuestionIndex: 0,
  userAnswers: new Array(questions.length).fill(null),
  markedQuestionSet: new Set(),
  isExamSubmitted: false
};

/**
 * Updates the user's answer choice for the current question.
 */
export function setUserAnswer(questionIndex, optionIndex) {
  state.userAnswers[questionIndex] = optionIndex;
}

/**
 * Toggles the mark for review status of a question.
 */
export function toggleMarkQuestion(questionIndex) {
  if (state.markedQuestionSet.has(questionIndex)) {
    state.markedQuestionSet.delete(questionIndex);
    return false; // unmarked
  } else {
    state.markedQuestionSet.add(questionIndex);
    return true; // marked
  }
}

/**
 * Sets the active question index.
 */
export function setCurrentIndex(newIndex) {
  if (newIndex >= 0 && newIndex < questions.length) {
    state.currentQuestionIndex = newIndex;
    return true;
  }
  return false;
}

/**
 * Resets the entire state to initial values.
 */
export function resetState() {
  state.currentQuestionIndex = 0;
  state.userAnswers.fill(null);
  state.markedQuestionSet.clear();
  state.isExamSubmitted = false;
}
