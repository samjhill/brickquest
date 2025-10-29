/**
 * Simulation Runner - Executes automated game simulations
 */

import { CardEngine, Player, Card } from '../engine/cards';
import { TurnManager, GameState, TerrainTile } from '../engine/turn';
import { CombatEngine } from '../engine/combat';
import {
  ScenarioConfig,
  getScenarioById,
  getAllScenarioIds,
  SCENARIOS,
} from './scenarios';

export interface SimulationConfig {
  scenarios: string[]; // 'all' or specific scenario IDs
  gamesPerScenario: number;
  seeds: number;
  diceMode: boolean;
}

export interface SimulationResult {
  scenarioId: string;
  gameId: number;
  seed: number;
  winner: string;
  totalRounds: number;
  playersStats: PlayerSimStats[];
  events: GameEvent[];
}

export interface PlayerSimStats {
  playerId: string;
  playerClass: string;
  teamId: string;
  damageDealt: number;
  damageTaken: number;
  energySpent: number;
  cardsPlayed: number;
  cardsByType: Record<string, number>;
  controlTurns: number; // Turns affected by control effects
  survivedRounds: number;
  finalHp: number;
}

export interface GameEvent {
  round: number;
  playerId: string;
  type: 'damage' | 'heal' | 'control' | 'structure' | 'move' | 'death';
  value?: number;
  target?: string;
  cardId?: string;
}

/**
 * AI Policy - Simple decision making for auto-play
 */
class SimpleAI {
  private rng: SeededRandom;

  constructor(seed: number) {
    this.rng = new SeededRandom(seed);
  }

  /**
   * Decide which card to play this turn
   */
  selectCardToPlay(
    player: Player,
    allPlayers: Player[],
    terrain: TerrainTile[],
    combatEngine: CombatEngine
  ): { card: Card; target?: Player | { x: number; y: number } } | null {
    const playableCards = player.hand.filter(c => c.cost <= player.energy);
    if (playableCards.length === 0) return null;

    // Score each card
    const scoredCards = playableCards.map(card => ({
      card,
      score: this.scoreCard(card, player, allPlayers, terrain, combatEngine),
    }));

    // Sort by score (descending)
    scoredCards.sort((a, b) => b.score - a.score);

    // Pick the best card
    const bestCard = scoredCards[0];
    if (bestCard.score <= 0) return null;

    // Determine target
    const target = this.selectTarget(bestCard.card, player, allPlayers, terrain);

    return { card: bestCard.card, target };
  }

  /**
   * Score a card's value
   */
  private scoreCard(
    card: Card,
    player: Player,
    allPlayers: Player[],
    terrain: TerrainTile[],
    combatEngine: CombatEngine
  ): number {
    let score = 0;

    // Damage cards
    if (card.damage && card.damage > 0) {
      const enemies = allPlayers.filter(p => p.id !== player.id && p.hp > 0);
      if (enemies.length > 0) {
        const avgEnemyDefense = enemies.reduce((sum, e) => sum + e.robot.stats.defense, 0) / enemies.length;
        const effectiveDamage = Math.max(1, card.damage - avgEnemyDefense);
        
        // Balance rails: 1E ≈ 2 dmg
        const expectedValue = effectiveDamage * 2;
        score += expectedValue - card.cost;

        // Bonus for finishing enemies
        const weakEnemy = enemies.find(e => e.hp <= effectiveDamage);
        if (weakEnemy) {
          score += 5; // High priority to eliminate units
        }
      }
    }

    // Healing cards
    if (card.type === 'program' && card.effects.some(e => e.type === 'heal')) {
      if (player.hp < player.maxHp * 0.5) {
        score += 3; // Prioritize healing when low
      }
    }

    // Movement cards
    if (card.effects.some(e => e.type === 'move')) {
      // Check if we need to reposition
      const enemies = allPlayers.filter(p => p.id !== player.id && p.hp > 0);
      if (enemies.length > 0) {
        const closestEnemy = enemies.reduce((closest, e) => {
          const dist = this.getDistance(player.position, e.position);
          const closestDist = this.getDistance(player.position, closest.position);
          return dist < closestDist ? e : closest;
        });
        const distance = this.getDistance(player.position, closestEnemy.position);
        
        // If too far, value movement
        if (distance > 5) {
          score += 2;
        }
        // If too close and we're weak, value escape
        if (distance <= 2 && player.hp < player.maxHp * 0.3) {
          score += 4;
        }
      }
    }

    // Structure cards
    if (card.type === 'structure') {
      // Structures are valuable in longer games
      score += 1.5;
    }

    // Control cards (stun/immobilize)
    const controlEffects = card.effects.filter(e => 
      e.description.toLowerCase().includes('stun') || 
      e.description.toLowerCase().includes('immobilize')
    );
    if (controlEffects.length > 0) {
      // Control is very valuable
      score += 3;
      
      // Balance rails: Hard control should be Rare+, 2E+
      if (card.rarity === 'common' || card.cost < 2) {
        score -= 1; // Penalty for undercosted control
      }
    }

    return score;
  }

