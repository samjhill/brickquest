#!/usr/bin/env node

/**
 * BrickQuest Playtest Simulation
 * 
 * This script simulates a complete playtest of BrickQuest, demonstrating:
 * - Game setup with different robot classes
 * - Turn-based gameplay with all phases
 * - Card mechanics and combat
 * - Building and terrain interaction
 * - Win conditions and game progression
 */

const chalk = require('chalk');

class BrickQuestSimulation {
  constructor() {
    this.gameState = {
      turn: 1,
      phase: 'draw',
      currentPlayer: 0,
      players: [],
      terrain: [],
      activeCards: [],
      encounterDeck: [],
      gameOver: false,
      winner: null
    };
    
    this.cardDatabase = this.initializeCardDatabase();
    this.setupGame();
  }

  /**
   * Initialize the card database with actual cards from the CSV
   */
  initializeCardDatabase() {
    return {
      // Action Cards
      'overdrive': {
        id: 'BQ-ACT-0001',
        name: 'Overdrive',
        type: 'action',
        cost: 2,
        description: 'Double movement for this turn',
        effects: [{ type: 'movement', value: 2, target: 'self', description: 'Gain 2 additional movement' }],
        rarity: 'common'
      },
      'dash': {
        id: 'BQ-ACT-0002',
        name: 'Dash',
        type: 'action',
        cost: 1,
        description: 'Move to adjacent tile',
        effects: [{ type: 'movement', value: 1, target: 'self', description: 'Quick movement' }],
        rarity: 'common'
      },
      'pulse_strike': {
        id: 'BQ-ACT-0003',
        name: 'Pulse Strike',
        type: 'action',
        cost: 3,
        description: 'Deal 2 damage to all enemies in range 3',
        effects: [{ type: 'damage', value: 2, target: 'allEnemies', description: 'Energy attack' }],
        range: 3,
        damage: 2,
        rarity: 'uncommon'
      },
      'shield_bash': {
        id: 'BQ-ACT-0004',
        name: 'Shield Bash',
        type: 'action',
        cost: 2,
        description: 'Deal 1 damage and push enemy back 1',
        effects: [{ type: 'damage', value: 1, target: 'enemy', description: 'Defensive counter' }],
        rarity: 'common'
      },
      'repair': {
        id: 'BQ-ACT-0005',
        name: 'Repair',
        type: 'action',
        cost: 1,
        description: 'Heal 3 HP',
        effects: [{ type: 'heal', value: 3, target: 'self', description: 'Restore health' }],
        rarity: 'common'
      },
      'energy_surge': {
        id: 'BQ-ACT-0006',
        name: 'Energy Surge',
        type: 'action',
        cost: 2,
        description: 'Gain 3 Energy',
        effects: [{ type: 'energy', value: 3, target: 'self', description: 'Power boost' }],
        rarity: 'uncommon'
      },
      'precision_shot': {
        id: 'BQ-ACT-0007',
        name: 'Precision Shot',
        type: 'action',
        cost: 2,
        description: 'Deal 3 damage to target. Cannot miss.',
        effects: [{ type: 'damage', value: 3, target: 'enemy', description: 'Guaranteed hit' }],
        rarity: 'uncommon'
      },
      'retreat': {
        id: 'BQ-ACT-0008',
        name: 'Retreat',
        type: 'action',
        cost: 1,
        description: 'Move 2 tiles away from nearest enemy',
        effects: [{ type: 'movement', value: 2, target: 'self', description: 'Tactical withdrawal' }],
        rarity: 'common'
      },
      'rally': {
        id: 'BQ-ACT-0009',
        name: 'Rally',
        type: 'action',
        cost: 2,
        description: 'All allies gain +1 Attack this turn',
        effects: [{ type: 'buff', value: 1, target: 'allies', description: 'Inspire team' }],
        rarity: 'uncommon'
      },
      'desperate_strike': {
        id: 'BQ-ACT-0010',
        name: 'Desperate Strike',
        type: 'action',
        cost: 1,
        description: 'Deal 2 damage. If you have 5 or less HP, deal +2 damage.',
        effects: [{ type: 'damage', value: 2, target: 'enemy', description: 'Conditional power' }],
        rarity: 'common'
      },
      
      // Structure Cards
      'watchtower': {
        id: 'BQ-STR-0001',
        name: 'Watchtower',
        type: 'structure',
        cost: 3,
        description: 'Provides +2 range to ranged attacks from this tile',
        effects: [{ type: 'build', value: 1, target: 'terrain', description: 'Defensive structure' }],
        rarity: 'uncommon'
      },
      'barricade': {
        id: 'BQ-STR-0002',
        name: 'Barricade',
        type: 'structure',
        cost: 2,
        description: 'Blocks movement. +2 Defense to adjacent units',
        effects: [{ type: 'build', value: 1, target: 'terrain', description: 'Movement blocker' }],
        rarity: 'common'
      },
      'bridge': {
        id: 'BQ-STR-0003',
        name: 'Bridge',
        type: 'structure',
        cost: 2,
        description: 'Connects two tiles. Units can move across',
        effects: [{ type: 'build', value: 1, target: 'terrain', description: 'Connectivity' }],
        rarity: 'common'
      },
      'turret_base': {
        id: 'BQ-STR-0004',
        name: 'Turret Base',
        type: 'structure',
        cost: 4,
        description: 'Ranged attack: 2 damage, 4 range',
        effects: [{ type: 'build', value: 1, target: 'terrain', description: 'Automated defense' }],
        rarity: 'uncommon'
      },
      'energy_core': {
        id: 'BQ-STR-0005',
        name: 'Energy Core',
        type: 'structure',
        cost: 5,
        description: 'All adjacent units gain +1 Energy per turn',
        effects: [{ type: 'build', value: 1, target: 'terrain', description: 'Power source' }],
        rarity: 'rare'
      },
      'healing_station': {
        id: 'BQ-STR-0006',
        name: 'Healing Station',
        type: 'structure',
        cost: 3,
        description: 'Heal 2 HP to all adjacent units at end of turn',
        effects: [{ type: 'build', value: 1, target: 'terrain', description: 'Medical facility' }],
        rarity: 'uncommon'
      },
      
      // Program Cards
      'auto_repair': {
        id: 'BQ-PRO-0001',
        name: 'Auto-Repair',
        type: 'program',
        cost: 2,
        description: 'Duration: 3 rounds. Heal 1 HP at start of each turn',
        effects: [{ type: 'heal', value: 1, target: 'self', description: 'Self-maintaining systems' }],
        duration: 3,
        rarity: 'uncommon'
      },
      'seek_and_destroy': {
        id: 'BQ-PRO-0002',
        name: 'Seek and Destroy',
        type: 'program',
        cost: 3,
        description: 'Duration: 2 rounds. +1 Attack against damaged enemies',
        effects: [{ type: 'buff', value: 1, target: 'self', description: 'Target the wounded' }],
        duration: 2,
        rarity: 'uncommon'
      },
      'retreat_loop': {
        id: 'BQ-PRO-0003',
        name: 'Retreat Loop',
        type: 'program',
        cost: 1,
        description: 'Duration: 2 rounds. When damaged, move 1 tile away from attacker',
        effects: [{ type: 'movement', value: 1, target: 'self', description: 'Evasive maneuvers' }],
        duration: 2,
        rarity: 'common'
      },
      'overclock': {
        id: 'BQ-PRO-0004',
        name: 'Overclock',
        type: 'program',
        cost: 4,
        description: 'Duration: 2 rounds. +2 Energy per turn, take 1 Heat at end of turn',
        effects: [{ type: 'energy', value: 2, target: 'self', description: 'Push beyond limits' }],
        duration: 2,
        rarity: 'rare'
      },
      'stealth_mode': {
        id: 'BQ-PRO-0005',
        name: 'Stealth Mode',
        type: 'program',
        cost: 2,
        description: 'Duration: 3 rounds. Enemies cannot target you with ranged attacks',
        effects: [{ type: 'stealth', value: 1, target: 'self', description: 'Hide in shadows' }],
        duration: 3,
        rarity: 'uncommon'
      },
      
      // Event Cards
      'system_overload': {
        id: 'BQ-EVT-0001',
        name: 'System Overload',
        type: 'event',
        cost: 1,
        description: 'All units take 1 damage. Energy costs are doubled this turn',
        effects: [{ type: 'damage', value: 1, target: 'all', description: 'System failure' }],
        rarity: 'uncommon'
      },
      'security_breach': {
        id: 'BQ-EVT-0002',
        name: 'Security Breach',
        type: 'event',
        cost: 0,
        description: 'All players draw 2 cards',
        effects: [{ type: 'draw', value: 2, target: 'all', description: 'Information flows freely' }],
        rarity: 'common'
      },
      'treasure_cache': {
        id: 'BQ-EVT-0003',
        name: 'Treasure Cache',
        type: 'event',
        cost: 0,
        description: 'Draw 3 cards and gain 2 Energy',
        effects: [{ type: 'draw', value: 3, target: 'self', description: 'Hidden riches' }],
        rarity: 'rare'
      },
      'power_surge': {
        id: 'BQ-EVT-0004',
        name: 'Power Surge',
        type: 'event',
        cost: 0,
        description: 'All units gain +2 Energy',
        effects: [{ type: 'energy', value: 2, target: 'all', description: 'Power flows through all' }],
        rarity: 'uncommon'
      },
      'structural_collapse': {
        id: 'BQ-EVT-0005',
        name: 'Structural Collapse',
        type: 'event',
        cost: 0,
        description: 'Destroy all structures. Return half their brick cost to shared pool',
        effects: [{ type: 'destroy', value: 1, target: 'structures', description: 'Foundation crumbles' }],
        rarity: 'rare'
      },
      
      // Loot Cards
      'energy_core_upgrade': {
        id: 'BQ-LOT-0001',
        name: 'Energy Core',
        type: 'loot',
        cost: 0,
        description: 'Permanent: +1 max Energy',
        effects: [{ type: 'upgrade', value: 1, target: 'self', description: 'Enhanced power systems' }],
        rarity: 'uncommon'
      },
      
      // NEW MID-COST ACTION CARDS (3-4 energy)
      'power_strike': {
        id: 'BQ-ACT-0011',
        name: 'Power Strike',
        type: 'action',
        cost: 3,
        description: 'Deal 4 damage to target. If you have 8+ Energy, deal +2 damage',
        effects: [{ type: 'damage', value: 4, target: 'enemy', description: 'High-energy attack' }],
        rarity: 'uncommon'
      },
      'tactical_retreat': {
        id: 'BQ-ACT-0012',
        name: 'Tactical Retreat',
        type: 'action',
        cost: 3,
        description: 'Move 3 tiles and gain +2 Defense until end of turn',
        effects: [{ type: 'movement', value: 3, target: 'self', description: 'Strategic withdrawal' }],
        rarity: 'uncommon'
      },
      'energy_blast': {
        id: 'BQ-ACT-0013',
        name: 'Energy Blast',
        type: 'action',
        cost: 3,
        description: 'Deal 2 damage to all enemies in range 2. Gain 1 Energy for each enemy hit',
        effects: [{ type: 'damage', value: 2, target: 'allEnemies', description: 'Area energy attack' }],
        range: 2,
        rarity: 'uncommon'
      },
      'combat_protocol': {
        id: 'BQ-ACT-0014',
        name: 'Combat Protocol',
        type: 'action',
        cost: 3,
        description: 'Deal 3 damage to target. Draw 1 card if it dies',
        effects: [{ type: 'damage', value: 3, target: 'enemy', description: 'Calculated attack' }],
        rarity: 'uncommon'
      },
      'defensive_matrix': {
        id: 'BQ-ACT-0015',
        name: 'Defensive Matrix',
        type: 'action',
        cost: 3,
        description: 'Gain 3 temporary HP and +1 Defense until end of turn',
        effects: [{ type: 'heal', value: 3, target: 'self', description: 'Protective systems' }],
        rarity: 'uncommon'
      },
      'overcharge': {
        id: 'BQ-ACT-0016',
        name: 'Overcharge',
        type: 'action',
        cost: 4,
        description: 'Deal 5 damage to target. Take 2 damage',
        effects: [{ type: 'damage', value: 5, target: 'enemy', description: 'Risky high-power attack' }],
        rarity: 'uncommon'
      },
      'system_scan': {
        id: 'BQ-ACT-0017',
        name: 'System Scan',
        type: 'action',
        cost: 4,
        description: 'Draw 3 cards. All enemies lose 1 Energy',
        effects: [{ type: 'draw', value: 3, target: 'self', description: 'Battlefield analysis' }],
        rarity: 'uncommon'
      },
      'fortress_mode': {
        id: 'BQ-ACT-0018',
        name: 'Fortress Mode',
        type: 'action',
        cost: 4,
        description: 'Gain +3 Defense and cannot move until end of turn',
        effects: [{ type: 'defense', value: 3, target: 'self', description: 'Immovable defense' }],
        rarity: 'uncommon'
      },
      
      // NEW MID-COST STRUCTURE CARDS (3-4 energy)
      'command_center': {
        id: 'BQ-STR-0007',
        name: 'Command Center',
        type: 'structure',
        cost: 3,
        description: 'Allies within range 2 gain +1 Attack',
        effects: [{ type: 'build', value: 1, target: 'terrain', description: 'Leadership structure' }],
        rarity: 'uncommon'
      },
      'supply_depot': {
        id: 'BQ-STR-0008',
        name: 'Supply Depot',
        type: 'structure',
        cost: 3,
        description: 'Allies adjacent gain +1 Energy per turn',
        effects: [{ type: 'build', value: 1, target: 'terrain', description: 'Support structure' }],
        rarity: 'uncommon'
      },
      'reinforced_wall': {
        id: 'BQ-STR-0009',
        name: 'Reinforced Wall',
        type: 'structure',
        cost: 3,
        description: 'Blocks movement. +3 Defense to adjacent units',
        effects: [{ type: 'build', value: 1, target: 'terrain', description: 'Strong barrier' }],
        rarity: 'uncommon'
      },
      'observation_post': {
        id: 'BQ-STR-0010',
        name: 'Observation Post',
        type: 'structure',
        cost: 3,
        description: '+3 Range to all attacks from this tile',
        effects: [{ type: 'build', value: 1, target: 'terrain', description: 'Scouting structure' }],
        rarity: 'uncommon'
      },
      'power_generator': {
        id: 'BQ-STR-0011',
        name: 'Power Generator',
        type: 'structure',
        cost: 4,
        description: 'All units within range 2 gain +1 Energy per turn',
        effects: [{ type: 'build', value: 1, target: 'terrain', description: 'Massive power source' }],
        rarity: 'rare'
      },
      'battle_station': {
        id: 'BQ-STR-0012',
        name: 'Battle Station',
        type: 'structure',
        cost: 4,
        description: 'Ranged attack: 3 damage, 5 range. +1 Defense to adjacent allies',
        effects: [{ type: 'build', value: 1, target: 'terrain', description: 'Heavy defensive position' }],
        rarity: 'rare'
      },
      
      // NEW MID-COST PROGRAM CARDS (3-4 energy)
      'combat_protocols': {
        id: 'BQ-PRO-0006',
        name: 'Combat Protocols',
        type: 'program',
        cost: 3,
        description: 'Duration: 2 rounds. +2 Attack and +1 Defense',
        effects: [{ type: 'buff', value: 2, target: 'self', description: 'Enhanced combat' }],
        duration: 2,
        rarity: 'uncommon'
      },
      'energy_efficiency': {
        id: 'BQ-PRO-0007',
        name: 'Energy Efficiency',
        type: 'program',
        cost: 3,
        description: 'Duration: 3 rounds. All cards cost -1 Energy (minimum 1)',
        effects: [{ type: 'discount', value: 1, target: 'self', description: 'Power optimization' }],
        duration: 3,
        rarity: 'uncommon'
      },
      'tactical_awareness': {
        id: 'BQ-PRO-0008',
        name: 'Tactical Awareness',
        type: 'program',
        cost: 3,
        description: 'Duration: 2 rounds. +2 Range and cannot be surprised',
        effects: [{ type: 'range', value: 2, target: 'self', description: 'Enhanced perception' }],
        duration: 2,
        rarity: 'uncommon'
      },
      'overdrive_protocol': {
        id: 'BQ-PRO-0009',
        name: 'Overdrive Protocol',
        type: 'program',
        cost: 4,
        description: 'Duration: 2 rounds. +3 Movement and +2 Attack. Take 1 damage at end of each turn',
        effects: [{ type: 'movement', value: 3, target: 'self', description: 'Maximum performance' }],
        duration: 2,
        rarity: 'rare'
      },
      'defensive_systems': {
        id: 'BQ-PRO-0010',
        name: 'Defensive Systems',
        type: 'program',
        cost: 4,
        description: 'Duration: 3 rounds. +2 Defense and reduce all incoming damage by 1',
        effects: [{ type: 'defense', value: 2, target: 'self', description: 'Comprehensive protection' }],
        duration: 3,
        rarity: 'rare'
      },
      
      // NEW REACTION CARDS
      'energy_shield': {
        id: 'BQ-REA-0002',
        name: 'Energy Shield',
        type: 'reaction',
        cost: 2,
        description: 'When you would take damage, prevent 3. If prevented damage is 5+, gain 1 Energy',
        effects: [{ type: 'prevent', value: 3, target: 'self', description: 'Energy barrier' }],
        rarity: 'uncommon'
      },
      'counter_strike': {
        id: 'BQ-REA-0003',
        name: 'Counter Strike',
        type: 'reaction',
        cost: 2,
        description: 'When an enemy attacks you, deal 2 damage back to them',
        effects: [{ type: 'damage', value: 2, target: 'attacker', description: 'Defensive counter' }],
        rarity: 'uncommon'
      },
      'emergency_repair': {
        id: 'BQ-REA-0004',
        name: 'Emergency Repair',
        type: 'reaction',
        cost: 1,
        description: 'When you take damage, heal 2 HP',
        effects: [{ type: 'heal', value: 2, target: 'self', description: 'Automatic repair' }],
        rarity: 'common'
      },
      'power_surge_reaction': {
        id: 'BQ-REA-0005',
        name: 'Power Surge',
        type: 'reaction',
        cost: 2,
        description: 'When an enemy plays a card, gain 1 Energy',
        effects: [{ type: 'energy', value: 1, target: 'self', description: 'Energy absorption' }],
        rarity: 'uncommon'
      },
      'tactical_interrupt': {
        id: 'BQ-REA-0006',
        name: 'Tactical Interrupt',
        type: 'reaction',
        cost: 3,
        description: 'When an enemy moves, you may move 1 tile in response',
        effects: [{ type: 'movement', value: 1, target: 'self', description: 'Reactive positioning' }],
        rarity: 'rare'
      },
      'defensive_matrix_reaction': {
        id: 'BQ-REA-0007',
        name: 'Defensive Matrix',
        type: 'reaction',
        cost: 2,
        description: 'When an enemy attacks an ally, prevent 2 damage to them',
        effects: [{ type: 'prevent', value: 2, target: 'ally', description: 'Team protection' }],
        rarity: 'uncommon'
      },
      'energy_drain': {
        id: 'BQ-REA-0008',
        name: 'Energy Drain',
        type: 'reaction',
        cost: 2,
        description: 'When an enemy gains Energy, they lose 1 Energy instead',
        effects: [{ type: 'drain', value: 1, target: 'enemy', description: 'Power siphon' }],
        rarity: 'uncommon'
      },
      'shield_generator': {
        id: 'BQ-LOT-0002',
        name: 'Shield Generator',
        type: 'loot',
        cost: 0,
        description: 'Permanent: +2 Defense',
        effects: [{ type: 'upgrade', value: 2, target: 'self', description: 'Protective barrier' }],
        rarity: 'uncommon'
      },
      'speed_boost': {
        id: 'BQ-LOT-0003',
        name: 'Speed Boost',
        type: 'loot',
        cost: 0,
        description: 'Permanent: +1 Movement',
        effects: [{ type: 'upgrade', value: 1, target: 'self', description: 'Enhanced mobility' }],
        rarity: 'common'
      },
      'weapon_upgrade': {
        id: 'BQ-LOT-0004',
        name: 'Weapon Upgrade',
        type: 'loot',
        cost: 0,
        description: 'Permanent: +1 Attack',
        effects: [{ type: 'upgrade', value: 1, target: 'self', description: 'Deadlier strikes' }],
        rarity: 'uncommon'
      },
      'sensor_array': {
        id: 'BQ-LOT-0005',
        name: 'Sensor Array',
        type: 'loot',
        cost: 0,
        description: 'Permanent: +2 Range',
        effects: [{ type: 'upgrade', value: 2, target: 'self', description: 'Enhanced detection' }],
        rarity: 'rare'
      }
    };
  }

