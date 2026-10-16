function escapeHtml(value) {
    if (!value) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function renderSubjectGrid({ container, subjects, selectedSubjectId, onSelect }) {
    if (!container) return;

    container.innerHTML = "";
    if (subjects.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 32px; color: #f59e0b; margin-bottom: 12px; display: block;"></i>
                No examination subjects currently available in database.
            </div>
        `;
        return;
    }

    subjects.forEach(subject => {
        const card = document.createElement("div");
        card.className = `subject-card ${selectedSubjectId === subject.id ? "selected" : ""}`;
        card.dataset.id = subject.id;
        card.innerHTML = `
            <div>
                <div class="subject-card-header">
                    <div class="subject-icon-box">
                        <i class="fa-solid ${subject.icon || "fa-book"}"></i>
                    </div>
                    <div class="check-indicator">
                        <i class="fa-solid fa-check"></i>
                    </div>
                </div>
                <div class="subject-title">${escapeHtml(subject.title)}</div>
                <div class="subject-desc">${escapeHtml(subject.desc)}</div>
            </div>
            <div class="subject-footer">
                <span class="badge-count">
                    <i class="fa-solid fa-list-check"></i> ${subject.questionCount} Questions
                </span>
                <span class="badge-category">${escapeHtml(subject.category)}</span>
            </div>
        `;

        card.addEventListener("click", () => {
            container.querySelectorAll(".subject-card").forEach(item => item.classList.remove("selected"));
            card.classList.add("selected");
            onSelect(subject.id);
        });

        container.appendChild(card);
    });
}
