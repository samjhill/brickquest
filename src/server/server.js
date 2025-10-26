const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Game state management
const MAX_PLAYERS = parseInt(process.env.MAX_PLAYERS) || 4;
const GAME_TIMEOUT = parseInt(process.env.GAME_TIMEOUT) || 3600000; // 1 hour

let gameState = {
  players: [],
  currentPlayer: null,
  phase: 'draw',
  turn: 1,
  terrain: [],
  activeCards: [],
  gameOver: false,
  winner: null,
  maxPlayers: MAX_PLAYERS,
  gameTimeout: GAME_TIMEOUT
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Send current game state to new player
  socket.emit('gameState', gameState);

  // Handle player joining
  socket.on('joinGame', (playerData) => {
    try {
      // Validate input data
      if (!playerData || typeof playerData.name !== 'string' || !playerData.name.trim()) {
        socket.emit('error', { message: 'Invalid player data: name is required' });
        return;
      }

      // Check if game is full
      if (gameState.players.length >= MAX_PLAYERS) {
        socket.emit('error', { message: 'Game is full' });
        return;
      }
      const player = {
        id: socket.id,
        name: playerData.name.trim(),
        hp: 20,
        maxHp: 20,
        energy: 5,
        maxEnergy: 5,
        position: { x: 0, y: 0 },
        hand: [],
        deck: [],
        discard: [],
        robot: {
          upgrades: [],
          stats: {
            movement: 3,
            attack: 2,
            defense: 1,
            energy: 5
          }
        }
      };

      gameState.players.push(player);
      
      if (!gameState.currentPlayer) {
        gameState.currentPlayer = player.id;
      }

      // Broadcast updated game state to all players
      io.emit('gameState', gameState);
      console.log('Player joined:', player.name);
    } catch (error) {
      console.error('Error in joinGame:', error);
      socket.emit('error', { message: 'Failed to join game' });
    }
  });

  // Handle player leaving
  socket.on('disconnect', () => {
    gameState.players = gameState.players.filter(p => p.id !== socket.id);
    
    if (gameState.currentPlayer === socket.id) {
      gameState.currentPlayer = gameState.players[0]?.id || null;
    }

    io.emit('gameState', gameState);
    console.log('Player disconnected:', socket.id);
  });

  // Handle card play
  socket.on('playCard', (data) => {
    try {
      if (!data || typeof data.cardId !== 'string') {
        socket.emit('error', { message: 'Invalid card data' });
        return;
      }

      const { cardId, target } = data;
      const player = gameState.players.find(p => p.id === socket.id);
      
      if (!player) {
        socket.emit('error', { message: 'Player not found' });
        return;
      }

      if (gameState.currentPlayer !== socket.id) {
        socket.emit('error', { message: 'Not your turn' });
        return;
      }

      // Find card in player's hand
      const card = player.hand.find(c => c.id === cardId);
      
      if (!card) {
        socket.emit('error', { message: 'Card not found in hand' });
        return;
      }

      if (player.energy < card.cost) {
        socket.emit('error', { message: 'Not enough energy' });
        return;
      }

      // Remove card from hand and add to discard
      player.hand = player.hand.filter(c => c.id !== cardId);
      player.discard.push(card);
      
      // Deduct energy
      player.energy -= card.cost;
      
      // Handle card effects based on type
      if (card.type === 'program') {
        gameState.activeCards.push({
          card,
          player: player.id,
          duration: card.duration || 1,
          effects: card.effects ? card.effects.map(e => e.description) : []
        });
      }
      
      io.emit('gameState', gameState);
      console.log('Card played:', card.name, 'by', player.name);
    } catch (error) {
      console.error('Error in playCard:', error);
      socket.emit('error', { message: 'Failed to play card' });
    }
  });

  // Handle player movement
  socket.on('movePlayer', (data) => {
    try {
      if (!data || !data.position || typeof data.position.x !== 'number' || typeof data.position.y !== 'number') {
        socket.emit('error', { message: 'Invalid position data' });
        return;
      }

      const { position } = data;
      const player = gameState.players.find(p => p.id === socket.id);
      
      if (!player) {
        socket.emit('error', { message: 'Player not found' });
        return;
      }

      if (gameState.currentPlayer !== socket.id) {
        socket.emit('error', { message: 'Not your turn' });
        return;
      }

      // Check if position is valid (within movement range, not occupied, etc.)
      const distance = Math.abs(player.position.x - position.x) + Math.abs(player.position.y - position.y);
      
      if (distance <= player.robot.stats.movement) {
        player.position = position;
        io.emit('gameState', gameState);
        console.log('Player moved:', player.name, 'to', position);
      } else {
        socket.emit('error', { message: 'Position too far away' });
      }
    } catch (error) {
      console.error('Error in movePlayer:', error);
      socket.emit('error', { message: 'Failed to move player' });
    }
  });

  // Handle terrain building
  socket.on('buildTerrain', (data) => {
    try {
      if (!data || !data.cardId || !data.position) {
        socket.emit('error', { message: 'Invalid terrain data' });
        return;
      }

      const { cardId, position } = data;
      const player = gameState.players.find(p => p.id === socket.id);
      
      if (!player) {
        socket.emit('error', { message: 'Player not found' });
        return;
      }

      if (gameState.currentPlayer !== socket.id) {
        socket.emit('error', { message: 'Not your turn' });
        return;
      }

      const terrainTile = {
        id: `${cardId}_${Date.now()}`,
        type: 'floor', // This would be determined by the card
        position,
        height: 1,
        properties: {
          owner: player.id,
          card: cardId,
          legoCompatible: true
        }
      };
      
      gameState.terrain.push(terrainTile);
      io.emit('gameState', gameState);
      console.log('Terrain built:', terrainTile.type, 'at', position);
    } catch (error) {
      console.error('Error in buildTerrain:', error);
      socket.emit('error', { message: 'Failed to build terrain' });
    }
  });

  // Handle phase changes
  socket.on('nextPhase', () => {
    try {
      if (gameState.currentPlayer !== socket.id) {
        socket.emit('error', { message: 'Not your turn' });
        return;
      }

      const phases = ['draw', 'action', 'build', 'program', 'encounter', 'end'];
      const currentIndex = phases.indexOf(gameState.phase);
      gameState.phase = phases[(currentIndex + 1) % phases.length];
      
      io.emit('gameState', gameState);
      console.log('Phase changed to:', gameState.phase);
    } catch (error) {
      console.error('Error in nextPhase:', error);
      socket.emit('error', { message: 'Failed to change phase' });
    }
  });

  // Handle turn changes
  socket.on('nextTurn', () => {
    try {
      if (gameState.currentPlayer !== socket.id) {
        socket.emit('error', { message: 'Not your turn' });
        return;
      }

      const playerIds = gameState.players.map(p => p.id);
      const currentIndex = playerIds.indexOf(gameState.currentPlayer);
      gameState.currentPlayer = playerIds[(currentIndex + 1) % playerIds.length];
      gameState.turn++;
      gameState.phase = 'draw';
      
      // Reset energy for all players
      gameState.players.forEach(player => {
        player.energy = player.maxEnergy;
      });
      
      io.emit('gameState', gameState);
      console.log('Turn changed to:', gameState.currentPlayer);
    } catch (error) {
      console.error('Error in nextTurn:', error);
      socket.emit('error', { message: 'Failed to change turn' });
    }
  });

  // Handle game over
  socket.on('gameOver', (data) => {
    try {
      if (gameState.currentPlayer !== socket.id) {
        socket.emit('error', { message: 'Not your turn' });
        return;
      }

      if (!data || !data.winner) {
        socket.emit('error', { message: 'Invalid game over data' });
        return;
      }

      gameState.gameOver = true;
      gameState.winner = data.winner;
      io.emit('gameState', gameState);
      console.log('Game over! Winner:', data.winner);
    } catch (error) {
      console.error('Error in gameOver:', error);
      socket.emit('error', { message: 'Failed to end game' });
    }
  });
});

// API routes
app.get('/api/game/state', (req, res) => {
  try {
    res.json(gameState);
  } catch (error) {
    console.error('Error getting game state:', error);
    res.status(500).json({ error: 'Failed to get game state' });
  }
});

app.post('/api/game/reset', (req, res) => {
  try {
    gameState = {
      players: [],
      currentPlayer: null,
      phase: 'draw',
      turn: 1,
      terrain: [],
      activeCards: [],
      gameOver: false,
      winner: null,
      maxPlayers: MAX_PLAYERS,
      gameTimeout: GAME_TIMEOUT
    };
    
    io.emit('gameState', gameState);
    res.json({ message: 'Game reset successfully' });
  } catch (error) {
    console.error('Error resetting game:', error);
    res.status(500).json({ error: 'Failed to reset game' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  } catch (error) {
    console.error('Error serving React app:', error);
    res.status(500).send('Internal server error');
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`BrickQuest server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
