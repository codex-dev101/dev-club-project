export function validateExamOptions({
    questionCount,
    availableQuestions,
    durationMinutes,
    questionMessage,
    questionMessageText,
    durationMessage,
    durationMessageText,
    continueButton
}) {
    let isValid = true;

    if (!questionCount || questionCount < 1) {
        questionMessage.style.display = "flex";
        questionMessageText.textContent = "Please select at least 1 question.";
        isValid = false;
    } else if (questionCount > availableQuestions) {
        questionMessage.style.display = "flex";
        questionMessageText.textContent = `Cannot select more than ${availableQuestions} questions (the maximum available for this subject).`;
        isValid = false;
    } else if (questionCount > 50) {
        questionMessage.style.display = "flex";
        questionMessageText.textContent = "Maximum allowed question count is 50.";
        isValid = false;
    } else {
        questionMessage.style.display = "none";
    }

    if (!durationMinutes || durationMinutes < 1) {
        durationMessage.style.display = "flex";
        durationMessageText.textContent = "Please specify a duration of at least 1 minute.";
        isValid = false;
    } else if (durationMinutes > 60) {
        durationMessage.style.display = "flex";
        durationMessageText.textContent = "Maximum allowed examination duration is strictly 60 minutes.";
        isValid = false;
    } else {
        durationMessage.style.display = "none";
    }

    continueButton.disabled = !isValid;
    return isValid;
}
