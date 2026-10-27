// Stash System
let currentStash = null;
let raidTimer = null;

function loadStash() {
    const grid = document.getElementById('stash-grid');
    grid.innerHTML = '';

    // Check if player has a stash nearby
    if (currentStash) {
        // Load stash items
        if (currentStash.items) {
            currentStash.items.forEach((item, index) => {
                const slot = document.createElement('div');
                slot.className = 'inventory-slot';
                slot.innerHTML = `
                    <span class="item-name">${item.name}</span>
                    ${item.quantity > 1 ? `<span class="item-quantity">${item.quantity}</span>` : ''}
                `;
                slot.classList.add(`rarity-${item.rarity}`);
                grid.appendChild(slot);
            });
        }

        document.getElementById('stash-money').textContent = currentStash.money || 0;
    } else {
        grid.innerHTML = '<p>No stash nearby. Build one or find one.</p>';
        document.getElementById('stash-money').textContent = '0';
    }

    // Setup buttons
    document.getElementById('build-stash-btn').addEventListener('click', buildStash);
    document.getElementById('raid-stash-btn').addEventListener('click', startRaid);
}

function buildStash() {
    if (GameState.character.money < CONFIG.STASH_COST) {
        showNotification('Not enough money!');
        return;
    }

    GameState.character.money -= CONFIG.STASH_COST;
    updateHUD();

    // Create stash at current position
    currentStash = {
        id: Date.now(),
        x: GameState.character.x,
        y: GameState.character.y,
        items: [],
        money: 0,
        isBeingRaided: false
    };

    GameState.stashes.push(currentStash);
    showNotification('Stash built!');
    loadStash();
}

function startRaid() {
    if (!currentStash) {
        showNotification('No stash nearby to raid!');
        return;
    }

    if (currentStash.isBeingRaided) {
        showNotification('Stash is already being raided!');
        return;
    }

    if (currentStash.isBeingRaided) {
        showNotification('This is your own stash!');
        return;
    }

    // Start raid timer
    currentStash.isBeingRaided = true;
    const raidBtn = document.getElementById('raid-stash-btn');
    raidBtn.disabled = true;
    raidBtn.textContent = 'Raiding...';

    let timeLeft = CONFIG.RAID_TIME;
    raidTimer = setInterval(() => {
        timeLeft--;
        raidBtn.textContent = `Raiding... ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(raidTimer);
            completeRaid();
        }
    }, 1000);

    showNotification('Raid started! Stand still for 5 minutes.');
}

function completeRaid() {
    if (!currentStash) return;

    // Transfer stash items to player
    currentStash.items.forEach(item => {
        addItemToInventory(item, item.quantity);
    });

    // Transfer money
    GameState.character.money += currentStash.money || 0;

    // Clear stash
    currentStash.items = [];
    currentStash.money = 0;
    currentStash.isBeingRaided = false;

    showNotification('Raid complete! Stash emptied.');
    updateHUD();
    loadStash();

    // Reset button
    const raidBtn = document.getElementById('raid-stash-btn');
    raidBtn.disabled = false;
    raidBtn.textContent = 'Raid Nearby Stash (5 min)';
}

function cancelRaid() {
    if (raidTimer) {
        clearInterval(raidTimer);
        raidTimer = null;

        if (currentStash) {
            currentStash.isBeingRaided = false;
        }

        const raidBtn = document.getElementById('raid-stash-btn');
        raidBtn.disabled = false;
        raidBtn.textContent = 'Raid Nearby Stash (5 min)';

        showNotification('Raid cancelled!');
    }
}

// Cancel raid if player moves
document.addEventListener('keydown', (e) => {
    if (raidTimer && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        cancelRaid();
    }
});
