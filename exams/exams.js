// ==========================================
// MAIN CONTROLLER: exams.js
// Connects modules with the UI & DOM Events
// ==========================================

// --- STATE ---
let activeSubject = "general_knowledge";
let questions = [];
let currentIndex = 0;
let userAnswers = {};
let timeLeft = 60 * 60; // 60 minutes

// --- DOM ELEMENTS ---
const examTitle = document.querySelector(".exam-title");
const questionGrid = document.getElementById("questionGrid");
const questionCount = document.getElementById("questionCount");
const questionPrompt = document.getElementById("questionPrompt");
const optionsList = document.getElementById("optionsList");

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnMark = document.getElementById("btnMark");
const markBtnText = document.getElementById("markBtnText");
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

// --- HELPER: Save current exam state to storage ---
function persist() {
  window.saveExamState({
    subject: activeSubject,
    questions,
    currentIndex,
    userAnswers,
    markedQuestions,
    timeLeft
  });
}

// --- SETUP SUBJECT & QUESTIONS ---
function setupExam() {
  // 1. Detect subject from URL parameters or previous session
  const urlSubject = new URLSearchParams(window.location.search).get("subject");
  const saved = window.loadExamState();

  if (urlSubject && window.subjectQuestions[urlSubject]) {
    activeSubject = urlSubject;
  } else if (saved?.subject && window.subjectQuestions[saved.subject]) {
    activeSubject = saved.subject;
  }

  // Update header title with subject name
  const names = {
    math: "Mathematics",
    english: "English",
    science: "Science",
    art: "Art",
    current_affairs: "Current Affairs",
    general_knowledge: "General Knowledge"
  };
  if (examTitle) {
    examTitle.textContent = `Smart CBT - ${names[activeSubject] || "General Knowledge"}`;
  }

  // 2. Load saved exam or generate new random questions
  if (saved && saved.subject === activeSubject && saved.questions?.length > 0) {
    questions = saved.questions;
    currentIndex = saved.currentIndex || 0;
    userAnswers = saved.userAnswers || {};
    markedQuestions = saved.markedQuestions || [];
    timeLeft = saved.timeLeft || 60 * 60;
  } else {
    const bank = window.subjectQuestions[activeSubject] || window.subjectQuestions.general_knowledge;
    questions = window.shuffleQuestions(bank);
    currentIndex = 0;
    userAnswers = {};
    markedQuestions = [];
    timeLeft = 60 * 60;
    persist();
  }
}

// --- UI RENDERING ---
function renderGrid() {
  if (!questionGrid) return;
  questionGrid.innerHTML = "";

  questions.forEach((_, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "q-btn";
    btn.textContent = idx + 1;

    if (userAnswers[idx] !== undefined) btn.classList.add("state-answered");
    if (markedQuestions.includes(idx)) btn.classList.add("state-marked");
    if (idx === currentIndex) btn.classList.add("state-current");

    btn.addEventListener("click", () => {
      currentIndex = idx;
      renderQuestion();
      persist();
    });

    questionGrid.appendChild(btn);
  });

  if (reviewMarkedText) {
    reviewMarkedText.textContent = `Review Marked (${markedQuestions.length})`;
  }
}

function renderQuestion() {
  const q = questions[currentIndex];
  if (!q) return;

  if (questionCount) {
    questionCount.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  }
  if (questionPrompt) {
    questionPrompt.textContent = q.question;
  }

  // Render options list
  if (optionsList) {
    optionsList.innerHTML = "";
    q.options.forEach((optText, optIdx) => {
      const isSelected = userAnswers[currentIndex] === optIdx;
      const card = document.createElement("div");
      card.className = `option-card ${isSelected ? "selected" : ""}`;

      card.innerHTML = `
        <div class="custom-radio"><div class="radio-dot"></div></div>
        <span class="option-text">${optText}</span>
      `;

      card.addEventListener("click", () => {
        userAnswers[currentIndex] = optIdx;
        persist();
        renderQuestion();
      });

      optionsList.appendChild(card);
    });
  }

  // Buttons state
  if (btnPrev) btnPrev.disabled = currentIndex === 0;
  if (btnNext) {
    btnNext.innerHTML = currentIndex === questions.length - 1 ? "Finish & Submit" : "Next &rarr;";
  }

  const isMarked = markedQuestions.includes(currentIndex);
  if (btnMark) btnMark.classList.toggle("is-marked", isMarked);
  if (markBtnText) markBtnText.textContent = isMarked ? "Unmark Question" : "Mark for Review";

  renderGrid();
}

