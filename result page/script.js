// 1. Supabase Credentials
const SUPABASE_URL = "https://cjqnrpbctqblxfpspxzq.supabase.co";
const SUPABASE_KEY = "sb_publishable_WoZjELCqdbbMtSBJAYAe7A_mv3PmKe_";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Function to load the latest score
async function loadLatestScore() {
  try {
    // --- Method A: Fetch from Supabase Database ---
    const { data, error } = await supabaseClient
      .from("exam_results")
      .select("*")
      .order("id", { ascending: false }) // gets the most recent submission
      .limit(1);

    if (data && data.length > 0) {
      const latestResult = data[0];
      displayScore(latestResult);
      return;
    }
  } catch (err) {
    console.warn("Could not fetch from Supabase, checking localStorage fallback...", err);
  }

  // --- Method B: Fallback to LocalStorage (if testing locally) ---
  const localData = JSON.parse(localStorage.getItem("cbt_exam_results"));
  if (localData) {
    displayScore(localData);
  } else {
    console.log("No score found yet.");
  }
}

// 3. Function to update her HTML elements with the score values
function displayScore(result) {
  // Available fields from result:
  // result.score           -> e.g. 42
  // result.total_questions -> e.g. 50
  // result.percentage      -> e.g. 84
  // result.subject         -> e.g. "mathematics"
  // result.candidate_name  -> e.g. "John Doe"

  console.log("Exam Result:", result);

  // Replace with her actual element IDs:
  const scoreElement = document.getElementById("userScore");
  const percentageElement = document.getElementById("userPercentage");
  const nameElement = document.getElementById("candidateName");

  if (scoreElement) scoreElement.textContent = result.score;
  if (percentageElement) percentageElement.textContent = `${result.percentage}%`;
  if (nameElement) nameElement.textContent = result.candidate_name;
}

// Run on page load
document.addEventListener("DOMContentLoaded", loadLatestScore);