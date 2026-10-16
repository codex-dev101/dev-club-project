export function loadExamHistory(currentUser) {
    let historyList = [];
    try {
        historyList = JSON.parse(localStorage.getItem("cbt_exam_history")) ||
            JSON.parse(localStorage.getItem("cbt_all_results")) || [];
    } catch (error) {
        historyList = [];
    }

    if (!currentUser) return historyList;

    return historyList.filter(item => {
        const idMatch = item.candidate_id === currentUser.matricNo ||
            item.candidateId === currentUser.matricNo;
        const nameMatch = item.candidate_name?.toLowerCase() === currentUser.fullName?.toLowerCase() ||
            item.name?.toLowerCase() === currentUser.fullName?.toLowerCase();
        return idMatch || nameMatch;
    });
}

export function clearExamHistory() {
    localStorage.removeItem("cbt_exam_history");
    localStorage.removeItem("cbt_all_results");
    localStorage.removeItem("cbt_exam_results");
}
