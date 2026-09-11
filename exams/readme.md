const result = JSON.parse(localStorage.getItem("cbt_exam_results"));

console.log(result.score);           // e.g. 18
console.log(result.totalMarks);      // e.g. 20
console.log(result.percentage);      // e.g. 90%
console.log(result.grade);           // e.g. "A"
console.log(result.correctAnswers);  // e.g. 9
console.log(result.wrongAnswers);    // e.g. 1



SUPABASE_URL=https://cjqnrpbctqblxfpspxzq.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_WoZjELCqdbbMtSBJAYAe7A_mv3PmKe_
SUPABASE_SECRET_KEY=sb_secret_5hd0ZrVBF7tPKrid3s5IEQ_JxVtOOx1
SUPABASE_JWKS_URL=https://cjqnrpbctqblxfpspxzq.supabase.co/auth/v1/.well-known/jwks.json