/**
 * Turn System - Manages game phases and turn flow
 */

import { Player, Card } from './cards';

export type GamePhase = 'draw' | 'action' | 'end';

export interface GameState {
  currentPlayer: string;
  phase: GamePhase;
  turn: number;
  players: Map<string, Player>;
  activeCards: ActiveCard[];
  terrain: TerrainTile[];
  encounterDeck: Card[];
  gameOver: boolean;
  winner?: string;
}

export interface TerrainTile {
  id: string;
  type: 'floor' | 'bridge' | 'cliff' | 'lava' | 'water' | 'turret' | 'trap';
  position: { x: number; y: number };
  height: number;
  properties: Record<string, any>;
}

export interface ActiveCard {
  card: Card;
  player: string;
  duration: number;
  effects: string[];
}

export class TurnManager {
  private gameState: GameState;
  private phaseOrder: GamePhase[] = ['draw', 'action', 'end'];

  constructor(players: Player[]) {
    this.gameState = {
      currentPlayer: players[0].id,
      phase: 'draw',
      turn: 1,
      players: new Map(players.map(p => [p.id, p])),
      activeCards: [],
      terrain: [],
      encounterDeck: [],
      gameOver: false
    };
  }

  /**
   * Get current game state
   */
  getGameState(): GameState {
    return { ...this.gameState };
  }

  /**
   * Get current player
   */
  getCurrentPlayer(): Player | undefined {
    return this.gameState.players.get(this.gameState.currentPlayer);
  }

  /**
   * Get current phase
   */
  getCurrentPhase(): GamePhase {
    return this.gameState.phase;
  }

  /**
   * Advance to next phase
   */
  nextPhase(): boolean {
    const currentIndex = this.phaseOrder.indexOf(this.gameState.phase);
    
    if (currentIndex === -1) {
      throw new Error(`Invalid phase: ${this.gameState.phase}`);
    }

    // Execute phase end logic
    this.executePhaseEnd(this.gameState.phase);

    // Move to next phase
    if (currentIndex < this.phaseOrder.length - 1) {
      this.gameState.phase = this.phaseOrder[currentIndex + 1];
      this.executePhaseStart(this.gameState.phase);
      return true;
    } else {
      // End of turn, move to next player
      this.endTurn();
      return false;
    }
  }

  /**
   * Execute phase start logic
   */
  private executePhaseStart(phase: GamePhase): void {
    const player = this.getCurrentPlayer();
    if (!player) return;

    switch (phase) {
      case 'draw':
        this.executeDrawPhase(player);
        break;
      case 'action':
        // Action phase is player-controlled
        break;
      case 'end':
        this.executeEndPhase(player);
        break;
    }
  }

  /**
   * Execute phase end logic
   */
  private executePhaseEnd(phase: GamePhase): void {
    const player = this.getCurrentPlayer();
    if (!player) return;

    switch (phase) {
      case 'action':
        // Resolve any pending actions
        break;
    }
  }

  /**
   * Execute draw phase
   */
  private executeDrawPhase(player: Player): void {
    // Draw cards up to hand limit (5 cards maximum)
    const handLimit = 5;
    const cardsToDraw = Math.min(handLimit - player.hand.length, player.deck.length);
    
    for (let i = 0; i < cardsToDraw; i++) {
      const card = player.deck.pop();
      if (card) {
        player.hand.push(card);
      }
    }

    // If hand exceeds limit, discard down to 5 cards
    if (player.hand.length > handLimit) {
      const excessCards = player.hand.length - handLimit;
      for (let i = 0; i < excessCards; i++) {
        const card = player.hand.pop();
        if (card) {
          player.discard.push(card);
        }
      }
    }

    // Shuffle discard back into deck if needed
    if (player.deck.length === 0 && player.discard.length > 0) {
      player.deck = [...player.discard];
      player.discard = [];
      this.shuffleDeck(player.deck);
    }
  }


  /**
   * Execute end phase
   */
  private executeEndPhase(player: Player): void {
    // Reset energy
    player.energy = player.maxEnergy;
    
    // Process active cards
    this.processActiveCards();
    
    // Check win conditions
    this.checkWinConditions();
  }