  /**
   * Set up the game with players
   */
  setupGame() {
    console.log(chalk.blue.bold('\n🧱 BrickQuest Playtest Simulation 🧱\n'));
    console.log(chalk.yellow('Setting up game with 4 players...\n'));

    // Create 4 players with different classes
    this.gameState.players = [
      this.createPlayer('Alice', 'engineer', { x: 0, y: 0 }),
      this.createPlayer('Bob', 'warrior', { x: 3, y: 0 }),
      this.createPlayer('Charlie', 'mage', { x: 0, y: 3 }),
      this.createPlayer('Diana', 'trickster', { x: 3, y: 3 })
    ];

    // Initialize encounter deck with some events
    this.gameState.encounterDeck = [
      this.cardDatabase['security_breach'],
      this.cardDatabase['power_surge'],
      this.cardDatabase['system_overload'],
      this.cardDatabase['treasure_cache'],
      this.cardDatabase['structural_collapse']
    ];

    console.log(chalk.green('✅ Game setup complete!\n'));
    this.displayGameState();
  }

  /**
   * Create a player with starting stats and deck
   */
  createPlayer(name, playerClass, position) {
    const baseStats = {
      hp: 20,
      maxHp: 20,
      energy: 5,
      maxEnergy: 5,
      movement: 3,
      attack: 2,
      defense: 1,
      range: 2
    };

    // Apply class bonuses
    switch (playerClass) {
      case 'engineer':
        baseStats.defense += 2;
        baseStats.maxEnergy += 1;
        baseStats.maxHp += 1;
        break;
      case 'warrior':
        baseStats.attack += 3;
        baseStats.maxHp += 1;
        break;
      case 'mage':
        baseStats.maxEnergy += 2;
        baseStats.movement += 1;
        break;
      case 'trickster':
        baseStats.movement += 2;
        baseStats.attack += 1;
        break;
    }

    // Create starting deck based on class
    const startingDeck = this.getStartingDeck(playerClass);

    return {
      id: name.toLowerCase(),
      name,
      class: playerClass,
      ...baseStats,
      hand: [],
      deck: [...startingDeck],
      discard: [],
      position,
      bricks: 6, // Starting bricks
      activePrograms: []
    };
  }

