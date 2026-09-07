fetch("./results.json")
    .then(response => response.json())
    .then(results => {

        const table = document.querySelector("#resultTable");

        results.forEach(result => {

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
   