let mode = "";
let score = 0;
let streak = 0;

let shuffledData = [];
let currentIndex = 0;
let currentQuestion = null;

// ===== SOUNDS =====
const correctSound = new Audio("C.mp3");
const wrongSound = new Audio("W.mp3");
const clickSound = new Audio("click.mp3");

// preload (IMPORTANT for no lag)
correctSound.preload = "auto";
wrongSound.preload = "auto";
clickSound.preload = "auto";

// ===== SETTINGS =====
let sfxEnabled = true;
let uiEnabled = true;

// ===== BOOLEAN HELPER =====
function toBool(val, fallback = true) {
  if (val === null || val === undefined) return fallback;
  return val === "true";
}

// ================= SOUND ENGINE (NO LAG CORE) =================
function playSound(sound) {
  try {
    sound.pause();
    sound.currentTime = 0;

    const p = sound.play();
    if (p !== undefined) p.catch(() => {});
  } catch (e) {}
}

// click lock (prevents micro lag / spam)
let clickLock = false;

function playClickSound() {
  if (!uiEnabled || clickLock) return;

  clickLock = true;
  playSound(clickSound);

  setTimeout(() => {
    clickLock = false;
  }, 70);
}

// ================= SETTINGS LOAD =================
document.addEventListener("DOMContentLoaded", () => {

  // DEFAULT SAFE STORAGE
  if (localStorage.getItem("sfx") === null) localStorage.setItem("sfx", "true");
  if (localStorage.getItem("ui") === null) localStorage.setItem("ui", "true");

  // LOAD VALUES
  sfxEnabled = toBool(localStorage.getItem("sfx"), true);
  uiEnabled = toBool(localStorage.getItem("ui"), true);

  // ===== SFX TOGGLE =====
  const sfxToggle = document.getElementById("sound2Toggle");

  if (sfxToggle) {
    sfxToggle.checked = sfxEnabled;

    sfxToggle.addEventListener("change", () => {
      sfxEnabled = sfxToggle.checked;
      localStorage.setItem("sfx", String(sfxEnabled));
    });
  }

  // ===== UI TOGGLE =====
  const uiToggle = document.getElementById("sound1Toggle");

  if (uiToggle) {
    uiToggle.checked = uiEnabled;

    uiToggle.addEventListener("change", () => {
      uiEnabled = uiToggle.checked;
      localStorage.setItem("ui", String(uiEnabled));
    });
  }

  // ===== BGM (unchanged but stable) =====
  const bgm = document.getElementById("bgm");
  const bgmToggle = document.getElementById("bgmToggle");
  const slider = document.getElementById("volumeSlider");

  let bgmOn = localStorage.getItem("bgmOn");
  let volume = localStorage.getItem("bgmVolume");

  if (bgmOn === null) bgmOn = "true";
  if (volume === null) volume = 0.5;

  bgm.volume = volume;
  bgmToggle.checked = (bgmOn === "true");
  slider.value = volume;

  bgmToggle.addEventListener("change", () => {
    if (bgmToggle.checked) {
      bgm.play().catch(() => {});
      localStorage.setItem("bgmOn", "true");
    } else {
      bgm.pause();
      localStorage.setItem("bgmOn", "false");
    }
  });

  slider.addEventListener("input", () => {
    bgm.volume = slider.value;
    localStorage.setItem("bgmVolume", slider.value);
  });
});

// ================= GAME START =================
function startGame(selectedMode) {
  mode = selectedMode;
  score = 0;
  streak = 0;
  updateScore();

  shuffledData = [...data].sort(() => Math.random() - 0.5);
  currentIndex = 0;

  document.getElementById("home").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");

  loadQuestion();
}

// ================= LOAD QUESTION =================
function loadQuestion() {
  if (currentIndex >= shuffledData.length) {
    shuffledData = [...data].sort(() => Math.random() - 0.5);
    currentIndex = 0;
  }

  const q = shuffledData[currentIndex];
  currentQuestion = q;
  currentIndex++;

  let questionText, correctAnswer;

  if (mode === "eng-mar") {
    questionText = q.eng;
    correctAnswer = q.mar;
  } else {
    questionText = q.mar;
    correctAnswer = q.eng;
  }

  document.getElementById("question").innerText = questionText;
  document.getElementById("hintText").innerText = "";

  let options = [correctAnswer];

  while (options.length < 4) {
    let rand = data[Math.floor(Math.random() * data.length)];
    let opt = (mode === "eng-mar") ? rand.mar : rand.eng;
    if (!options.includes(opt)) options.push(opt);
  }

  options.sort(() => Math.random() - 0.5);

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  options.forEach(opt => {
    let btn = document.createElement("button");

    btn.innerText = opt;
    btn.onclick = () => {
      playClickSound();
      checkAnswer(opt, correctAnswer);
    };

    optionsDiv.appendChild(btn);
  });
}

// ================= ANSWER CHECK =================
function checkAnswer(selected, correct) {
  if (selected === correct) {
    score++;
    streak++;
    if (sfxEnabled) playSound(correctSound);
  } else {
    streak = 0;
    if (sfxEnabled) playSound(wrongSound);
  }

  updateScore();

  // smooth transition (removes lag feel)
  setTimeout(() => {
    loadQuestion();
  }, 70);
}

// ================= SCORE =================
function updateScore() {
  document.getElementById("score").innerText = "Your Score 🎉: " + score;
  document.getElementById("streak").innerText = "Streak 🔥: " + streak;
}

// ================= OTHER =================
function skipQuestion() {
  streak = 0;
  updateScore();
  loadQuestion();
}

function showHint() {
  let hint = (mode === "eng-mar")
    ? currentQuestion.mar.charAt(0)
    : currentQuestion.eng.charAt(0);

  document.getElementById("hintText").innerText = "Hint : " + hint;
}

function openSettings() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("settings").classList.remove("hidden");
}

function goHome() {
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
}