/**
 * Encounter System - Handles encounters, events, and AI behaviors
 */

import { Card, Player } from './cards';
import { TerrainTile } from './terrain';

export interface Encounter {
  id: string;
  name: string;
  type: 'event' | 'combat' | 'treasure' | 'hazard' | 'story';
  description: string;
  effects: EncounterEffect[];
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  rewards?: EncounterReward[];
}

export interface EncounterEffect {
  type: 'damage' | 'heal' | 'energy' | 'terrain' | 'card' | 'special';
  value: number;
  target: 'all' | 'random' | 'nearest' | 'farthest' | 'lowest_hp' | 'highest_hp';
  description: string;
}

export interface EncounterReward {
  type: 'card' | 'energy' | 'hp' | 'upgrade';
  value: number;
  description: string;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  position: { x: number; y: number };
  behavior: EnemyBehavior;
  stats: {
    attack: number;
    defense: number;
    movement: number;
    range: number;
  };
}

export interface EnemyBehavior {
  type: 'aggressive' | 'defensive' | 'patrol' | 'guard' | 'berserker';
  target: 'nearest' | 'weakest' | 'strongest' | 'random';
  movement: 'toward' | 'away' | 'patrol' | 'stationary';
  attack: 'melee' | 'ranged' | 'area' | 'special';
}

export class EncounterManager {
  private encounters: Map<string, Encounter> = new Map();
  private enemies: Enemy[] = [];
  private encounterDeck: Card[] = [];

  constructor() {
    this.loadEncounters();
    this.loadEncounterDeck();
  }

  /**
   * Draw and resolve an encounter
   */
  drawEncounter(players: Player[], terrain: TerrainTile[]): EncounterResult {
    if (this.encounterDeck.length === 0) {
      this.encounterDeck = this.createEncounterDeck();
    }

    const encounterCard = this.encounterDeck.pop();
    if (!encounterCard) {
      throw new Error('No encounter cards available');
    }

    const encounter = this.encounters.get(encounterCard.id);
    if (!encounter) {
      throw new Error(`Encounter not found: ${encounterCard.id}`);
    }

    return this.resolveEncounter(encounter, players, terrain);
  }

  /**
   * Resolve encounter effects
   */
  private resolveEncounter(encounter: Encounter, players: Player[], terrain: TerrainTile[]): EncounterResult {
    const result: EncounterResult = {
      encounter,
      effects: [],
      rewards: [],
      enemies: [],
      message: encounter.description
    };

    // Apply encounter effects
    for (const effect of encounter.effects) {
      const effectResult = this.applyEncounterEffect(effect, players, terrain);
      result.effects.push(effectResult);
    }

    // Spawn enemies if combat encounter
    if (encounter.type === 'combat') {
      const spawnedEnemies = this.spawnEnemies(encounter, players);
      result.enemies = spawnedEnemies;
    }

    // Apply rewards
    if (encounter.rewards) {
      for (const reward of encounter.rewards) {
        const rewardResult = this.applyReward(reward, players);
        result.rewards.push(rewardResult);
      }
    }

    return result;
  }

  /**
   * Apply encounter effect
   */
  private applyEncounterEffect(effect: EncounterEffect, players: Player[], terrain: TerrainTile[]): EffectResult {
    const result: EffectResult = {
      effect,
      success: true,
      message: effect.description,
      targets: []
    };

    const targets = this.selectTargets(effect.target, players);

    for (const target of targets) {
      switch (effect.type) {
        case 'damage':
          target.hp = Math.max(0, target.hp - effect.value);
          result.targets.push(target.id);
          break;
        
        case 'heal':
          target.hp = Math.min(target.maxHp, target.hp + effect.value);
          result.targets.push(target.id);
          break;
        
        case 'energy':
          target.energy = Math.min(target.maxEnergy, target.energy + effect.value);
          result.targets.push(target.id);
          break;
        
        case 'terrain':
          this.modifyTerrain(effect, terrain);
          break;
        
        case 'card':
          this.modifyCards(effect, target);
          break;
      }
    }

    return result;
  }

