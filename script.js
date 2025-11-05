/* Main Content Container */
const contentContainer = document.getElementById('content-container');

/* Team Members Data */
const teamMembers = [
  { id: 1, name: "Shamma", role: "Website Developer & Host", bio: "Loves sparking meaningful conversations and ensuring every episode brings value and authenticity.", image: "Shamma.png" },
  { id: 2, name: "Jana", role: "Content Creator & Sound Editor", bio: "Passionate about creating seamless digital experiences and crafting perfect sound.", image: "Jana Barbie.png" },
  { id: 3, name: "Hind", role: "Web Specialist & Producer", bio: "Combines technical expertise with creative production.", image: "Hind.png" },
  { id: 4, name: "Hoor", role: "Creative Director & Sound Designer", bio: "Ensures each episode tells a compelling story.", image: "Hoor.png" },
];

/* Audio Paths */
const AUDIO_PATHS = {
  intro: 'audio/Intro final.mp3',
  'girl-math': 'audio/Girl Math.mp3',
  'pink-tax': 'audio/PinkTax.mp3'
};

/* Extract Audio Elements */
function getEpisodeElements() {
  return {
    audioSource: document.getElementById('episode-audio-source'),
    introStartWrapper: document.getElementById('intro-start-wrapper'),
    choiceButtonsWrapper: document.getElementById('choice-buttons-wrapper'),
    mainPlayerWrapper: document.getElementById('main-player-wrapper'),
    timeDisplay: document.getElementById('time-display'),
    progress: document.querySelector('#main-player-wrapper .progress'),
    playBtn: document.getElementById('play-btn'),
    pauseBtn: document.getElementById('pause-btn'),
    startOverBtn: document.getElementById('start-over-btn')
  };
}

/* Format Time to mm:ss */
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

/* Start Intro */
function startIntro() {
  const { introStartWrapper, choiceButtonsWrapper, audioSource } = getEpisodeElements();

  audioSource.src = AUDIO_PATHS.intro;
  audioSource.load();
  audioSource.currentTime = 0;

  introStartWrapper.classList.add('hidden');
  choiceButtonsWrapper.classList.add('visible');

  audioSource.play().catch(() => {});
  audioSource.addEventListener('ended', () => audioSource.pause(), { once: true });
}

/* Handle Episode Choice */
function handleEpisodeChoice(event) {
  const episodeKey = event.currentTarget.dataset.episode;
  const { choiceButtonsWrapper, mainPlayerWrapper, audioSource, timeDisplay, progress, playBtn, pauseBtn } = getEpisodeElements();

  choiceButtonsWrapper.classList.remove('visible');
  mainPlayerWrapper.classList.remove('hidden');

  audioSource.src = AUDIO_PATHS[episodeKey];
  audioSource.load();
  audioSource.play().catch(() => {});

  timeDisplay.textContent = "0:00 / Loading...";
  progress.style.width = "0%";

  playBtn.classList.add('hidden');
  pauseBtn.classList.remove('hidden');

  audioSource.onplaying = () => { playBtn.classList.add('hidden'); pauseBtn.classList.remove('hidden'); };
  audioSource.onpause = () => { playBtn.classList.remove('hidden'); pauseBtn.classList.add('hidden'); };
  audioSource.onended = () => { playBtn.classList.remove('hidden'); pauseBtn.classList.add('hidden'); };
}

/* Update Audio Progress */
function updatePlayerState() {
  const { audioSource, timeDisplay, progress } = getEpisodeElements();

  if (!audioSource.duration || !isFinite(audioSource.duration)) return;

  timeDisplay.textContent = `${formatTime(audioSource.currentTime)} / ${formatTime(audioSource.duration)}`;
  progress.style.width = `${(audioSource.currentTime / audioSource.duration) * 100}%`;
}

/* Reset Player */
function resetPodcastPlayer() {
  const { introStartWrapper, choiceButtonsWrapper, mainPlayerWrapper, audioSource, timeDisplay, progress } = getEpisodeElements();

  audioSource.pause();
  audioSource.src = AUDIO_PATHS.intro;
  audioSource.load();
  audioSource.currentTime = 0;

  introStartWrapper.classList.remove('hidden');
  choiceButtonsWrapper.classList.remove('visible');
  mainPlayerWrapper.classList.add('hidden');

  timeDisplay.textContent = "0:00 / 0:00";
  progress.style.width = "0%";
}

/* Initialize Podcast Audio Controls */
function initializeAudioControls() {
  const { audioSource, playBtn, pauseBtn, startOverBtn } = getEpisodeElements();

  const introStartBtn = document.getElementById('intro-start-btn');
  introStartBtn.addEventListener('click', startIntro);

  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', handleEpisodeChoice);
  });

  playBtn.addEventListener('click', () => audioSource.play());
  pauseBtn.addEventListener('click', () => audioSource.pause());
  startOverBtn.addEventListener('click', resetPodcastPlayer);

  audioSource.addEventListener('timeupdate', updatePlayerState);
}

/* Clone Templates */
function getTemplateClone(id) {
  return document.getElementById(id).content.cloneNode(true);
}

/* Render About Page */
function renderAboutPage() {
  const page = getTemplateClone('about-template');
  const teamGrid = page.querySelector('#team-grid-placeholder');

  teamGrid.innerHTML = "";

  teamMembers.forEach(member => {
    const card = getTemplateClone('team-card-template');
    card.querySelector('.profile-img').src = `photo/${member.image}`;
    card.querySelector('[data-name-target]').textContent = member.name;
    card.querySelector('[data-role-target]').textContent = member.role;
    card.querySelector('[data-bio-target]').textContent = member.bio;

    teamGrid.appendChild(card);
  });

  return page;
}

/* Render BTS Page */
function renderBTSPage() {
  return getTemplateClone('bts-template');
}

/* Render Podcast Page */
function renderPodcastPage() {
  return getTemplateClone('podcast-template');
}

/* Navigation Handler */
function showPage(pageName) {
  const homePage = document.getElementById('home-page');
  let content;

  if (pageName === "home") content = homePage;
  if (pageName === "podcast") content = renderPodcastPage();
  if (pageName === "about") content = renderAboutPage();
  if (pageName === "bts") content = renderBTSPage();

  contentContainer.innerHTML = "";
  contentContainer.appendChild(content);

  if (pageName === "podcast") {
    const { audioSource } = getEpisodeElements();
    audioSource.pause();
    audioSource.src = AUDIO_PATHS.intro;
    audioSource.load();
    initializeAudioControls();
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageName);
  });
}

/* Header Shadow On Scroll */
function handleScrollShadow() {
  const header = document.getElementById('main-header');
  if (window.scrollY > 10) header.classList.add("header-scrolled");
  else header.classList.remove("header-scrolled");
}

document.addEventListener('scroll', handleScrollShadow);

/* Set Home as Active on Load */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.nav-link[data-page="home"]').classList.add('active');
});
