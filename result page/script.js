// 1. Supabase Initialization
const SUPABASE_URL = "https://cjqnrpbctqblxfpspxzq.supabase.co";
const SUPABASE_KEY = "sb_publishable_WoZjELCqdbbMtSBJAYAe7A_mv3PmKe_";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  // 2. Setup Page Navigation & Actions
  const printBtn = document.getElementById("btn-print");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  const detailedResultBtn = document.getElementById("btn-detailed-result");
  if (detailedResultBtn) {
    detailedResultBtn.addEventListener("click", () => {
      window.location.href = "result.html";
    });
  }

  // 3. Load Latest Result from Supabase
  await loadAndRenderLatestResult();
});

/**
 * Fetches the latest exam submission from Supabase
 */
async function loadAndRenderLatestResult() {
  try {
    const { data, error } = await supabaseClient
      .from("exam_results")
      .select("*")
      .order("id", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching from Supabase:", error);
      return;
    }

    if (data && data.length > 0) {
      const latestResult = data[0];
      renderResults(latestResult);
    } else {
      console.log("No exam results found in Supabase database.");
    }
  } catch (err) {
    console.error("Unexpected error fetching result:", err);
  }
}


 //Calculates statistics and populates UI elements
 
async function renderResults(data) {
  const {
    candidate_name = "Student",
    studentName, // Fallback property name
    subject = "CBT Examination",
    examTitle,   // Fallback property name
    total_questions = 0,
    totalQuestions,
    correctCount = 0,
    incorrectCount = 0,
    unansweredCount = 0,
    timeSpentSeconds = 0,
    marksPerQuestion = 2,
    score = 0
  } = data;

  // Normalize property names (handles both snake_case from DB and camelCase)
  const name = candidate_name || studentName || "Student";
  const title = subject || examTitle || "CBT Examination";
  const total = total_questions || totalQuestions || 0;

  // Perform Calculations
  const maxPossibleMarks = total * marksPerQuestion;
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const incorrectPercent = total > 0 ? Math.round((incorrectCount / total) * 100) : 0;
  const unansweredPercent = total > 0 ? Math.round((unansweredCount / total) * 100) : 0;

  // Helper for safe element updating
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  };

  // Update Text Elements (Handles both original UI IDs)
  setText("student-name", `${name}!`);
  setText("candidateName", name);
  setText("userScore", score);
  setText("score-percentage", `${scorePercent}%`);
  setText("userPercentage", `${scorePercent}%`);
  setText("score-count", `(${correctCount} out of ${total})`);
  setText("total-marks", maxPossibleMarks);
  setText("time-taken", formatTime(timeSpentSeconds));

  // Calculate & Set Grade
  const gradeInfo = calculateGrade(scorePercent);
  setText("grade-letter", gradeInfo.letter);
  setText("grade-text", gradeInfo.text);

  // Dynamic CSS Progress Bar Widths
  const setWidth = (id, width) => {
    const el = document.getElementById(id);
    if (el) el.style.width = `${width}%`;
  };
  setWidth("bar-correct", scorePercent);
  setWidth("bar-incorrect", incorrectPercent);
  setWidth("bar-unanswered", unansweredPercent);

  // Dynamic Legend Text
  setText("correct-stats", `${correctCount} (${scorePercent}%)`);
  setText("incorrect-stats", `${incorrectCount} (${incorrectPercent}%)`);
  setText("unanswered-stats", `${unansweredCount} (${unansweredPercent}%)`);

  // Record into Supabase History table
  await saveToSupabaseHistory({
    exam_title: title,
    date_taken: new Date().toISOString(),
    score: `${scorePercent}% (${correctCount}/${total})`,
    grade: gradeInfo.letter
  });
}


 //Inserts completed exam record into the `exam_history` table in Supabase

async function saveToSupabaseHistory(newRecord) {
  try {
    const { error } = await supabaseClient
      .from("exam_history")
      .insert([newRecord]);

    if (error) {
      console.warn("Could not save to history table:", error.message);
    }
  } catch (err) {
    console.error("Error saving exam history to Supabase:", err);
  }
}


 //Time Helper - Convert seconds into padded MM:SS format
 
function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

 //Grading Helper - Determine letter grade and label
 
function calculateGrade(percentage) {
  if (percentage >= 80) return { letter: "A", text: "Excellent" };
  if (percentage >= 70) return { letter: "B", text: "Very Good" };
  if (percentage >= 60) return { letter: "C", text: "Good" };
  if (percentage >= 50) return { letter: "D", text: "Pass" };
  return { letter: "F", text: "Fail" };
}