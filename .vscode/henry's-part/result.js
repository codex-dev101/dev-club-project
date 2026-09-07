import (results) from "results .js";   
const resultsTable = document.getElementById("resultsTable");


results.forEach((result) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${result.exam}</td>
        <td>${result.date}</td>
        <td>${result.score}</td>
        <td>${result.grade}</td>
        <td>
            <button>View</button>
        </td>
    `;

    resultsTable.appendChild(row);
});


let grade;

if (result.score >= 70) {
    grade = "A";
} else if (result.score >= 60) {
    grade = "B";
} else {
    grade = "C";
}