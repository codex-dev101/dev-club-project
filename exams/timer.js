// ==========================================
// Smart CBT - timer.js
// Handles reliable countdown timer with deadline verification
// ==========================================

let timerInterval = null;

function formatTime(seconds) {
  const sec = Math.max(0, Math.floor(seconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function initTimer({ getDeadline, getTime, setTime, onTick, onTimeUp }) {
  clearInterval(timerInterval);

  function tick() {
    let current;
    if (typeof getDeadline === "function") {
      const deadline = getDeadline();
      const now = Date.now();
      current = Math.max(0, Math.floor((deadline - now) / 1000));
    } else if (typeof getTime === "function") {
      current = getTime() - 1;
    } else {
      current = 0;
    }

    if (typeof setTime === "function") {
      setTime(current);
    }

    if (typeof onTick === "function") {
      onTick(current);
    }

    if (current <= 0) {
      clearInterval(timerInterval);
      if (typeof onTimeUp === "function") {
        onTimeUp();
      }
    }
  }

  // Run immediate first tick
  tick();
  timerInterval = setInterval(tick, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Make accessible globally
window.formatTime = formatTime;
window.initTimer = initTimer;
window.stopTimer = stopTimer;
