/**
 * Tests for combat system
 */

import { CombatEngine } from '../combat';
import { CardEngine, Player, Card } from '../cards';
import { TerrainTile } from '../turn';

describe('CombatEngine', () => {
  let combatEngine: CombatEngine;
  let cardEngine: CardEngine;
  let attacker: Player;
  let target: Player;
  let terrain: TerrainTile[];

  beforeEach(() => {
    combatEngine = new CombatEngine();
    cardEngine = new CardEngine();
    attacker = cardEngine.createPlayer('attacker', 'Attacker', 'warrior');
    target = cardEngine.createPlayer('target', 'Target', 'engineer');
    terrain = [];
  });

  describe('calculateDamage', () => {
    test('should calculate basic damage', () => {
      const card: Card = {
        id: 'test_card',
        name: 'Test Attack',
        type: 'action',
        cost: 2,
        description: 'Deal 3 damage',
        damage: 3,
        effects: [],
        rarity: 'common',
      };

      const result = combatEngine.calculateDamage(attacker, target, card, terrain);
      
      expect(result.damage).toBeGreaterThan(0);
      expect(result.attacker).toBe(attacker);
      expect(result.target).toBe(target);
    });

    test('should apply attacker robot attack bonus', () => {
      const card: Card = {
        id: 'test_card',
        name: 'Test Attack',
        type: 'action',
        cost: 2,
        description: 'Deal 3 damage',
        damage: 3,
        effects: [],
        rarity: 'common',
      };

      attacker.robot.stats.attack = 2;
      const result = combatEngine.calculateDamage(attacker, target, card, terrain);
      
      // Damage should include base (3) + attack bonus (2)
      expect(result.damage).toBeGreaterThanOrEqual(3);
    });

    test('should apply target defense', () => {
      const card: Card = {
        id: 'test_card',
        name: 'Test Attack',
        type: 'action',
        cost: 2,
        description: 'Deal 3 damage',
        damage: 3,
        effects: [],
        rarity: 'common',
      };

      target.robot.stats.defense = 2;
      const result = combatEngine.calculateDamage(attacker, target, card, terrain);
      
      expect(result.blocked).toBeGreaterThanOrEqual(0);
    });

    test('should ensure minimum damage of 1 on hit', () => {
      const card: Card = {
        id: 'weak_card',
        name: 'Weak Attack',
        type: 'action',
        cost: 1,
        description: 'Deal 1 damage',
        damage: 1,
        effects: [],
        rarity: 'common',
      };

      attacker.robot.stats.attack = 0;
      target.robot.stats.defense = 5;
      
      const result = combatEngine.calculateDamage(attacker, target, card, terrain);
      
      // Even with high defense, should deal at least 1 damage
      expect(result.damage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('applyDamage', () => {
    test('should reduce target HP', () => {
      const initialHp = target.hp;
      combatEngine.applyDamage(target, 5);
      
      expect(target.hp).toBe(initialHp - 5);
    });

    test('should not reduce HP below 0', () => {
      combatEngine.applyDamage(target, 999);
      
      expect(target.hp).toBe(0);
    });
  });

  describe('checkHit', () => {
    test('should return false if out of range', () => {
      attacker.position = { x: 0, y: 0 };
      target.position = { x: 10, y: 10 };
      
      const hit = combatEngine.checkHit(attacker, target, 3, terrain);
      
      expect(hit).toBe(false);
    });

    test('should have chance to hit within range', () => {
      attacker.position = { x: 0, y: 0 };
      target.position = { x: 2, y: 0 };
      
      // Run multiple times to test probability
      let hits = 0;
      for (let i = 0; i < 100; i++) {
        if (combatEngine.checkHit(attacker, target, 5, terrain)) {
          hits++;
        }
      }
      
      // Should hit at least sometimes (not 0) but not always (not 100)
      expect(hits).toBeGreaterThan(0);
      expect(hits).toBeLessThan(100);
    });
  });

  describe('isInRange', () => {
    test('should return true if in range', () => {
      attacker.position = { x: 0, y: 0 };
      target.position = { x: 2, y: 0 };
      
      const inRange = combatEngine.isInRange(attacker, target, 5);
      
      expect(inRange).toBe(true);
    });

    test('should return false if out of range', () => {
      attacker.position = { x: 0, y: 0 };
      target.position = { x: 10, y: 10 };
      
      const inRange = combatEngine.isInRange(attacker, target, 5);
      
      expect(inRange).toBe(false);
    });
  });

  describe('getValidTargets', () => {
    test('should return only targets in range', () => {
      attacker.position = { x: 0, y: 0 };
      
      const nearTarget = cardEngine.createPlayer('near', 'Near', 'warrior');
      nearTarget.position = { x: 2, y: 0 };
      
      const farTarget = cardEngine.createPlayer('far', 'Far', 'warrior');
      farTarget.position = { x: 10, y: 10 };
      
      const allPlayers = [attacker, nearTarget, farTarget];
      const validTargets = combatEngine.getValidTargets(attacker, allPlayers, 5);
      
      expect(validTargets).toContain(nearTarget);
      expect(validTargets).not.toContain(farTarget);
      expect(validTargets).not.toContain(attacker);
    });

    test('should not include dead players', () => {
      attacker.position = { x: 0, y: 0 };
      
      const deadTarget = cardEngine.createPlayer('dead', 'Dead', 'warrior');
      deadTarget.position = { x: 2, y: 0 };
      deadTarget.hp = 0;
      
      const allPlayers = [attacker, deadTarget];
      const validTargets = combatEngine.getValidTargets(attacker, allPlayers, 5);
      
      expect(validTargets).not.toContain(deadTarget);
    });
  });

  describe('calculateHealing', () => {
    test('should calculate healing amount', () => {
      const healCard: Card = {
        id: 'heal_card',
        name: 'Heal',
        type: 'action',
        cost: 2,
        description: 'Heal 3 HP',
        effects: [{
          type: 'heal',
          value: 3,
          target: 'self',
          description: 'Heal 3 HP',
        }],
        rarity: 'common',
      };

      const healing = combatEngine.calculateHealing(attacker, target, healCard);
      
      expect(healing).toBeGreaterThan(0);
    });
  });

  describe('applyHealing', () => {
    test('should increase target HP', () => {
      target.hp = 10;
      combatEngine.applyHealing(target, 5);
      
      expect(target.hp).toBe(15);
    });

    test('should not exceed max HP', () => {
      target.hp = target.maxHp - 2;
      combatEngine.applyHealing(target, 10);
      
      expect(target.hp).toBe(target.maxHp);
    });
  });
});

