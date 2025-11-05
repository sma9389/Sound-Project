const contentContainer = document.getElementById('content-container');

const teamMembers = [
  { id: 1, name: "Shamma", role: "Website Developer & Host", bio: "Loves sparking meaningful conversations.", image: "Shamma.png" },
  { id: 2, name: "Jana", role: "Content Creator & Sound Editor", bio: "Creates seamless digital experiences.", image: "Jana Barbie.png" },
  { id: 3, name: "Hind", role: "Web Specialist & Producer", bio: "Combines technical expertise with creativity.", image: "Hind.png" },
  { id: 4, name: "Hoor", role: "Creative Director & Sound Designer", bio: "Shapes the sound and mood of each episode.", image: "Hoor.png" }
];

const AUDIO_PATHS = {
  intro: "audio/Intro final.mp3",
  "girl-math": "audio/Girl Math.mp3",
  "pink-tax": "audio/PinkTax.mp3"
};

/* Audio DOM references */
function getEpisodeElements() {
  return {
    audioSource: document.getElementById("episode-audio-source"),
    introStartWrapper: document.getElementById("intro-start-wrapper"),
    choiceButtonsWrapper: document.getElementById("choice-buttons-wrapper"),
    mainPlayerWrapper: document.getElementById("main-player-wrapper"),
    timeDisplay: document.getElementById("time-display"),
    progress: document.querySelector("#main-player-wrapper .progress"),
    playBtn: document.getElementById("play-btn"),
    pauseBtn: document.getElementById("pause-btn"),
    startOverBtn: document.getElementById("start-over-btn"),
  };
}

/* Format time */
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

/* Start intro audio */
function startIntro() {
  const { audioSource, introStartWrapper, choiceButtonsWrapper } = getEpisodeElements();

  introStartWrapper.classList.add("hidden");
  choiceButtonsWrapper.classList.add("visible");

  audioSource.src = AUDIO_PATHS.intro;
  audioSource.currentTime = 0;
  audioSource.play();
}

/* Selecting Girl Math or Pink Tax */
function handleEpisodeChoice(event) {
  const episodeKey = event.currentTarget.dataset.episode;
  const { audioSource, choiceButtonsWrapper, mainPlayerWrapper, playBtn, pauseBtn } = getEpisodeElements();

  choiceButtonsWrapper.classList.remove("visible");
  mainPlayerWrapper.classList.remove("hidden");

  audioSource.src = AUDIO_PATHS[episodeKey];
  audioSource.play();

  playBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
}

/* Update progress bar */
function updatePlayerState() {
  const { audioSource, progress, timeDisplay } = getEpisodeElements();
  if (!audioSource.duration) return;

  progress.style.width = `${(audioSource.currentTime / audioSource.duration) * 100}%`;
  timeDisplay.textContent = `${formatTime(audioSource.currentTime)} / ${formatTime(audioSource.duration)}`;
}

/* Reset player */
function resetPodcastPlayer() {
  const {
    audioSource,
    introStartWrapper,
    choiceButtonsWrapper,
    mainPlayerWrapper,
    progress,
    timeDisplay
  } = getEpisodeElements();

  audioSource.pause();
  audioSource.src = AUDIO_PATHS.intro;

  introStartWrapper.classList.remove("hidden");
  choiceButtonsWrapper.classList.remove("visible");
  mainPlayerWrapper.classList.add("hidden");

  progress.style.width = "0%";
  timeDisplay.textContent = "0:00 / 0:00";
}

/* Initialize audio listeners */
function initializeAudioControls() {
  const {
    audioSource,
    playBtn,
    pauseBtn,
    startOverBtn
  } = getEpisodeElements();

  document.getElementById("intro-start-btn").onclick = startIntro;

  document.querySelectorAll(".choice-btn").forEach(btn => {
    btn.addEventListener("click", handleEpisodeChoice);
  });

  playBtn.onclick = () => audioSource.play();
  pauseBtn.onclick = () => audioSource.pause();
  startOverBtn.onclick = resetPodcastPlayer;

  audioSource.addEventListener("timeupdate", updatePlayerState);

  audioSource.onplaying = () => {
    playBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden");
  };

  audioSource.onpause = () => {
    playBtn.classList.remove("hidden");
    pauseBtn.classList.add("hidden");
  };
}

/* Build About Page */
function getTemplateClone(id) {
  return document.getElementById(id).content.cloneNode(true);
}

function renderAboutPage() {
  const page = getTemplateClone("about-template");
  const grid = page.querySelector("#team-grid-placeholder");

  grid.innerHTML = "";
  teamMembers.forEach(m => {
    const card = getTemplateClone("team-card-template");
    card.querySelector("[data-name-target]").textContent = m.name;
    card.querySelector("[data-role-target]").textContent = m.role;
    card.querySelector("[data-bio-target]").textContent = m.bio;
    card.querySelector(".profile-img").src = `photo/${m.image}`;
    grid.appendChild(card);
  });

  return page;
}

/* Page Routing */
function renderPodcastPage() {
  const clone = getTemplateClone("podcast-template");
  setTimeout(initializeAudioControls, 50);
  return clone;
}

function renderBTSPage() {
  return getTemplateClone("bts-template");
}

function showPage(page) {
  let node = null;

  if (page === "home") node = document.getElementById("home-page");
  if (page === "podcast") node = renderPodcastPage();
  if (page === "about") node = renderAboutPage();
  if (page === "bts") node = renderBTSPage();

  contentContainer.innerHTML = "";
  contentContainer.appendChild(node);

  document.querySelectorAll(".nav-link").forEach(a => {
    a.classList.remove("active");
    if (a.dataset.page === page) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('.nav-link[data-page="home"]').classList.add("active");
});
