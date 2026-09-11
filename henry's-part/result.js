// Helper function to calculate grade based on score
function calculateGrade(score) {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 40) return "D";
    return "F";
}

// Function to render results rows to the table
function renderResults(results) {
    const resultsTable = document.getElementById("resultsTable");
    if (!resultsTable) return;

    resultsTable.innerHTML = "";

    if (!results || results.length === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `<td colspan="5" style="text-align: center; color: #777;">No results found.</td>`;
        resultsTable.appendChild(emptyRow);
        return;
    }

    results.forEach((result) => {
        const row = document.createElement("tr");

        const examName = result.exam || result.subject || result.name || "Exam";
        const dateTaken = result.date || (result.submitted_at ? new Date(result.submitted_at).toLocaleDateString() : new Date().toLocaleDateString());
        const score = result.score !== undefined ? result.score : (result.percentage !== undefined ? `${result.percentage}%` : "0");
        const numericScore = typeof result.score === "number" ? result.score : (Number(result.percentage) || 0);
        const grade = result.grade || calculateGrade(numericScore);

        row.innerHTML = `
            <td>${examName}</td>
            <td>${dateTaken}</td>
            <td>${score}</td>
            <td>${grade}</td>
            <td>
                <button type="button">View</button>
            </td>
        `;

        resultsTable.appendChild(row);
    });
}

// Load results from JSON file or fall back to localStorage / sample data
function loadResults() {
    fetch("./results.json")
        .then((response) => {
            if (!response.ok) throw new Error("results.json not found");
            return response.json();
        })
        .then((results) => {
            renderResults(results);
        })
        .catch(() => {
            // Fallback: Check localStorage saved results
            try {
                const stored = JSON.parse(localStorage.getItem("cbt_all_results") || "[]");
                if (stored && stored.length > 0) {
                    renderResults(stored);
                    return;
                }
                const single = JSON.parse(localStorage.getItem("cbt_exam_results") || "null");
                if (single) {
                    renderResults([single]);
                    return;
                }
            } catch (e) {
                console.warn("Could not load from localStorage:", e);
            }

            // Demo default data if neither is available
            const demoResults = [
                { exam: "Mathematics", date: "2026-09-08", score: 84, grade: "A" },
                { exam: "English Language", date: "2026-09-05", score: 68, grade: "B" },
                { exam: "General Knowledge", date: "2026-09-01", score: 74, grade: "A" }
            ];
            renderResults(demoResults);
        });
}

document.addEventListener("DOMContentLoaded", loadResults);