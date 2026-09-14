// Handles saving, loading, and clearing exam data, and connects to Supabase database

const STORAGE_KEY = "cbt_exam_state";
const RESULTS_KEY = "cbt_exam_results";
const ALL_RESULTS_KEY = "cbt_all_results";

const SUPABASE_URL = "https://cjqnrpbctqblxfpspxzq.supabase.co";
const SUPABASE_KEY = "sb_publishable_WoZjELCqdbbMtSBJAYAe7A_mv3PmKe_";

// Initialize Supabase Client if SDK is loaded
let supabaseClient = null;
function getSupabaseClient() {
  if (!supabaseClient && typeof supabase !== "undefined" && supabase.createClient) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabaseClient;
}

// --- ACTIVE EXAM STATE (In-progress persistence) ---
function saveExamState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Error persisting exam state:", e);
  }
}

function loadExamState() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Error loading exam state:", e);
    return null;
  }
}

function clearExamState() {
  localStorage.removeItem(STORAGE_KEY);
}

// --- SAVE EXAM RESULT TO DATABASE ---
async function saveResultToDatabase(resultData) {
  const submittedAt = new Date().toISOString();
  const candidateName = resultData.candidate_name || localStorage.getItem("cbt_candidate_name") || "Candidate";
  const candidateId = resultData.candidate_id || localStorage.getItem("cbt_candidate_id") || "CBT-2026";
  const attemptNumber = resultData.attempt_number || parseInt(localStorage.getItem("cbt_current_attempt_number")) || 1;
  const subject = resultData.subject || "general_knowledge";
  const subjectTitle = resultData.subject_title || resultData.subject || "General Knowledge";
  const creatorTag = resultData.creator_tag || localStorage.getItem("cbt_creator_tag") || "";
  
  const score = Number(resultData.score) || 0;
  const totalQuestions = Number(resultData.total_questions) || 50;
  const percentage = Number(resultData.percentage) || 0;
  const grade = resultData.grade || "F";
  const correctQuestions = Number(resultData.correct_questions ?? resultData.correctAnswers ?? resultData.correct) || 0;
  const wrongQuestions = Number(resultData.wrong_questions ?? resultData.wrongAnswers ?? resultData.wrong) || 0;
  const timeSpentSeconds = Number(resultData.timeSpentSeconds ?? resultData.time_spent_seconds) || 0;
  const reviewBreakdown = Array.isArray(resultData.review_breakdown) ? resultData.review_breakdown : [];

  // Package for local storage
  const fullResultRecord = {
    candidate_id: candidateId,
    candidateId: candidateId,
    candidate_name: candidateName,
    name: candidateName,
    studentName: candidateName,
    subject: subject,
    subject_title: subjectTitle,
    creator_tag: creatorTag,
    attempt_number: attemptNumber,
    attemptNumber: attemptNumber,
    score: score,
    total_questions: totalQuestions,
    percentage: percentage,
    grade: grade,
    correct_answers: correctQuestions,
    correctAnswers: correctQuestions,
    correct_questions: correctQuestions,
    wrong_answers: wrongQuestions,
    wrongAnswers: wrongQuestions,
    wrong_questions: wrongQuestions,
    unattempted: resultData.unattempted ?? Math.max(0, totalQuestions - correctQuestions - wrongQuestions),
    total_marks: resultData.totalMarks ?? totalQuestions * 2,
    time_spent_seconds: timeSpentSeconds,
    timeSpentSeconds: timeSpentSeconds,
    submitted_at: submittedAt,
    review_breakdown: reviewBreakdown
  };

  // Cache locally
  localStorage.setItem(RESULTS_KEY, JSON.stringify(fullResultRecord));

  try {
    const history = JSON.parse(localStorage.getItem(ALL_RESULTS_KEY) || "[]");
    history.unshift(fullResultRecord);
    localStorage.setItem(ALL_RESULTS_KEY, JSON.stringify(history));

    // Also update Henry's history key
    const henryHistory = JSON.parse(localStorage.getItem("cbt_exam_history") || "[]");
    henryHistory.unshift({
      candidate_id: candidateId,
      candidateId: candidateId,
      name: candidateName,
      candidate_name: candidateName,
      exam: subjectTitle,
      subject: subject,
      subject_title: subjectTitle,
      creator_tag: creatorTag,
      attempt_number: attemptNumber,
      attemptNumber: attemptNumber,
      score: score,
      total_questions: totalQuestions,
      percentage: percentage,
      grade: grade,
      correctAnswers: correctQuestions,
      correct_questions: correctQuestions,
      wrong_questions: wrongQuestions,
      dateTaken: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      submitted_at: submittedAt,
      review_breakdown: reviewBreakdown
    });
    localStorage.setItem("cbt_exam_history", JSON.stringify(henryHistory));
  } catch (e) {
    console.warn("Could not update local history:", e);
  }

  // Insert to Supabase Database
  const client = getSupabaseClient();
  if (client) {
    try {
      const payloadWithNewCols = {
        candidate_name: candidateName,
        subject: subject,
        score: score,
        total_questions: totalQuestions,
        percentage: percentage,
        correct_questions: correctQuestions,
        wrong_questions: wrongQuestions
      };

      let { data, error } = await client
        .from("exam_results")
        .insert([payloadWithNewCols])
        .select();

      // If error is caused by missing columns in Supabase schema, retry with basic payload
      if (error && (error.message?.includes("column") || error.code === "PGRST204" || error.code === "42703")) {
        console.warn("Retrying Supabase insert without new columns (table schema may not have them yet)...");
        const basePayload = {
          candidate_name: candidateName,
          subject: subject,
          score: score,
          total_questions: totalQuestions,
          percentage: percentage
        };
        const retryResult = await client.from("exam_results").insert([basePayload]).select();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (error) {
        console.error("Supabase Error Details:", error.message || error);
        return { success: false, error, data: fullResultRecord, localSaved: true };
      }

      if (data && data[0] && data[0].id) {
        localStorage.setItem("cbt_current_submission_id", String(data[0].id));
        fullResultRecord.id = data[0].id;
        localStorage.setItem(RESULTS_KEY, JSON.stringify(fullResultRecord));
      }

      console.log("Result saved to Supabase successfully:", data);
      return { success: true, data: data?.[0] || fullResultRecord, error: null, localSaved: true };
    } catch (err) {
      console.error("Exception connecting to Supabase:", err);
      return { success: false, error: err, data: fullResultRecord, localSaved: true };
    }
  } else {
    console.warn("Supabase client not initialized. Saved to local storage only.");
    return { success: true, data: fullResultRecord, error: null, localSaved: true };
  }
}

// --- FETCH RESULTS FROM DATABASE ---
async function fetchResultsFromDatabase() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("exam_results")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("Error fetching results from Supabase:", error);
      } else if (data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.error("Exception fetching from Supabase:", err);
    }
  }

  // Fallback to local storage if Supabase is offline or empty
  try {
    const localAll = JSON.parse(localStorage.getItem(ALL_RESULTS_KEY) || "[]");
    if (localAll.length > 0) return localAll;

    const singleResult = JSON.parse(localStorage.getItem(RESULTS_KEY) || "null");
    if (singleResult) return [singleResult];
  } catch (e) {
    console.error("Error reading fallback results:", e);
  }

  return [];
}

// Make accessible globally
window.saveExamState = saveExamState;
window.loadExamState = loadExamState;
window.clearExamState = clearExamState;
window.saveResultToDatabase = saveResultToDatabase;
window.fetchResultsFromDatabase = fetchResultsFromDatabase;
window.getSupabaseClient = getSupabaseClient;
