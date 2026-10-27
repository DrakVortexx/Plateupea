-- Platopia Database Schema for Supabase
-- This schema supports the core game systems

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_online BOOLEAN DEFAULT FALSE
);

-- Player characters table
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    level INTEGER DEFAULT 1,
    experience BIGINT DEFAULT 0,
    hp INTEGER DEFAULT 100,
    max_hp INTEGER DEFAULT 100,
    money INTEGER DEFAULT 100,
    x FLOAT DEFAULT 0,
    y FLOAT DEFAULT 0,
    biome VARCHAR(50) DEFAULT 'forest',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id, name)
);

-- Player stats
CREATE TABLE character_stats (
    character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
    strength INTEGER DEFAULT 10,
    agility INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    defense INTEGER DEFAULT 10,
    luck INTEGER DEFAULT 10
);

-- Items table (item definitions)
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'divine', 'celestial', 'eternal', 'omniversal')),
    type VARCHAR(50) NOT NULL, -- weapon, armor, tool, consumable, material, spell
    base_value INTEGER NOT NULL,
    stackable BOOLEAN DEFAULT FALSE,
    max_stack INTEGER DEFAULT 1,
    damage INTEGER DEFAULT 0,
    defense INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory slots
CREATE TABLE inventory_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    slot_index INTEGER NOT NULL,
    item_id UUID REFERENCES items(id),
    quantity INTEGER DEFAULT 1,
    UNIQUE(character_id, slot_index)
);

-- Stashes
CREATE TABLE stashes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    x FLOAT NOT NULL,
    y FLOAT NOT NULL,
    biome VARCHAR(50) NOT NULL,
    is_being_raided BOOLEAN DEFAULT FALSE,
    raid_start_time TIMESTAMP WITH TIME ZONE,
    raider_character_id UUID REFERENCES characters(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stash items
CREATE TABLE stash_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stash_id UUID REFERENCES stashes(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id),
    quantity INTEGER DEFAULT 1,
    UNIQUE(stash_id, item_id)
);

-- Stash money
CREATE TABLE stash_money (
    stash_id UUID PRIMARY KEY REFERENCES stashes(id) ON DELETE CASCADE,
    amount INTEGER DEFAULT 0
);

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    leader_id UUID REFERENCES characters(id),
    member_count INTEGER DEFAULT 1,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, character_id)
);

-- Bazaar listings
CREATE TABLE bazaar_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id),
    quantity INTEGER DEFAULT 1,
    price INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quests
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'story')),
    reward_money INTEGER DEFAULT 0,
    reward_experience BIGINT DEFAULT 0,
    required_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quest objectives
CREATE TABLE quest_objectives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    target_type VARCHAR(50), -- enemy, item, location
    target_id VARCHAR(100),
    required_quantity INTEGER DEFAULT 1,
    reward_item_id UUID REFERENCES items(id)
);

-- Character quest progress
CREATE TABLE character_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'in_progress', 'completed', 'failed')),
    progress INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(character_id, quest_id)
);

-- Mounts
CREATE TABLE mounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(50) DEFAULT 'horse',
    speed_multiplier FLOAT DEFAULT 1.5,
    color VARCHAR(20) DEFAULT 'brown',
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crafting recipes
CREATE TABLE crafting_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    result_item_id UUID REFERENCES items(id),
    quantity INTEGER DEFAULT 1,
    required_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe materials
CREATE TABLE recipe_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID REFERENCES crafting_recipes(id) ON DELETE CASCADE,
    material_item_id UUID REFERENCES items(id),
    quantity INTEGER DEFAULT 1
);

-- Player crafting knowledge
CREATE TABLE character_recipes (
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES crafting_recipes(id) ON DELETE CASCADE,
    learned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (character_id, recipe_id)
);

-- Kill logs (for PvP tracking)
CREATE TABLE kill_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    killer_id UUID REFERENCES characters(id),
    victim_id UUID REFERENCES characters(id),
    location_x FLOAT,
    location_y FLOAT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_characters_player_id ON characters(player_id);
CREATE INDEX idx_inventory_character_id ON inventory_slots(character_id);
CREATE INDEX idx_stashes_character_id ON stashes(character_id);
CREATE INDEX idx_bazaar_character_id ON bazaar_listings(character_id);
CREATE INDEX idx_bazaar_active ON bazaar_listings(is_active);
CREATE INDEX idx_team_members_character_id ON team_members(character_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_character_quests_character_id ON character_quests(character_id);
CREATE INDEX idx_character_quests_status ON character_quests(status);

-- Insert default items
INSERT INTO items (name, description, rarity, type, base_value, damage, defense) VALUES
('Wood Axe', 'A basic axe for chopping wood and combat', 'common', 'weapon', 10, 5, 0),
('Iron Sword', 'A sturdy iron sword', 'uncommon', 'weapon', 50, 15, 0),
('Steel Sword', 'A sharp steel sword', 'rare', 'weapon', 200, 25, 0),
('Health Potion', 'Restores 50 HP', 'common', 'consumable', 20, 0, 0),
('Leather Armor', 'Basic leather protection', 'common', 'armor', 30, 0, 5),
('Iron Armor', 'Iron plate armor', 'uncommon', 'armor', 100, 0, 15),
('Wood', 'Basic building material', 'common', 'material', 5, 0, 0),
('Stone', 'Basic building material', 'common', 'material', 5, 0, 0),
('Fireball Spell', 'Cast a fireball', 'rare', 'spell', 150, 30, 0),
('Healing Spell', 'Restore health', 'uncommon', 'spell', 100, 0, 0);

-- Insert default quests
INSERT INTO quests (title, description, type, reward_money, reward_experience, required_level) VALUES
('Chop Wood', 'Chop 10 wood using your axe', 'daily', 50, 100, 1),
('Defeat Enemies', 'Defeat 5 enemies', 'daily', 100, 200, 1),
('Explore', 'Visit 3 different biomes', 'weekly', 500, 1000, 5),
('Craft Item', 'Craft your first item', 'story', 200, 500, 1);

-- Insert default horse mount
INSERT INTO items (name, description, rarity, type, base_value) VALUES
('Brown Horse', 'A reliable brown horse', 'common', 'mount', 500),
('Black Horse', 'A fast black horse', 'uncommon', 'mount', 1000),
('White Horse', 'A majestic white horse', 'rare', 'mount', 2500);