  /**
   * Get starting deck based on player class
   */
  getStartingDeck(playerClass) {
    const baseCards = [
      'overdrive', 'dash', 'repair', 'retreat', 'desperate_strike'
    ];

    const classCards = {
      engineer: ['barricade', 'bridge', 'turret_base', 'auto_repair', 'command_center', 'supply_depot', 'defensive_matrix'],
      warrior: ['shield_bash', 'precision_shot', 'rally', 'seek_and_destroy', 'power_strike', 'combat_protocol', 'counter_strike'],
      mage: ['energy_surge', 'pulse_strike', 'overclock', 'stealth_mode', 'energy_blast', 'system_scan', 'energy_efficiency'],
      trickster: ['dash', 'retreat', 'retreat_loop', 'stealth_mode', 'tactical_retreat', 'tactical_awareness', 'emergency_repair']
    };

    const allCards = [...baseCards, ...classCards[playerClass]];
    return allCards.map(cardId => this.cardDatabase[cardId]).filter(Boolean);
  }

  /**
   * Run the complete simulation
   */
  async runSimulation() {
    console.log(chalk.blue.bold('🎮 Starting Playtest Simulation...\n'));

    // Simulate 8 turns (2 full rounds)
    for (let turn = 1; turn <= 8 && !this.gameState.gameOver; turn++) {
      console.log(chalk.cyan.bold(`\n${'='.repeat(60)}`));
      console.log(chalk.cyan.bold(`TURN ${turn}`));
      console.log(chalk.cyan.bold(`${'='.repeat(60)}\n`));

      await this.simulateTurn();
      
      if (this.gameState.gameOver) {
        break;
      }
    }

    this.displayFinalResults();
  }

