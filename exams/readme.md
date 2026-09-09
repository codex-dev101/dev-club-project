const result = JSON.parse(localStorage.getItem("cbt_exam_results"));

console.log(result.score);           // e.g. 18
console.log(result.totalMarks);      // e.g. 20
console.log(result.percentage);      // e.g. 90%
console.log(result.grade);           // e.g. "A"
console.log(result.correctAnswers);  // e.g. 9
console.log(result.wrongAnswers);    // e.g. 1