// --- TIMER START ---
function startExamTimer() {
  if (timerDisplay) {
    timerDisplay.textContent = window.formatTime(timeLeft);
  }

  window.initTimer({
    getTime: () => timeLeft,
    setTime: (t) => {
      timeLeft = t;
      if (timeLeft % 5 === 0) persist();
    },
    onTick: (t) => {
      if (timerDisplay) timerDisplay.textContent = window.formatTime(t);
      if (timerContainer) timerContainer.classList.toggle("warning", t < 300);
    },
    onTimeUp: () => {
      alert("Time is up! Submitting your exam.");
      submitExam();
    }
  });
}

// --- SUBMISSION & REDIRECT TO RESULTS PAGE ---
function submitExam() {
  window.stopTimer();
  if (submitModal) submitModal.classList.remove("active");

  let correct = 0;
  let wrong = 0;
  let unattempted = 0;

  questions.forEach((q, idx) => {
    const ans = userAnswers[idx];
    if (ans === undefined) unattempted++;
    else if (ans === q.answer) correct++;
    else wrong++;
  });

  const percent = Math.round((correct / questions.length) * 100);
  const grades = { 70: "A", 60: "B", 50: "C", 40: "D" };
  const grade = Object.entries(grades).find(([min]) => percent >= min)?.[1] || "F";

  // Package results to local storage so the Result Page can display it
  const examResults = {
    subject: activeSubject,
    totalQuestions: questions.length,
    correctAnswers: correct,
    wrongAnswers: wrong,
    unattempted: unattempted,
    percentage: percent,
    grade: grade,
    score: correct * 2,
    totalMarks: questions.length * 2,
    submittedAt: new Date().toISOString()
  };

  localStorage.setItem("cbt_exam_results", JSON.stringify(examResults));

  // Clear active test state
  window.clearExamState();

  // Redirect to separate result page
  window.location.href = "../result page/index.html";
}

// --- ATTACH EVENT LISTENERS ---
if (btnPrev) {
  btnPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
      persist();
    }
  });
}

if (btnNext) {
  btnNext.addEventListener("click", () => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
      persist();
    } else {
      if (statAnswered) statAnswered.textContent = Object.keys(userAnswers).length;
      if (statUnanswered) statUnanswered.textContent = questions.length - Object.keys(userAnswers).length;
      if (statMarked) statMarked.textContent = markedQuestions.length;
      if (submitModal) submitModal.classList.add("active");
    }
  });
}

if (btnMark) {
  btnMark.addEventListener("click", () => {
    const pos = markedQuestions.indexOf(currentIndex);
    if (pos === -1) markedQuestions.push(currentIndex);
    else markedQuestions.splice(pos, 1);
    persist();
    renderQuestion();
  });
}

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
    if (statAnswered) statAnswered.textContent = Object.keys(userAnswers).length;
    if (statUnanswered) statUnanswered.textContent = questions.length - Object.keys(userAnswers).length;
    if (statMarked) statMarked.textContent = markedQuestions.length;
    if (submitModal) submitModal.classList.add("active");
  });
}

if (btnCancelSubmit) {
  btnCancelSubmit.addEventListener("click", () => {
    if (submitModal) submitModal.classList.remove("active");
  });
}

if (btnConfirmSubmit) {
  btnConfirmSubmit.addEventListener("click", submitExam);
}

// --- INITIALIZE ---
setupExam();
renderQuestion();
startExamTimer();