  /**
   * Simulate a complete turn
   */
  async simulateTurn() {
    const player = this.gameState.players[this.gameState.currentPlayer];
    
    console.log(chalk.yellow.bold(`🎯 ${player.name}'s Turn (${player.class.toUpperCase()})`));
    console.log(chalk.gray(`Position: (${player.position.x}, ${player.position.y})`));
    console.log(chalk.gray(`HP: ${player.hp}/${player.maxHp} | Energy: ${player.energy}/${player.maxEnergy} | Bricks: ${player.bricks}\n`));

    // Draw Phase
    await this.simulateDrawPhase(player);
    
    // Action Phase
    await this.simulateActionPhase(player);
    
    // Build Phase
    await this.simulateBuildPhase(player);
    
    // Program Phase
    await this.simulateProgramPhase(player);
    
    // Encounter Phase
    await this.simulateEncounterPhase();
    
    // End Phase
    await this.simulateEndPhase(player);

    // Move to next player
    this.gameState.currentPlayer = (this.gameState.currentPlayer + 1) % this.gameState.players.length;
    if (this.gameState.currentPlayer === 0) {
      this.gameState.turn++;
    }
  }

  /**
   * Simulate Draw Phase
   */
  async simulateDrawPhase(player) {
    console.log(chalk.blue('📖 Draw Phase'));
    
    const cardsToDraw = Math.min(2, player.deck.length); // Draw 2 cards
    const drawnCards = [];
    
    for (let i = 0; i < cardsToDraw; i++) {
      const card = player.deck.pop();
      if (card) {
        player.hand.push(card);
        drawnCards.push(card.name);
      }
    }

    if (drawnCards.length > 0) {
      console.log(chalk.green(`  Drew: ${drawnCards.join(', ')}`));
    } else {
      console.log(chalk.red('  No cards to draw!'));
    }

    console.log(chalk.gray(`  Hand size: ${player.hand.length} cards\n`));
  }

