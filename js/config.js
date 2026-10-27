// Game Configuration
const CONFIG = {
    // Server
    SERVER_URL: window.location.origin,
    SOCKET_URL: window.location.origin,

    // Supabase (can be set via localStorage for dev)
    SUPABASE_URL: (typeof window !== 'undefined' && window.SUPABASE_URL) || (localStorage.getItem('supabase_url')) || '',
    SUPABASE_KEY: (typeof window !== 'undefined' && window.SUPABASE_KEY) || (localStorage.getItem('supabase_key')) || '',

    // Game
    WORLD_WIDTH: 10000,
    WORLD_HEIGHT: 10000,
    TILE_SIZE: 32,

    // Player
    START_HP: 100,
    START_MONEY: 100,
    START_LEVEL: 1,
    MAX_LEVEL: 300,
    NOOB_PROTECTION_LEVEL: 10,

    // Inventory
    INVENTORY_SLOTS: 24,
    EXPAND_COST: 500,

    // Stash
    STASH_COST: 500,
    RAID_TIME: 300, // 5 minutes in seconds

    // Biomes
    BIOMES: {
        forest: { color: 0x228B22, name: 'Forest' },
        desert: { color: 0xD2691E, name: 'Desert' },
        snow: { color: 0xFFFAFA, name: 'Snow' },
        jungle: { color: 0x006400, name: 'Jungle' },
        mountains: { color: 0x808080, name: 'Mountains' },
        plains: { color: 0x90EE90, name: 'Plains' },
        swamp: { color: 0x556B2F, name: 'Swamp' }
    },

    // Item rarities
    RARITIES: {
        common: { color: '#888888', multiplier: 1 },
        uncommon: { color: '#4eff4e', multiplier: 2 },
        rare: { color: '#4e9eff', multiplier: 5 },
        epic: { color: '#9e4eff', multiplier: 10 },
        legendary: { color: '#ff9e4e', multiplier: 25 },
        mythic: { color: '#ff4e9e', multiplier: 50 },
        divine: { color: '#ffd700', multiplier: 100 },
        celestial: { color: '#00ffff', multiplier: 250 },
        eternal: { color: '#ff00ff', multiplier: 500 },
        omniversal: { color: '#ffffff', multiplier: 1000 }
    }
};