  /**
   * Select targets for encounter effect
   */
  private selectTargets(targetType: EncounterEffect['target'], players: Player[]): Player[] {
    const alivePlayers = players.filter(p => p.hp > 0);
    
    switch (targetType) {
      case 'all':
        return alivePlayers;
      
      case 'random':
        const randomIndex = Math.floor(Math.random() * alivePlayers.length);
        return [alivePlayers[randomIndex]];
      
      case 'nearest':
        // This would need position data to determine nearest
        return [alivePlayers[0]];
      
      case 'farthest':
        return [alivePlayers[alivePlayers.length - 1]];
      
      case 'lowest_hp':
        return [alivePlayers.reduce((lowest, current) => 
          current.hp < lowest.hp ? current : lowest
        )];
      
      case 'highest_hp':
        return [alivePlayers.reduce((highest, current) => 
          current.hp > highest.hp ? current : highest
        )];
      
      default:
        return alivePlayers;
    }
  }

  /**
   * Spawn enemies for combat encounter
   */
  private spawnEnemies(encounter: Encounter, players: Player[]): Enemy[] {
    const enemies: Enemy[] = [];
    const enemyCount = this.getEnemyCount(encounter.difficulty, players.length);

    for (let i = 0; i < enemyCount; i++) {
      const enemy = this.createEnemy(encounter.difficulty, players);
      enemies.push(enemy);
    }

    this.enemies.push(...enemies);
    return enemies;
  }

  /**
   * Create enemy based on difficulty
   */
  private createEnemy(difficulty: Encounter['difficulty'], players: Player[]): Enemy {
    const baseStats = this.getBaseEnemyStats(difficulty);
    
    return {
      id: `enemy_${Date.now()}_${Math.random()}`,
      name: this.getEnemyName(difficulty),
      hp: baseStats.hp,
      maxHp: baseStats.hp,
      position: this.getSpawnPosition(players),
      behavior: this.getEnemyBehavior(difficulty),
      stats: {
        attack: baseStats.attack,
        defense: baseStats.defense,
        movement: baseStats.movement,
        range: baseStats.range
      }
    };
  }

  /**
   * Get enemy count based on difficulty and player count
   */
  private getEnemyCount(difficulty: Encounter['difficulty'], playerCount: number): number {
    const baseCount = playerCount;
    
    switch (difficulty) {
      case 'easy':
        return Math.max(1, baseCount - 1);
      case 'medium':
        return baseCount;
      case 'hard':
        return baseCount + 1;
      case 'extreme':
        return baseCount + 2;
      default:
        return baseCount;
    }
  }

  /**
   * Get base enemy stats by difficulty
   */
  private getBaseEnemyStats(difficulty: Encounter['difficulty']): {
    hp: number;
    attack: number;
    defense: number;
    movement: number;
    range: number;
  } {
    const stats = {
      easy: { hp: 8, attack: 1, defense: 0, movement: 2, range: 1 },
      medium: { hp: 12, attack: 2, defense: 1, movement: 3, range: 2 },
      hard: { hp: 18, attack: 3, defense: 2, movement: 4, range: 3 },
      extreme: { hp: 25, attack: 4, defense: 3, movement: 5, range: 4 }
    };

    return stats[difficulty];
  }

  /**
   * Get enemy name by difficulty
   */
  private getEnemyName(difficulty: Encounter['difficulty']): string {
    const names = {
      easy: ['Scout Bot', 'Repair Drone', 'Security Bot'],
      medium: ['Combat Bot', 'Guardian', 'Hunter'],
      hard: ['Elite Guard', 'War Machine', 'Destroyer'],
      extreme: ['Boss Mech', 'Titan', 'Annihilator']
    };

    const nameList = names[difficulty];
    return nameList[Math.floor(Math.random() * nameList.length)];
  }

  /**
   * Get spawn position for enemy
   */
  private getSpawnPosition(players: Player[]): { x: number; y: number } {
    // Simple spawn logic - in a real game, you'd want more sophisticated positioning
    const maxDistance = 5;
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * maxDistance + 2;
    
    return {
      x: Math.round(Math.cos(angle) * distance),
      y: Math.round(Math.sin(angle) * distance)
    };
  }

