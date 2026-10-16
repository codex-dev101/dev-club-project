export function createExamSubmitter({ getState, elements, stopTimer, saveResultToDatabase, clearExamState }) {
  let isSubmitting = false;

  return async function submitExam(isAuto = false) {
    if (isSubmitting) return;
    isSubmitting = true;

    const {
      attemptId,
      candidateId,
      candidateName,
      activeSubject,
      activeSubjectTitle,
      creatorTag,
      attemptNumber,
      questions,
      userAnswers,
      startTime,
      totalDurationSeconds
    } = getState();
    const { submitModal, btnConfirmSubmit, btnSubmitExam } = elements;

    stopTimer();
    if (submitModal) submitModal.classList.remove("active");
    if (btnConfirmSubmit) {
      btnConfirmSubmit.disabled = true;
      btnConfirmSubmit.textContent = "Calculating and saving results...";
    }

    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    const reviewBreakdown = questions.map((question, index) => {
      const userAnswer = userAnswers[index];
      const isAnswered = userAnswer !== undefined && userAnswer !== null;
      const isCorrect = isAnswered && userAnswer === question.answer;

      if (!isAnswered) unattempted++;
      else if (isCorrect) correct++;
      else wrong++;

      return {
        index: index + 1,
        question: question.question,
        options: question.options,
        userAnswerIndex: isAnswered ? userAnswer : null,
        userAnswerText: isAnswered ? question.options[userAnswer] : "Not Answered",
        correctAnswerIndex: question.answer,
        correctAnswerText: question.options[question.answer],
        isCorrect,
        isUnanswered: !isAnswered,
        explanation: question.explanation || `Option ${String.fromCharCode(65 + question.answer)} is the correct answer.`
      };
    });

    const totalQuestions = questions.length;
    const score = correct * 2;
    const totalMarks = totalQuestions * 2;
    const percent = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    const grades = { 70: "A", 60: "B", 50: "C", 40: "D" };
    const grade = Object.entries(grades).find(([minimum]) => percent >= Number(minimum))?.[1] || "F";
    const now = Date.now();
    const timeSpentSeconds = Math.min(totalDurationSeconds, Math.max(1, Math.round((now - startTime) / 1000)));

    const examResultData = {
      attempt_id: attemptId,
      candidate_id: candidateId,
      candidate_name: candidateName,
      subject: activeSubject,
      subject_title: activeSubjectTitle,
      creator_tag: creatorTag,
      attempt_number: attemptNumber,
      total_questions: totalQuestions,
      correctAnswers: correct,
      correct_questions: correct,
      wrongAnswers: wrong,
      wrong_questions: wrong,
      unattempted,
      percentage: percent,
      grade,
      score,
      totalMarks,
      duration_minutes: Math.round(totalDurationSeconds / 60),
      timeSpentSeconds,
      auto_submitted: isAuto,
      submitted_at: new Date().toISOString(),
      review_breakdown: reviewBreakdown
    };

    if (saveResultToDatabase) {
      try {
        await saveResultToDatabase(examResultData);
      } catch (error) {
        console.error("Failed to save result:", error);
      }
    }

    clearExamState();
    if (submitModal) submitModal.classList.remove("active");
    if (btnSubmitExam) btnSubmitExam.disabled = true;
    window.location.href = "../result page/index.html";
  };
}
