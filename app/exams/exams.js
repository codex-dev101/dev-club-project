import { getCbtSubjectById, sampleCbtQuestions } from "./questions-data.js";
import { saveExamState, loadExamState, clearExamState, saveResultToDatabase } from "./storage.js";
import { formatTime, initTimer, stopTimer } from "./timer.js";
import { escapeText, renderQuestionView } from "./rendering.js";
import { createExamSubmitter } from "./submission.js";
import { requireAuth } from "../authentication/auth.js";

// ============================================================
// Smart CBT - Examination Controller (exams.js)
// Handles Question Navigation, Custom Timer, Answer Selection & Submissions
// ============================================================

// --- STATE ---
let activeSubject = "general_knowledge";
let activeSubjectTitle = "General Knowledge";
let creatorTag = "";
let candidateId = "CBT-2026";
let candidateName = "Student";
let attemptNumber = 1;
let attemptId = "";

let questions = [];
let currentIndex = 0;
let userAnswers = {};
let markedQuestions = [];

let startTime = Date.now();
let totalDurationSeconds = 60 * 60; // Up to 60 minutes
let deadlineTimestamp = Date.now() + totalDurationSeconds * 1000;
let timeLeft = totalDurationSeconds;


// --- DOM ELEMENTS ---
const examTitle = document.querySelector(".exam-title");
const questionGrid = document.getElementById("questionGrid");
const questionCount = document.getElementById("questionCount");
const questionMarks = document.getElementById("questionMarks");
const questionPrompt = document.getElementById("questionPrompt");
const optionsList = document.getElementById("optionsList");

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnMark = document.getElementById("btnMark");
const btnReviewMarked = document.getElementById("btnReviewMarked");
const reviewMarkedText = document.getElementById("reviewMarkedText");

const timerDisplay = document.getElementById("timerDisplay");
const timerContainer = document.getElementById("timerContainer");

// Submission Confirmation Modal
const btnSubmitExam = document.getElementById("btnSubmitExam");
const submitModal = document.getElementById("submitModal");
const btnCancelSubmit = document.getElementById("btnCancelSubmit");
const btnConfirmSubmit = document.getElementById("btnConfirmSubmit");

const statAnswered = document.getElementById("statAnswered");
const statUnanswered = document.getElementById("statUnanswered");
const statMarked = document.getElementById("statMarked");

const submitExam = createExamSubmitter({
  getState: () => ({
    attemptId,
    candidateId,
    candidateName,
    activeSubject,
    activeSubjectTitle,
    creatorTag,
    attemptNumber,
    questions,
    userAnswers,
    startTime,
    totalDurationSeconds
  }),
  elements: { submitModal, btnConfirmSubmit, btnSubmitExam },
  stopTimer,
  saveResultToDatabase,
  clearExamState
});

// --- HELPER: Save current exam state to storage ---
function persist() {
  if (typeof saveExamState === "function") {
    saveExamState({
      attemptId,
      subject: activeSubject,
      subjectTitle: activeSubjectTitle,
      creatorTag: creatorTag,
      candidateId: candidateId,
      candidateName: candidateName,
      attemptNumber: attemptNumber,
      questions,
      currentIndex,
      userAnswers,
      markedQuestions,
      startTime,
      durationSeconds: totalDurationSeconds,
      deadlineTimestamp,
      timeLeft,
      totalDurationSeconds
    });
  }
}

// Check if all questions have been answered
function isAllQuestionsAnswered() {
  return questions.length > 0 && Object.keys(userAnswers).length >= questions.length;
}

