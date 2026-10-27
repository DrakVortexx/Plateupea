// Tutorial System
let currentTutorialStep = 1;
const totalTutorialSteps = 4;

function initTutorial() {
    const tutorial = document.getElementById('tutorial');
    if (!tutorial) return;
    
    // Show tutorial for new players
    const hasSeenTutorial = localStorage.getItem('platopia_tutorial_seen');
    if (!hasSeenTutorial) {
        tutorial.classList.remove('hidden');
        setupTutorialHandlers();
    }
}

function setupTutorialHandlers() {
    const nextBtn = document.getElementById('tutorial-next');
    const prevBtn = document.getElementById('tutorial-prev');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentTutorialStep < totalTutorialSteps) {
                document.querySelector(`.tutorial-step[data-step="${currentTutorialStep}"]`).classList.remove('active');
                currentTutorialStep++;
                document.querySelector(`.tutorial-step[data-step="${currentTutorialStep}"]`).classList.add('active');
                updateTutorialNav();
            } else {
                closeTutorial();
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentTutorialStep > 1) {
                document.querySelector(`.tutorial-step[data-step="${currentTutorialStep}"]`).classList.remove('active');
                currentTutorialStep--;
                document.querySelector(`.tutorial-step[data-step="${currentTutorialStep}"]`).classList.add('active');
                updateTutorialNav();
            }
        });
    }
}

function updateTutorialNav() {
    const counter = document.getElementById('tutorial-counter');
    const nextBtn = document.getElementById('tutorial-next');
    const prevBtn = document.getElementById('tutorial-prev');
    
    if (counter) counter.textContent = `${currentTutorialStep} / ${totalTutorialSteps}`;
    if (prevBtn) prevBtn.style.display = currentTutorialStep === 1 ? 'none' : 'block';
    if (nextBtn) {
        nextBtn.textContent = currentTutorialStep === totalTutorialSteps ? 'Got it!' : 'Next';
    }
}

function closeTutorial() {
    const tutorial = document.getElementById('tutorial');
    if (tutorial) {
        tutorial.classList.add('hidden');
    }
    localStorage.setItem('platopia_tutorial_seen', 'true');
}

// Initialize tutorial when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initTutorial, 1000);
});
