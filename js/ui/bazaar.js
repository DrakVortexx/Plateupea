// Bazaar System
let currentTab = 'buy';

function loadBazaar() {
    // Setup tab buttons
    document.querySelectorAll('.bazaar-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.bazaar-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.tab;
            loadBazaarContent();
        });
    });

    loadBazaarContent();
}

function loadBazaarContent() {
    const content = document.getElementById('bazaar-content');
    content.innerHTML = '';

    switch (currentTab) {
        case 'buy':
            loadBuyListings(content);
            break;
        case 'sell':
            loadSellInterface(content);
            break;
        case 'my-listings':
            loadMyListings(content);
            break;
    }
}

function loadBuyListings(content) {
    // Mock listings for now
    const listings = [
        { id: 1, item: { name: 'Iron Sword', rarity: 'uncommon', base_value: 50 }, price: 75, seller: 'Player1' },
        { id: 2, item: { name: 'Health Potion', rarity: 'common', base_value: 20 }, price: 25, seller: 'Player2' },
        { id: 3, item: { name: 'Steel Sword', rarity: 'rare', base_value: 200 }, price: 250, seller: 'Player3' }
    ];

    listings.forEach(listing => {
        const item = document.createElement('div');
        item.className = 'bazaar-item';
        item.innerHTML = `
            <div>
                <span class="rarity-${listing.item.rarity}">${listing.item.name}</span>
                <p>Seller: ${listing.seller}</p>
            </div>
            <div>
                <p>$${listing.price}</p>
                <button onclick="buyItem(${listing.id})">Buy</button>
            </div>
        `;
        content.appendChild(item);
    });
}

function loadSellInterface(content) {
    content.innerHTML = `
        <div class="sell-interface">
            <p>Select an item from your inventory to sell</p>
            <button onclick="sellFromInventory()">Open Inventory</button>
        </div>
    `;
}

function loadMyListings(content) {
    content.innerHTML = '<p>You have no active listings</p>';
}

function buyItem(listingId) {
    // Mock buy functionality
    showNotification('Item purchased!');
}

function sellFromInventory() {
    togglePanel('inventory-ui');
    loadInventory();
}