// --- SETUP SUBJECT & QUESTIONS ---
function setupExam() {
  // 1. Authenticate Route
  const user = requireAuth();
  if (user) {
    candidateName = user.fullName || "Student";
    candidateId = user.matricNo || "CBT-2026";
  } else {
    candidateName = localStorage.getItem("cbt_candidate_name") || "Student";
    candidateId = localStorage.getItem("cbt_candidate_id") || "CBT-2026";
  }

  // 2. Read Configuration
  let examConfig = null;
  try {
    examConfig = JSON.parse(localStorage.getItem("cbt_exam_config") || "null");
  } catch (e) {}

  const urlParams = new URLSearchParams(window.location.search);
  const urlSubject = urlParams.get("subject");
  const storedSubject = localStorage.getItem("cbt_selected_subject");
  const isFreshStart = urlParams.get("start") === "true";

  activeSubject = urlSubject || examConfig?.subjectId || storedSubject || "general_knowledge";
  attemptNumber = parseInt(urlParams.get("attempt") || localStorage.getItem("cbt_current_attempt_number")) || 1;

  // Customization parameters
  const requestedQCount = Math.min(50, Math.max(1, parseInt(urlParams.get("qcount")) || examConfig?.questionCount || parseInt(localStorage.getItem("cbt_selected_question_count")) || 20));
  const requestedDurationMins = Math.min(60, Math.max(1, parseInt(urlParams.get("duration")) || examConfig?.durationMinutes || parseInt(localStorage.getItem("cbt_selected_duration_minutes")) || 30));

  // Retrieve subject metadata
  const subMeta = getCbtSubjectById(activeSubject);
  activeSubjectTitle = examConfig?.subjectTitle || (subMeta ? subMeta.title : activeSubject);
  creatorTag = localStorage.getItem("cbt_creator_tag") || subMeta?.creatorTag || "";

  // Update navbar header title
  if (examTitle) {
    if (creatorTag) {
      examTitle.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Smart CBT - ${escapeText(activeSubjectTitle)} <span style="font-size: 0.8rem; background: rgba(255,255,255,0.18); padding: 2px 8px; border-radius: 9999px; margin-left: 6px; font-weight: normal;">by ${escapeText(creatorTag)}</span>`;
    } else {
      examTitle.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Smart CBT - ${escapeText(activeSubjectTitle)}`;
    }
  }

  // Check saved exam state in local storage (for page refreshes)
  const saved = loadExamState();

  if (saved && !isFreshStart && saved.subject === activeSubject && Array.isArray(saved.questions) && saved.questions.length > 0) {
    // RESUME EXISTING IN-PROGRESS EXAM
    questions = saved.questions;
    currentIndex = saved.currentIndex || 0;
    userAnswers = saved.userAnswers || {};
    markedQuestions = saved.markedQuestions || [];
    startTime = saved.startTime || Date.now();
    totalDurationSeconds = saved.totalDurationSeconds || (requestedDurationMins * 60);
    deadlineTimestamp = saved.deadlineTimestamp || (startTime + totalDurationSeconds * 1000);
    attemptId = saved.attemptId || ("att_" + Date.now());

    // Calculate remaining time against persistent deadline
    const now = Date.now();
    timeLeft = Math.max(0, Math.floor((deadlineTimestamp - now) / 1000));

    // If deadline has already passed while away, auto-submit immediately!
    if (timeLeft <= 0) {
      submitExam(true);
      return;
    }
  } else {
    // INITIALIZE NEW EXAM ATTEMPT
    questions = sampleCbtQuestions(activeSubject, requestedQCount);

    currentIndex = 0;
    userAnswers = {};
    markedQuestions = [];
    attemptId = "att_" + Date.now() + "_" + Math.floor(Math.random() * 10000);

    totalDurationSeconds = Math.min(3600, requestedDurationMins * 60); // Strictly max 60 minutes
    startTime = Date.now();
    deadlineTimestamp = startTime + (totalDurationSeconds * 1000);
    timeLeft = totalDurationSeconds;

    persist();
  }
}

function renderQuestion() {
  renderQuestionView({
    elements: {
      questionCount,
      questionMarks,
      questionPrompt,
      optionsList,
      btnPrev,
      btnNext,
      btnMark,
      questionGrid,
      reviewMarkedText
    },
    questions,
    currentIndex,
    attemptNumber,
    userAnswers,
    markedQuestions,
    onSelectOption: selectOption,
    onSelectQuestion: (index) => {
      currentIndex = index;
      renderQuestion();
      persist();
    }
  });
}

function selectOption(optIdx) {
  userAnswers[currentIndex] = optIdx;
  persist();
  renderQuestion();
}

// --- TIMER START ---
function startExamTimer() {
  if (timerDisplay) {
    timerDisplay.textContent = formatTime(timeLeft);
  }

  initTimer({
    getDeadline: () => deadlineTimestamp,
    setTime: (t) => {
      timeLeft = t;
      if (timeLeft % 5 === 0) persist();
    },
    onTick: (t) => {
      if (timerDisplay) timerDisplay.textContent = formatTime(t);
      if (timerContainer) timerContainer.classList.toggle("warning", t < 300);
    },
    onTimeUp: () => {
      // Automatic submission when timer expires
      submitExam(true);
    }
  });
}