  /**
   * Simulate Action Phase
   */
  async simulateActionPhase(player) {
    console.log(chalk.blue('⚡ Action Phase'));
    
    const actionCards = player.hand.filter(card => card.type === 'action');
    
    if (actionCards.length > 0 && player.energy > 0) {
      // Choose a random action card to play
      const cardToPlay = actionCards[Math.floor(Math.random() * actionCards.length)];
      
      if (player.energy >= cardToPlay.cost) {
        console.log(chalk.green(`  Playing: ${cardToPlay.name} (${cardToPlay.cost} energy)`));
        console.log(chalk.gray(`  Effect: ${cardToPlay.description}`));
        
        // Apply card effects
        this.applyCardEffects(cardToPlay, player);
        
        // Remove card from hand and add to discard
        const cardIndex = player.hand.indexOf(cardToPlay);
        player.hand.splice(cardIndex, 1);
        player.discard.push(cardToPlay);
        
        player.energy -= cardToPlay.cost;
      } else {
        console.log(chalk.red(`  Cannot afford ${cardToPlay.name} (need ${cardToPlay.cost} energy)`));
      }
    } else {
      console.log(chalk.gray('  No action cards to play or no energy'));
    }

    // Simulate movement
    await this.simulateMovement(player);
    
    // Simulate attack if possible
    await this.simulateAttack(player);
    
    console.log('');
  }

