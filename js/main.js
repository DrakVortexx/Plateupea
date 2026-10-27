// Main Entry Point
let game = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Setup login handlers
    setupLoginHandlers();

    // Initialize game
    initGame();
});

function setupLoginHandlers() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    loginBtn.addEventListener('click', handleLogin);
    registerBtn.addEventListener('click', handleRegister);
}

async function handleLogin() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
        showError('Please fill in all fields');
        return;
    }

    // Mock login for now
    mockLogin(username);
}

async function handleRegister() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
        showError('Please fill in all fields');
        return;
    }

    // Mock registration for now
    mockLogin(username);
}

function mockLogin(username) {
    // Create mock player
    GameState.player = {
        id: 'mock-player-id',
        username: username,
        email: document.getElementById('email').value
    };

    // Create mock character
    GameState.character = {
        id: 'mock-character-id',
        name: username,
        level: 1,
        experience: 0,
        hp: CONFIG.START_HP,
        max_hp: CONFIG.START_HP,
        money: CONFIG.START_MONEY,
        x: 500,
        y: 500,
        biome: 'forest'
    };

    // Give starting items
    GameState.inventory = [
        {
            id: 'wood-axe',
            name: 'Wood Axe',
            description: 'A basic axe for chopping wood and combat',
            rarity: 'common',
            type: 'weapon',
            base_value: 10,
            damage: 5,
            defense: 0,
            quantity: 1,
            stackable: false
        }
    ];

    // Save to localStorage
    localStorage.setItem('player', JSON.stringify(GameState.player));
    localStorage.setItem('character', JSON.stringify(GameState.character));

    // Show HUD and start game
    showHUD();
    updateHUD();
    startPhaser();
}

function showError(message) {
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = message;
}

function startPhaser() {
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: 'game-container',
        backgroundColor: '#1a1a2e',
        scene: [MainScene, UIScene],
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    };

    game = new Phaser.Game(config);
}

// Handle window resize
window.addEventListener('resize', () => {
    if (game) {
        game.scale.resize(window.innerWidth, window.innerHeight);
    }
});

// Auto-save character data every 30 seconds
setInterval(() => {
    saveCharacter();
}, 30000);
