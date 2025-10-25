/**
 * CLI Interface for BrickQuest
 */

const chalk = require('chalk');
const inquirer = require('inquirer');

// Import game engines (we'll need to convert these to JS or use a different approach)
// For now, we'll create a simplified version

class BrickQuestCLI {
  constructor() {
    this.gameState = null;
    this.currentPlayer = null;
    this.players = [];
  }

  /**
   * Start the game
   */
  async start() {
    console.log(chalk.blue.bold('\n🧱 Welcome to BrickQuest! 🧱\n'));
    console.log('A hybrid tabletop + maker game combining card mechanics, Lego building, and 3D printed terrain.\n');

    await this.showMainMenu();
  }

  /**
   * Show main menu
   */
  async showMainMenu() {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '🎮 Start New Game', value: 'new_game' },
          { name: '📚 View Rules', value: 'rules' },
          { name: '🃏 Card Reference', value: 'cards' },
          { name: '🖨️ 3D Printing Guide', value: 'printing' },
          { name: '❌ Exit', value: 'exit' }
        ]
      }
    ]);

    switch (action) {
      case 'new_game':
        await this.startNewGame();
        break;
      case 'rules':
        await this.showRules();
        break;
      case 'cards':
        await this.showCardReference();
        break;
      case 'printing':
        await this.showPrintingGuide();
        break;
      case 'exit':
        console.log(chalk.green('\nThanks for playing BrickQuest! 🧱\n'));
        process.exit(0);
    }
  }

  /**
   * Start a new game
   */
  async startNewGame() {
    console.log(chalk.yellow('\n🎮 Starting New Game...\n'));

    // Get player count
    const { playerCount } = await inquirer.prompt([
      {
        type: 'number',
        name: 'playerCount',
        message: 'How many players? (2-5)',
        validate: (input) => {
          const num = parseInt(input);
          return num >= 2 && num <= 5 ? true : 'Please enter a number between 2 and 5';
        }
      }
    ]);

    // Get player details
    this.players = [];
    for (let i = 0; i < playerCount; i++) {
      const playerData = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: `Player ${i + 1} name:`,
          validate: (input) => input.trim().length > 0 ? true : 'Name cannot be empty'
        },
        {
          type: 'list',
          name: 'class',
          message: 'Choose your robot class:',
          choices: [
            { name: '🔧 Engineer - Build efficiency and structures', value: 'engineer' },
            { name: '⚔️ Warrior - Combat focus and damage', value: 'warrior' },
            { name: '⚡ Mage Core - Energy manipulation', value: 'mage' },
            { name: '🎭 Trickster - Mobility and sabotage', value: 'trickster' }
          ]
        }
      ]);

      this.players.push({
        id: `player_${i}`,
        name: playerData.name,
        class: playerData.class,
        hp: 20,
        maxHp: 20,
        energy: 5,
        maxEnergy: 5,
        hand: [],
        deck: [],
        discard: [],
        position: { x: 0, y: 0 }
      });
    }

    this.currentPlayer = 0;
    console.log(chalk.green('\n✅ Game initialized! Let\'s begin!\n'));

    await this.gameLoop();
  }

  /**
   * Main game loop
   */
  async gameLoop() {
    while (true) {
      const player = this.players[this.currentPlayer];
      console.log(chalk.blue.bold(`\n🎯 ${player.name}'s Turn (${player.class})`));
      console.log(`HP: ${player.hp}/${player.maxHp} | Energy: ${player.energy}/${player.maxEnergy}`);

      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: '🃏 Play Card', value: 'play_card' },
            { name: '🏗️ Build Structure', value: 'build' },
            { name: '🤖 Program Robot', value: 'program' },
            { name: '📍 Move', value: 'move' },
            { name: '⚔️ Attack', value: 'attack' },
            { name: '📋 View Hand', value: 'hand' },
            { name: '🗺️ View Map', value: 'map' },
            { name: '⏭️ End Turn', value: 'end_turn' }
          ]
        }
      ]);

      switch (action) {
        case 'play_card':
          await this.playCard(player);
          break;
        case 'build':
          await this.buildStructure(player);
          break;
        case 'program':
          await this.programRobot(player);
          break;
        case 'move':
          await this.movePlayer(player);
          break;
        case 'attack':
          await this.attack(player);
          break;
        case 'hand':
          await this.showHand(player);
          break;
        case 'map':
          await this.showMap();
          break;
        case 'end_turn':
          await this.endTurn();
          break;
      }
    }
  }

  /**
   * Play a card
   */
  async playCard(player) {
    if (player.hand.length === 0) {
      console.log(chalk.red('No cards in hand!'));
      return;
    }

    const { cardId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'cardId',
        message: 'Choose a card to play:',
        choices: player.hand.map(card => ({
          name: `${card.name} (${card.cost} energy) - ${card.description}`,
          value: card.id
        }))
      }
    ]);

    const card = player.hand.find(c => c.id === cardId);
    if (card && player.energy >= card.cost) {
      player.energy -= card.cost;
      player.hand = player.hand.filter(c => c.id !== cardId);
      player.discard.push(card);
      
      console.log(chalk.green(`✅ Played ${card.name}!`));
      console.log(chalk.yellow(`Effects: ${card.effects.map(e => e.description).join(', ')}`));
    } else {
      console.log(chalk.red('Not enough energy to play this card!'));
    }
  }

  /**
   * Build a structure
   */
  async buildStructure(player) {
    const structureCards = player.hand.filter(card => card.type === 'structure');
    
    if (structureCards.length === 0) {
      console.log(chalk.red('No structure cards in hand!'));
      return;
    }

    const { cardId, x, y } = await inquirer.prompt([
      {
        type: 'list',
        name: 'cardId',
        message: 'Choose a structure to build:',
        choices: structureCards.map(card => ({
          name: `${card.name} (${card.cost} energy) - ${card.description}`,
          value: card.id
        }))
      },
      {
        type: 'number',
        name: 'x',
        message: 'X coordinate:',
        default: 0
      },
      {
        type: 'number',
        name: 'y',
        message: 'Y coordinate:',
        default: 0
      }
    ]);

    const card = structureCards.find(c => c.id === cardId);
    if (card && player.energy >= card.cost) {
      player.energy -= card.cost;
      player.hand = player.hand.filter(c => c.id !== cardId);
      player.discard.push(card);
      
      console.log(chalk.green(`✅ Built ${card.name} at (${x}, ${y})!`));
    } else {
      console.log(chalk.red('Not enough energy to build this structure!'));
    }
  }

  /**
   * Program robot
   */
  async programRobot(player) {
    const programCards = player.hand.filter(card => card.type === 'program');
    
    if (programCards.length === 0) {
      console.log(chalk.red('No program cards in hand!'));
      return;
    }

    const { cardId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'cardId',
        message: 'Choose a program to install:',
        choices: programCards.map(card => ({
          name: `${card.name} (${card.cost} energy) - ${card.description}`,
          value: card.id
        }))
      }
    ]);

    const card = programCards.find(c => c.id === cardId);
    if (card && player.energy >= card.cost) {
      player.energy -= card.cost;
      player.hand = player.hand.filter(c => c.id !== cardId);
      player.discard.push(card);
      
      console.log(chalk.green(`✅ Installed ${card.name} program!`));
    } else {
      console.log(chalk.red('Not enough energy to install this program!'));
    }
  }

  /**
   * Move player
   */
  async movePlayer(player) {
    const { direction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'direction',
        message: 'Choose direction to move:',
        choices: [
          { name: '⬆️ North', value: 'north' },
          { name: '➡️ East', value: 'east' },
          { name: '⬇️ South', value: 'south' },
          { name: '⬅️ West', value: 'west' }
        ]
      }
    ]);

    const movement = {
      north: { x: 0, y: -1 },
      east: { x: 1, y: 0 },
      south: { x: 0, y: 1 },
      west: { x: -1, y: 0 }
    };

    const move = movement[direction];
    player.position.x += move.x;
    player.position.y += move.y;
    
    console.log(chalk.green(`✅ Moved to (${player.position.x}, ${player.position.y})`));
  }

  /**
   * Attack another player
   */
  async attack(player) {
    const targets = this.players.filter(p => p.id !== player.id && p.hp > 0);
    
    if (targets.length === 0) {
      console.log(chalk.red('No valid targets!'));
      return;
    }

    const { targetId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'targetId',
        message: 'Choose target:',
        choices: targets.map(target => ({
          name: `${target.name} (${target.hp} HP)`,
          value: target.id
        }))
      }
    ]);

    const target = targets.find(t => t.id === targetId);
    if (target) {
      const damage = Math.floor(Math.random() * 3) + 1; // 1-3 damage
      target.hp = Math.max(0, target.hp - damage);
      
      console.log(chalk.green(`✅ Attacked ${target.name} for ${damage} damage!`));
      
      if (target.hp <= 0) {
        console.log(chalk.red(`${target.name} has been defeated!`));
      }
    }
  }

  /**
   * Show player's hand
   */
  async showHand(player) {
    console.log(chalk.blue.bold('\n🃏 Your Hand:'));
    if (player.hand.length === 0) {
      console.log('No cards in hand.');
    } else {
      player.hand.forEach((card, index) => {
        console.log(`${index + 1}. ${card.name} (${card.cost} energy) - ${card.description}`);
      });
    }
    
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
  }

  /**
   * Show game map
   */
  async showMap() {
    console.log(chalk.blue.bold('\n🗺️ Game Map:'));
    console.log('Players:');
    this.players.forEach(player => {
      console.log(`  ${player.name} (${player.class}): (${player.position.x}, ${player.position.y}) - ${player.hp} HP`);
    });
    
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
  }

  /**
   * End turn
   */
  async endTurn() {
    const player = this.players[this.currentPlayer];
    
    // Reset energy
    player.energy = player.maxEnergy;
    
    // Move to next player
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    
    console.log(chalk.yellow(`\n⏭️ ${player.name}'s turn ended. Energy restored to ${player.maxEnergy}.`));
  }

  /**
   * Show game rules
   */
  async showRules() {
    console.log(chalk.blue.bold('\n📚 BrickQuest Rules\n'));
    console.log('BrickQuest is a hybrid tabletop + maker game that combines:');
    console.log('• 🃏 Card game mechanics for actions, events, and upgrades');
    console.log('• 🧠 Light D&D-style storytelling and character progression');
    console.log('• 🧱 Lego building for dynamic in-game construction');
    console.log('• 🖨️ 3D printed terrain and parts for modular setup\n');
    
    console.log('Game Phases:');
    console.log('1. Draw Phase - Draw cards up to hand limit');
    console.log('2. Action Phase - Play action cards, move, attack');
    console.log('3. Build Phase - Construct structures with Lego/3D parts');
    console.log('4. Program Phase - Install robot programs');
    console.log('5. Encounter Phase - Resolve events and encounters');
    console.log('6. End Phase - Reset energy, process active effects\n');
    
    console.log('Robot Classes:');
    console.log('• 🔧 Engineer - Build efficiency and structures');
    console.log('• ⚔️ Warrior - Combat focus and damage');
    console.log('• ⚡ Mage Core - Energy manipulation');
    console.log('• 🎭 Trickster - Mobility and sabotage\n');
    
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    await this.showMainMenu();
  }

  /**
   * Show card reference
   */
  async showCardReference() {
    console.log(chalk.blue.bold('\n🃏 Card Reference\n'));
    console.log('Card Types:');
    console.log('• Action - Movement, attack, defend, repair');
    console.log('• Structure - Create physical objects with Lego/3D terrain');
    console.log('• Program - Give temporary AI to your robot');
    console.log('• Event - Dungeon/world effects');
    console.log('• Loot & Upgrade - Permanent or temporary improvements\n');
    
    console.log('Example Cards:');
    console.log('• Overdrive (Action) - Double movement for this turn');
    console.log('• Pulse Strike (Action) - Energy attack that damages all enemies in range');
    console.log('• Watchtower (Structure) - Build a defensive structure that provides cover');
    console.log('• Auto-Repair (Program) - Automatically repair 1 HP at the start of each turn\n');
    
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    await this.showMainMenu();
  }

  /**
   * Show 3D printing guide
   */
  async showPrintingGuide() {
    console.log(chalk.blue.bold('\n🖨️ 3D Printing Guide\n'));
    console.log('Required STL Files:');
    console.log('• base_hex_tile.stl - Basic hexagonal floor tile with Lego-compatible pegs');
    console.log('• turret_platform.stl - Raised platform for turret placement');
    console.log('• bridge_tile.stl - Bridge connecting two terrain pieces');
    console.log('• trap_tile.stl - Floor tile with trap mechanism');
    console.log('• archway.stl - Dungeon gate archway\n');
    
    console.log('Print Settings:');
    console.log('• Material: PLA (recommended)');
    console.log('• Layer Height: 0.2mm');
    console.log('• Infill: 20%');
    console.log('• Supports: As needed\n');
    
    console.log('Lego Compatibility:');
    console.log('• All terrain pieces include Lego-compatible connection points');
    console.log('• Use standard Lego plates and bricks for custom structures');
    console.log('• Robot upgrades can be attached using Lego-compatible mounts\n');
    
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    await this.showMainMenu();
  }
}

// Start the CLI if this file is run directly
if (require.main === module) {
  const cli = new BrickQuestCLI();
  cli.start().catch(console.error);
}

module.exports = BrickQuestCLI;


