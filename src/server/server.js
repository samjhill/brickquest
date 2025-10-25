const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Game state management
let gameState = {
  players: [],
  currentPlayer: null,
  phase: 'draw',
  turn: 1,
  terrain: [],
  activeCards: [],
  gameOver: false,
  winner: null
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Send current game state to new player
  socket.emit('gameState', gameState);

  // Handle player joining
  socket.on('joinGame', (playerData) => {
    const player = {
      id: socket.id,
      ...playerData,
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
    const { cardId, target } = data;
    const player = gameState.players.find(p => p.id === socket.id);
    
    if (player && gameState.currentPlayer === socket.id) {
      // Find card in player's hand
      const card = player.hand.find(c => c.id === cardId);
      
      if (card && player.energy >= card.cost) {
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
            effects: card.effects.map(e => e.description)
          });
        }
        
        io.emit('gameState', gameState);
        console.log('Card played:', card.name, 'by', player.name);
      }
    }
  });

  // Handle player movement
  socket.on('movePlayer', (data) => {
    const { position } = data;
    const player = gameState.players.find(p => p.id === socket.id);
    
    if (player && gameState.currentPlayer === socket.id) {
      // Check if position is valid (within movement range, not occupied, etc.)
      const distance = Math.abs(player.position.x - position.x) + Math.abs(player.position.y - position.y);
      
      if (distance <= player.robot.stats.movement) {
        player.position = position;
        io.emit('gameState', gameState);
        console.log('Player moved:', player.name, 'to', position);
      }
    }
  });

  // Handle terrain building
  socket.on('buildTerrain', (data) => {
    const { cardId, position } = data;
    const player = gameState.players.find(p => p.id === socket.id);
    
    if (player && gameState.currentPlayer === socket.id) {
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
    }
  });

  // Handle phase changes
  socket.on('nextPhase', () => {
    if (gameState.currentPlayer === socket.id) {
      const phases = ['draw', 'action', 'build', 'program', 'encounter', 'end'];
      const currentIndex = phases.indexOf(gameState.phase);
      gameState.phase = phases[(currentIndex + 1) % phases.length];
      
      io.emit('gameState', gameState);
      console.log('Phase changed to:', gameState.phase);
    }
  });

  // Handle turn changes
  socket.on('nextTurn', () => {
    if (gameState.currentPlayer === socket.id) {
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
    }
  });

  // Handle game over
  socket.on('gameOver', (data) => {
    if (gameState.currentPlayer === socket.id) {
      gameState.gameOver = true;
      gameState.winner = data.winner;
      io.emit('gameState', gameState);
      console.log('Game over! Winner:', data.winner);
    }
  });
});

// API routes
app.get('/api/game/state', (req, res) => {
  res.json(gameState);
});

app.post('/api/game/reset', (req, res) => {
  gameState = {
    players: [],
    currentPlayer: null,
    phase: 'draw',
    turn: 1,
    terrain: [],
    activeCards: [],
    gameOver: false,
    winner: null
  };
  
  io.emit('gameState', gameState);
  res.json({ message: 'Game reset successfully' });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`BrickQuest server running on port ${PORT}`);
});
