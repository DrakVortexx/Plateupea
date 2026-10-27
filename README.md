# Platopia - Open World MMO

Platopia is a 2D top-down open world action RPG with real-time combat, featuring a massive shared world with thousands of players. The game focuses on exploration, questing, economy, PvP, and base building.

## Features

- **2D Top-Down View**: Classic top-down perspective with a large open world (4-6 hours to cross)
- **Single Shared World**: Thousands of players in one persistent instance
- **Real-Time Action Combat**: Skill-based combat with active dodging and timing
- **Open World PvP**: Fight anywhere except the spawn safe zone
- **Classless Progression**: Level-based system (cap 300) with free ability selection
- **Noob Protection**: Cannot take damage for first 10 levels
- **Slot-Based Inventory**: Expandable inventory system
- **Build-Anywhere Stashes**: Hidden storage with raiding mechanics
- **Quest System**: Daily, weekly, monthly, and story quests
- **10-Tier Item Rarity**: From Common to Omniversal
- **Real-Time Bazaar**: Player-driven marketplace
- **Team System**: 5-20 player teams with leaderboards
- **Multiple Biomes**: Forest, Desert, Snow, Jungle, Mountains, Plains, Swamp
- **Crafting System**: Deep crafting with recipes and materials
- **Mounts**: Horses for faster travel

## Tech Stack

- **Frontend**: Phaser.js (Game Engine), HTML5, CSS3
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.io
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Render

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (for database)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd platopia
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Copy and run the contents of `schema.sql`
4. Copy your Supabase URL and Anon Key from Project Settings > API

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
NODE_ENV=development
PORT=3000
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key
```

### 5. Start the Development Server

```bash
npm run dev
```

The game will be available at `http://localhost:3000`

### 6. Development with Auto-Reload

The project uses `nodemon` for auto-reload during development. Any changes to server files will automatically restart the server.

## Game Controls

### Movement
- **WASD** or **Arrow Keys**: Move character
- **Space**: Attack

### UI Shortcuts
- **I**: Open/Close Inventory
- **M**: Open/Close Map
- **B**: Open/Close Bazaar
- **Q**: Open/Close Quests
- **T**: Open/Close Team
- **S**: Open/Close Stash
- **ESC**: Close all panels

## Game Mechanics

### Starting the Game
1. Register or login with username, email, and password
2. Start with 100 HP, Wood Axe, and $100
3. Spawn at the starter village (safe zone)
4. Noob protection prevents damage until level 10

### Combat
- Press **Space** to attack nearby enemies
- Attack range: 60 pixels
- Attack cooldown: 500ms
- Enemies drop XP, money, and items
- PvP is enabled everywhere except the safe zone

### Inventory
- 24 slots by default
- Click items to view details
- Use consumables, equip weapons/armor
- Drop items to free space

### Stashes
- Build stashes anywhere for $500
- Store items and money safely
- Other players can raid stashes (5-minute timer)
- Must stand still to raid
- Stash items are NOT lost on death

### Death
- Respawn with nothing at starter village
- Lose all inventory items and money
- Stash contents remain safe
- High stakes for carrying valuable items

### Quests
- Daily, weekly, monthly, and story quests
- Complete objectives for rewards
- Rewards include money and XP
- Quests drive progression and economy

### Bazaar
- List items for sale
- Buy items from other players
- Real-time transactions
- Player-driven economy

### Teams
- Create or join teams (5-20 players)
- Team chat
- Team leaderboards
- Compete for rankings

## Database Schema

The database schema is defined in `schema.sql` and includes:

- **Players**: User accounts and authentication
- **Characters**: Player characters with stats and position
- **Items**: Item definitions with rarity and stats
- **Inventory**: Player inventory slots
- **Stashes**: Player-built storage
- **Teams**: Team management
- **Bazaar**: Marketplace listings
- **Quests**: Quest definitions and progress
- **Crafting**: Recipes and materials

## Project Structure

```
platopia/
├── index.html              # Main HTML file
├── styles.css              # Game styles
├── server.js               # Node.js server
├── package.json            # Dependencies
├── schema.sql              # Database schema
├── render.yaml             # Render deployment config
├── .env.example            # Environment variables template
├── js/
│   ├── config.js           # Game configuration
│   ├── game.js             # Game state management
│   ├── main.js             # Entry point
│   ├── supabaseClient.js   # Supabase client
│   ├── scenes/
│   │   ├── MainScene.js    # Main game scene
│   │   └── UIScene.js      # UI overlay scene
│   └── ui/
│       ├── inventory.js    # Inventory system
│       ├── map.js          # Map system
│       ├── bazaar.js       # Bazaar system
│       ├── quests.js       # Quest system
│       ├── team.js         # Team system
│       └── stash.js        # Stash system
```

## Deployment to Render

### 1. Prepare for Deployment

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Ensure `.env` is NOT committed (it's in `.gitignore`)
3. Add your Supabase credentials as environment variables in Render

### 2. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up and create a new account
3. Connect your Git repository

### 3. Configure Web Service

1. Create a new **Web Service**
2. Select your repository
3. Render will detect the `render.yaml` file
4. Configure environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase Anon Key

### 4. Deploy

Click **Deploy** and Render will:
- Install dependencies
- Build the application
- Start the server
- Provide a public URL

### 5. Access Your Game

Once deployed, your game will be available at:
`https://your-app-name.onrender.com`

## Performance Considerations

### Scalability
- The current implementation uses in-memory player tracking
- For production, consider:
  - Redis for player state management
  - Database-backed position tracking
  - Load balancing for multiple server instances
  - Region-based world sharding

### Optimization
- Implement spatial partitioning for collision detection
- Use object pooling for frequently spawned entities
- Optimize network updates with interpolation
- Implement delta compression for position updates

## Future Enhancements

- [ ] Supabase authentication integration
- [ ] Persistent character data in database
- [ ] Real-time inventory sync
- [ ] Crafting UI and recipe system
- [ ] Mount system implementation
- [ ] Guild system
- [ ] Achievement system
- [ ] Leaderboards
- [ ] Chat system
- [ ] Anti-cheat measures
- [ ] Mobile support

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review the game design document: `GAME_PLAN.md`

## Acknowledgments

- Phaser.js for the game engine
- Socket.io for real-time communication
- Supabase for the backend database
- Render for deployment infrastructure
