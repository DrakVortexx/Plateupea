# Platopia - Game Design Document

## Overview

Platopia is a 2D top-down open world action RPG with real-time combat, featuring a massive shared world with thousands of players. The game focuses on exploration, questing, economy, PvP, and base building.
---

## Core Systems

### 1. Game View & Movement
- **Perspective:** 2D top-down
- **World Size:** Large (4-6 hours to cross entire world)
- **Movement:** Open exploration across one seamless world
- **Loading:** Loading screens between regions as needed
- **Map:** Full-screen map on HUD showing player as a dot (no minimap)

### 2. Multiplayer Architecture
- **Server Model:** Single shared world (no separate servers)
- **Player Capacity:** Thousands of players, aiming for millions at scale
- **Always-online:** Persistent world with all players in one instance

### 3. Character System
- **Class:** Classless system (no fixed classes)
- **Progression:** Level-based
  - Gain XP through various activities
  - Level up to increase stats and HP
  - Free ability/skill selection
  - Level cap: 300
- **Noob Protection:** Cannot take damage for first 10 levels
- **Starting Loadout:**
  - 100 HP
  - Wood axe (for PvP and wood chopping)
  - $100 starting money
  - Spawn at single starter village

### 4. Combat System
- **Style:** Real-time action combat
- **Mechanics:**
  - Active dodging and timing required
  - Skill-based gameplay
  - Weapons and spells found around the world
- **PvP:** Open world PvP (can fight anywhere)
- **Weapons:** Various weapons obtainable through exploration
- **Spells:** Magic spells discoverable in the world

### 5. Inventory System
- **Type:** Slot-based (like WoW)
- **Capacity:** Fixed number of slots
- **Expansion:** Can upgrade to increase slot count
- **Management:** When inventory is full, use hidden stash

### 6. Hidden Stash System
- **Placement:** Build stash anywhere in the world
- **Function:** Stores items and money
- **Purpose:** Extra storage when main inventory is full
- **Raiding Mechanics:**
  - Anyone can raid any stash
  - Stand next to stash and click "Raid"
  - Must stand in same place for 5 minutes to fully extract
  - If owner sees you raiding, they can attack you
  - Stash remains accessible to owner during raid

### 7. Quest System
- **Types:**
  - Daily quests
  - Weekly quests
  - Monthly quests
  - Stories (exist but not main focus)
- **Purpose:** Drive multiplayer progression and economy
- **Rewards:** Money and items

### 8. Item System
- **Rarity Tiers (10 levels):**
  1. Common
  2. Uncommon
  3. Rare
  4. Epic
  5. Legendary
  6. Mythic
  7. Divine
  8. Celestial
  9. Eternal
  10. Omniversal
- **Value:** Each rarity has different sell values
- **Acquisition Methods:**
  - Drops from enemies
  - Crafting
  - Exploration

### 9. Economy & Bazaar
- **Currency:** Single currency (money/dollars)
- **Bazaar Type:** Real-time listings
  - Players can list items for sale
  - Players can buy other players' items
  - Instant transactions
- **Economy Drivers:**
  - Player trading
  - Quest rewards
  - Item sales

### 10. Skills & Abilities
- **No Skill Tree:** No traditional skill tree system
- **Weapons:** Found throughout the world
- **Spells:** Discoverable magic spells
- **Progression:** Level-based stat increases

### 11. UI Elements
The game will have extensive UI systems:
- **Essential UIs:**
  - Inventory panel
  - Character stats panel
  - Quest log
  - Full-screen map (with player dot)
  - Bazaar/marketplace UI
  - Stash management UI
- **Additional UIs:**
  - Crafting interface
  - Social/friends UI
  - Settings menu
  - Chat system
  - Party system
  - Guild system
  - Achievements
  - Leaderboards

### 12. Death & Respawn System
- **Death Penalty:** Respawn with nothing (lose all inventory items and money)
- **Respawn Location:** Fixed spawn at single starter village
- **Stash Safety:** Items in stash are NOT lost on death
- **Risk:** High stakes for carrying valuable items
- **Strategy:** Players must decide when to stash loot vs. carry it

### 12.5 Safe Zones & PvP
- **Safe Zone:** Area around spawn (starter village) only
- **PvP Everywhere:** Open world PvP in all other areas
- **No Safe Towns:** Even towns and cities have PvP enabled
- **Exception:** Only spawn area protects new players

