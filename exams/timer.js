// ==========================================
// MODULE 3: timer.js
// Handles exam countdown timer display and tick
// ==========================================

let timerInterval = null;

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function initTimer({ getTime, setTime, onTick, onTimeUp }) {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    let current = getTime();

    if (current <= 0) {
      clearInterval(timerInterval);
      onTimeUp();
      return;
    }

    current--;
    setTime(current);
    onTick(current);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// Make accessible globally
window.formatTime = formatTime;
window.initTimer = initTimer;
window.stopTimer = stopTimer;
