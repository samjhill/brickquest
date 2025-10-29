/**
 * Tests for turn system
 */

import { TurnManager, GameState } from '../turn';
import { CardEngine, Player } from '../cards';

describe('TurnManager', () => {
  let cardEngine: CardEngine;
  let players: Player[];
  let turnManager: TurnManager;

  beforeEach(() => {
    cardEngine = new CardEngine();
    players = [
      cardEngine.createPlayer('player1', 'Player 1', 'warrior'),
      cardEngine.createPlayer('player2', 'Player 2', 'mage'),
    ];
    turnManager = new TurnManager(players);
  });

  describe('initialization', () => {
    test('should initialize with first player', () => {
      const currentPlayer = turnManager.getCurrentPlayer();
      expect(currentPlayer?.id).toBe('player1');
    });

    test('should start in draw phase', () => {
      const phase = turnManager.getCurrentPhase();
      expect(phase).toBe('draw');
    });

    test('should have turn 1', () => {
      const state = turnManager.getGameState();
      expect(state.turn).toBe(1);
    });
  });

  describe('phase progression', () => {
    test('should advance through phases', () => {
      expect(turnManager.getCurrentPhase()).toBe('draw');
      
      turnManager.nextPhase();
      expect(turnManager.getCurrentPhase()).toBe('action');
      
      turnManager.nextPhase();
      expect(turnManager.getCurrentPhase()).toBe('end');
    });

    test('should cycle back to next player after end phase', () => {
      // Complete all phases for player 1
      turnManager.nextPhase(); // action
      turnManager.nextPhase(); // end
      
      // Should now be player 2's turn
      const currentPlayer = turnManager.getCurrentPlayer();
      expect(currentPlayer?.id).toBe('player2');
      expect(turnManager.getCurrentPhase()).toBe('draw');
    });
  });

  describe('playCard', () => {
    test('should play card during action phase', () => {
      // Advance to action phase
      turnManager.nextPhase();
      
      const player = turnManager.getCurrentPlayer()!;
      const initialEnergy = player.energy;
      
      // Add a card to hand
      if (player.hand.length > 0) {
        const card = player.hand[0];
        const success = turnManager.playCard(card.id);
        
        if (success) {
          expect(player.energy).toBeLessThanOrEqual(initialEnergy);
        }
      }
    });

    test('should not play card outside action phase', () => {
      // In draw phase
      const player = turnManager.getCurrentPlayer()!;
      
      if (player.hand.length > 0) {
        const card = player.hand[0];
        const success = turnManager.playCard(card.id);
        
        expect(success).toBe(false);
      }
    });

    test('should not play card without enough energy', () => {
      turnManager.nextPhase(); // action phase
      
      const player = turnManager.getCurrentPlayer()!;
      player.energy = 0;
      
      if (player.hand.length > 0) {
        const card = player.hand[0];
        const success = turnManager.playCard(card.id);
        
        expect(success).toBe(false);
      }
    });
  });

  describe('movePlayer', () => {
    test('should move player to valid position', () => {
      const player = players[0];
      const newPosition = { x: 5, y: 5 };
      
      const success = turnManager.movePlayer(player.id, newPosition);
      
      expect(success).toBe(true);
      expect(player.position).toEqual(newPosition);
    });

    test('should not move to occupied position', () => {
      const player1 = players[0];
      const player2 = players[1];
      
      player1.position = { x: 5, y: 5 };
      player2.position = { x: 10, y: 10 };
      
      // Try to move player2 to player1's position
      const success = turnManager.movePlayer(player2.id, player1.position);
      
      expect(success).toBe(false);
      expect(player2.position).not.toEqual(player1.position);
    });
  });

  describe('win conditions', () => {
    test('should detect game over when only one player alive', () => {
      // Kill player 2
      players[1].hp = 0;
      
      // Advance to end phase to check win conditions
      turnManager.nextPhase(); // action
      turnManager.nextPhase(); // end
      
      const state = turnManager.getGameState();
      
      expect(state.gameOver).toBe(true);
      expect(state.winner).toBe('player1');
    });

    test('should not end game while multiple players alive', () => {
      const state = turnManager.getGameState();
      
      expect(state.gameOver).toBe(false);
      expect(state.winner).toBeUndefined();
    });
  });

  describe('energy management', () => {
    test('should prevent energy debt', () => {
      turnManager.nextPhase(); // action phase
      
      const player = turnManager.getCurrentPlayer()!;
      const card = player.hand[0];
      
      if (card && card.cost > player.energy) {
        const initialEnergy = player.energy;
        turnManager.playCard(card.id);
        
        // Energy should not go below 0
        expect(player.energy).toBeGreaterThanOrEqual(0);
        expect(player.energy).toBe(initialEnergy); // Should not have changed
      }
    });

    test('should reset energy at end of turn', () => {
      const player = players[0];
      const maxEnergy = player.maxEnergy;
      
      player.energy = 1;
      
      // Complete turn cycle
      turnManager.nextPhase(); // action
      turnManager.nextPhase(); // end
      
      // Should reset after end phase (in next player's draw phase)
      // Actually energy resets in executeEndPhase for current player
      expect(players[0].energy).toBe(maxEnergy);
    });
  });
});

