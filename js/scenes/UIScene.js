// UI Scene - Handles UI overlays
class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: true });
    }

    create() {
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Setup UI event listeners
        this.setupUIListeners();
    }

    setupKeyboardShortcuts() {
        this.input.keyboard.on('keydown-I', () => {
            togglePanel('inventory-ui');
        });

        this.input.keyboard.on('keydown-M', () => {
            togglePanel('map-ui');
        });

        this.input.keyboard.on('keydown-B', () => {
            togglePanel('bazaar-ui');
        });

        this.input.keyboard.on('keydown-Q', () => {
            togglePanel('quests-ui');
        });

        this.input.keyboard.on('keydown-T', () => {
            togglePanel('team-ui');
        });

        this.input.keyboard.on('keydown-S', () => {
            togglePanel('stash-ui');
        });

        this.input.keyboard.on('keydown-ESC', () => {
            closeAllPanels();
        });
    }

    setupUIListeners() {
        // Close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const panel = btn.dataset.panel;
                document.getElementById(panel).classList.add('hidden');
            });
        });

        // HUD buttons
        document.getElementById('inventory-btn').addEventListener('click', () => {
            togglePanel('inventory-ui');
            loadInventory();
        });

        document.getElementById('map-btn').addEventListener('click', () => {
            togglePanel('map-ui');
            loadMap();
        });

        document.getElementById('bazaar-btn').addEventListener('click', () => {
            togglePanel('bazaar-ui');
            loadBazaar();
        });

        document.getElementById('quests-btn').addEventListener('click', () => {
            togglePanel('quests-ui');
            loadQuests();
        });

        document.getElementById('team-btn').addEventListener('click', () => {
            togglePanel('team-ui');
            loadTeam();
        });

        document.getElementById('stash-btn').addEventListener('click', () => {
            togglePanel('stash-ui');
            loadStash();
        });
    }
}

// Toggle panel visibility
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    panel.classList.toggle('hidden');
}

// Close all panels
function closeAllPanels() {
    document.querySelectorAll('.ui-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
}
