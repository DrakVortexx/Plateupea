// Map System
let mapCanvas = null;
let mapCtx = null;

function loadMap() {
    mapCanvas = document.getElementById('map-canvas');
    mapCtx = mapCanvas.getContext('2d');

    // Set canvas size
    mapCanvas.width = 600;
    mapCanvas.height = 600;

    drawMap();
}

function drawMap() {
    if (!mapCtx) return;

    // Clear canvas
    mapCtx.fillStyle = '#1a1a2e';
    mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

    // Draw biomes
    const scale = mapCanvas.width / CONFIG.WORLD_WIDTH;

    // Safe zone
    mapCtx.fillStyle = 'rgba(65, 105, 225, 0.5)';
    mapCtx.fillRect(100 * scale, 100 * scale, 800 * scale, 800 * scale);

    // Desert
    mapCtx.fillStyle = 'rgba(210, 105, 30, 0.5)';
    mapCtx.fillRect(2000 * scale, 2000 * scale, 1500 * scale, 1500 * scale);

    // Snow
    mapCtx.fillStyle = 'rgba(255, 250, 250, 0.5)';
    mapCtx.fillRect(5000 * scale, 3000 * scale, 2000 * scale, 2000 * scale);

    // Jungle
    mapCtx.fillStyle = 'rgba(0, 100, 0, 0.5)';
    mapCtx.fillRect(3000 * scale, 6000 * scale, 1800 * scale, 1800 * scale);

    // Mountains
    mapCtx.fillStyle = 'rgba(128, 128, 128, 0.5)';
    mapCtx.fillRect(7000 * scale, 5000 * scale, 1500 * scale, 1500 * scale);

    // Plains
    mapCtx.fillStyle = 'rgba(144, 238, 144, 0.5)';
    mapCtx.fillRect(4000 * scale, 4000 * scale, 2000 * scale, 2000 * scale);

    // Swamp
    mapCtx.fillStyle = 'rgba(85, 107, 47, 0.5)';
    mapCtx.fillRect(6000 * scale, 2000 * scale, 1500 * scale, 1500 * scale);

    // Draw player position
    if (GameState.character) {
        const playerX = GameState.character.x * scale;
        const playerY = GameState.character.y * scale;

        mapCtx.fillStyle = '#e94560';
        mapCtx.beginPath();
        mapCtx.arc(playerX, playerY, 5, 0, Math.PI * 2);
        mapCtx.fill();

        // Draw player name
        mapCtx.fillStyle = '#ffffff';
        mapCtx.font = '12px Arial';
        mapCtx.textAlign = 'center';
        mapCtx.fillText(GameState.character.name, playerX, playerY - 10);
    }

    // Draw other players
    GameState.otherPlayers.forEach((data, characterId) => {
        const otherX = data.x * scale;
        const otherY = data.y * scale;

        mapCtx.fillStyle = '#4e9eff';
        mapCtx.beginPath();
        mapCtx.arc(otherX, otherY, 4, 0, Math.PI * 2);
        mapCtx.fill();
    });
}

// Update map periodically
setInterval(() => {
    if (!document.getElementById('map-ui').classList.contains('hidden')) {
        drawMap();
    }
}, 1000);