  /**
   * Simulate movement
   */
  async simulateMovement(player) {
    const moveDistance = Math.floor(Math.random() * 3) + 1; // 1-3 movement
    const directions = ['north', 'south', 'east', 'west'];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    
    const moveVectors = {
      north: { x: 0, y: -1 },
      south: { x: 0, y: 1 },
      east: { x: 1, y: 0 },
      west: { x: -1, y: 0 }
    };
    
    const move = moveVectors[direction];
    const newX = Math.max(0, Math.min(5, player.position.x + (move.x * moveDistance)));
    const newY = Math.max(0, Math.min(5, player.position.y + (move.y * moveDistance)));
    
    if (newX !== player.position.x || newY !== player.position.y) {
      player.position.x = newX;
      player.position.y = newY;
      console.log(chalk.green(`  Moved ${moveDistance} tiles ${direction} to (${newX}, ${newY})`));
    } else {
      console.log(chalk.gray('  No movement (at board edge)'));
    }
  }

  /**
   * Simulate attack
   */
  async simulateAttack(player) {
    const targets = this.gameState.players.filter(p => 
      p.id !== player.id && 
      p.hp > 0 && 
      this.getDistance(player.position, p.position) <= player.range
    );
    
    if (targets.length > 0) {
      const target = targets[Math.floor(Math.random() * targets.length)];
      const damage = Math.floor(Math.random() * 3) + player.attack; // 1-3 + attack bonus
      
      console.log(chalk.red(`  Attacking ${target.name} for ${damage} damage`));
      
      target.hp = Math.max(0, target.hp - damage);
      
      if (target.hp <= 0) {
        console.log(chalk.red.bold(`  ${target.name} has been defeated!`));
        this.checkWinConditions();
      }
    } else {
      console.log(chalk.gray('  No valid targets in range'));
    }
  }

  /**
   * Simulate Build Phase
   */
  async simulateBuildPhase(player) {
    console.log(chalk.blue('🏗️ Build Phase'));
    
    // Gain bricks
    const bricksGained = 2;
    player.bricks += bricksGained;
    console.log(chalk.green(`  Gained ${bricksGained} bricks (total: ${player.bricks})`));
    
    const structureCards = player.hand.filter(card => card.type === 'structure');
    
    if (structureCards.length > 0 && player.energy > 0) {
      const cardToBuild = structureCards[Math.floor(Math.random() * structureCards.length)];
      
      if (player.energy >= cardToBuild.cost) {
        console.log(chalk.green(`  Building: ${cardToBuild.name} (${cardToBuild.cost} energy)`));
        console.log(chalk.gray(`  Effect: ${cardToBuild.description}`));
        
        // Create terrain tile
        const terrainTile = {
          id: `${cardToBuild.id}_${Date.now()}`,
          type: this.getTerrainTypeFromCard(cardToBuild),
          position: { x: player.position.x, y: player.position.y },
          owner: player.id,
          card: cardToBuild
        };
        
        this.gameState.terrain.push(terrainTile);
        
        // Remove card from hand and add to discard
        const cardIndex = player.hand.indexOf(cardToBuild);
        player.hand.splice(cardIndex, 1);
        player.discard.push(cardToBuild);
        
        player.energy -= cardToBuild.cost;
        player.bricks -= Math.floor(Math.random() * 4) + 2; // Simulate brick cost
      } else {
        console.log(chalk.red(`  Cannot afford ${cardToBuild.name} (need ${cardToBuild.cost} energy)`));
      }
    } else {
      console.log(chalk.gray('  No structure cards to build or no energy'));
    }
    
    console.log('');
  }

