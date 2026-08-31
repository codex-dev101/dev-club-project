/**
 * Timer Module (timer.js)
 * Controls the countdown clock, UI warning pulse, and timeout events.
 */

const DEFAULT_TIME_SECONDS = 45 * 60; // 45 Minutes

let timeRemaining = DEFAULT_TIME_SECONDS;
let timerInterval = null;

/**
 * Starts the countdown timer.
 * @param {Function} onTick - Callback executed each second with formatted string and time remaining
 * @param {Function} onTimeUp - Callback executed when timer reaches 0
 */
export function startTimer(onTick, onTimeUp) {
  clearInterval(timerInterval);
  
  // Initial tick
  if (onTick) onTick(formatTime(timeRemaining), timeRemaining);

  timerInterval = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timeRemaining = 0;
      if (onTick) onTick(formatTime(0), 0);
      if (onTimeUp) onTimeUp();
      return;
    }

    timeRemaining--;
    if (onTick) onTick(formatTime(timeRemaining), timeRemaining);
  }, 1000);
}

/**
 * Stops/pauses the timer.
 */
export function stopTimer() {
  clearInterval(timerInterval);
}

/**
 * Resets the timer back to 45 minutes.
 */
export function resetTimer() {
  stopTimer();
  timeRemaining = DEFAULT_TIME_SECONDS;
}

/**
 * Formats seconds into HH:MM:SS
 */
export function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
