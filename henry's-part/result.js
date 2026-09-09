fetch("./results.json")
    .then(response => response.json())
    .then(results => {
import results from "results .js";
import results from "./results.js";
const resultsTable = document.getElementById("resultsTable");

        const table = document.querySelector("#resultTable");

        results.forEach(result => {
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

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${result.name}</td>
                <td>${result.exam}</td>
                <td>${result.score}</td>
            `;

            table.appendChild(row);
        });
    });
let grade;

if (result.score >= 70) {
    grade = "A";
} else if (result.score >= 60) {
    grade = "B";
} else {
    grade = "C";
}
   