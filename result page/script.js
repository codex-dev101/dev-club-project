// Supabase Initialization
const SUPABASE_URL = "https://cjqnrpbctqblxfpspxzq.supabase.co";
const SUPABASE_KEY = "sb_publishable_WoZjELCqdbbMtSBJAYAe7A_mv3PmKe_";

let supabaseClient = null;
if (typeof supabase !== "undefined" && supabase.createClient) {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Global reference for question review filtering
let activeReviewQuestions = [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", async () => {
  // Setup Actions
  const printBtn = document.getElementById("btn-print");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  const detailedResultBtn = document.getElementById("btn-detailed-result");
  if (detailedResultBtn) {
    detailedResultBtn.addEventListener("click", () => {
      window.location.href = "../henry's-part/result.html";
    });
  }

  // Setup Review Filter Tabs
  setupFilterTabs();

  // Load and display result
  await loadAndRenderLatestResult();
});

/**
 * Fetches the user's exam submission from Supabase database or local storage cache
 */
async function loadAndRenderLatestResult() {
  // 1. Read Local Storage for the current user's session
  let localResult = null;
  try {
    const localRaw = localStorage.getItem("cbt_exam_results");
    if (localRaw) localResult = JSON.parse(localRaw);
  } catch (e) {
    console.error("Error reading local exam results:", e);
  }

  const currentSubmissionId = localStorage.getItem("cbt_current_submission_id");
  const candidateName = localStorage.getItem("cbt_candidate_name") || localResult?.candidate_name;
  const candidateId = localStorage.getItem("cbt_candidate_id") || localResult?.candidate_id || "CBT-2026";

  let dbResult = null;

  // 2. Query Supabase for the specific record
  if (supabaseClient) {
    try {
      let query = supabaseClient.from("exam_results").select("*");

      if (currentSubmissionId) {
        query = query.eq("id", currentSubmissionId);
      } else if (candidateName && candidateName !== "Candidate") {
        query = query.eq("candidate_name", candidateName).order("id", { ascending: false });
      } else {
        query = query.order("id", { ascending: false });
      }

      const { data, error } = await query.limit(1);

      if (error) {
        console.warn("Could not fetch from Supabase:", error.message || error);
      } else if (data && data.length > 0) {
        dbResult = data[0];
      }
    } catch (err) {
      console.warn("Error communicating with Supabase:", err);
    }
  }

  // 3. Combine verified DB data with the local active session data (local contains full review_breakdown)
  const combinedData = {
    ...(dbResult || {}),
    ...(localResult || {})
  };

  // If DB returned data, ensure scores are aligned with DB
  if (dbResult) {
    if (dbResult.score !== undefined) combinedData.score = dbResult.score;
    if (dbResult.percentage !== undefined) combinedData.percentage = dbResult.percentage;
    if (dbResult.correct_questions !== undefined) combinedData.correct_questions = dbResult.correct_questions;
    if (dbResult.wrong_questions !== undefined) combinedData.wrong_questions = dbResult.wrong_questions;
    if (dbResult.total_questions !== undefined) combinedData.total_questions = dbResult.total_questions;
  }

  if (localResult) {
    if (localResult.review_breakdown) combinedData.review_breakdown = localResult.review_breakdown;
    if (localResult.candidate_id) combinedData.candidate_id = localResult.candidate_id;
    if (localResult.attempt_number) combinedData.attempt_number = localResult.attempt_number;
    if (localResult.creator_tag) combinedData.creator_tag = localResult.creator_tag;
    if (localResult.subject_title) combinedData.subject_title = localResult.subject_title;
    if (localResult.timeSpentSeconds || localResult.time_spent_seconds) {
      combinedData.timeSpentSeconds = localResult.timeSpentSeconds ?? localResult.time_spent_seconds;
    }
  }

  renderResults(combinedData);
}

/**
 * Populates all UI elements and renders the detailed questions breakdown
 */
function renderResults(data) {
  if (!data) return;

  const candidateName = data.candidate_name || data.name || data.studentName || localStorage.getItem("cbt_candidate_name") || "Student";
  const candidateId = data.candidate_id || data.candidateId || localStorage.getItem("cbt_candidate_id") || "CBT-2026";
  const attemptNum = data.attempt_number || data.attemptNumber || parseInt(localStorage.getItem("cbt_current_attempt_number")) || 1;
  const subjectKey = data.subject || "general_knowledge";
  const subjectTitle = data.subject_title || getSubjectTitle(subjectKey);
  const creatorTag = data.creator_tag || localStorage.getItem("cbt_creator_tag") || "";

  const totalQuestions = Number(data.total_questions || data.totalQuestions) || (data.review_breakdown ? data.review_breakdown.length : 50);
  
  const correctCount = Number(data.correct_questions ?? data.correct_answers ?? data.correctAnswers ?? data.correctCount ?? data.correct) || 0;
  const incorrectCount = Number(data.wrong_questions ?? data.wrong_answers ?? data.wrongAnswers ?? data.incorrectCount ?? data.wrong) || 0;
  const unansweredCount = Number(data.unattempted ?? data.unansweredCount ?? data.unanswered) || Math.max(0, totalQuestions - (correctCount + incorrectCount));
  
  const score = Number(data.score ?? (correctCount * 2));
  const totalMarks = Number(data.total_marks ?? data.totalMarks ?? (totalQuestions * 2)) || (totalQuestions * 2);
  const percentage = Number(data.percentage ?? (totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0));
  const timeSpentSeconds = Number(data.timeSpentSeconds ?? data.time_spent_seconds) || 0;

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
  setText("score-count", `(${correctCount} out of ${totalQuestions})`);
  setText("total-marks", totalMarks);
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

  // 6. Render Detailed Question Review Breakdown
  activeReviewQuestions = Array.isArray(data.review_breakdown) ? data.review_breakdown : [];
  renderDetailedAnswersReview(activeReviewQuestions);

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
    timeSpentSeconds: timeSpentSeconds,
    dateTaken: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    submitted_at: data.submitted_at || new Date().toISOString(),
    review_breakdown: activeReviewQuestions
  });
}