  /**
   * Get enemy behavior by difficulty
   */
  private getEnemyBehavior(difficulty: Encounter['difficulty']): EnemyBehavior {
    const behaviors = {
      easy: { type: 'defensive', target: 'nearest', movement: 'toward', attack: 'melee' },
      medium: { type: 'aggressive', target: 'nearest', movement: 'toward', attack: 'ranged' },
      hard: { type: 'aggressive', target: 'weakest', movement: 'toward', attack: 'area' },
      extreme: { type: 'berserker', target: 'strongest', movement: 'toward', attack: 'special' }
    };

    return behaviors[difficulty];
  }

  /**
   * Apply encounter reward
   */
  private applyReward(reward: EncounterReward, players: Player[]): RewardResult {
    const result: RewardResult = {
      reward,
      success: true,
      message: reward.description,
      targets: []
    };

    // Apply reward to all players
    for (const player of players) {
      switch (reward.type) {
        case 'card':
          // Add card to player's deck
          result.targets.push(player.id);
          break;
        case 'energy':
          player.energy = Math.min(player.maxEnergy, player.energy + reward.value);
          result.targets.push(player.id);
          break;
        case 'hp':
          player.hp = Math.min(player.maxHp, player.hp + reward.value);
          result.targets.push(player.id);
          break;
        case 'upgrade':
          // Add upgrade to player's robot
          result.targets.push(player.id);
          break;
      }
    }

    return result;
  }

  /**
   * Load encounter definitions
   */
  private loadEncounters(): void {
    const encounters: Encounter[] = [
      {
        id: 'system_overload',
        name: 'System Overload',
        type: 'hazard',
        description: 'The facility\'s power systems are unstable!',
        effects: [
          {
            type: 'energy',
            value: -2,
            target: 'all',
            description: 'All players lose 2 energy'
          }
        ],
        difficulty: 'medium'
      },
      {
        id: 'security_breach',
        name: 'Security Breach',
        type: 'combat',
        description: 'Security bots have detected your presence!',
        effects: [],
        difficulty: 'medium',
        rewards: [
          {
            type: 'card',
            value: 1,
            description: 'Gain a random card'
          }
        ]
      },
      {
        id: 'treasure_cache',
        name: 'Treasure Cache',
        type: 'treasure',
        description: 'You found a hidden cache of supplies!',
        effects: [],
        difficulty: 'easy',
        rewards: [
          {
            type: 'energy',
            value: 3,
            description: 'Gain 3 energy'
          },
          {
            type: 'hp',
            value: 5,
            description: 'Heal 5 HP'
          }
        ]
      }
    ];

    encounters.forEach(encounter => {
      this.encounters.set(encounter.id, encounter);
    });
  }

  /**
   * Load encounter deck
   */
  private loadEncounterDeck(): void {
    // Create encounter cards based on loaded encounters
    const encounterCards: Card[] = Array.from(this.encounters.values()).map(encounter => ({
      id: encounter.id,
      name: encounter.name,
      type: 'event' as const,
      cost: 0,
      description: encounter.description,
      effects: encounter.effects.map(effect => ({
        type: effect.type as any,
        value: effect.value,
        target: effect.target as any,
        description: effect.description
      })),
      rarity: 'common' as const
    }));

    this.encounterDeck = [...encounterCards];
    this.shuffleDeck(this.encounterDeck);
  }

  /**
   * Create new encounter deck
   */
  private createEncounterDeck(): Card[] {
    this.loadEncounterDeck();
    return [...this.encounterDeck];
  }

  /**
   * Shuffle deck
   */
  private shuffleDeck(deck: Card[]): void {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  /**
   * Modify terrain based on encounter effect
   */
  private modifyTerrain(effect: EncounterEffect, terrain: TerrainTile[]): void {
    // Implement terrain modification logic
    console.log(`Terrain effect: ${effect.description}`);
  }

  /**
   * Modify cards based on encounter effect
   */
  private modifyCards(effect: EncounterEffect, player: Player): void {
    // Implement card modification logic
    console.log(`Card effect: ${effect.description}`);
  }
}

export interface EncounterResult {
  encounter: Encounter;
  effects: EffectResult[];
  rewards: RewardResult[];
  enemies: Enemy[];
  message: string;
}

export interface EffectResult {
  effect: EncounterEffect;
  success: boolean;
  message: string;
  targets: string[];
}

export interface RewardResult {
  reward: EncounterReward;
  success: boolean;
  message: string;
  targets: string[];
}


