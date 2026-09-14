// Connects modules with the UI & DOM Events

// --- STATE ---
let activeSubject = "general_knowledge";
let activeSubjectTitle = "General Knowledge";
let creatorTag = "";
let candidateId = "CBT-2026";
let attemptNumber = 1;

let questions = [];
let currentIndex = 0;
let userAnswers = {};
let markedQuestions = [];
let timeLeft = 60 * 60; // Default 60 minutes
let totalDurationSeconds = 60 * 60;

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
    subjectTitle: activeSubjectTitle,
    creatorTag: creatorTag,
    candidateId: candidateId,
    attemptNumber: attemptNumber,
    questions,
    currentIndex,
    userAnswers,
    markedQuestions,
    timeLeft,
    totalDurationSeconds
  });
}

// Check if all questions have been answered
function isAllQuestionsAnswered() {
  return questions.length > 0 && Object.keys(userAnswers).length >= questions.length;
}

// Update Next/Submit Button State Dynamically
function updateNavigationButtons() {
  if (btnPrev) {
    btnPrev.disabled = currentIndex === 0;
    btnPrev.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Previous <kbd class="kbd-shortcut">P</kbd>`;
  }

  if (btnNext) {
    const allAnswered = isAllQuestionsAnswered();
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

// --- SETUP SUBJECT & QUESTIONS ---
function setupExam() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlSubject = urlParams.get("subject");
  const storedSubject = localStorage.getItem("cbt_selected_subject");
  const saved = window.loadExamState ? window.loadExamState() : null;

  candidateId = urlParams.get("candidateId") || localStorage.getItem("cbt_candidate_id") || "CBT-2026";
  attemptNumber = parseInt(urlParams.get("attempt") || localStorage.getItem("cbt_current_attempt_number")) || 1;

  let targetSubject = "general_knowledge";
  if (urlSubject) {
    targetSubject = urlSubject;
  } else if (storedSubject) {
    targetSubject = storedSubject;
  } else if (saved?.subject) {
    targetSubject = saved.subject;
  }

  activeSubject = targetSubject;

  // Standard Subject Titles
  const standardNames = {
    math: "Mathematics",
    english: "English",
    science: "Science",
    art: "Art",
    current_affairs: "Current Affairs",
    general_knowledge: "General Knowledge"
  };

  activeSubjectTitle = standardNames[activeSubject] || activeSubject;
  creatorTag = "";

  // Check if target is a Custom Question Pack
  let customPack = null;
  try {
    const packs = JSON.parse(localStorage.getItem("cbt_custom_packs") || "[]");
    customPack = packs.find(p => p.id === activeSubject || p.subjectKey === activeSubject);
    if (customPack) {
      activeSubjectTitle = customPack.title;
      creatorTag = customPack.creatorTag || "@creator";
      if (customPack.durationMinutes) {
        totalDurationSeconds = customPack.durationMinutes * 60;
      }
    }
  } catch (e) {
    console.error("Error checking custom packs:", e);
  }

  // Update header title with subject name and creator tag
  if (examTitle) {
    if (creatorTag) {
      examTitle.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Smart CBT - ${activeSubjectTitle} <span style="font-size: 0.8rem; background: rgba(255,255,255,0.18); padding: 2px 8px; border-radius: 9999px; margin-left: 6px; font-weight: normal;">by ${creatorTag}</span>`;
    } else {
      examTitle.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Smart CBT - ${activeSubjectTitle}`;
    }
  }

  // Load saved exam if it matches the current activeSubject, otherwise generate questions
  if (saved && saved.subject === activeSubject && Array.isArray(saved.questions) && saved.questions.length > 0) {
    questions = saved.questions;
    currentIndex = saved.currentIndex || 0;
    userAnswers = saved.userAnswers || {};
    markedQuestions = saved.markedQuestions || [];
    timeLeft = typeof saved.timeLeft === "number" ? saved.timeLeft : totalDurationSeconds;
  } else {
    let bank = [];
    if (customPack && Array.isArray(customPack.questions) && customPack.questions.length > 0) {
      bank = customPack.questions;
    } else if (window.subjectQuestions && window.subjectQuestions[activeSubject]) {
      bank = window.subjectQuestions[activeSubject];
    } else if (window.subjectQuestions && window.subjectQuestions.general_knowledge) {
      bank = window.subjectQuestions.general_knowledge;
    }

    questions = typeof window.shuffleQuestions === "function" ? window.shuffleQuestions(bank) : [...bank];
    currentIndex = 0;
    userAnswers = {};
    markedQuestions = [];
    timeLeft = totalDurationSeconds;
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
    questionCount.innerHTML = `Question ${currentIndex + 1} of ${questions.length} <span style="font-size: 0.75rem; color: #64748b; font-weight: normal; margin-left: 8px;">(Attempt #${attemptNumber})</span>`;
  }
  if (questionMarks) {
    questionMarks.textContent = "2 Marks";
  }
  if (questionPrompt) {
    questionPrompt.textContent = q.question;
  }

  // Render options list with letter keys (A, B, C, D)
  if (optionsList) {
    optionsList.innerHTML = "";
    q.options.forEach((optText, optIdx) => {
      const isSelected = userAnswers[currentIndex] === optIdx;
      const card = document.createElement("div");
      card.className = `option-card ${isSelected ? "selected" : ""}`;

      const optionLetter = String.fromCharCode(65 + optIdx);
      card.innerHTML = `
        <div class="custom-radio"><div class="radio-dot"></div></div>
        <kbd class="kbd-shortcut" style="margin-right: 8px; margin-left: 0; background: #eef2ff; color: #3730a3; border-color: #c7d2fe;">${optionLetter}</kbd>
        <span class="option-text">${optText}</span>
      `;

      card.addEventListener("click", () => {
        selectOption(optIdx);
      });

      optionsList.appendChild(card);
    });
  }

  updateNavigationButtons();
  renderGrid();
}

function selectOption(optIdx) {
  userAnswers[currentIndex] = optIdx;
  persist();
  renderQuestion();
}

// --- TIMER START ---
function startExamTimer() {
  if (timerDisplay) {
    timerDisplay.textContent = window.formatTime ? window.formatTime(timeLeft) : formatSeconds(timeLeft);
  }

  if (window.initTimer) {
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
}

function formatSeconds(sec) {
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function openSubmitModal() {
  if (statAnswered) statAnswered.textContent = Object.keys(userAnswers).length;
  if (statUnanswered) statUnanswered.textContent = Math.max(0, questions.length - Object.keys(userAnswers).length);
  if (statMarked) statMarked.textContent = markedQuestions.length;
  if (submitModal) submitModal.classList.add("active");
}

// --- SUBMISSION & REDIRECT TO RESULTS PAGE ---
async function submitExam() {
  if (window.stopTimer) window.stopTimer();
  if (submitModal) submitModal.classList.remove("active");

  if (btnConfirmSubmit) {
    btnConfirmSubmit.disabled = true;
    btnConfirmSubmit.textContent = "Saving to Database...";
  }

  let correct = 0;
  let wrong = 0;
  let unattempted = 0;

  // Build Comprehensive Question-by-Question Review Breakdown
  const reviewBreakdown = questions.map((q, idx) => {
    const userAns = userAnswers[idx];
    const isAnswered = userAns !== undefined;
    const isCorrect = isAnswered && userAns === q.answer;

    if (!isAnswered) unattempted++;
    else if (isCorrect) correct++;
    else wrong++;

    return {
      index: idx + 1,
      question: q.question,
      options: q.options,
      userAnswerIndex: isAnswered ? userAns : null,
      userAnswerText: isAnswered ? q.options[userAns] : "Not Answered",
      correctAnswerIndex: q.answer,
      correctAnswerText: q.options[q.answer],
      isCorrect: isCorrect,
      isUnanswered: !isAnswered,
      explanation: q.explanation || `Option ${String.fromCharCode(65 + q.answer)} is the correct answer.`
    };
  });

  const totalQuestions = questions.length;
  const score = correct * 2;
  const totalMarks = totalQuestions * 2;
  const percent = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
  const grades = { 70: "A", 60: "B", 50: "C", 40: "D" };
  const grade = Object.entries(grades).find(([min]) => percent >= Number(min))?.[1] || "F";
  
  const urlParams = new URLSearchParams(window.location.search);
  const currentCandidate = urlParams.get("fullname") || localStorage.getItem("cbt_candidate_name") || "Candidate";
  const timeSpentSeconds = Math.max(0, totalDurationSeconds - timeLeft);

  const examResultData = {
    candidate_id: candidateId,
    candidate_name: currentCandidate,
    subject: activeSubject,
    subject_title: activeSubjectTitle,
    creator_tag: creatorTag,
    attempt_number: attemptNumber,
    total_questions: totalQuestions,
    correctAnswers: correct,
    correct_questions: correct,
    wrongAnswers: wrong,
    wrong_questions: wrong,
    unattempted: unattempted,
    percentage: percent,
    grade: grade,
    score: score,
    totalMarks: totalMarks,
    timeSpentSeconds: timeSpentSeconds,
    review_breakdown: reviewBreakdown
  };

  // Save to database (Supabase) and local storage
  if (window.saveResultToDatabase) {
    try {
      await window.saveResultToDatabase(examResultData);
    } catch (err) {
      console.error("Failed to save result:", err);
    }
  }

  // Clear active in-progress exam state
  if (window.clearExamState) {
    window.clearExamState();
  }

  if (submitModal) submitModal.classList.remove("active");
  if (btnSubmitExam) btnSubmitExam.disabled = true;
  if (btnConfirmSubmit) {
    btnConfirmSubmit.disabled = true;
    btnConfirmSubmit.textContent = "Submitted";
  }

  // Redirect to result page
  window.location.href = "../result page/index.html";
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
    submitExam();
  });
}

// --- KEYBOARD SHORTCUT SYSTEM ---
document.addEventListener("keydown", (e) => {
  // If focused in input/textarea, ignore shortcuts
  const activeEl = document.activeElement;
  if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable)) {
    return;
  }

  const key = e.key.toUpperCase();
  const isModalActive = submitModal && submitModal.classList.contains("active");

  // When Submit Modal is open
  if (isModalActive) {
    if (e.key === "Enter" || key === "S" || key === "Y") {
      e.preventDefault();
      submitExam();
    } else if (e.key === "Escape" || key === "C") {
      e.preventDefault();
      closeSubmitModal();
    }
    return;
  }

  // Active Exam Shortcuts
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

    // Option selections: A, B, C, D (or 1, 2, 3, 4)
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