function openSubmitModal() {
  if (statAnswered) statAnswered.textContent = Object.keys(userAnswers).length;
  if (statUnanswered) statUnanswered.textContent = Math.max(0, questions.length - Object.keys(userAnswers).length);
  if (statMarked) statMarked.textContent = markedQuestions.length;
  if (submitModal) submitModal.classList.add("active");
}

function goToNextQuestion() {
  const allAnswered = isAllQuestionsAnswered();
  const isLast = currentIndex === questions.length - 1;

  if (allAnswered || isLast) {
    openSubmitModal();
  } else {
    currentIndex++;
    renderQuestion();
    persist();
  }
}

function goToPrevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
    persist();
  }
}

function toggleMarkQuestion() {
  const pos = markedQuestions.indexOf(currentIndex);
  if (pos === -1) markedQuestions.push(currentIndex);
  else markedQuestions.splice(pos, 1);
  persist();
  renderQuestion();
}

function closeSubmitModal() {
  if (submitModal) submitModal.classList.remove("active");
}

// --- ATTACH CLICK EVENT LISTENERS ---
if (btnPrev) btnPrev.addEventListener("click", goToPrevQuestion);
if (btnNext) btnNext.addEventListener("click", goToNextQuestion);
if (btnMark) btnMark.addEventListener("click", toggleMarkQuestion);

if (btnReviewMarked) {
  btnReviewMarked.addEventListener("click", () => {
    if (markedQuestions.length > 0) {
      currentIndex = markedQuestions[0];
      renderQuestion();
    } else {
      alert("No questions marked for review!");
    }
  });
}

if (btnSubmitExam) {
  btnSubmitExam.addEventListener("click", () => {
    openSubmitModal();
  });
}

if (btnCancelSubmit) {
  btnCancelSubmit.addEventListener("click", closeSubmitModal);
}

if (btnConfirmSubmit) {
  btnConfirmSubmit.addEventListener("click", (e) => {
    if (e && e.preventDefault) e.preventDefault();
    submitExam(false);
  });
}

// --- KEYBOARD SHORTCUT SYSTEM ---
document.addEventListener("keydown", (e) => {
  const activeEl = document.activeElement;
  if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable)) {
    return;
  }

  const key = e.key.toUpperCase();
  const isModalActive = submitModal && submitModal.classList.contains("active");

  if (isModalActive) {
    if (e.key === "Enter" || key === "S" || key === "Y") {
      e.preventDefault();
      submitExam(false);
    } else if (e.key === "Escape" || key === "C") {
      e.preventDefault();
      closeSubmitModal();
    }
    return;
  }

  switch (key) {
    case "N":
    case "ARROWRIGHT":
      e.preventDefault();
      goToNextQuestion();
      break;

    case "P":
    case "ARROWLEFT":
      e.preventDefault();
      goToPrevQuestion();
      break;

    case "S":
      e.preventDefault();
      openSubmitModal();
      break;

    case "M":
    case "R":
      e.preventDefault();
      toggleMarkQuestion();
      break;

    case "A":
    case "1":
      e.preventDefault();
      if (questions[currentIndex]?.options?.[0]) selectOption(0);
      break;

    case "B":
    case "2":
      e.preventDefault();
      if (questions[currentIndex]?.options?.[1]) selectOption(1);
      break;

    case "C":
    case "3":
      e.preventDefault();
      if (questions[currentIndex]?.options?.[2]) selectOption(2);
      break;

    case "D":
    case "4":
      e.preventDefault();
      if (questions[currentIndex]?.options?.[3]) selectOption(3);
      break;
  }
});

// --- INITIALIZE ---
setupExam();
renderQuestion();
startExamTimer();

// Mobile Question Palette Toggle
const btnTogglePalette = document.getElementById("btnTogglePalette");
const btnClosePalette = document.getElementById("btnClosePalette");
const sidebarNav = document.querySelector(".sidebar-navigation");

if (btnTogglePalette && sidebarNav) {
  btnTogglePalette.addEventListener("click", () => {
    sidebarNav.classList.toggle("mobile-open");
    btnTogglePalette.classList.toggle("active");
  });
}

if (btnClosePalette && sidebarNav) {
  btnClosePalette.addEventListener("click", () => {
    sidebarNav.classList.remove("mobile-open");
    if (btnTogglePalette) btnTogglePalette.classList.remove("active");
  });
}
