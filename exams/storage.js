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
  const candidateName = resultData.candidate_name || localStorage.getItem("cbt_candidate_name") || "Candidate";
  const subject = resultData.subject || "general_knowledge";
  const score = Number(resultData.score) || 0;
  const totalQuestions = Number(resultData.total_questions) || 50;
  const percentage = Number(resultData.percentage) || 0;
  const grade = resultData.grade || "F";
  const submittedAt = new Date().toISOString();

  // Package for local storage
  const fullResultRecord = {
    candidate_name: candidateName,
    subject: subject,
    score: score,
    total_questions: totalQuestions,
    percentage: percentage,
    grade: grade,
    correct_answers: resultData.correctAnswers ?? resultData.correct,
    wrong_answers: resultData.wrongAnswers ?? resultData.wrong,
    unattempted: resultData.unattempted ?? 0,
    total_marks: resultData.totalMarks ?? totalQuestions * 2,
    submitted_at: submittedAt
  };

  // Cache locally
  localStorage.setItem(RESULTS_KEY, JSON.stringify(fullResultRecord));

  try {
    const history = JSON.parse(localStorage.getItem(ALL_RESULTS_KEY) || "[]");
    history.unshift(fullResultRecord);
    localStorage.setItem(ALL_RESULTS_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn("Could not update local history:", e);
  }

  const correctQuestions = Number(resultData.correct_questions ?? resultData.correctAnswers ?? resultData.correct) || 0;
  const wrongQuestions = Number(resultData.wrong_questions ?? resultData.wrongAnswers ?? resultData.wrong) || 0;

  // Insert to Supabase Database
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("exam_results")
        .insert([
          {
            candidate_name: candidateName,
            subject: subject,
            score: score,
            total_questions: totalQuestions,
            percentage: percentage,
            correct_questions: correctQuestions,
            wrong_questions: wrongQuestions
          }
        ])
        .select();

      if (error) {
        console.error("Supabase error saving result:", error);
        return { success: false, error, data: null, localSaved: true };
      }

      console.log("Result saved to Supabase successfully:", data);
      return { success: true, data: data?.[0] || fullResultRecord, error: null, localSaved: true };
    } catch (err) {
      console.error("Exception connecting to Supabase:", err);
      return { success: false, error: err, data: null, localSaved: true };
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
