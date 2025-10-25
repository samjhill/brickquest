/**
 * Card Engine - Core card resolution and management
 */

export interface Card {
  id: string;
  name: string;
  type: 'action' | 'structure' | 'program' | 'event' | 'loot' | 'upgrade';
  cost: number;
  description: string;
  effects: CardEffect[];
  range?: number;
  damage?: number;
  duration?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface CardEffect {
  type: 'damage' | 'heal' | 'move' | 'build' | 'program' | 'draw' | 'energy' | 'special';
  value: number;
  target: 'self' | 'enemy' | 'all' | 'terrain' | 'robot';
  condition?: string;
  description: string;
}

export interface Player {
  id: string;
  name: string;
  class: 'engineer' | 'warrior' | 'mage' | 'trickster';
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  hand: Card[];
  deck: Card[];
  discard: Card[];
  robot: Robot;
  position: { x: number; y: number };
}

export interface Robot {
  upgrades: RobotUpgrade[];
  stats: {
    movement: number;
    attack: number;
    defense: number;
    energy: number;
  };
}

export interface RobotUpgrade {
  id: string;
  name: string;
  type: 'weapon' | 'mobility' | 'sensor' | 'power' | 'armor';
  stats: {
    movement?: number;
    attack?: number;
    defense?: number;
    energy?: number;
  };
  description: string;
}

export class CardEngine {
  private cards: Map<string, Card> = new Map();

  constructor() {
    this.loadBaseCards();
  }

  /**
   * Load base card set from JSON
   */
  private loadBaseCards(): void {
    // This will be populated from cards/base_set.json
    // For now, we'll define some basic cards
    const baseCards: Card[] = [
      {
        id: 'overdrive',
        name: 'Overdrive',
        type: 'action',
        cost: 2,
        description: 'Double movement for this turn',
        effects: [
          {
            type: 'move',
            value: 2,
            target: 'self',
            description: 'Gain 2 additional movement'
          }
        ],
        rarity: 'common'
      },
      {
        id: 'pulse_strike',
        name: 'Pulse Strike',
        type: 'action',
        cost: 3,
        description: 'Energy attack that damages all enemies in range',
        effects: [
          {
            type: 'damage',
            value: 2,
            target: 'enemy',
            description: 'Deal 2 energy damage to all enemies in range'
          }
        ],
        range: 3,
        damage: 2,
        rarity: 'uncommon'
      },
      {
        id: 'watchtower',
        name: 'Watchtower',
        type: 'structure',
        cost: 4,
        description: 'Build a defensive structure that provides cover',
        effects: [
          {
            type: 'build',
            value: 1,
            target: 'terrain',
            description: 'Place a watchtower structure'
          }
        ],
        rarity: 'common'
      },
      {
        id: 'auto_repair',
        name: 'Auto-Repair',
        type: 'program',
        cost: 2,
        description: 'Automatically repair 1 HP at the start of each turn',
        effects: [
          {
            type: 'heal',
            value: 1,
            target: 'self',
            description: 'Heal 1 HP at start of turn'
          }
        ],
        duration: 3,
        rarity: 'uncommon'
      }
    ];

    baseCards.forEach(card => {
      this.cards.set(card.id, card);
    });
  }

  /**
   * Get a card by ID
   */
  getCard(id: string): Card | undefined {
    return this.cards.get(id);
  }

  /**
   * Get all cards of a specific type
   */
  getCardsByType(type: Card['type']): Card[] {
    return Array.from(this.cards.values()).filter(card => card.type === type);
  }

  /**
   * Resolve a card's effects
   */
  resolveCard(card: Card, player: Player, target?: Player | { x: number; y: number }): CardResolution {
    const resolution: CardResolution = {
      card,
      player,
      effects: [],
      success: true,
      message: ''
    };

    // Check if player has enough energy
    if (player.energy < card.cost) {
      resolution.success = false;
      resolution.message = 'Not enough energy to play this card';
      return resolution;
    }

    // Apply card effects
    for (const effect of card.effects) {
      const effectResult = this.applyEffect(effect, player, target);
      resolution.effects.push(effectResult);
    }

    // Deduct energy cost
    player.energy -= card.cost;

    resolution.message = `Played ${card.name}`;
    return resolution;
  }

  /**
   * Apply a single card effect
   */
  private applyEffect(effect: CardEffect, player: Player, target?: Player | { x: number; y: number }): EffectResult {
    const result: EffectResult = {
      effect,
      success: true,
      value: effect.value,
      message: ''
    };

    switch (effect.type) {
      case 'damage':
        if (target && 'hp' in target) {
          target.hp = Math.max(0, target.hp - effect.value);
          result.message = `Dealt ${effect.value} damage`;
        }
        break;
      
      case 'heal':
        player.hp = Math.min(player.maxHp, player.hp + effect.value);
        result.message = `Healed ${effect.value} HP`;
        break;
      
      case 'move':
        // Movement logic would be handled by the game state
        result.message = `Gained ${effect.value} movement`;
        break;
      
      case 'build':
        // Building logic would be handled by the terrain system
        result.message = `Built structure`;
        break;
      
      case 'energy':
        player.energy = Math.min(player.maxEnergy, player.energy + effect.value);
        result.message = `Gained ${effect.value} energy`;
        break;
      
      default:
        result.message = `Applied ${effect.type} effect`;
    }

    return result;
  }

  /**
   * Create a new player with starting deck
   */
  createPlayer(id: string, name: string, playerClass: Player['class']): Player {
    const startingDeck = this.getStartingDeck(playerClass);
    
    return {
      id,
      name,
      class: playerClass,
      hp: 20,
      maxHp: 20,
      energy: 5,
      maxEnergy: 5,
      hand: [],
      deck: [...startingDeck],
      discard: [],
      robot: this.getStartingRobot(playerClass),
      position: { x: 0, y: 0 }
    };
  }

  /**
   * Get starting deck based on player class
   */
  private getStartingDeck(playerClass: Player['class']): Card[] {
    const baseCards = [
      this.cards.get('overdrive')!,
      this.cards.get('pulse_strike')!,
      this.cards.get('watchtower')!,
      this.cards.get('auto_repair')!
    ];

    // Add class-specific cards
    switch (playerClass) {
      case 'engineer':
        // Engineers get more structure cards
        break;
      case 'warrior':
        // Warriors get more combat cards
        break;
      case 'mage':
        // Mages get more energy manipulation cards
        break;
      case 'trickster':
        // Tricksters get more mobility cards
        break;
    }

    return baseCards;
  }

  /**
   * Get starting robot based on player class
   */
  private getStartingRobot(playerClass: Player['class']): Robot {
    const baseStats = {
      movement: 3,
      attack: 2,
      defense: 1,
      energy: 5
    };

    // Modify stats based on class
    switch (playerClass) {
      case 'engineer':
        return { upgrades: [], stats: { ...baseStats, defense: 2 } };
      case 'warrior':
        return { upgrades: [], stats: { ...baseStats, attack: 3 } };
      case 'mage':
        return { upgrades: [], stats: { ...baseStats, energy: 7 } };
      case 'trickster':
        return { upgrades: [], stats: { ...baseStats, movement: 4 } };
    }
  }
}

export interface CardResolution {
  card: Card;
  player: Player;
  effects: EffectResult[];
  success: boolean;
  message: string;
}

export interface EffectResult {
  effect: CardEffect;
  success: boolean;
  value: number;
  message: string;
}


