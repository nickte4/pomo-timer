import "../styles/modern-normalize.css";
import "../styles/style.css";
import "../styles/components/timer.css";
import "../styles/utils.css";

let timerStart = retrieveTimerAmt();
const timerEnd = 0;
let now = timerStart;
let progress;
let audioVolume = 0.1;

function retrieveTimerAmt() {
  if (!window.localStorage.getItem("timer_amt")) {
    window.localStorage.setItem("timer_amt", "1500");
  }
  return parseInt(window.localStorage.getItem("timer_amt"));
}

function setTimerAmt(timerAmt) {
  window.localStorage.setItem("timer_amt", timerAmt);
}

function setInitialTimer() {
  let timerAmt = retrieveTimerAmt();
  let progressValue = document.querySelector(".progress-value");
  progressValue.textContent = secondsToMinSec(timerAmt);
  return timerAmt;
}

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

// starts the timer
function startTimer() {
  let circularProgress = document.querySelector(".circular-progress");
  let progressValue = document.querySelector(".progress-value");
  let startBtn = document.querySelector(".btn-start");
  let pauseBtn = document.querySelector(".btn-pause");
  progressValue.textContent = secondsToMinSec(now);
  const speed = 1000; // speed in ms, 1000 ms = 1 sec
  progress = setInterval(() => {
    now--;
    progressValue.textContent = secondsToMinSec(now);
    circularProgress.style.background = `conic-gradient(var(--clr-dark-red) ${
      ((now - timerEnd) / timerStart) * 360
    }deg, var(--clr-lightest-red) 0deg)`;

    if (now == timerEnd) {
      progressValue.textContent = "0:00";
      let completedAudio = new Audio("../audio/success.mp3");
      startBtn.disabled = true;
      pauseBtn.disabled = true;
      completedAudio.volume = audioVolume;
      completedAudio.play();
      clearInterval(progress);
    }
  }, speed);
}

function listenForStartBtn() {
  let startBtn = document.querySelector(".btn-start");
  let pauseBtn = document.querySelector(".btn-pause");
  startBtn.addEventListener("click", () => {
    // console.log("start!");
    startBtn.style.display = "none";
    pauseBtn.style.display = "block";
    startTimer();
  });
}

function listenForPauseBtn() {
  let startBtn = document.querySelector(".btn-start");
  let pauseBtn = document.querySelector(".btn-pause");
  pauseBtn.addEventListener("click", () => {
    // console.log("pause!");
    startBtn.style.display = "block";
    pauseBtn.style.display = "none";
    clearInterval(progress);
  });
}

function listenForRestartBtn() {
  let startBtn = document.querySelector(".btn-start");
  let pauseBtn = document.querySelector(".btn-pause");
  let restartBtn = document.querySelector(".btn-restart");
  let circularProgress = document.querySelector(".circular-progress");
  let progressValue = document.querySelector(".progress-value");
  restartBtn.addEventListener("click", () => {
    // console.log("restart!");
    now = timerStart;
    progressValue.textContent = secondsToMinSec(now);
    circularProgress.style.background =
      "conic-gradient(var(--clr-dark-red) 360deg, var(--clr-lightest-red) 0deg)";
    startBtn.style.display = "block";
    pauseBtn.style.display = "none";
    startBtn.disabled = false;
    pauseBtn.disabled = false;
    clearInterval(progress);
  });
}

function listenForSettingsBtn() {
  let settingsBtn = document.querySelector(".timer__setting");
  let dialog = document.querySelector(".timer__dialog");
  settingsBtn.addEventListener("click", () => {
    dialog.showModal();
  });
}

function listenToAllBtns() {
  listenForStartBtn();
  listenForPauseBtn();
  listenForRestartBtn();
  listenForSettingsBtn();
}

setInitialTimer();
listenToAllBtns();
