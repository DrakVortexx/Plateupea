// Inventory System
let selectedSlot = null;

function loadInventory() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';

    // Create inventory slots
    for (let i = 0; i < CONFIG.INVENTORY_SLOTS; i++) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        slot.dataset.slotIndex = i;

        if (GameState.inventory[i]) {
            const item = GameState.inventory[i];
            slot.innerHTML = `
                <span class="item-name">${item.name}</span>
                ${item.quantity > 1 ? `<span class="item-quantity">${item.quantity}</span>` : ''}
            `;
            slot.classList.add(`rarity-${item.rarity}`);
        }

        slot.addEventListener('click', () => selectSlot(i, slot));
        grid.appendChild(slot);
    }
}

function selectSlot(slotIndex, element) {
    // Remove previous selection
    document.querySelectorAll('.inventory-slot').forEach(slot => {
        slot.classList.remove('selected');
    });

    // Select new slot
    element.classList.add('selected');
    selectedSlot = slotIndex;

    // Show item details
    showItemDetails(GameState.inventory[slotIndex]);
}

function showItemDetails(item) {
    const details = document.getElementById('item-details');

    if (!item) {
        details.innerHTML = '<p>Select an item to view details</p>';
        return;
    }

    const rarityColor = CONFIG.RARITIES[item.rarity].color;
    details.innerHTML = `
        <h3 style="color: ${rarityColor}">${item.name}</h3>
        <p>${item.description || 'No description'}</p>
        <p><strong>Rarity:</strong> <span style="color: ${rarityColor}">${item.rarity}</span></p>
        <p><strong>Type:</strong> ${item.type}</p>
        <p><strong>Value:</strong> $${item.base_value}</p>
        ${item.damage ? `<p><strong>Damage:</strong> ${item.damage}</p>` : ''}
        ${item.defense ? `<p><strong>Defense:</strong> ${item.defense}</p>` : ''}
        <button onclick="useItem()">Use</button>
        <button onclick="dropItem()">Drop</button>
    `;
}

function useItem() {
    if (selectedSlot === null) return;

    const item = GameState.inventory[selectedSlot];
    if (!item) return;

    // Handle item usage based on type
    switch (item.type) {
        case 'consumable':
            // Apply consumable effect
            if (item.name === 'Health Potion') {
                GameState.character.hp = Math.min(
                    GameState.character.hp + 50,
                    GameState.character.max_hp
                );
                showNotification('Used Health Potion (+50 HP)');
                updateHUD();
            }
            break;
        case 'weapon':
            // Equip weapon
            showNotification(`Equipped ${item.name}`);
            break;
        case 'armor':
            // Equip armor
            showNotification(`Equipped ${item.name}`);
            break;
        default:
            showNotification('Cannot use this item');
            return;
    }

    // Remove item if consumable
    if (item.type === 'consumable') {
        item.quantity--;
        if (item.quantity <= 0) {
            GameState.inventory[selectedSlot] = null;
        }
        loadInventory();
    }
}

function dropItem() {
    if (selectedSlot === null) return;

    const item = GameState.inventory[selectedSlot];
    if (!item) return;

    // Remove item from inventory
    GameState.inventory[selectedSlot] = null;
    showNotification(`Dropped ${item.name}`);
    loadInventory();
    showItemDetails(null);
}

function addItemToInventory(item, quantity = 1) {
    // Check if item already exists and is stackable
    if (item.stackable) {
        for (let i = 0; i < GameState.inventory.length; i++) {
            if (GameState.inventory[i] && GameState.inventory[i].id === item.id) {
                GameState.inventory[i].quantity += quantity;
                return true;
            }
        }
    }

    // Find empty slot
    for (let i = 0; i < GameState.inventory.length; i++) {
        if (!GameState.inventory[i]) {
            GameState.inventory[i] = { ...item, quantity };
            return true;
        }
    }

    showNotification('Inventory full!');
    return false;
}
