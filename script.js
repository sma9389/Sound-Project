const contentContainer = document.getElementById('content-container');

const teamMembers = [
    { 
        id: 1, 
        name: "Shamma", 
        role: "Website Developer & Host", 
        bio: "Loves sparking meaningful conversations and ensuring every episode brings value and authenticity to our listeners.",
        image: "Shamma.png" 
    },
    { 
        id: 2, 
        name: "Jana", 
        role: "Content Creator & Sound Editor", 
        bio: "Passionate about creating seamless digital experiences and crafting the perfect soundscape for our conversations.",
        image: "Jana Barbie.png" 
    },
    { 
        id: 3, 
        name: "Hind", 
        role: "Web Specialist & Producer", 
        bio: "Combines technical expertise with creative production to make Girl Talk accessible and engaging for everyone.",
        image: "Hind.png" 
    },
    { 
        id: 4, 
        name: "Hoor", 
        role: "Creative Director & Sound Designer", 
        bio: "Oversees the creative vision and sound designing, ensuring each episode tells a compelling story.",
        image: "Hoor.png" 
    },
];

const AUDIO_PATHS = {
    'intro': 'audio/Intro final.mp3', 
    'girl-math': 'audio/Girl Math.mp3',
    'pink-tax': 'audio/PinkTax.mp3'
};

/**
 * Retrieves essential elements for the audio player.
 * @returns {Object} An object containing key player elements.
 */
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

/**
 * Formats seconds into MM:SS string.
 */
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

/**
 * Starts the intro track and shows episode choices.
 */
function startIntro() {
    const { introStartWrapper, choiceButtonsWrapper, audioSource } = getEpisodeElements();
    
    if (!introStartWrapper || !choiceButtonsWrapper || !audioSource) return;

    audioSource.src = AUDIO_PATHS.intro;
    audioSource.load();
    audioSource.currentTime = 0; 

    introStartWrapper.classList.add('hidden');
    choiceButtonsWrapper.classList.remove('hidden');

    audioSource.play().catch(e => console.error("Autoplay failed:", e));

    // Optional: Pause audio if intro finishes naturally
    audioSource.addEventListener('ended', handleIntroEnd, { once: true });
}

function handleIntroEnd() {
    const { audioSource } = getEpisodeElements();
    if (audioSource) audioSource.pause();
}

/**
 * Handles the selection of a main episode.
 */
function handleEpisodeChoice(event) {
    const episodeKey = event.currentTarget.dataset.episode;
    const { choiceButtonsWrapper, mainPlayerWrapper, audioSource, timeDisplay, progress, playBtn, pauseBtn } = getEpisodeElements();
    
    if (!episodeKey || !choiceButtonsWrapper || !mainPlayerWrapper || !audioSource) return;

    choiceButtonsWrapper.classList.add('hidden');
    mainPlayerWrapper.classList.remove('hidden');

    audioSource.src = AUDIO_PATHS[episodeKey];
    audioSource.load();
    audioSource.play().catch(e => console.error("Autoplay failed after choice:", e));
    
    if (timeDisplay) timeDisplay.textContent = '0:00 / Loading...';
    if (progress) progress.style.width = '0%';
    
    if (playBtn) playBtn.classList.add('hidden');
    if (pauseBtn) pauseBtn.classList.remove('hidden');

    audioSource.onplaying = () => { if (playBtn) playBtn.classList.add('hidden'); if (pauseBtn) pauseBtn.classList.remove('hidden'); };
    audioSource.onpause = () => { if (playBtn) playBtn.classList.remove('hidden'); if (pauseBtn) pauseBtn.classList.add('hidden'); };
    audioSource.onended = () => { if (playBtn) playBtn.classList.remove('hidden'); if (pauseBtn) pauseBtn.classList.add('hidden'); };
}

/**
 * Updates the time display and progress bar during playback.
 */
function updatePlayerState() {
    const { audioSource, timeDisplay, progress } = getEpisodeElements();
    if (!audioSource || !timeDisplay || !progress) return;

    const currentTime = audioSource.currentTime;
    const duration = audioSource.duration;

    if (isFinite(duration)) {
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    }
}

/**
 * Resets the player state back to the 'Play Intro' button.
 */
function resetPodcastPlayer() {
    const { introStartWrapper, choiceButtonsWrapper, mainPlayerWrapper, audioSource, timeDisplay, progress } = getEpisodeElements();
    
    if (audioSource) {
        audioSource.pause();
        audioSource.src = AUDIO_PATHS.intro; 
        audioSource.load();
        audioSource.currentTime = 0;
    }
    
    if (introStartWrapper) introStartWrapper.classList.remove('hidden');
    if (choiceButtonsWrapper) choiceButtonsWrapper.classList.add('hidden');
    if (mainPlayerWrapper) mainPlayerWrapper.classList.add('hidden');
    
    if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';
    if (progress) progress.style.width = '0%';
}

