const contentContainer = document.getElementById('content-container');

const teamMembers = [
    { 
        id: 1, 
        name: "Shamma", 
        role: "Website Developer & Host", 
        bio: "Loves sparking meaningful conversations and ensuring every episode brings value and authenticity to our listeners.",
        color: "f472b6", 
        text: "SM"
    },
    { 
        id: 2, 
        name: "Jana", 
        role: "Content Creator & Sound Editor", 
        bio: "Passionate about creating seamless digital experiences and crafting the perfect soundscape for our conversations.",
        color: "c084fc", 
        text: "JA"
    },
    { 
        id: 3, 
        name: "Hind", 
        role: "Web Specialist & Producer", 
        bio: "Combines technical expertise with creative production to make Girl Talk accessible and engaging for everyone.",
        color: "f9a8d4", 
        text: "HD"
    },
    { 
        id: 4, 
        name: "Hoor", 
        role: "Creative Director & Sound Designer", 
        bio: "Oversees the creative vision and sound designing, ensuring each episode tells a compelling story.",
        color: "a855f7", 
        text: "HR"
    },
];

const AUDIO_PATHS = {
    'intro': 'audio/Intro final.mp3', 
    'girl-math': 'audio/Girl Math.mp3',
    'pink-tax': 'audio/PinkTax.mp3'
};

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
    choiceButtonsWrapper.classList.remove('hidden');

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

function initializeAudioControls() {
    const { audioSource, playBtn, pauseBtn, startOverBtn } = getEpisodeElements();
    
    const introStartBtn = document.getElementById('intro-start-btn');

    if (introStartBtn) introStartBtn.addEventListener('click', startIntro);
    
    document.querySelectorAll('.choice-btn').forEach(button => {
        button.addEventListener('click', handleEpisodeChoice);
    });

    if (startOverBtn) startOverBtn.addEventListener('click', resetPodcastPlayer);

    if (audioSource) {
        if (playBtn) playBtn.addEventListener('click', () => audioSource.play());
        if (pauseBtn) pauseBtn.addEventListener('click', () => audioSource.pause());
        audioSource.addEventListener('timeupdate', updatePlayerState);

        if (playBtn) playBtn.classList.remove('hidden');
        if (pauseBtn) pauseBtn.classList.add('hidden');
    }
}


function getTemplateClone(id) {
    const template = document.getElementById(id);
    if (!template) {
        console.error(`Template with ID '${id}' not found.`);
        return document.createElement('div'); 
    }
    return template.content.cloneNode(true);
}

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
            img.src = `https://placehold.co/150x150/${member.color}/ffffff?text=${member.text}`;
            img.alt = `${member.name} - ${member.role}`;

            teamCardsFragment.appendChild(cardClone);
        });

        teamGrid.innerHTML = '';
        teamGrid.appendChild(teamCardsFragment);
    }

    return pageClone;
}

function renderBTSPage() {
    return getTemplateClone('bts-template');
}

function showPage(pageName) {
    const homePageContent = document.getElementById('home-page');
    let shouldLoadAudioControls = false;
    let contentNode;
    switch(pageName) {
        case 'home':
            contentNode = homePageContent
            shouldLoadAudioControls = true;
            break;
        case 'about':
            contentNode = renderAboutPage();
            break;
        case 'bts':
            contentNode = renderBTSPage();
            break;
        default:
            contentNode = homePageContent;
            shouldLoadAudioControls = true;
        }
    
    

    if (!contentContainer) {
        console.error("Content container not found in HTML.");
        return; 
    }
    
    if (contentContainer.firstChild !== contentNode){
        contentContainer.innerHTML = '';
        contentContainer.appendChild(contentNode);
    }

    if (shouldLoadAudioControls){
        initializeAudioControls ();
    }
    

   
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
}


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
    initializeAudioControls();
    document.querySelector('.nav-link[data-page="home"]').classList.add('active');

    const choiceWrapper = document.getElementById('choice-buttons-wrapper');
    const delayInMilliseconds = 35000; 
    
    if (choiceWrapper) {
        setTimeout(() => {
            choiceWrapper.classList.add('visible');
        }, delayInMilliseconds);
    }
});