  /**
   * End current turn and move to next player
   */
  private endTurn(): void {
    const playerIds = Array.from(this.gameState.players.keys());
    const currentIndex = playerIds.indexOf(this.gameState.currentPlayer);
    
    if (currentIndex < playerIds.length - 1) {
      this.gameState.currentPlayer = playerIds[currentIndex + 1];
    } else {
      this.gameState.currentPlayer = playerIds[0];
      this.gameState.turn++;
    }

    this.gameState.phase = 'draw';
    this.executePhaseStart('draw');
  }

  /**
   * Play a card during action phase
   */
  playCard(cardId: string, target?: Player | { x: number; y: number }): boolean {
    const player = this.getCurrentPlayer();
    if (!player || this.gameState.phase !== 'action') {
      return false;
    }

    const card = player.hand.find(c => c.id === cardId);
    if (!card) {
      return false;
    }

    // Check if player has enough energy
    if (player.energy < card.cost) {
      return false;
    }

    // Remove card from hand and add to discard
    const cardIndex = player.hand.indexOf(card);
    player.hand.splice(cardIndex, 1);
    player.discard.push(card);

    // Deduct energy (never go below 0 - prevents energy debt)
    player.energy = Math.max(0, player.energy - card.cost);

    // If it's a program card, add to active cards
    if (card.type === 'program') {
      this.gameState.activeCards.push({
        card,
        player: player.id,
        duration: card.duration || 1,
        effects: card.effects.map(e => e.description)
      });
    }

    return true;
  }

  /**
   * Build a structure during action phase
   */
  buildStructure(cardId: string, position: { x: number; y: number }): boolean {
    const player = this.getCurrentPlayer();
    if (!player || this.gameState.phase !== 'action') {
      return false;
    }

    const card = player.hand.find(c => c.id === cardId && c.type === 'structure');
    if (!card) {
      return false;
    }

    // Check if player has enough energy
    if (player.energy < card.cost) {
      return false;
    }

    // Create terrain studs
    const terrainTile: TerrainTile = {
      id: `${card.id}_${Date.now()}`,
      type: this.getTerrainTypeFromCard(card),
      position,
      height: 1,
      properties: { owner: player.id, card: card.id }
    };

    this.gameState.terrain.push(terrainTile);

    // Remove card from hand and add to discard
    const cardIndex = player.hand.indexOf(card);
    player.hand.splice(cardIndex, 1);
    player.discard.push(card);

    // Deduct energy (never go below 0 - prevents energy debt)
    player.energy = Math.max(0, player.energy - card.cost);

    return true;
  }

  /**
   * Move player to new position
   */
  movePlayer(playerId: string, newPosition: { x: number; y: number }): boolean {
    const player = this.gameState.players.get(playerId);
    if (!player) {
      return false;
    }

    // Check if position is valid (not occupied by another player)
    const occupied = Array.from(this.gameState.players.values())
      .some(p => p.id !== playerId && p.position.x === newPosition.x && p.position.y === newPosition.y);
    
    if (occupied) {
      return false;
    }

    player.position = newPosition;
    return true;
  }

  /**
   * Process active cards (programs, etc.)
   */
  private processActiveCards(): void {
    this.gameState.activeCards = this.gameState.activeCards.filter(activeCard => {
      activeCard.duration--;
      
      if (activeCard.duration <= 0) {
        // Card effect ends
        return false;
      }
      
      return true;
    });
  }


  /**
   * Check win conditions
   */
  private checkWinConditions(): void {
    const alivePlayers = Array.from(this.gameState.players.values())
      .filter(p => p.hp > 0);
    
    if (alivePlayers.length <= 1) {
      this.gameState.gameOver = true;
      this.gameState.winner = alivePlayers[0]?.id;
    }
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
   * Get terrain type from structure card
   */
  private getTerrainTypeFromCard(card: Card): TerrainTile['type'] {
    switch (card.name.toLowerCase()) {
      case 'watchtower':
        return 'turret';
      case 'bridge':
        return 'bridge';
      case 'trap':
        return 'trap';
      default:
        return 'floor';
    }
  }
}


