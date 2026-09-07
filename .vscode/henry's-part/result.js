const results = [
    {
        exam: "Computer Basics Test",
        date: "May 24, 2024",
        score: "78% (39/50)",
        grade: "B"
    },

    {
        exam: "Web Development Test",
        date: "May 10, 2024",
        score: "92% (46/50)",
        grade: "A"
    },

    {
        exam: "JavaScript Test",
        date: "Apr 28, 2024",
        score: "85% (42/50)",
        grade: "A-"
    },

    {
        exam: "Data Structures Test",
        date: "Apr 15, 2024",
        score: "70% (35/50)",
        grade: "B"
    },
    {
        exam: "Database Management Test",
        date: "Apr 01, 2024",
        score: "88% (44/50)",
        grade: "A"
    },

];


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