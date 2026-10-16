import { requireAuth } from "../authentication/auth.js";
import { loadLatestResult } from "./result-data.js";
import { renderResults, renderReviewModal } from "./result-rendering.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Require Authentication
  requireAuth();

  // Setup Actions
  const printBtn = document.getElementById("btn-print");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  // Review Modal Handlers
  const detailedResultBtn = document.getElementById("btn-detailed-result");
  const reviewModal = document.getElementById("resultReviewModal");
  const btnCloseModal = document.getElementById("btnCloseResultModal");
  const btnCloseModalBtn = document.getElementById("btnCloseResultModalBtn");

  if (detailedResultBtn && reviewModal) {
    detailedResultBtn.addEventListener("click", () => {
      renderReviewModal();
      reviewModal.style.display = "flex";
    });
  }

  if (btnCloseModal && reviewModal) {
    btnCloseModal.addEventListener("click", () => {
      reviewModal.style.display = "none";
    });
  }

  if (btnCloseModalBtn && reviewModal) {
    btnCloseModalBtn.addEventListener("click", () => {
      reviewModal.style.display = "none";
    });
  }

  // Load and display result
  const result = await loadLatestResult();
  renderResults(result);
});

