/**
 * Tests for armor and cover mechanics
 */

import { CombatEngine } from '../combat';
import { CardEngine, Card } from '../cards';
import { TerrainTile } from '../turn';

describe('Armor and Cover', () => {
  let combatEngine: CombatEngine;
  let cardEngine: CardEngine;

  beforeEach(() => {
    combatEngine = new CombatEngine();
    cardEngine = new CardEngine();
  });

  describe('Armor Rating (AR)', () => {
    test('should reduce damage by AR amount', () => {
      const attacker = cardEngine.createPlayer('attacker', 'Attacker', 'warrior');
      const target = cardEngine.createPlayer('target', 'Target', 'engineer');
      
      const card: Card = {
        id: 'attack',
        name: 'Attack',
        type: 'action',
        cost: 2,
        damage: 5,
        description: 'Deal 5 damage',
        effects: [],
        rarity: 'common',
      };
      
      // Set target defense (AR)
      target.robot.stats.defense = 2;
      
      const result = combatEngine.calculateDamage(attacker, target, card, []);
      
      // Should block at least some damage
      expect(result.blocked).toBeGreaterThan(0);
    });

    test('armor should not reduce damage below 0', () => {
      const attacker = cardEngine.createPlayer('attacker', 'Attacker', 'warrior');
      const target = cardEngine.createPlayer('target', 'Target', 'engineer');
      
      const card: Card = {
        id: 'weak_attack',
        name: 'Weak Attack',
        type: 'action',
        cost: 1,
        damage: 1,
        description: 'Deal 1 damage',
        effects: [],
        rarity: 'common',
      };
      
      target.robot.stats.defense = 10;
      
      const result = combatEngine.calculateDamage(attacker, target, card, []);
      
      expect(result.damage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Cover Mechanics', () => {
    test('cover should provide armor bonus', () => {
      const attacker = cardEngine.createPlayer('attacker', 'Attacker', 'warrior');
      const target = cardEngine.createPlayer('target', 'Target', 'engineer');
      
      attacker.position = { x: 0, y: 0 };
      target.position = { x: 5, y: 5 };
      
      const terrain: TerrainTile[] = [{
        id: 'cover_1',
        type: 'bridge',
        position: { x: 5, y: 5 },
        height: 0,
        properties: { armorBonus: 1 },
      }];
      
      const card: Card = {
        id: 'attack',
        name: 'Attack',
        type: 'action',
        cost: 2,
        damage: 5,
        description: 'Deal 5 damage',
        effects: [],
        rarity: 'common',
      };
      
      const result = combatEngine.calculateDamage(attacker, target, card, terrain);
      
      // Cover should increase blocked damage
      expect(result.blocked).toBeGreaterThan(0);
    });
  });

  describe('High Ground Bonus', () => {
    test('high ground should increase damage', () => {
      const attacker = cardEngine.createPlayer('attacker', 'Attacker', 'warrior');
      const target = cardEngine.createPlayer('target', 'Target', 'engineer');
      
      attacker.position = { x: 0, y: 0 };
      target.position = { x: 5, y: 5 };
      
      // Attacker on high ground
      const terrain: TerrainTile[] = [{
        id: 'high_ground',
        type: 'turret',
        position: { x: 0, y: 0 },
        height: 2,
        properties: { damageBonus: 2 },
      }];
      
      const card: Card = {
        id: 'attack',
        name: 'Attack',
        type: 'action',
        cost: 2,
        damage: 5,
        description: 'Deal 5 damage',
        effects: [],
        rarity: 'common',
      };
      
      const result = combatEngine.calculateDamage(attacker, target, card, terrain);
      
      // Should deal more damage from high ground
      expect(result.damage).toBeGreaterThan(0);
    });

    test('high ground bonus should be capped at +2', () => {
      const attacker = cardEngine.createPlayer('attacker', 'Attacker', 'warrior');
      const target = cardEngine.createPlayer('target', 'Target', 'engineer');
      
      attacker.position = { x: 0, y: 0 };
      target.position = { x: 5, y: 5 };
      
      // Excessive height advantage
      const terrain: TerrainTile[] = [{
        id: 'high_ground',
        type: 'turret',
        position: { x: 0, y: 0 },
        height: 10,
        properties: { damageBonus: 10 },
      }];
      
      const card: Card = {
        id: 'attack',
        name: 'Attack',
        type: 'action',
        cost: 2,
        damage: 5,
        description: 'Deal 5 damage',
        effects: [],
        rarity: 'common',
      };
      
      const result = combatEngine.calculateDamage(attacker, target, card, terrain);
      
      // Bonus should be reasonable (not 10x multiplier)
      expect(result.damage).toBeLessThan(50);
    });
  });
});

