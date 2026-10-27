// Game Configuration
const CONFIG = {
    // Server
    SERVER_URL: window.location.origin,
    SOCKET_URL: window.location.origin,

    // Supabase (can be set via localStorage for dev)
    SUPABASE_URL: (typeof window !== 'undefined' && window.SUPABASE_URL) || (localStorage.getItem('supabase_url')) || '',
    SUPABASE_KEY: (typeof window !== 'undefined' && window.SUPABASE_KEY) || (localStorage.getItem('supabase_key')) || '',

    // Game
    WORLD_WIDTH: 20000,
    WORLD_HEIGHT: 20000,
    TILE_SIZE: 32,
    CHUNK_SIZE: 512,

    // Player
    START_HP: 150,
    START_MANA: 50,
    START_MONEY: 200,
    START_LEVEL: 1,
    MAX_LEVEL: 300,
    NOOB_PROTECTION_LEVEL: 15,

    // Movement
    WALK_SPEED: 180,
    SPRINT_SPEED: 280,
    MOUNT_SPEED: 420,

    // Combat
    ATTACK_COOLDOWN: 400,
    ATTACK_RANGE: 80,
    CRIT_CHANCE: 0.05,
    CRIT_MULTIPLIER: 1.5,

    // Inventory
    INVENTORY_SLOTS: 36,
    BANK_SLOTS: 100,
    EXPAND_COST: 1000,

    // Stash
    STASH_COST: 1000,
    RAID_TIME: 300, // 5 minutes in seconds

    // Skills
    SKILL_POINTS_PER_LEVEL: 3,

    // Biomes
    BIOMES: {
        forest: { color: 0x2d5a27, name: 'Forest', enemyMultiplier: 1, lootBonus: 1 },
        desert: { color: 0xd2691e, name: 'Desert', enemyMultiplier: 1.2, lootBonus: 1.1 },
        snow: { color: 0xf0f8ff, name: 'Tundra', enemyMultiplier: 1.3, lootBonus: 1.2 },
        jungle: { color: 0x1a4d1a, name: 'Jungle', enemyMultiplier: 1.4, lootBonus: 1.3 },
        mountains: { color: 0x696969, name: 'Mountains', enemyMultiplier: 1.6, lootBonus: 1.5 },
        plains: { color: 0x7cb342, name: 'Plains', enemyMultiplier: 0.9, lootBonus: 1.0 },
        swamp: { color: 0x4a5d23, name: 'Swamp', enemyMultiplier: 1.5, lootBonus: 1.4 },
        volcanic: { color: 0x8b0000, name: 'Volcanic', enemyMultiplier: 2.0, lootBonus: 2.0 },
        corrupted: { color: 0x4b0082, name: 'Corrupted Lands', enemyMultiplier: 2.5, lootBonus: 2.5 }
    },

    // Item rarities
    RARITIES: {
        common: { color: '#a0a0a0', multiplier: 1, chance: 0.50 },
        uncommon: { color: '#4eff4e', multiplier: 1.5, chance: 0.30 },
        rare: { color: '#4e9eff', multiplier: 2.5, chance: 0.12 },
        epic: { color: '#b84eff', multiplier: 4, chance: 0.06 },
        legendary: { color: '#ff9e4e', multiplier: 7, chance: 0.015 },
        mythic: { color: '#ff4e9e', multiplier: 12, chance: 0.004 },
        divine: { color: '#ffd700', multiplier: 20, chance: 0.0008 },
        celestial: { color: '#00ffff', multiplier: 35, chance: 0.00015 },
        eternal: { color: '#ff00ff', multiplier: 60, chance: 0.00003 },
        omniversal: { color: '#ffffff', multiplier: 100, chance: 0.000002 }
    },

    // Classes/Archetypes
    CLASSES: {
        warrior: { name: 'Warrior', hpBonus: 20, damageBonus: 10, color: '#ff6b6b' },
        mage: { name: 'Mage', manaBonus: 30, spellBonus: 15, color: '#4e9eff' },
        rogue: { name: 'Rogue', critBonus: 0.1, speedBonus: 30, color: '#4eff4e' },
        ranger: { name: 'Ranger', rangeBonus: 20, damageBonus: 8, color: '#ffd93d' },
        paladin: { name: 'Paladin', hpBonus: 15, defenseBonus: 12, color: '#f0932b' }
    }
};
