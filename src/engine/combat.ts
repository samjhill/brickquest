/**
 * Combat System - Handles combat resolution and damage calculation
 */

import { Player, Card, CardEffect } from './cards';
import { TerrainTile } from './turn';

export interface CombatResult {
  attacker: Player;
  target: Player;
  damage: number;
  blocked: number;
  critical: boolean;
  effects: string[];
}

export interface AttackModifier {
  type: 'damage' | 'accuracy' | 'critical' | 'range';
  value: number;
  source: string;
}

export class CombatEngine {
  /**
   * Calculate damage between two players
   */
  calculateDamage(attacker: Player, target: Player, card: Card, terrain: TerrainTile[]): CombatResult {
    let baseDamage = card.damage || 1;
    let blocked = 0;
    let critical = false;
    const effects: string[] = [];

    // Apply attacker's robot attack bonus
    baseDamage += attacker.robot.stats.attack;

    // Apply target's robot defense
    blocked = Math.min(target.robot.stats.defense, baseDamage);
    baseDamage -= blocked;

    // Check for critical hit (10% base chance)
    const criticalChance = 0.1 + (attacker.robot.stats.attack * 0.02);
    if (Math.random() < criticalChance) {
      critical = true;
      baseDamage = Math.floor(baseDamage * 1.5);
      effects.push('Critical hit!');
    }

    // Apply terrain modifiers
    const terrainModifiers = this.getTerrainModifiers(attacker, target, terrain);
    baseDamage = Math.floor(baseDamage * terrainModifiers.damage);
    
    if (terrainModifiers.cover > 0) {
      blocked += terrainModifiers.cover;
      effects.push('Terrain provides cover');
    }

    // Apply card effects
    for (const effect of card.effects) {
      if (effect.type === 'damage') {
        baseDamage += effect.value;
        effects.push(effect.description);
      }
    }

    // Ensure minimum damage of 1 if attack hits
    if (baseDamage < 1 && !blocked) {
      baseDamage = 1;
    }

    return {
      attacker,
      target,
      damage: Math.max(0, baseDamage),
      blocked,
      critical,
      effects
    };
  }

  /**
   * Apply damage to target
   */
  applyDamage(target: Player, damage: number): void {
    target.hp = Math.max(0, target.hp - damage);
  }

  /**
   * Check if attack hits (accuracy calculation)
   */
  checkHit(attacker: Player, target: Player, range: number, terrain: TerrainTile[]): boolean {
    let accuracy = 0.8; // Base 80% hit chance

    // Range penalty
    const distance = this.getDistance(attacker.position, target.position);
    if (distance > range) {
      return false; // Out of range
    }

    // Range accuracy penalty
    if (distance > 1) {
      accuracy -= (distance - 1) * 0.1;
    }

    // Attacker's robot stats
    accuracy += attacker.robot.stats.attack * 0.05;

    // Terrain modifiers
    const terrainModifiers = this.getTerrainModifiers(attacker, target, terrain);
    accuracy *= terrainModifiers.accuracy;

    return Math.random() < Math.max(0.1, Math.min(0.95, accuracy));
  }

  /**
   * Get distance between two positions
   */
  private getDistance(pos1: { x: number; y: number }, pos2: { x: number; y: number }): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get terrain modifiers for combat
   */
  private getTerrainModifiers(attacker: Player, target: Player, terrain: TerrainTile[]): {
    damage: number;
    accuracy: number;
    cover: number;
  } {
    let damage = 1.0;
    let accuracy = 1.0;
    let cover = 0;

    // Check for cover between attacker and target
    const lineOfSight = this.checkLineOfSight(attacker.position, target.position, terrain);
    if (!lineOfSight) {
      accuracy *= 0.5; // 50% accuracy penalty for no line of sight
    }

    // Check terrain at target position
    const targetTerrain = terrain.find(t => 
      t.position.x === target.position.x && t.position.y === target.position.y
    );

    if (targetTerrain) {
      switch (targetTerrain.type) {
        case 'turret':
          cover += 2;
          break;
        case 'bridge':
          // No cover bonus
          break;
        case 'trap':
          // Target might be distracted
          accuracy *= 1.1;
          break;
      }
    }

    // Check terrain at attacker position
    const attackerTerrain = terrain.find(t => 
      t.position.x === attacker.position.x && t.position.y === attacker.position.y
    );

    if (attackerTerrain) {
      switch (attackerTerrain.type) {
        case 'turret':
          damage *= 1.2; // Height advantage
          accuracy *= 1.1;
          break;
        case 'lava':
          // Dangerous position
          damage *= 0.8;
          break;
      }
    }

    return { damage, accuracy, cover };
  }

  /**
   * Check line of sight between two positions
   */
  private checkLineOfSight(
    from: { x: number; y: number }, 
    to: { x: number; y: number }, 
    terrain: TerrainTile[]
  ): boolean {
    // Simple line of sight check
    // In a more complex implementation, this would use ray casting
    
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    
    for (let i = 1; i < steps; i++) {
      const x = from.x + Math.round((dx * i) / steps);
      const y = from.y + Math.round((dy * i) / steps);
      
      const blockingTerrain = terrain.find(t => 
        t.position.x === x && t.position.y === y && t.type === 'turret'
      );
      
      if (blockingTerrain) {
        return false; // Line of sight blocked
      }
    }
    
    return true;
  }

  /**
   * Resolve area of effect attack
   */
  resolveAreaAttack(
    attacker: Player, 
    center: { x: number; y: number }, 
    radius: number, 
    card: Card, 
    allPlayers: Player[], 
    terrain: TerrainTile[]
  ): CombatResult[] {
    const results: CombatResult[] = [];
    
    // Find all targets in range
    const targets = allPlayers.filter(player => {
      if (player.id === attacker.id) return false; // Can't target self
      const distance = this.getDistance(center, player.position);
      return distance <= radius;
    });

    // Resolve attack for each target
    for (const target of targets) {
      const result = this.calculateDamage(attacker, target, card, terrain);
      results.push(result);
    }

    return results;
  }

  /**
   * Calculate healing amount
   */
  calculateHealing(healer: Player, target: Player, card: Card): number {
    let healing = 1; // Base healing

    // Apply card effects
    for (const effect of card.effects) {
      if (effect.type === 'heal') {
        healing += effect.value;
      }
    }

    // Apply healer's robot stats (if they have healing bonuses)
    // This would depend on specific robot upgrades

    return healing;
  }

  /**
   * Apply healing to target
   */
  applyHealing(target: Player, healing: number): void {
    target.hp = Math.min(target.maxHp, target.hp + healing);
  }

  /**
   * Check if player is in range for attack
   */
  isInRange(attacker: Player, target: Player, range: number): boolean {
    const distance = this.getDistance(attacker.position, target.position);
    return distance <= range;
  }

  /**
   * Get all valid targets for an attack
   */
  getValidTargets(attacker: Player, allPlayers: Player[], range: number): Player[] {
    return allPlayers.filter(player => {
      if (player.id === attacker.id) return false;
      if (player.hp <= 0) return false; // Dead players can't be targeted
      return this.isInRange(attacker, player, range);
    });
  }
}


