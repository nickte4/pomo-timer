import "../styles/modern-normalize.css";
import "../styles/style.css";
import "../styles/components/timer.css";
import "../styles/utils.css";

// converts the seconds into a readable min:sec format
function secondsToMinSec(sec) {
  let min = Math.floor(sec / 60);
  if (min == 0) {
    if (sec < 10) {
      sec = `0${sec}`;
    }
    return `0:${sec}`;
  }
  let secLeft = sec - min * 60;
  if (secLeft < 10) {
    secLeft = `0${secLeft}`;
  }
  return `${min}:${secLeft}`;
}

// activates the timer
function activateTimer(start) {
  let circularProgress = document.querySelector(".circular-progress");
  let progressValue = document.querySelector(".progress-value");
  progressValue.textContent = secondsToMinSec(start);

  let timerStart = start;
  let now = timerStart;
  const timerEnd = 0;
  const speed = 1000; // speed in ms, 1000 ms = 1 sec

  let progress = setInterval(() => {
    now--;
    progressValue.textContent = secondsToMinSec(now);
    circularProgress.style.background = `conic-gradient(var(--clr-dark-red) ${
      ((now - timerEnd) / timerStart) * 360
    }deg, var(--clr-lighter-red) 0deg)`;

    if (now == timerEnd) {
      clearInterval(progress);
    }
  }, speed);
}

activateTimer(120);
