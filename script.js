const contentContainer = document.getElementById('content-container');


const teamMembers = [
    { id: 1, name: "Shamma", role: "Website Developer", bio: "Just in case if we need a bio", color: "f472b6", text: "SM" },
    { id: 2, name: "Jana", role: "idk", bio: "Just a placeholder bio", color: "c084fc", text: "JA" },
    { id: 3, name: "Hind", role: "Web Specialist", bio: "just a placeholder", color: "f9a8d4", text: "HD" },
    { id: 4, name: "Hoor", role: "idkt", bio: "just a placeholder", color: "a855f7", text: "HR" },
];


function getTemplateClone(id) {
    const template = document.getElementById(id);
    if (!template) {
        console.error(`Template with ID '${id}' not found.`);
        return document.createElement('div'); 
    }
    
    // NOTE: Use .content to access the template's DOM tree
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
            img.alt = member.name;

            teamCardsFragment.appendChild(cardClone);
        });

        
        teamGrid.innerHTML = ''; // Clear placeholder content
        teamGrid.appendChild(teamCardsFragment);
    }

    return pageClone;
}

// Fixed missing function closing brace and comment for renderBTSPage
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


    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
}

// FIX: This function was commented out or misplaced. 
// It MUST run on page load to display the default content.
window.onload = () => {
    showPage('home');
};