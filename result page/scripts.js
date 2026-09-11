document.addEventListener("DOMContentLoaded", () => {
  // 1. RECEIVE: Read output saved by arinze (Exam Page) from localStorage
const result = JSON.parse(localStorage.getItem("cbt_exam_results"));


  // Step 1: Early Guard Clause - Exit safe no exam data exists in localStorage
  if (!rawData) {
    console.warn("No exam data found in localStorage. Please complete the exam first.");
    return;
  }

  // Parse JSON string into usable JavaScript object and render real data
  const examResultData = JSON.parse(rawData);
  renderResults(examResultData);

  // Print button feature
  const printBtn = document.getElementById("btn-print");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print()
  // Pure JavaScript navigation to Henery's History Page (Screen 5)
  const detailedResultBtn = document.getElementById("btn-detailed-result");
  if (detailedResultBtn) {
    detailedResultBtn.addEventListener("click", () => {
      window.location.href = "result.html";
    });
  }
});

function renderResults(data) {
  const { 
    studentName = "Student", 
    examTitle = "CBT Examination",
    totalQuestions = 0, 
    correctCount = 0, 
    incorrectCount = 0, 
    unansweredCount = 0, 
    timeSpentSeconds = 0, 
    marksPerQuestion = 2 
  } = data;

  // Perform Calculations
  const maxPossibleMarks = totalQuestions * marksPerQuestion;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const incorrectPercent = totalQuestions > 0 ? Math.round((incorrectCount / totalQuestions) * 100) : 0;
  const unansweredPercent = totalQuestions > 0 ? Math.round((unansweredCount / totalQuestions) * 100) : 0;

  // Update HTML elements
  document.getElementById("student-name").innerText = `${studentName}!`;
  document.getElementById("score-percentage").innerText = `${scorePercent}%`;
  document.getElementById("score-count").innerText = `(${correctCount} out of ${totalQuestions})`;
  document.getElementById("total-marks").innerText = maxPossibleMarks;
  document.getElementById("time-taken").innerText = formatTime(timeSpentSeconds);

  // Determine Grade
  const gradeInfo = calculateGrade(scorePercent);
  document.getElementById("grade-letter").innerText = gradeInfo.letter;
  document.getElementById("grade-text").innerText = gradeInfo.text;

  // Dynamic CSS Progress Bar Widths
  document.getElementById("bar-correct").style.width = `${scorePercent}%`;
  document.getElementById("bar-incorrect").style.width = `${incorrectPercent}%`;
  document.getElementById("bar-unanswered").style.width = `${unansweredPercent}%`;

  // Dynamic Legend Text
  document.getElementById("correct-stats").innerText = `${correctCount} (${scorePercent}%)`;
  document.getElementById("incorrect-stats").innerText = `${incorrectCount} (${incorrectPercent}%)`;
  document.getElementById("unanswered-stats").innerText = `${unansweredCount} (${unansweredPercent}%)`;

  // 2. PASS: Save formatted summary into history array for Henery (History Page)
  saveToHistory({
    examTitle: examTitle,
    dateTaken: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    score: `${scorePercent}% (${correctCount}/${totalQuestions})`,
    grade: gradeInfo.letter
  });
}

/**
 * Stores completed exam into Henery's table database in localStorage
 */
function saveToHistory(newRecord) {
  // Step 1: Retrieve existing history or default to an empty array
  let historyList = JSON.parse(localStorage.getItem("cbt_exam_history")) || [];
  
  // Step 2: Duplicate check - prevent duplicate entries if user refreshes the page
  const exists = historyList.some(item => item.dateTaken === newRecord.dateTaken && item.score === newRecord.score);
  
  // Step 3: Save the new record to storage if it doesn't already exist
  if (!exists) {
    historyList.unshift(newRecord); // Add newest result to the very top (index 0)
    localStorage.setItem("cbt_exam_history", JSON.stringify(historyList));
  }
}

/**
 * Step 4: Time Helper - Convert seconds into padded MM:SS format
 */
function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Step 5: Grading Helper - Determine letter grade and text label based on percentage score
 */
function calculateGrade(percentage) {
  if (percentage >= 80) return { letter: "A", text: "Excellent" };
  if (percentage >= 70) return { letter: "B", text: "Very Good" };
  if (percentage >= 60) return { letter: "C", text: "Good" };
  if (percentage >= 50) return { letter: "D", text: "Pass" };
  return { letter: "F", text: "Fail" };
}

//const historyList = JSON.parse(localStorage.getItem("cbt_exam_history")) || [];