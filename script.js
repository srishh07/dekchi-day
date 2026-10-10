
const scenes = Array.from(document.querySelectorAll(".scene"));
const nextButtons = document.querySelectorAll("[data-next]");
const progress = document.getElementById("progress");
const bootText = document.getElementById("bootText");
const messageTyping = document.getElementById("messageTyping");
const memoryVideo = document.getElementById("memoryVideo");
const voiceMessage = document.getElementById("voiceMessage");
const restartBtn = document.getElementById("restartBtn");

let currentScene = 0;
let typingTimer = null;
let bootStarted = false;
let messageStarted = false;

const bootMessage =
  "> locating a very special person...\n> identity confirmed: ANANYA\n> nickname detected: DEKCHI\n> loading birthday.exe ... DONE";

const surpriseMessage =
  "Out of all the things I could've made, I wanted to make you something you could actually keep. So take your time, click around, and enjoy this little corner of the internet. You deserve a surprise that feels like you.";

function typeText(element, text, speed = 28, onComplete = null) {
  clearInterval(typingTimer);
  element.textContent = "";

  let index = 0;

  typingTimer = setInterval(() => {
    element.textContent += text.charAt(index);
    index++;

    if (index >= text.length) {
      clearInterval(typingTimer);
      typingTimer = null;
      if (onComplete) onComplete();
    }
  }, speed);
}

function startBootTyping() {
  if (bootStarted) return;
  bootStarted = true;
  typeText(bootText, bootMessage, 24);
}

function startMessageTyping() {
  if (messageStarted) return;
  messageStarted = true;
  typeText(messageTyping, surpriseMessage, 24);
}

function updateProgress() {
  const percent = ((currentScene + 1) / scenes.length) * 100;
  progress.style.width = `${percent}%`;
}

function showScene(index) {
  if (index < 0 || index >= scenes.length) return;

  clearInterval(typingTimer);
  typingTimer = null;

  // Stop media when leaving its scene.
  if (currentScene !== index) {
    memoryVideo.pause();
    voiceMessage.pause();
  }

  scenes.forEach((scene, i) => {
    scene.classList.toggle("active", i === index);
    scene.setAttribute("aria-hidden", i === index ? "false" : "true");
  });

  currentScene = index;
  updateProgress();

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (index === 0) startBootTyping();
  if (index === 1) startMessageTyping();
}

nextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showScene(currentScene + 1);
  });
});

restartBtn.addEventListener("click", () => {
  bootStarted = false;
  messageStarted = false;
  bootText.textContent = "";
  messageTyping.textContent = "";

  memoryVideo.pause();
  memoryVideo.currentTime = 0;
  voiceMessage.pause();
  voiceMessage.currentTime = 0;

  showScene(0);
  startBootTyping();
});

// Start the first scene and its typing effect.
showScene(0);
