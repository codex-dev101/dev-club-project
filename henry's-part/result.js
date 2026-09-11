document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("#resultsTable") || document.querySelector("#resultTable");
  if (!table) return;

  const historyList = JSON.parse(localStorage.getItem("cbt_exam_history")) || 
                      JSON.parse(localStorage.getItem("cbt_all_results")) || [];

  table.innerHTML = "";

  if (historyList.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `<td colspan="6" style="text-align: center; color: #888; padding: 20px;">No exam results found yet.</td>`;
    table.appendChild(emptyRow);
    return;
  }

  historyList.forEach((result, idx) => {
    const examTitle = result.exam || result.subject || "CBT Examination";
    const dateTaken = result.dateTaken || (result.submitted_at ? new Date(result.submitted_at).toLocaleDateString() : new Date().toLocaleDateString());
    const scoreText = `${result.percentage ?? result.score}% (${result.correctAnswers ?? result.correct_questions ?? 0}/${result.total_questions ?? 50})`;
    
    let grade = result.grade;
    if (!grade) {
      const score = Number(result.percentage ?? result.score) || 0;
      if (score >= 70) grade = "A";
      else if (score >= 60) grade = "B";
      else if (score >= 50) grade = "C";
      else if (score >= 40) grade = "D";
      else grade = "F";
    }

    const correctCount = result.correctAnswers ?? result.correct_questions ?? result.correct_answers ?? 0;
    const totalQ = result.total_questions || 50;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${examTitle}</strong></td>
      <td>${dateTaken}</td>
      <td>${scoreText}</td>
      <td><span class="badge-grade" style="font-weight: bold; color: ${grade === 'F' ? '#ef4444' : '#22c55e'}">${grade}</span></td>
      <td><a href="../result page/index.html" style="color: #007bff; text-decoration: none; font-weight: 500;"><i class="fa-solid fa-eye"></i> View Summary</a></td>
      <td>${correctCount} / ${totalQ} Correct</td>
    `;

    table.appendChild(row);
  });
});
