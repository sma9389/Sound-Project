const contentContainer = document.getElementById('content-container');

const teamMembers = [
  { id: 1, name: "Shamma", role: "Website Developer & Host", bio: "Loves sparking meaningful conversations and ensuring every episode brings value and authenticity to our listeners.", image: "Shamma.png" },
  { id: 2, name: "Jana",   role: "Content Creator & Sound Editor", bio: "Passionate about creating seamless digital experiences and crafting the perfect soundscape for our conversations.", image: "Jana Barbie.png" },
  { id: 3, name: "Hind",   role: "Web Specialist & Producer", bio: "Combines technical expertise with creative production to make Girl Talk accessible and engaging for everyone.", image: "Hind.png" },
  { id: 4, name: "Hoor",   role: "Creative Director & Sound Designer", bio: "Oversees the creative vision and sound designing, ensuring each episode tells a compelling story.", image: "Hoor.png" },
];

const AUDIO_PATHS = {
  intro: 'audio/Intro final.mp3',
  'girl-math': 'audio/Girl Math.mp3',
  'pink-tax': 'audio/PinkTax.mp3'
};

/* -------- Audio Helpers -------- */
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

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function startIntro() {
  const { introStartWrapper, choiceButtonsWrapper, audioSource } = getEpisodeElements();
  if (!introStartWrapper || !choiceButtonsWrapper || !audioSource) return;

  audioSource.src = AUDIO_PATHS.intro;
  audioSource.load();
  audioSource.currentTime = 0;

  introStartWrapper.classList.add('hidden');
  choiceButtonsWrapper.classList.add('visible');  // show choices

  audioSource.play().catch(e => console.error("Autoplay failed:", e));
  audioSource.addEventListener('ended', handleIntroEnd, { once: true });
}

function handleIntroEnd() {
  const { audioSource } = getEpisodeElements();
  if (audioSource) audioSource.pause();
}

function handleEpisodeChoice(event) {
  const episodeKey = event.currentTarget.dataset.episode;
  const { choiceButtonsWrapper, mainPlayerWrapper, audioSource, timeDisplay, progress, playBtn, pauseBtn } = getEpisodeElements();
  if (!episodeKey || !choiceButtonsWrapper || !mainPlayerWrapper || !audioSource) return;

  choiceButtonsWrapper.classList.remove('visible'); // hide choices
  mainPlayerWrapper.classList.remove('hidden');     // show player

  audioSource.src = AUDIO_PATHS[episodeKey];
  audioSource.load();
  audioSource.play().catch(e => console.error("Autoplay failed after choice:", e));

  if (timeDisplay) timeDisplay.textContent = '0:00 / Loading...';
  if (progress) progress.style.width = '0%';
  if (playBtn) playBtn.classList.add('hidden');
  if (pauseBtn) pauseBtn.classList.remove('hidden');

  audioSource.onplaying = () => { playBtn?.classList.add('hidden'); pauseBtn?.classList.remove('hidden'); };
  audioSource.onpause   = () => { playBtn?.classList.remove('hidden'); pauseBtn?.classList.add('hidden'); };
  audioSource.onended   = () => { playBtn?.classList.remove('hidden'); pauseBtn?.classList.add('hidden'); };
}

function updatePlayerState() {
  const { audioSource, timeDisplay, progress } = getEpisodeElements();
  if (!audioSource || !timeDisplay || !progress) return;

  const currentTime = audioSource.currentTime;
  const duration = audioSource.duration;

  if (isFinite(duration)) {
    timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    progress.style.width = `${(currentTime / duration) * 100}%`;
  }
}

function resetPodcastPlayer() {
  const { introStartWrapper, choiceButtonsWrapper, mainPlayerWrapper, audioSource, timeDisplay, progress } = getEpisodeElements();

  if (audioSource) {
    audioSource.pause();
    audioSource.src = AUDIO_PATHS.intro;
    audioSource.load();
    audioSource.currentTime = 0;
  }

  introStartWrapper?.classList.remove('hidden');
  choiceButtonsWrapper?.classList.remove('visible');
  mainPlayerWrapper?.classList.add('hidden');

  if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';
  if (progress) progress.style.width = '0%';
}