/**
 * Attaches event listeners for all audio controls.
 * This is called only when the 'podcast' page is rendered.
 */
function initializeAudioControls() {
    const { audioSource, playBtn, pauseBtn, startOverBtn } = getEpisodeElements();
    
    // Ensure all elements exist before attaching listeners
    if (!audioSource) return;
    
    const introStartBtn = document.getElementById('intro-start-btn');

    if (introStartBtn) introStartBtn.addEventListener('click', startIntro);
    
    document.querySelectorAll('.choice-btn').forEach(button => {
        button.addEventListener('click', handleEpisodeChoice);
    });

    if (startOverBtn) startOverBtn.addEventListener('click', resetPodcastPlayer);

    if (playBtn) playBtn.addEventListener('click', () => audioSource.play());
    if (pauseBtn) pauseBtn.addEventListener('click', () => audioSource.pause());
    
    audioSource.addEventListener('timeupdate', updatePlayerState);

    // Set initial visible state for controls
    if (playBtn) playBtn.classList.remove('hidden');
    if (pauseBtn) pauseBtn.classList.add('hidden');
}

/**
 * Utility function to clone a template.
 */
function getTemplateClone(id) {
    const template = document.getElementById(id);
    if (!template) {
        console.error(`Template with ID '${id}' not found.`);
        return document.createElement('div'); 
    }
    return template.content.cloneNode(true);
}

/**
 * Renders the 'About' page, dynamically inserting team member data.
 */
function renderAboutPage() {
    const pageClone = getTemplateClone('about-template');
    const teamGrid = pageClone.querySelector('#team-grid-placeholder');

    if (teamGrid) {
        const teamCardsFragment = document.createDocumentFragment();

        teamMembers.forEach(member => {
            const cardClone = getTemplateClone('team-card-template');

            cardClone.querySelector('[data-name-target]').textContent = member.name;
            cardClone.querySelector('[data-role-target]').textContent = member.role;
            cardClone.querySelector('[data-bio-target]').textContent = member.bio;

            const img = cardClone.querySelector('.profile-img');
            // Use the actual image path
            img.src = `photo/${member.image}`;
            img.alt = `${member.name} - ${member.role}`;

            teamCardsFragment.appendChild(cardClone);
        });

        teamGrid.innerHTML = '';
        teamGrid.appendChild(teamCardsFragment);
    }

    return pageClone;
}

/**
 * Renders the 'Behind The Scenes' page.
 */
function renderBTSPage() {
    return getTemplateClone('bts-template');
}

/**
 * Renders the 'Podcast' page.
 */
function renderPodcastPage() {
    return getTemplateClone('podcast-template');
}

/**
 * Main navigation handler.
 * @param {string} pageName - The name of the page to show ('home', 'podcast', 'about', 'bts').
 */
function showPage(pageName) {
    const homePageContent = document.getElementById('home-page');
    let shouldLoadAudioControls = false;
    let contentNode;
    
    switch(pageName) {
        case 'home':
            contentNode = homePageContent
            shouldLoadAudioControls = false; // Player is no longer here
            break;
        case 'podcast':
            contentNode = renderPodcastPage();
            shouldLoadAudioControls = true; // Player is on this page
            break;
        case 'about':
            contentNode = renderAboutPage();
            break;
        case 'bts':
            contentNode = renderBTSPage();
            break;
        default:
            contentNode = homePageContent;
            shouldLoadAudioControls = false;
        }
    
    if (!contentContainer) {
        console.error("Content container not found in HTML.");
        return; 
    }
    
    // Logic to swap content (re-inserting the original 'home-page' element if navigating back to home)
    if (pageName === 'home') {
        contentContainer.innerHTML = ''; 
        contentContainer.appendChild(homePageContent);
        homePageContent.style.display = 'block'; 
    } else if (contentContainer.firstChild !== contentNode){
        contentContainer.innerHTML = '';
        contentContainer.appendChild(contentNode);
    }

    // Initialize audio controls ONLY if the player is present (on the podcast page)
    if (shouldLoadAudioControls){
        // Ensure audio is reset and controls are initialized every time the page loads
        const { audioSource } = getEpisodeElements();
        if (audioSource) {
            audioSource.pause();
            audioSource.src = AUDIO_PATHS.intro; 
            audioSource.load();
            audioSource.currentTime = 0;
        }
        initializeAudioControls ();
    }
    
    // Update active navigation link styling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
}


/**
 * Adds a shadow to the header when the user scrolls down.
 */
function handleScrollShadow() {
    const header = document.getElementById('main-header');
    if (!header) return; 
    
    if (window.scrollY > 10) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
}


document.addEventListener('scroll', handleScrollShadow);

document.addEventListener('DOMContentLoaded',() => {
    // Set 'home' as the default active page on load
    document.querySelector('.nav-link[data-page="home"]').classList.add('active');
});
