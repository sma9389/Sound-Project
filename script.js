const contentContainer = document.getElementById('content-container');

// Team members data
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

// Audio functionality
let currentAudio = null;

function playAudio() {
    console.log('Playing audio...');
    // Show playing state
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.style.background = 'var(--pink-50)';
    });
}

function pauseAudio() {
    console.log('Audio paused');
}

// Idea submission functionality
function toggleIdeaBox() {
    const ideaBox = document.getElementById('idea-box');
    const thankYouMessage = document.getElementById('thank-you-message');
    
    ideaBox.classList.toggle('hidden');
    thankYouMessage.classList.add('hidden');
}

function submitIdea() {
    const ideaBox = document.getElementById('idea-box');
    const thankYouMessage = document.getElementById('thank-you-message');
    const textarea = ideaBox.querySelector('textarea');
    
    // Simple validation
    if (textarea.value.trim() === '') {
        alert('Please share your idea with us!');
        return;
    }
    
    // Hide idea box, show thank you message
    ideaBox.classList.add('hidden');
    thankYouMessage.classList.remove('hidden');
    
    // Create confetti
    createConfetti();
    
    // Clear the textarea
    textarea.value = '';
    
    // Hide thank you message after 3 seconds
    setTimeout(() => {
        thankYouMessage.classList.add('hidden');
    }, 3000);
}

// Simple confetti effect
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#ec4899', '#a855f7', '#f472b6', '#c084fc', '#f9a8d4'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        
        // Add rotation animation
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add confetti animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        0% {
            top: -10px;
            opacity: 1;
            transform: translateX(0) rotate(0deg);
        }
        100% {
            top: 100vh;
            opacity: 0;
            transform: translateX(${Math.random() * 200 - 100}px) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Template and page rendering functions
function getTemplateClone(id) {
    const template = document.getElementById(id);
    if (!template) {
        console.error(`Template with ID '${id}' not found.`);
        return document.createElement('div'); 
    }
    return template.content.cloneNode(true);
}

function renderHomePage() {
    return getTemplateClone('home-template');
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
    let contentNode;

    switch(pageName) {
        case 'home':
            contentNode = renderHomePage();
            break;
        case 'about':
            contentNode = renderAboutPage();
            break;
        case 'bts':
            contentNode = renderBTSPage();
            break;
        default:
            contentNode = renderHomePage();
    }

    contentContainer.innerHTML = '';
    contentContainer.appendChild(contentNode);

    // Update active navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });

    // Close idea box when changing pages
    const ideaBox = document.getElementById('idea-box');
    const thankYouMessage = document.getElementById('thank-you-message');
    if (ideaBox) ideaBox.classList.add('hidden');
    if (thankYouMessage) thankYouMessage.classList.add('hidden');
}

// Initialize the page
window.onload = () => {
    showPage('home');
};

// Close idea box when clicking outside
document.addEventListener('click', function(e) {
    const ideaBox = document.getElementById('idea-box');
    const ideaBtn = document.querySelector('.idea-btn');
    
    if (ideaBox && !ideaBox.contains(e.target) && !ideaBtn.contains(e.target)) {
        ideaBox.classList.add('hidden');
    }
});
