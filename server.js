const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.io connection handling
const players = new Map();

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    // Player joins
    socket.on('player_join', (data) => {
        players.set(data.characterId, {
            socketId: socket.id,
            characterId: data.characterId,
            x: data.x,
            y: data.y,
            name: data.name || 'Unknown',
            level: data.level || 1
        });

        // Send current players to new player
        const otherPlayers = Array.from(players.values())
            .filter(p => p.characterId !== data.characterId);

        socket.emit('world_update', { players: otherPlayers });

        // Broadcast new player to others
        socket.broadcast.emit('player_join', {
            characterId: data.characterId,
            x: data.x,
            y: data.y,
            name: data.name,
            level: data.level
        });
    });

    // Player movement
    socket.on('player_move', (data) => {
        const player = players.get(data.characterId);
        if (player) {
            player.x = data.x;
            player.y = data.y;

            // Broadcast to other players
            socket.broadcast.emit('player_update', {
                characterId: data.characterId,
                x: data.x,
                y: data.y,
                name: player.name,
                level: player.level
            });
        }
    });

    // Player disconnect
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);

        // Find and remove player
        for (const [characterId, player] of players.entries()) {
            if (player.socketId === socket.id) {
                players.delete(characterId);
                io.emit('player_leave', { characterId });
                break;
            }
        }
    });

    // PvP attack
    socket.on('pvp_attack', (data) => {
        const attacker = players.get(data.characterId);
        const target = players.get(data.targetCharacterId);

        if (attacker && target) {
            // Send damage to target
            io.to(target.socketId).emit('pvp_damage', {
                characterId: data.targetCharacterId,
                damage: data.damage,
                attackerId: data.characterId
            });

            // Log kill for future leaderboard
            // (This would be saved to database in production)
        }
    });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', players: players.size });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