/**
 * Renders the question-by-question review with all options highlighted
 */
function renderDetailedAnswersReview(questions) {
  const container = document.getElementById("reviewQuestionsList");
  if (!container) return;

  // Update filter counters
  const total = questions.length;
  const correct = questions.filter(q => q.isCorrect).length;
  const wrong = questions.filter(q => !q.isCorrect && !q.isUnanswered).length;
  const unanswered = questions.filter(q => q.isUnanswered).length;

  const setElText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setElText("count-filter-all", total);
  setElText("count-filter-correct", correct);
  setElText("count-filter-wrong", wrong);
  setElText("count-filter-unanswered", unanswered);

  // Filter based on active tab
  let filtered = questions;
  if (currentFilter === "correct") {
    filtered = questions.filter(q => q.isCorrect);
  } else if (currentFilter === "wrong") {
    filtered = questions.filter(q => !q.isCorrect && !q.isUnanswered);
  } else if (currentFilter === "unanswered") {
    filtered = questions.filter(q => q.isUnanswered);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;">
        <i class="fa-solid fa-clipboard-check" style="font-size: 2rem; color: #94a3b8; margin-bottom: 0.5rem;"></i>
        <p style="color: #64748b; font-weight: 600;">No questions found in this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  filtered.forEach(q => {
    const card = document.createElement("div");
    let statusClass = "status-unanswered";
    let statusPill = `<span class="review-status-pill pill-unanswered"><i class="fa-solid fa-circle-question"></i> Not Answered</span>`;

    if (q.isCorrect) {
      statusClass = "status-correct";
      statusPill = `<span class="review-status-pill pill-correct"><i class="fa-solid fa-circle-check"></i> Correct (+2 Marks)</span>`;
    } else if (!q.isUnanswered) {
      statusClass = "status-wrong";
      statusPill = `<span class="review-status-pill pill-wrong"><i class="fa-solid fa-circle-xmark"></i> Incorrect (0 Marks)</span>`;
    }

    card.className = `review-card ${statusClass}`;

    // Options HTML
    const optionsHtml = q.options.map((optText, optIdx) => {
      const isCorrectOpt = optIdx === q.correctAnswerIndex;
      const isUserChoice = optIdx === q.userAnswerIndex;

      let optClass = "";
      let optBadge = "";

      if (isCorrectOpt && isUserChoice) {
        optClass = "is-user-correct";
        optBadge = `<span class="review-opt-badge"><i class="fa-solid fa-check"></i> Your Choice (Correct)</span>`;
      } else if (isCorrectOpt) {
        optClass = "is-correct-answer";
        optBadge = `<span class="review-opt-badge"><i class="fa-solid fa-check"></i> Correct Answer</span>`;
      } else if (isUserChoice) {
        optClass = "is-user-wrong";
        optBadge = `<span class="review-opt-badge"><i class="fa-solid fa-xmark"></i> Your Choice</span>`;
      }

      const letter = String.fromCharCode(65 + optIdx);
      return `
        <div class="review-opt ${optClass}">
          <div class="review-opt-left">
            <span class="review-opt-letter">${letter}.</span>
            <span>${escapeHtml(optText)}</span>
          </div>
          ${optBadge}
        </div>
      `;
    }).join("");

    card.innerHTML = `
      <div class="review-card-header">
        <span class="review-q-num">Question ${q.index || 1}</span>
        ${statusPill}
      </div>
      <div class="review-prompt">${escapeHtml(q.question)}</div>
      <div class="review-options-grid">
        ${optionsHtml}
      </div>
      ${q.explanation ? `
        <div class="review-explanation">
          <i class="fa-solid fa-circle-info" style="margin-top: 2px;"></i>
          <div><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div>
        </div>
      ` : ''}
    `;

    container.appendChild(card);
  });
}

/**
 * Filter Tabs Setup
 */
function setupFilterTabs() {
  const tabs = document.querySelectorAll(".review-filter-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.getAttribute("data-filter") || "all";
      renderDetailedAnswersReview(activeReviewQuestions);
    });
  });
}

function getSubjectTitle(key) {
  const standard = {
    math: "Mathematics",
    english: "English",
    science: "Science",
    art: "Art",
    current_affairs: "Current Affairs",
    general_knowledge: "General Knowledge"
  };
  return standard[key] || key;
}

/**
 * Saves result entry to history array for Henry's table
 */
function saveToHenryHistory(record) {
  try {
    let history = JSON.parse(localStorage.getItem("cbt_exam_history") || "[]");
    const isDuplicate = history.some(item => 
      item.submitted_at === record.submitted_at || 
      (item.dateTaken === record.dateTaken && item.score === record.score && item.candidate_id === record.candidate_id && item.subject === record.subject)
    );

    if (!isDuplicate) {
      history.unshift(record);
      localStorage.setItem("cbt_exam_history", JSON.stringify(history));
    }
  } catch (e) {
    console.warn("Could not save to history:", e);
  }
}

/**
 * Converts total seconds into MM:SS format
 */
function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Returns letter grade and descriptive performance text
 */
function getGradeDetails(percentage) {
  if (percentage >= 70) return { letter: "A", text: "Excellent" };
  if (percentage >= 60) return { letter: "B", text: "Very Good" };
  if (percentage >= 50) return { letter: "C", text: "Good" };
  if (percentage >= 40) return { letter: "D", text: "Pass" };
  return { letter: "F", text: "Needs Improvement" };
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