  /**
   * Simulate Program Phase
   */
  async simulateProgramPhase(player) {
    console.log(chalk.blue('🤖 Program Phase'));
    
    const programCards = player.hand.filter(card => card.type === 'program');
    
    if (programCards.length > 0 && player.energy > 0) {
      const cardToInstall = programCards[Math.floor(Math.random() * programCards.length)];
      
      if (player.energy >= cardToInstall.cost) {
        console.log(chalk.green(`  Installing: ${cardToInstall.name} (${cardToInstall.cost} energy)`));
        console.log(chalk.gray(`  Effect: ${cardToInstall.description}`));
        
        // Add to active programs
        player.activePrograms.push({
          card: cardToInstall,
          duration: cardToInstall.duration || 1
        });
        
        // Remove card from hand and add to discard
        const cardIndex = player.hand.indexOf(cardToInstall);
        player.hand.splice(cardIndex, 1);
        player.discard.push(cardToInstall);
        
        player.energy -= cardToInstall.cost;
      } else {
        console.log(chalk.red(`  Cannot afford ${cardToInstall.name} (need ${cardToInstall.cost} energy)`));
      }
    } else {
      console.log(chalk.gray('  No program cards to install or no energy'));
    }
    
    console.log('');
  }

  /**
   * Simulate Encounter Phase
   */
  async simulateEncounterPhase() {
    console.log(chalk.blue('🎲 Encounter Phase'));
    
    if (this.gameState.encounterDeck.length > 0 && Math.random() < 0.3) { // 30% chance
      const encounterCard = this.gameState.encounterDeck.pop();
      console.log(chalk.yellow(`  Encounter: ${encounterCard.name}`));
      console.log(chalk.gray(`  Effect: ${encounterCard.description}`));
      
      this.applyEncounterEffects(encounterCard);
    } else {
      console.log(chalk.gray('  No encounter this turn'));
    }
    
    console.log('');
  }

  /**
   * Simulate End Phase
   */
  async simulateEndPhase(player) {
    console.log(chalk.blue('🏁 End Phase'));
    
    // Reset energy
    const oldEnergy = player.energy;
    player.energy = player.maxEnergy;
    console.log(chalk.green(`  Energy restored: ${oldEnergy} → ${player.maxEnergy}`));
    
    // Process active programs
    this.processActivePrograms(player);
    
    // Check win conditions
    this.checkWinConditions();
    
    console.log('');
  }

  /**
   * Apply card effects
   */
  applyCardEffects(card, player) {
    for (const effect of card.effects) {
      switch (effect.type) {
        case 'damage':
          if (effect.target === 'allEnemies') {
            const enemies = this.gameState.players.filter(p => p.id !== player.id && p.hp > 0);
            enemies.forEach(enemy => {
              enemy.hp = Math.max(0, enemy.hp - effect.value);
              console.log(chalk.red(`    ${enemy.name} takes ${effect.value} damage`));
            });
          }
          break;
        case 'heal':
          const oldHp = player.hp;
          player.hp = Math.min(player.maxHp, player.hp + effect.value);
          console.log(chalk.green(`    Healed ${player.hp - oldHp} HP`));
          break;
        case 'energy':
          const oldEnergy = player.energy;
          player.energy = Math.min(player.maxEnergy, player.energy + effect.value);
          console.log(chalk.green(`    Gained ${player.energy - oldEnergy} energy`));
          break;
        case 'movement':
          console.log(chalk.green(`    Gained ${effect.value} movement`));
          break;
      }
    }
  }

  /**
   * Apply encounter effects
   */
  applyEncounterEffects(encounterCard) {
    for (const effect of encounterCard.effects) {
      switch (effect.type) {
        case 'damage':
          if (effect.target === 'all') {
            this.gameState.players.forEach(player => {
              if (player.hp > 0) {
                player.hp = Math.max(0, player.hp - effect.value);
                console.log(chalk.red(`    ${player.name} takes ${effect.value} damage`));
              }
            });
          }
          break;
        case 'draw':
          if (effect.target === 'all') {
            this.gameState.players.forEach(player => {
              const cardsToDraw = Math.min(effect.value, player.deck.length);
              for (let i = 0; i < cardsToDraw; i++) {
                const card = player.deck.pop();
                if (card) {
                  player.hand.push(card);
                }
              }
              console.log(chalk.green(`    ${player.name} draws ${cardsToDraw} cards`));
            });
          }
          break;
        case 'energy':
          if (effect.target === 'all') {
            this.gameState.players.forEach(player => {
              const oldEnergy = player.energy;
              player.energy = Math.min(player.maxEnergy, player.energy + effect.value);
              console.log(chalk.green(`    ${player.name} gains ${player.energy - oldEnergy} energy`));
            });
          }
          break;
        case 'destroy':
          if (effect.target === 'structures') {
            const destroyedCount = this.gameState.terrain.length;
            this.gameState.terrain = [];
            console.log(chalk.red(`    Destroyed ${destroyedCount} structures`));
          }
          break;
      }
    }
  }

