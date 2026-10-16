import { getCurrentUser } from "../authentication/auth.js";
import { clearExamHistory, loadExamHistory } from "./result-history-data.js";
import { renderResultsTable } from "./result-history-rendering.js";
import { renderAnswerReviewModal } from "./result-review-rendering.js";

document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector("#resultsTable") || document.querySelector("#resultTable");
    const clearButton = document.getElementById("btnClearHistory");
    const reviewModal = document.getElementById("reviewModal");
    const closeButton = document.getElementById("btnCloseModal");
    const closeBottomButton = document.getElementById("btnCloseModalBottom");
    const modalExamTitle = document.getElementById("modalExamTitle");
    const modalQuestionsList = document.getElementById("modalQuestionsList");

    if (closeButton && reviewModal) {
        closeButton.addEventListener("click", () => {
            reviewModal.style.display = "none";
        });
    }

    if (closeBottomButton && reviewModal) {
        closeBottomButton.addEventListener("click", () => {
            reviewModal.style.display = "none";
        });
    }

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear all exam history?")) {
                clearExamHistory();
                renderTable();
            }
        });
    }

    renderTable();

    function renderTable() {
        if (!table) return;

        const currentUser = getCurrentUser();
        const historyList = loadExamHistory(currentUser);
        renderResultsTable({
            table,
            historyList,
            currentUser,
            onReview: item => renderAnswerReviewModal(item, {
                reviewModal,
                modalExamTitle,
                modalQuestionsList
            })
        });
    }
});
