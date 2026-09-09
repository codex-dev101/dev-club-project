// Handles saving, loading, and clearing exam data

const STORAGE_KEY = "cbt_exam_state";

function saveExamState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadExamState() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function clearExamState() {
  localStorage.removeItem(STORAGE_KEY);
}

// Make accessible globally
window.saveExamState = saveExamState;
window.loadExamState = loadExamState;
window.clearExamState = clearExamState;