  /**
   * Select target for a card
   */
  private selectTarget(
    card: Card,
    player: Player,
    allPlayers: Player[],
    terrain: TerrainTile[]
  ): Player | { x: number; y: number } | undefined {
    // For damage cards, target weakest enemy in range
    if (card.damage && card.damage > 0) {
      const enemies = allPlayers.filter(p => p.id !== player.id && p.hp > 0);
      if (enemies.length === 0) return undefined;

      const enemiesInRange = enemies.filter(e => {
        const distance = this.getDistance(player.position, e.position);
        return distance <= (card.range || 1);
      });

      if (enemiesInRange.length === 0) return enemies[0]; // Target closest if none in range

      // Prioritize low HP enemies
      return enemiesInRange.reduce((target, e) => 
        e.hp < target.hp ? e : target
      );
    }

    // For structure cards, place near high ground
    if (card.type === 'structure') {
      const highGround = terrain.find(t => t.type === 'turret');
      if (highGround) {
        return { x: highGround.position.x + 1, y: highGround.position.y };
      }
      // Otherwise, place near player
      return { x: player.position.x + 1, y: player.position.y };
    }

    return undefined;
  }

  /**
   * Decide where to move
   */
  selectMovement(
    player: Player,
    allPlayers: Player[],
    terrain: TerrainTile[]
  ): { x: number; y: number } | null {
    const enemies = allPlayers.filter(p => p.id !== player.id && p.hp > 0);
    if (enemies.length === 0) return null;

    // Find high ground
    const highGround = terrain.find(t => 
      t.type === 'turret' && !allPlayers.some(p => 
        p.position.x === t.position.x && p.position.y === t.position.y
      )
    );

    // Move to high ground if available
    if (highGround && this.rng.next() < 0.6) {
      return highGround.position;
    }

    // Find cover
    const cover = terrain.find(t => 
      t.type === 'bridge' && !allPlayers.some(p => 
        p.position.x === t.position.x && p.position.y === t.position.y
      )
    );

    if (cover && player.hp < player.maxHp * 0.5 && this.rng.next() < 0.7) {
      return cover.position;
    }

    // Move toward closest enemy
    const closestEnemy = enemies.reduce((closest, e) => {
      const dist = this.getDistance(player.position, e.position);
      const closestDist = this.getDistance(player.position, closest.position);
      return dist < closestDist ? e : closest;
    });

    const dx = closestEnemy.position.x - player.position.x;
    const dy = closestEnemy.position.y - player.position.y;

    // Move one step closer
    const newX = player.position.x + Math.sign(dx);
    const newY = player.position.y + Math.sign(dy);

    return { x: newX, y: newY };
  }

  private getDistance(pos1: { x: number; y: number }, pos2: { x: number; y: number }): number {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }
}

/**
 * Seeded Random Number Generator
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    // Simple LCG (Linear Congruential Generator)
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }
}

/**
 * Run simulations
 */
export async function runSimulations(config: SimulationConfig): Promise<SimulationResult[]> {
  const results: SimulationResult[] = [];
  
  // Determine which scenarios to run
  const scenarioIds = config.scenarios.includes('all') 
    ? getAllScenarioIds() 
    : config.scenarios;

  console.log(`Running ${config.gamesPerScenario} games for ${scenarioIds.length} scenarios with ${config.seeds} seeds...`);

  for (const scenarioId of scenarioIds) {
    const scenario = getScenarioById(scenarioId);
    if (!scenario) {
      console.warn(`Scenario ${scenarioId} not found, skipping...`);
      continue;
    }

    console.log(`  Scenario: ${scenario.name}`);

    for (let gameNum = 0; gameNum < config.gamesPerScenario; gameNum++) {
      for (let seedNum = 0; seedNum < config.seeds; seedNum++) {
        const seed = seedNum + gameNum * 1000;
        const result = await runSingleGame(scenario, seed, gameNum, config.diceMode);
        results.push(result);
      }

      // Progress indicator
      if ((gameNum + 1) % 100 === 0) {
        console.log(`    Completed ${gameNum + 1}/${config.gamesPerScenario} games`);
      }
    }
  }

  console.log(`Completed ${results.length} total game simulations`);
  return results;
}

