/* Team data */
const teamMembers = [
  { name: "Shamma", role: "Website Developer & Host", bio: "Loves sparking meaningful conversations.", image: "Shamma.png" },
  { name: "Jana", role: "Content Creator & Sound Editor", bio: "Creates seamless digital experiences.", image: "Jana Barbie.png" },
  { name: "Hind", role: "Web Specialist & Producer", bio: "Combines tech with creative work.", image: "Hind.png" },
  { name: "Hoor", role: "Creative Director & Sound Designer", bio: "Ensures each episode tells a story.", image: "Hoor.png" }
];

/* Audio paths */
const AUDIO_PATHS = {
  intro: 'audio/Intro final.mp3',
  'girl-math': 'audio/Girl Math.mp3',
  'pink-tax': 'audio/PinkTax.mp3'
};

/* Helper: get all audio elements */
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

/* Format time */
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

/* Play intro */
function startIntro() {
  const { introStartWrapper, choiceButtonsWrapper, audioSource } = getEpisodeElements();
  audioSource.src = AUDIO_PATHS.intro;
  audioSource.currentTime = 0;
  audioSource.play();

  introStartWrapper.classList.add('hidden');
  choiceButtonsWrapper.classList.add('visible');

  audioSource.addEventListener('ended', () => audioSource.pause(), { once: true });
}

/* Handle episode choice */
function handleEpisodeChoice(event) {
  const episodeKey = event.currentTarget.dataset.episode;
  const { choiceButtonsWrapper, mainPlayerWrapper, audioSource, timeDisplay, progress, playBtn, pauseBtn } = getEpisodeElements();

  choiceButtonsWrapper.classList.remove('visible');
  mainPlayerWrapper.classList.remove('hidden');

  audioSource.src = AUDIO_PATHS[episodeKey];
  audioSource.load();
  audioSource.play();

  playBtn.classList.add('hidden');
  pauseBtn.classList.remove('hidden');

  audioSource.onplaying = () => { playBtn.classList.add('hidden'); pauseBtn.classList.remove('hidden'); };
  audioSource.onpause = () => { playBtn.classList.remove('hidden'); pauseBtn.classList.add('hidden'); };
}

/* Update time+progress */
function updatePlayerState() {
  const { audioSource, timeDisplay, progress } = getEpisodeElements();
  if (!audioSource.duration) return;
  timeDisplay.textContent = `${formatTime(audioSource.currentTime)} / ${formatTime(audioSource.duration)}`;
  progress.style.width = `${(audioSource.currentTime / audioSource.duration) * 100}%`;
}

/* Reset player */
function resetPodcastPlayer() {
  const { introStartWrapper, choiceButtonsWrapper, mainPlayerWrapper, audioSource, timeDisplay, progress } = getEpisodeElements();

  audioSource.pause();
  audioSource.src = AUDIO_PATHS.intro;
  audioSource.currentTime = 0;

  introStartWrapper.classList.remove('hidden');
  choiceButtonsWrapper.classList.remove('visible');
  mainPlayerWrapper.classList.add('hidden');

  timeDisplay.textContent = '0:00 / 0:00';
  progress.style.width = '0%';
}

/* Init audio buttons */
function initializeAudioControls() {
  const { audioSource, playBtn, pauseBtn, startOverBtn } = getEpisodeElements();

  document.getElementById('intro-start-btn').addEventListener('click', startIntro);
  document.querySelectorAll('.choice-btn').forEach(btn => btn.addEventListener('click', handleEpisodeChoice));

  startOverBtn.addEventListener('click', resetPodcastPlayer);
  playBtn.addEventListener('click', () => audioSource.play());
  pauseBtn.addEventListener('click', () => audioSource.pause());

  audioSource.addEventListener('timeupdate', updatePlayerState);
}

/* Render About page */
function renderAboutPage() {
  const page = document.getElementById('about-template').content.cloneNode(true);
  const teamGrid = page.querySelector('#team-grid-placeholder');

  teamMembers.forEach(member => {
    const card = document.getElementById('team-card-template').content.cloneNode(true);
    card.querySelector('[data-name-target]').textContent = member.name;
    card.querySelector('[data-role-target]').textContent = member.role;
    card.querySelector('[data-bio-target]').textContent = member.bio;
    card.querySelector('.profile-img').src = `photo/${member.image}`;
    teamGrid.appendChild(card);
  });

  return page;
}

/* Page navigation */
function renderPodcastPage() {
  return document.getElementById('podcast-template').content.cloneNode(true);
}

function renderBTSPage() {
  return document.getElementById('bts-template').content.cloneNode(true);
}

function showPage(pageName) {
  const contentContainer = document.getElementById('content-container');
  const homePageContent = document.getElementById('home-page');
  let contentNode;
  let loadAudio = false;

  if (pageName === 'home') {
    contentNode = homePageContent;
  } else if (pageName === 'podcast') {
    contentNode = renderPodcastPage();
    loadAudio = true;
  } else if (pageName === 'about') {
    contentNode = renderAboutPage();
  } else if (pageName === 'bts') {
    contentNode = renderBTSPage();
  }

  contentContainer.innerHTML = '';
  contentContainer.appendChild(contentNode);

  if (loadAudio) initializeAudioControls();

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageName) link.classList.add('active');
  });
}

/* Header shadow */
function handleScrollShadow() {
  const header = document.getElementById('main-header');
  if (window.scrollY > 10) header.classList.add('header-scrolled');
  else header.classList.remove('header-scrolled');
}
document.addEventListener('scroll', handleScrollShadow);

/* Default active tab */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.nav-link[data-page="home"]').classList.add('active');
});