function initializeAudioControls() {
  const { audioSource, playBtn, pauseBtn, startOverBtn } = getEpisodeElements();
  if (!audioSource) return;

  const introStartBtn = document.getElementById('intro-start-btn');
  introStartBtn?.addEventListener('click', startIntro);

  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', handleEpisodeChoice);
  });

  startOverBtn?.addEventListener('click', resetPodcastPlayer);
  playBtn?.addEventListener('click', () => audioSource.play());
  pauseBtn?.addEventListener('click', () => audioSource.pause());

  audioSource.addEventListener('timeupdate', updatePlayerState);

  audioSource.addEventListener('loadedmetadata', () => {
    const { timeDisplay, progress } = getEpisodeElements();
    if (timeDisplay && isFinite(audioSource.duration)) {
      timeDisplay.textContent = `0:00 / ${formatTime(audioSource.duration)}`;
    } else if (timeDisplay) {
      timeDisplay.textContent = '0:00 / 0:00';
    }
    progress && (progress.style.width = '0%');
    playBtn?.classList.remove('hidden');
    pauseBtn?.classList.add('hidden');
  });

  audioSource.addEventListener('error', () => {
    const { timeDisplay } = getEpisodeElements();
    if (timeDisplay) timeDisplay.textContent = 'Audio failed to load';
  });

  playBtn?.classList.remove('hidden');
  pauseBtn?.classList.add('hidden');
}

/* -------- Page Rendering -------- */
function getTemplateClone(id) {
  const template = document.getElementById(id);
  if (!template) {
    console.error(`Template with ID '${id}' not found.`);
    return document.createElement('div');
  }
  return template.content.cloneNode(true);
}

function renderAboutPage() {
  const page = getTemplateClone('about-template');
  const teamGrid = page.querySelector('#team-grid-placeholder');
  if (teamGrid) {
    const frag = document.createDocumentFragment();
    teamMembers.forEach(member => {
      const card = getTemplateClone('team-card-template');
      card.querySelector('[data-name-target]').textContent = member.name;
      card.querySelector('[data-role-target]').textContent = member.role;
      card.querySelector('[data-bio-target]').textContent = member.bio;

      const img = card.querySelector('.profile-img');
      img.src = `photo/${member.image}`;
      img.alt = `${member.name} - ${member.role}`;
      frag.appendChild(card);
    });
    teamGrid.innerHTML = '';
    teamGrid.appendChild(frag);
  }
  return page;
}

function renderBTSPage() { return getTemplateClone('bts-template'); }
function renderPodcastPage() { return getTemplateClone('podcast-template'); }

function showPage(pageName) {
  const homePageContent = document.getElementById('home-page');
  let shouldLoadAudioControls = false;
  let contentNode;

  switch (pageName) {
    case 'home':    contentNode = homePageContent; break;
    case 'podcast': contentNode = renderPodcastPage(); shouldLoadAudioControls = true; break;
    case 'about':   contentNode = renderAboutPage(); break;
    case 'bts':     contentNode = renderBTSPage(); break;
    default:        contentNode = homePageContent;
  }

  if (!contentContainer) { console.error("Content container not found."); return; }

  if (pageName === 'home') {
    contentContainer.innerHTML = '';
    contentContainer.appendChild(homePageContent);
    homePageContent.style.display = 'block';
  } else if (contentContainer.firstChild !== contentNode) {
    contentContainer.innerHTML = '';
    contentContainer.appendChild(contentNode);
  }

  if (shouldLoadAudioControls) {
    const { audioSource } = getEpisodeElements();
    if (audioSource) {
      audioSource.pause();
      audioSource.src = AUDIO_PATHS.intro;
      audioSource.load();
      audioSource.currentTime = 0;
    }
    initializeAudioControls();
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageName) link.classList.add('active');
  });
}

/* Header shadow on scroll */
function handleScrollShadow() {
  const header = document.getElementById('main-header');
  if (!header) return;
  if (window.scrollY > 10) header.classList.add('header-scrolled');
  else header.classList.remove('header-scrolled');
}
document.addEventListener('scroll', handleScrollShadow);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.nav-link[data-page="home"]')?.classList.add('active');
});