  /**
   * Process active programs
   */
  processActivePrograms(player) {
    if (player.activePrograms.length > 0) {
      console.log(chalk.blue('  Processing active programs:'));
      
      player.activePrograms = player.activePrograms.filter(program => {
        program.duration--;
        
        if (program.duration <= 0) {
          console.log(chalk.gray(`    ${program.card.name} expired`));
          return false;
        } else {
          console.log(chalk.green(`    ${program.card.name} active (${program.duration} turns left)`));
          
          // Apply program effects
          for (const effect of program.card.effects) {
            if (effect.type === 'heal') {
              const oldHp = player.hp;
              player.hp = Math.min(player.maxHp, player.hp + effect.value);
              if (player.hp > oldHp) {
                console.log(chalk.green(`      Auto-healed ${player.hp - oldHp} HP`));
              }
            }
          }
          
          return true;
        }
      });
    }
  }

  /**
   * Check win conditions
   */
  checkWinConditions() {
    const alivePlayers = this.gameState.players.filter(p => p.hp > 0);
    
    if (alivePlayers.length <= 1) {
      this.gameState.gameOver = true;
      this.gameState.winner = alivePlayers[0]?.id;
    }
  }

  /**
   * Get distance between two positions
   */
  getDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get terrain type from structure card
   */
  getTerrainTypeFromCard(card) {
    switch (card.name.toLowerCase()) {
      case 'watchtower':
        return 'turret';
      case 'bridge':
        return 'bridge';
      case 'barricade':
        return 'wall';
      case 'turret base':
        return 'turret';
      case 'energy core':
        return 'power';
      case 'healing station':
        return 'healing';
      default:
        return 'floor';
    }
  }

  /**
   * Display current game state
   */
  displayGameState() {
    console.log(chalk.blue.bold('📊 Game State:'));
    this.gameState.players.forEach(player => {
      const status = player.hp > 0 ? '🟢' : '🔴';
      console.log(chalk.white(`  ${status} ${player.name} (${player.class}): HP ${player.hp}/${player.maxHp}, Energy ${player.energy}/${player.maxEnergy}, Pos (${player.position.x},${player.position.y}), Bricks ${player.bricks}`));
    });
    
    if (this.gameState.terrain.length > 0) {
      console.log(chalk.blue.bold('\n🏗️ Structures:'));
      this.gameState.terrain.forEach(tile => {
        console.log(chalk.gray(`  ${tile.type} at (${tile.position.x},${tile.position.y}) - Owner: ${tile.owner}`));
      });
    }
    
    console.log('');
  }

  /**
   * Display final results
   */
  displayFinalResults() {
    console.log(chalk.cyan.bold('\n' + '='.repeat(60)));
    console.log(chalk.cyan.bold('🎉 SIMULATION COMPLETE'));
    console.log(chalk.cyan.bold('='.repeat(60)));
    
    if (this.gameState.gameOver) {
      const winner = this.gameState.players.find(p => p.id === this.gameState.winner);
      console.log(chalk.green.bold(`\n🏆 Winner: ${winner.name} (${winner.class})`));
    } else {
      console.log(chalk.yellow.bold('\n⏰ Simulation ended after 8 turns'));
    }
    
    console.log(chalk.blue.bold('\n📊 Final Statistics:'));
    this.gameState.players.forEach(player => {
      const status = player.hp > 0 ? '🟢 Alive' : '🔴 Defeated';
      console.log(chalk.white(`  ${player.name} (${player.class}): ${status} - HP ${player.hp}/${player.maxHp}, Energy ${player.energy}/${player.maxEnergy}`));
      console.log(chalk.gray(`    Hand: ${player.hand.length} cards, Deck: ${player.deck.length} cards, Discard: ${player.discard.length} cards`));
      console.log(chalk.gray(`    Active Programs: ${player.activePrograms.length}, Bricks: ${player.bricks}`));
    });
    
    console.log(chalk.blue.bold('\n🏗️ Final Terrain:'));
    if (this.gameState.terrain.length > 0) {
      this.gameState.terrain.forEach(tile => {
        console.log(chalk.gray(`  ${tile.type} at (${tile.position.x},${tile.position.y}) - Owner: ${tile.owner}`));
      });
    } else {
      console.log(chalk.gray('  No structures remaining'));
    }
    
    console.log(chalk.blue.bold('\n🎯 Simulation Summary:'));
    console.log(chalk.white(`  Total turns: ${this.gameState.turn}`));
    console.log(chalk.white(`  Total structures built: ${this.gameState.terrain.length}`));
    console.log(chalk.white(`  Encounter cards remaining: ${this.gameState.encounterDeck.length}`));
    
    console.log(chalk.green.bold('\n✅ Playtest simulation completed successfully!'));
  }
}

// Run the simulation
if (require.main === module) {
  const simulation = new BrickQuestSimulation();
  simulation.runSimulation().catch(console.error);
}

module.exports = BrickQuestSimulation;
