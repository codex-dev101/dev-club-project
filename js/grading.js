/**
 * Grading & Scoring Module (grading.js)
 * Evaluates student answers, computes scores, and assigns grades.
 */

/**
 * Grades the exam based on user answers and the question bank.
 * @param {Array} questions - Array of question objects
 * @param {Array} userAnswers - Array of user selected option indices
 * @returns {Object} Full score breakdown
 */
export function calculateResults(questions, userAnswers) {
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;
  let totalScoreEarned = 0;
  let maxPossibleScore = 0;

  questions.forEach((q, idx) => {
    maxPossibleScore += q.marks;
    const userChoice = userAnswers[idx];

    if (userChoice === null || userChoice === undefined) {
      unattemptedCount++;
    } else if (userChoice === q.correctAnswer) {
      correctCount++;
      totalScoreEarned += q.marks;
    } else {
      wrongCount++;
    }
  });

  const percentage = maxPossibleScore > 0 
    ? Math.round((totalScoreEarned / maxPossibleScore) * 100) 
    : 0;

  // Grade Assignment
  let grade = "F";
  if (percentage >= 75) grade = "A (Excellent)";
  else if (percentage >= 65) grade = "B (Very Good)";
  else if (percentage >= 50) grade = "C (Good)";
  else if (percentage >= 40) grade = "D (Pass)";
  else grade = "F (Fail)";

  return {
    totalQuestions: questions.length,
    correctCount,
    wrongCount,
    unattemptedCount,
    totalScoreEarned,
    maxPossibleScore,
    percentage,
    grade
  };
}