### 13. World Biomes
Classic biome types:
- **Forest:** Standard starting area, wood resources
- **Desert:** Hot environment, rare materials
- **Snow:** Cold biome, unique creatures and resources
- **Jungle:** Dense vegetation, exotic items
- **Mountains:** High elevation, difficult terrain, rare ores
- **Plains:** Open areas, farming potential
- **Swamp:** Dangerous but valuable resources
- **Ocean/Water:** Coastal areas, fishing, sea travel

### 14. Crafting System
- **Depth:** Complex system with many recipes and materials
- **Categories:**
  - Weapons crafting
  - Armor crafting
  - Tools crafting
  - Consumables (potions, food)
  - Building materials
  - Magic items
- **Materials:** Gathered from different biomes
- **Recipes:** Discovered through exploration, quests, or experimentation
- **Skill:** Crafting proficiency improves with practice

### 15. Team System
- **Name:** Teams (not guilds)
- **Team Size:** 5-20 players per team
- **Features:**
  - Create/join teams
  - Team chat
  - Team leaderboards
  - Best teams ranking system
- **Competition:** Teams compete for top rankings

### 16. Building System
- **Current:** Stashes are placeable items
- **Future:** May allow placing other items later
- **Limitation:** No building structures other than stashes at launch

### 17. Travel System
- **Mounts:** Horses only
- **Variety:** Different speeds and colors available
- **Method:** Obtain horses through exploration/crafting/trading
- **Benefit:** Significantly faster world traversal

### 18. NPC System
- **Essential NPCs:**
  - Quest givers
  - Vendors (buy/sell items)
  - Guards (protect safe areas)
  - Enemies (monsters, creatures)
- **Role:** Support core gameplay without overwhelming player-driven content

---

## Key Features Summary

✅ 2D top-down view
✅ Large open world (4-6 hours to cross)
✅ Single shared world with thousands of players
✅ Real-time action combat
✅ Open world PvP (except spawn area)
✅ Classless, level-based progression (level cap 300)
✅ Noob protection (first 10 levels)
✅ Slot-based inventory (expandable)
✅ Build-anywhere hidden stashes
✅ 5-minute stash raiding (stand still)
✅ Daily/weekly/monthly quests
✅ 10-tier item rarity system
✅ Real-time player bazaar
✅ Single currency economy
✅ Weapons and spells from exploration
✅ Full-screen map with player dot
✅ Comprehensive UI systems
✅ Starting: 100 HP, wood axe, $100 at single starter village
✅ Death: Respawn with nothing at starter village
✅ Classic biomes (forest, desert, snow, jungle, mountains, etc.)
✅ Deep crafting system
✅ Team system (5-20 players) with leaderboards
✅ Horses (different speeds/colors) for faster travel
✅ Essential NPCs (quest givers, vendors, guards, enemies)
✅ Safe zone only at spawn area

---

## Gameplay Loop

1. **Spawn** at single starter village with wood axe, 100 HP, and $100
2. **Enjoy noob protection** (cannot take damage for first 10 levels)
3. **Explore** the large open world across various biomes
4. **Complete quests** (daily/weekly/monthly) for rewards
5. **Fight enemies** and other players (PvP enabled everywhere except spawn)
6. **Collect items** through drops, crafting, and exploration
7. **Craft** gear and items using deep crafting system
8. **Upgrade** character through leveling (up to level 300)
9. **Build stash** to store excess loot (safe from death)
10. **Trade** items on the bazaar
11. **Raid** other players' stashes (5-minute timer, must stand still)
12. **Join/create teams** (5-20 players) and compete on leaderboards
13. **Obtain horses** (different speeds/colors) for faster travel
14. **Risk death** (lose everything, respawn at starter village)
15. **Progress** through higher rarity items

---

## Technical Considerations

### Scalability
- Single shared world requires robust server architecture
- Thousands of concurrent players
- Potential for millions of players at scale
- Real-time sync for all player actions

### Database Requirements
- Player accounts and authentication
- Character data (stats, inventory, level)
- World state (stashes, placed items)
- Bazaar listings and transactions
- Quest progress tracking
- Economy tracking

### Networking
- Real-time position sync
- Combat event synchronization
- Raid timer validation
- Bazaar transaction processing
- Chat and social features

---

## Next Planning Steps

Still to determine:
- Enemy types and spawn locations
- Quest types and variety
- Weapon/spell variety and mechanics
- Horse acquisition methods
- Team shared resources/features
- Anti-cheat measures
- Monetization (if any)
- Server infrastructure details
- Database schema design
