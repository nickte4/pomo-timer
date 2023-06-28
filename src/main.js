import "../styles/modern-normalize.css";
import "../styles/style.css";
import "../styles/components/timer.css";
import "../styles/utils.css";

let workMode = retrieveLastMode();
let timerArr = retrieveTimerAmt();
let workMin = timerArr[0];
let breakMin = timerArr[1];
let timerStart = workMode ? workMin : breakMin;
const timerEnd = 0;
let now = timerStart;
let progress;
let audioVolume = 0.1;

function retrieveLastMode() {
  if (!window.localStorage.getItem("work_mode")) {
    window.localStorage.setItem("work_mode", "true");
  }
  return window.localStorage.getItem("work_mode");
}

function retrieveTimerAmt() {
  if (!window.localStorage.getItem("work_amt")) {
    window.localStorage.setItem("work_amt", "1500");
  }
  if (!window.localStorage.getItem("break_amt")) {
    window.localStorage.setItem("break_amt", "300");
  }
  let workAmt = parseInt(window.localStorage.getItem("work_amt"));
  let breakAmt = parseInt(window.localStorage.getItem("break_amt"));
  return [workAmt, breakAmt];
}

function setTimerAmt(timerAmt) {
  window.localStorage.setItem("work_amt", timerAmt[0]);
  window.localStorage.setItem("break_amt", timerAmt[1]);
}

function setInitSettingsTimerAmt() {
  let workSettings = document.getElementById("timer__dialog_work_mins");
  let breakSettings = document.getElementById("timer__dialog_break_mins");
  workSettings.value = workMin;
  breakSettings.value = breakMin;
}

function setInitialTimer() {
  let timerAmt = retrieveTimerAmt();
  let progressValue = document.querySelector(".progress-value");
  progressValue.textContent = secondsToMinSec(timerAmt[0]);
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

function listenForMinuteSettingsChange() {
  let workSettings = document.getElementById("timer__dialog_work_mins");
  let breakSettings = document.getElementById("timer__dialog_break_mins");
  workSettings.addEventListener("input", () => {
    setTimerAmt(workSettings.value, breakMin);
  });
  breakSettings.addEventListener("input", () => {
    setTimerAmt(workMin, breakSettings.value);
  });
}

function listenToAllEvents() {
  listenForStartBtn();
  listenForPauseBtn();
  listenForRestartBtn();
  listenForSettingsBtn();
  listenForMinuteSettingsChange();
}

setInitialTimer();
setInitSettingsTimerAmt();
listenToAllEvents();
