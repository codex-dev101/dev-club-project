const historyList = JSON.parse(localStorage.getItem("cbt_exam_history")) || [];

const table = document.querySelector("#resultTable");

table.innerHTML = "";

historyList.forEach(result => {

    let grade;

    if (result.score >= 70) {
        grade = "A";
    } else if (result.score >= 60) {
        grade = "B";
    } else {
        grade = "C";
    }

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${result.name}</td>
        <td>${result.exam}</td>
        <td>${result.score}</td>
        <td>${grade}</td>
        <td>${correctAnswers(result.answers)}</td>
    `;

    table.appendChild(row);
});