/**
 * Run a single game simulation
 */
async function runSingleGame(
  scenario: ScenarioConfig,
  seed: number,
  gameId: number,
  diceMode: boolean
): Promise<SimulationResult> {
  const rng = new SeededRandom(seed);
  const cardEngine = new CardEngine();
  const combatEngine = new CombatEngine();
  const ai = new SimpleAI(seed);

  // Create players from scenario
  const allPlayers: Player[] = [];
  const playerStats = new Map<string, PlayerSimStats>();
  const events: GameEvent[] = [];

  scenario.teams.forEach((team, teamIdx) => {
    team.units.forEach((unitConfig, unitIdx) => {
      const playerId = `${team.id}_unit_${unitIdx}`;
      const player = cardEngine.createPlayer(playerId, playerId, unitConfig.class);
      
      // Apply custom stats if provided
      if (unitConfig.hp) player.hp = unitConfig.hp;
      if (unitConfig.maxHp) player.maxHp = unitConfig.maxHp;
      if (unitConfig.energy) player.energy = unitConfig.energy;
      if (unitConfig.maxEnergy) player.maxEnergy = unitConfig.maxEnergy;
      if (unitConfig.stats) {
        if (unitConfig.stats.movement !== undefined) {
          player.robot.stats.movement = unitConfig.stats.movement;
        }
        if (unitConfig.stats.attack !== undefined) {
          player.robot.stats.attack = unitConfig.stats.attack;
        }
        if (unitConfig.stats.defense !== undefined) {
          player.robot.stats.defense = unitConfig.stats.defense;
        }
      }

      // Set starting position
      if (team.startingPositions[unitIdx]) {
        player.position = team.startingPositions[unitIdx];
      }

      allPlayers.push(player);

      // Initialize stats
      playerStats.set(playerId, {
        playerId,
        playerClass: unitConfig.class,
        teamId: team.id,
        damageDealt: 0,
        damageTaken: 0,
        energySpent: 0,
        cardsPlayed: 0,
        cardsByType: {},
        controlTurns: 0,
        survivedRounds: 0,
        finalHp: player.hp,
      });
    });
  });

  // Initialize turn manager
  const turnManager = new TurnManager(allPlayers);
  
  // Initialize terrain from scenario
  const terrain: TerrainTile[] = [];
  scenario.mapLayout.coverTiles.forEach((pos, idx) => {
    terrain.push({
      id: `cover_${idx}`,
      type: 'bridge',
      position: pos,
      height: 0,
      properties: { armorBonus: 1 },
    });
  });
  scenario.mapLayout.highGroundTiles.forEach((pos, idx) => {
    terrain.push({
      id: `high_${idx}`,
      type: 'turret',
      position: pos,
      height: 2,
      properties: { armorBonus: 1, damageBonus: 2 },
    });
  });
  scenario.mapLayout.hazardTiles.forEach((pos, idx) => {
    terrain.push({
      id: `hazard_${idx}`,
      type: 'lava',
      position: pos,
      height: 0,
      properties: { damage: 1 },
    });
  });

  // Game loop
  let round = 0;
  let gameOver = false;

  while (round < scenario.maxRounds && !gameOver) {
    round++;

    // Spawn NPC waves if applicable
    if (scenario.npcWaves) {
      const wave = scenario.npcWaves.find(w => w.round === round);
      if (wave) {
        wave.units.forEach((unitConfig, idx) => {
          const playerId = `npc_wave_${round}_${idx}`;
          const npc = cardEngine.createPlayer(playerId, playerId, unitConfig.class);
          if (unitConfig.hp) npc.hp = unitConfig.hp;
          if (unitConfig.maxHp) npc.maxHp = unitConfig.maxHp;
          if (wave.spawnPositions[idx]) {
            npc.position = wave.spawnPositions[idx];
          }
          allPlayers.push(npc);
          
          playerStats.set(playerId, {
            playerId,
            playerClass: unitConfig.class,
            teamId: 'npc',
            damageDealt: 0,
            damageTaken: 0,
            energySpent: 0,
            cardsPlayed: 0,
            cardsByType: {},
            controlTurns: 0,
            survivedRounds: 0,
            finalHp: npc.hp,
          });
        });
      }
    }

    // Each player takes a turn
    for (const player of allPlayers) {
      if (player.hp <= 0) continue;

      // AI decides action
      const action = ai.selectCardToPlay(player, allPlayers, terrain, combatEngine);
      
      if (action) {
        const { card, target } = action;
        
        // Play the card
        if (player.energy >= card.cost) {
          player.energy -= card.cost;
          const stats = playerStats.get(player.id)!;
          stats.energySpent += card.cost;
          stats.cardsPlayed++;
          stats.cardsByType[card.type] = (stats.cardsByType[card.type] || 0) + 1;

          // Remove card from hand
          const cardIndex = player.hand.indexOf(card);
          if (cardIndex >= 0) {
            player.hand.splice(cardIndex, 1);
          }

          // Resolve damage
          if (card.damage && target && 'hp' in target) {
            const result = combatEngine.calculateDamage(player, target, card, terrain);
            
            if (result.damage > 0) {
              target.hp = Math.max(0, target.hp - result.damage);
              
              const attackerStats = playerStats.get(player.id)!;
              attackerStats.damageDealt += result.damage;
              
              const targetStats = playerStats.get(target.id);
              if (targetStats) {
                targetStats.damageTaken += result.damage;
              }

              events.push({
                round,
                playerId: player.id,
                type: 'damage',
                value: result.damage,
                target: target.id,
                cardId: card.id,
              });

              // Check for death
              if (target.hp <= 0) {
                events.push({
                  round,
                  playerId: target.id,
                  type: 'death',
                  target: player.id,
                });
              }
            }
          }
        }
      }

      // AI decides movement (if energy remains)
      if (player.energy >= 1) {
        const newPosition = ai.selectMovement(player, allPlayers, terrain);
        if (newPosition) {
          const occupied = allPlayers.some(p => 
            p.id !== player.id && p.hp > 0 &&
            p.position.x === newPosition.x && p.position.y === newPosition.y
          );
          if (!occupied) {
            player.position = newPosition;
            player.energy = Math.max(0, player.energy - 1);
            
            events.push({
              round,
              playerId: player.id,
              type: 'move',
            });
          }
        }
      }

      // Refill energy
      player.energy = player.maxEnergy;

      // Draw cards up to hand limit
      const handLimit = 5;
      while (player.hand.length < handLimit && player.deck.length > 0) {
        const card = player.deck.pop();
        if (card) player.hand.push(card);
      }

      // Shuffle discard into deck if needed
      if (player.deck.length === 0 && player.discard.length > 0) {
        player.deck = [...player.discard];
        player.discard = [];
        // Shuffle with seeded RNG
        for (let i = player.deck.length - 1; i > 0; i--) {
          const j = rng.nextInt(i + 1);
          [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]];
        }
      }
    }

    // Check win condition
    const aliveTeams = new Set<string>();
    allPlayers.forEach(p => {
      if (p.hp > 0) {
        const stats = playerStats.get(p.id);
        if (stats) {
          aliveTeams.add(stats.teamId);
        }
      }
    });

    if (aliveTeams.size <= 1) {
      gameOver = true;
    }
  }

  // Determine winner
  const aliveTeams = new Set<string>();
  allPlayers.forEach(p => {
    if (p.hp > 0) {
      const stats = playerStats.get(p.id);
      if (stats) {
        aliveTeams.add(stats.teamId);
      }
    }
  });
  const winner = aliveTeams.size === 1 ? Array.from(aliveTeams)[0] : 'draw';

  // Finalize stats
  allPlayers.forEach(p => {
    const stats = playerStats.get(p.id);
    if (stats) {
      stats.finalHp = p.hp;
      stats.survivedRounds = round;
    }
  });

  return {
    scenarioId: scenario.id,
    gameId,
    seed,
    winner,
    totalRounds: round,
    playersStats: Array.from(playerStats.values()),
    events,
  };
}

/**
 * CLI Entry point
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const config: SimulationConfig = {
    scenarios: ['all'],
    gamesPerScenario: 5000,
    seeds: 32,
    diceMode: false,
  };

  // Parse CLI args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--scenarios' && args[i + 1]) {
      config.scenarios = args[i + 1] === 'all' ? ['all'] : args[i + 1].split(',');
      i++;
    } else if (args[i] === '--games' && args[i + 1]) {
      config.gamesPerScenario = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--seeds' && args[i + 1]) {
      config.seeds = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--dice' && args[i + 1]) {
      config.diceMode = args[i + 1] === 'true';
      i++;
    }
  }

  console.log('Starting simulations with config:', config);
  
  runSimulations(config)
    .then(results => {
      // Write results to file
      const fs = require('fs');
      const path = require('path');
      const outputPath = path.join(__dirname, '../../sim_results.json');
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
      console.log(`\nResults written to: ${outputPath}`);
    })
    .catch(err => {
      console.error('Simulation error:', err);
      process.exit(1);
    });
}

