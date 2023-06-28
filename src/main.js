import "../styles/modern-normalize.css";
import "../styles/style.css";
import "../styles/components/timer.css";
import "../styles/utils.css";
import workCompletionSound from "../audio/success.mp3";
import breakCompletionSound from "../audio/notif.mp3";

let workMode = retrieveLastMode();
let timerArr = retrieveTimerAmt();
let workSec = timerArr[0];
let breakSec = timerArr[1];
let timerStart = workMode ? workSec : breakSec;
let autoStart = retrieveAutoStart();
const timerEnd = 0;
let now = timerStart;
let progress;
let audioVolume = retrieveVolAmt();
const workAudio = new Audio(workCompletionSound);
const breakAudio = new Audio(breakCompletionSound);
workAudio.volume = audioVolume;
breakAudio.volume = audioVolume;

function retrieveAutoStart() {
  if (!window.localStorage.getItem("auto_start")) {
    window.localStorage.setItem("auto_start", "true");
  }
  return window.localStorage.getItem("auto_start") === "true";
}

function retrieveVolAmt() {
  if (!window.localStorage.getItem("vol_amt")) {
    window.localStorage.setItem("vol_amt", "0.2");
  }
  return parseFloat(window.localStorage.getItem("vol_amt"));
}

function retrieveLastMode() {
  if (!window.localStorage.getItem("work_mode")) {
    window.localStorage.setItem("work_mode", "true");
  }
  return window.localStorage.getItem("work_mode") === "true";
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

function setAutoStart(mode) {
  window.localStorage.setItem("auto_start", mode);
}

function setLastMode(mode) {
  window.localStorage.setItem("work_mode", mode);
}

function setVolAmt(volAmt) {
  window.localStorage.setItem("vol_amt", volAmt);
}

function setTimerAmt(timerAmt) {
  window.localStorage.setItem("work_amt", timerAmt[0]);
  window.localStorage.setItem("break_amt", timerAmt[1]);
}

function setInitSettingsAutoStart() {
  let autoToggle = document.querySelector(".timer__dialog_auto_start_toggle");
  autoToggle.checked = retrieveAutoStart();
  checkAutoToggle();
}

function setInitSettingsVolAmt() {
  let volSlider = document.querySelector(".timer__dialog_vol_slider");
  volSlider.value = audioVolume * 100;
}

function setInitSettingsTimerAmt() {
  let workSettings = document.getElementById("timer__dialog_work_mins");
  let breakSettings = document.getElementById("timer__dialog_break_mins");
  workSettings.value = workSec / 60;
  breakSettings.value = breakSec / 60;
}

function setInitialTimer() {
  let timerAmt = retrieveTimerAmt();
  let progressValue = document.querySelector(".progress-value");
  progressValue.textContent = workMode
    ? secondsToMinSec(timerAmt[0])
    : secondsToMinSec(timerAmt[1]);
}

function setInitMode() {
  if (workMode) {
    changeToWorkColors();
  } else {
    changeToBreakColors();
  }
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
    if (workMode) {
      circularProgress.style.background = `conic-gradient(var(--clr-dark-red) ${
        ((now - timerEnd) / timerStart) * 360
      }deg, var(--clr-lightest-red) 0deg)`;
    } else {
      circularProgress.style.background = `conic-gradient(var(--clr-dark-blue) ${
        ((now - timerEnd) / timerStart) * 360
      }deg, var(--clr-lightest-blue) 0deg)`;
    }

    if (now == timerEnd) {
      progressValue.textContent = "0:00";
      startBtn.disabled = true;
      pauseBtn.disabled = true;
      if (workMode) {
        workAudio.play();
      } else {
        breakAudio.play();
      }
      if (autoStart) {
        changeMode(!workMode);
        startTimer();
      } else {
        clearInterval(progress);
      }
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

function restartDisplay() {
  let startBtn = document.querySelector(".btn-start");
  let pauseBtn = document.querySelector(".btn-pause");
  let circularProgress = document.querySelector(".circular-progress");
  let progressValue = document.querySelector(".progress-value");
  now = timerStart;
  progressValue.textContent = secondsToMinSec(now);
  if (workMode) {
    circularProgress.style.background =
      "conic-gradient(var(--clr-dark-red) 360deg, var(--clr-lightest-red) 0deg)";
  } else {
    circularProgress.style.background =
      "conic-gradient(var(--clr-dark-blue) 360deg, var(--clr-lightest-blue) 0deg)";
  }
  if (!autoStart) {
    startBtn.style.display = "block";
    pauseBtn.style.display = "none";
  }
  startBtn.disabled = false;
  pauseBtn.disabled = false;
  clearInterval(progress);
}

function listenForRestartBtn() {
  let restartBtn = document.querySelector(".btn-restart");
  restartBtn.addEventListener("click", () => {
    // console.log("restart!");
    restartDisplay();
  });
}

function listenForOpenSettingsBtn() {
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
    workSec = Math.floor(workSettings.value * 60);
    if (workMode) {
      timerStart = workSec;
      updateLabels(workSec);
      restartDisplay();
    }
    setTimerAmt([workSec, breakSec]);
  });
  breakSettings.addEventListener("input", () => {
    breakSec = Math.floor(breakSettings.value * 60);
    if (!workMode) {
      timerStart = breakSec;
      updateLabels(breakSec);
      restartDisplay();
    }
    setTimerAmt([workSec, breakSec]);
  });
}

function listenForVolSliderChange() {
  let volSlider = document.querySelector(".timer__dialog_vol_slider");
  volSlider.addEventListener("input", () => {
    audioVolume = volSlider.value / 100;
    workAudio.volume = audioVolume;
    breakAudio.volume = audioVolume;
    setVolAmt(audioVolume);
  });
}

function listenForCloseSettingsBtn() {
  let closeBtn = document.querySelector(".btn-close-dialog");
  let dialog = document.querySelector(".timer__dialog");
  closeBtn.addEventListener("click", () => {
    dialog.close();
  });
}

function changeMode(mode) {
  if (mode) {
    changeToWorkColors();
    workMode = true;
    setLastMode(true);
    timerStart = workSec;
    checkAutoToggle();
    restartDisplay();
  } else {
    changeToBreakColors();
    workMode = false;
    setLastMode(false);
    timerStart = breakSec;
    checkAutoToggle();
    restartDisplay();
  }
}

function listenForWorkBtn() {
  let workBtn = document.querySelector(".timer__work");
  workBtn.addEventListener("click", () => {
    changeMode(true);
  });
}

function listenForBreakBtn() {
  let breakBtn = document.querySelector(".timer__break");
  breakBtn.addEventListener("click", () => {
    changeMode(false);
  });
}

function listenForAutoStartToggle() {
  let autoToggle = document.querySelector(".timer__dialog_auto_start_toggle");
  autoToggle.addEventListener("input", () => {
    autoStart = autoToggle.checked;
    checkAutoToggle();
  });
}

function checkAutoToggle() {
  let autoToggle = document.querySelector(".timer__dialog_auto_start_toggle");
  if (autoToggle.checked) {
    setAutoStart(true);
    fillSlider();
  } else {
    setAutoStart(false);
    emptySlider();
  }
}

function fillSlider() {
  let autoSlider = document.querySelector(
    ".timer__dialog_auto_start_toggle_slider"
  );
  autoSlider.style.backgroundColor = workMode
    ? "var(--clr-red)"
    : "var(--clr-blue)";
}

function emptySlider() {
  let autoSlider = document.querySelector(
    ".timer__dialog_auto_start_toggle_slider"
  );
  autoSlider.style.backgroundColor = "var(--clr-light-gray)";
}

function changeToBreakColors() {
  /* list of colors to change:
  body.style.bockground -> blue
  .timer__box -> light blue
  .timer__work:hover -> dark blue [SPECIAL CSS]
  .timer__break backgound -> dark blue
  .circular-progress::before -> blue [SPECIAL CSS]
  .timer__dialog_vol_slider accent-color -> blue
    circle outline empty -> lightest blue [IN FUNCTIONS]
  */
  document.body.style.background = "var(--clr-blue)";
  document.querySelector(".timer__box").style.background =
    "var(--clr-light-blue)";
  document.querySelector(".timer__work").style.background = "none";
  document.querySelector(".timer__break").style.background =
    "var(--clr-dark-blue)";
  document
    .getElementById("timer__break")
    .classList.remove("hoverRed", "hoverBlue");
  document.getElementById("timer__work").classList.add("hoverBlue");
  document.querySelector(".timer__dialog_vol_slider").style.accentColor =
    "var(--clr-blue)";
  document
    .getElementById("circular-progress")
    .classList.remove("inner-circle-red");
  document
    .getElementById("circular-progress")
    .classList.add("inner-circle-blue");
  document.querySelector(".circular-progress").style.background =
    "conic-gradient(var(--clr-dark-blue) 360deg, var(--clr-lightest-blue) 0deg)";
}

function changeToWorkColors() {
  /* list of colors to change:
  body.style.bockground -> red
  .timer__box -> lighter red
  .timer__break:hover -> dark red [SPECIAL CSS]
  .timer__work backgound -> dark red
  .circular-progress::before -> red; [SPECIAL CSS]
  .timer__dialog_vol_slider accent-color -> red
  circle outline empty -> lightest red [IN FUNCTIONS]
  */
  document.body.style.background = "var(--clr-red)";
  document.querySelector(".timer__box").style.background =
    "var(--clr-lighter-red)";
  document.querySelector(".timer__work").style.background =
    "var(--clr-dark-red)";
  document.querySelector(".timer__break").style.background = "none";
  document
    .getElementById("timer__work")
    .classList.remove("hoverBlue", "hoverRed");
  document.getElementById("timer__break").classList.add("hoverRed");
  document.querySelector(".timer__dialog_vol_slider").style.accentColor =
    "var(--clr-red)";
  document
    .getElementById("circular-progress")
    .classList.remove("inner-circle-blue");
  document
    .getElementById("circular-progress")
    .classList.add("inner-circle-red");
  document.querySelector(".circular-progress").style.background =
    "conic-gradient(var(--clr-dark-red) 360deg, var(--clr-lightest-red) 0deg)";
}

function updateLabels(timerAmt) {
  let progressValue = document.querySelector(".progress-value");
  progressValue.textContent = secondsToMinSec(timerAmt);
}

function listenToAllEvents() {
  listenForStartBtn();
  listenForPauseBtn();
  listenForRestartBtn();
  listenForOpenSettingsBtn();
  listenForCloseSettingsBtn();
  listenForAutoStartToggle();
  listenForWorkBtn();
  listenForBreakBtn();
  listenForMinuteSettingsChange();
  listenForVolSliderChange();
}

setInitMode();
setInitialTimer();
setInitSettingsTimerAmt();
setInitSettingsAutoStart();
setInitSettingsVolAmt();
listenToAllEvents();
