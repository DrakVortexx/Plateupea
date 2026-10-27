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

    // Allow Enter key to login
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('password').focus();
        }
    });
}

async function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showError('Please enter username and password');
        return;
    }

    if (username.length < 3) {
        showError('Username must be at least 3 characters');
        return;
    }

    if (password.length < 4) {
        showError('Password must be at least 4 characters');
        return;
    }

    // Mock login for now
    mockLogin(username);
}

async function handleRegister() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showError('Please enter username and password');
        return;
    }

    if (username.length < 3) {
        showError('Username must be at least 3 characters');
        return;
    }

    if (password.length < 4) {
        showError('Password must be at least 4 characters');
        return;
    }

    // Mock registration for now
    mockLogin(username);
}

function mockLogin(username) {
    // Create mock player
    if (typeof GameState === 'undefined') {
        window.GameState = {
            player: null,
            character: null,
            socket: null,
            otherPlayers: new Map(),
            inventory: [],
            stashes: [],
            currentQuests: [],
            team: null
        };
    }
    
    GameState.player = {
        id: 'mock-player-id-' + Date.now(),
        username: username
    };

    // Create mock character
    GameState.character = {
        id: 'char-' + Date.now(),
        name: username,
        level: 1,
        experience: 0,
        hp: CONFIG.START_HP || 150,
        max_hp: CONFIG.START_HP || 150,
        mana: CONFIG.START_MANA || 50,
        max_mana: CONFIG.START_MANA || 50,
        money: CONFIG.START_MONEY || 200,
        x: 2500,
        y: 2500,
        biome: 'forest',
        skillPoints: 0,
        class: 'warrior'
    };

    // Give starting items
    GameState.inventory = [
        {
            id: 'starter-sword',
            name: 'Rusty Blade',
            description: 'A weathered blade for beginners',
            rarity: 'common',
            type: 'weapon',
            base_value: 50,
            damage: 12,
            defense: 0,
            quantity: 1,
            stackable: false,
            rarityData: CONFIG.RARITIES.common
        },
        {
            id: 'health-potion',
            name: 'Health Potion',
            description: 'Restores 60 HP',
            rarity: 'common',
            type: 'consumable',
            base_value: 25,
            heal: 60,
            quantity: 5,
            stackable: true,
            rarityData: CONFIG.RARITIES.common
        }
    ];

    // Save to localStorage
    localStorage.setItem('player', JSON.stringify(GameState.player));
    localStorage.setItem('character', JSON.stringify(GameState.character));
    localStorage.setItem('inventory', JSON.stringify(GameState.inventory));

    // Show HUD and start game
    showHUD();
    updateHUD();
    startPhaser();
    
    showNotification('Welcome to Platopia! Use WASD to move, SPACE to attack!');
}

function showError(message) {
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = message;
    errorEl.style.animation = 'none';
    setTimeout(() => {
        errorEl.style.animation = 'shake 0.5s ease-in-out';
    }, 10);
}

function startPhaser() {
    if (typeof Phaser === 'undefined') {
        console.error('Phaser not loaded');
        return;
    }
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: 'game-container',
        backgroundColor: '#0a1a0a',
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
        },
        pixelArt: false,
        antialias: true
    };

    game = new Phaser.Game(config);
}

// Alias for compatibility
if (typeof initPhaser === 'undefined') {
    window.initPhaser = startPhaser;
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
