const SUPABASE_URL = "https://cjqnrpbctqblxfpspxzq.supabase.co";
const SUPABASE_KEY = "sb_publishable_WoZjELCqdbbMtSBJAYAe7A_mv3PmKe_";

let supabaseClient = null;
if (window.supabase && window.supabase.createClient) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

/**
 * Fetches the user's exam submission from Supabase database or local storage cache
 */
export async function loadLatestResult() {
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

  return combinedData;
}


export function getSubjectTitle(key) {
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
export function saveToHenryHistory(record) {
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
export function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Returns letter grade and descriptive performance text
 */
export function getGradeDetails(percentage) {
  if (percentage >= 70) return { letter: "A", text: "Excellent" };
  if (percentage >= 60) return { letter: "B", text: "Very Good" };
  if (percentage >= 50) return { letter: "C", text: "Good" };
  if (percentage >= 40) return { letter: "D", text: "Pass" };
  return { letter: "F", text: "Needs Improvement" };
}

export function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}