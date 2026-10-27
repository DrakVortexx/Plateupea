// Game State
const GameState = {
    player: null,
    character: null,
    socket: null,
    otherPlayers: new Map(),
    inventory: [],
    stashes: [],
    currentQuests: [],
    team: null
};

// Initialize game
function initGame() {
    // Check if user is logged in
    const savedPlayer = localStorage.getItem('player');
    if (savedPlayer) {
        GameState.player = JSON.parse(savedPlayer);
        showHUD();
        startGame();
    } else {
        showLogin();
    }
}

// Show login screen
function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('hud').classList.add('hidden');
}

// Show HUD
function showHUD() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
}

// Start game
function startGame() {
    initSupabase();
    connectSocket();
    initPhaser();
}

// Connect to socket
function connectSocket() {
    GameState.socket = io(CONFIG.SOCKET_URL);

    GameState.socket.on('connect', () => {
        console.log('Connected to server');
        if (GameState.character) {
            GameState.socket.emit('player_join', {
                characterId: GameState.character.id,
                x: GameState.character.x,
                y: GameState.character.y
            });
        }
    });

    GameState.socket.on('player_update', (data) => {
        updateOtherPlayer(data);
    });

    GameState.socket.on('player_leave', (data) => {
        removeOtherPlayer(data.characterId);
    });

    GameState.socket.on('world_update', (data) => {
        updateWorld(data);
    });

    GameState.socket.on('pvp_damage', (data) => {
        handlePvPDamage(data);
    });
}

// Update other player
function updateOtherPlayer(data) {
    if (data.characterId === GameState.character.id) return;

    if (!GameState.otherPlayers.has(data.characterId)) {
        GameState.otherPlayers.set(data.characterId, {
            x: data.x,
            y: data.y,
            name: data.name,
            level: data.level
        });
    } else {
        const player = GameState.otherPlayers.get(data.characterId);
        player.x = data.x;
        player.y = data.y;
    }
}

// Remove other player
function removeOtherPlayer(characterId) {
    GameState.otherPlayers.delete(characterId);
}

// Update world
function updateWorld(data) {
    // Handle world updates from server
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Update HUD
function updateHUD() {
    if (!GameState.character) return;

    document.getElementById('player-name').textContent = GameState.character.name;
    document.getElementById('player-level').textContent = `Level ${GameState.character.level}`;
    document.getElementById('health-text').textContent = `${GameState.character.hp}/${GameState.character.max_hp}`;
    document.getElementById('health-fill').style.width = `${(GameState.character.hp / GameState.character.max_hp) * 100}%`;
    document.getElementById('money-display').textContent = GameState.character.money;

    const xpForLevel = getXPForLevel(GameState.character.level);
    const xpProgress = (GameState.character.experience % xpForLevel) / xpForLevel * 100;
    document.getElementById('xp-text').textContent = `${GameState.character.experience}/${xpForLevel} XP`;
    document.getElementById('xp-fill').style.width = `${xpProgress}%`;
}

// Get XP required for level
function getXPForLevel(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Save character data
function saveCharacter() {
    if (GameState.character) {
        localStorage.setItem('character', JSON.stringify(GameState.character));
    }
}

// Handle PvP damage from server
function handlePvPDamage(data) {
    if (data.characterId === GameState.character.id) {
        // Apply damage
        const actualDamage = Math.max(1, data.damage);
        GameState.character.hp -= actualDamage;

        showNotification(`Took ${actualDamage} damage from PvP!`);
        updateHUD();

        // Check for death
        if (GameState.character.hp <= 0) {
            handleDeath();
        }
    }
}

// Handle death
function handleDeath() {
    showNotification('You died! Respawning with nothing...');

    // Reset character
    GameState.character.x = 500;
    GameState.character.y = 500;
    GameState.character.hp = GameState.character.max_hp;
    GameState.character.money = CONFIG.START_MONEY;
    GameState.character.biome = 'forest';

    // Clear inventory
    GameState.inventory = [];

    // Give starting item
    GameState.inventory.push({
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
    });

    saveCharacter();
    updateHUD();

    // Reload page to reset game state
    setTimeout(() => {
        location.reload();
    }, 2000);
}
