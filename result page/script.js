// ============================================================
// Smart CBT - Result Page Controller (script.js)
// Loads, computes and visualizes verified examination results
// ============================================================

const SUPABASE_URL = "https://cjqnrpbctqblxfpspxzq.supabase.co";
const SUPABASE_KEY = "sb_publishable_WoZjELCqdbbMtSBJAYAe7A_mv3PmKe_";

let supabaseClient = null;
if (typeof supabase !== "undefined" && supabase.createClient) {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Global reference for question review
let activeReviewQuestions = [];

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Require Authentication
  const user = window.requireAuth ? window.requireAuth("../index.html") : null;

  // Setup Actions
  const printBtn = document.getElementById("btn-print");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  // Review Modal Handlers
  const detailedResultBtn = document.getElementById("btn-detailed-result");
  const reviewModal = document.getElementById("resultReviewModal");
  const btnCloseModal = document.getElementById("btnCloseResultModal");
  const btnCloseModalBtn = document.getElementById("btnCloseResultModalBtn");

  if (detailedResultBtn && reviewModal) {
    detailedResultBtn.addEventListener("click", () => {
      renderReviewModal();
      reviewModal.style.display = "flex";
    });
  }

  if (btnCloseModal && reviewModal) {
    btnCloseModal.addEventListener("click", () => {
      reviewModal.style.display = "none";
    });
  }

  if (btnCloseModalBtn && reviewModal) {
    btnCloseModalBtn.addEventListener("click", () => {
      reviewModal.style.display = "none";
    });
  }

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

  // 3. Combine verified DB data with the local active session data
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
    if (localResult.duration_minutes) combinedData.duration_minutes = localResult.duration_minutes;
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
function renderReviewModal() {
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

function getSubjectTitle(key) {
  const standard = {
    math: "Mathematics",
    english: "English Language",
    science: "Basic Science",
    art: "Art & Culture",
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