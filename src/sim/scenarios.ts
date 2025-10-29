/**
 * Simulation Scenarios - Pre-configured game scenarios for playtesting
 */

import { Player } from '../engine/cards';

export type MapZone = 'open' | 'cover' | 'highground' | 'hazard' | 'objective';

export interface ScenarioConfig {
  id: string;
  name: string;
  description: string;
  mapLayout: MapLayout;
  teams: TeamConfig[];
  winCondition: WinCondition;
  maxRounds: number;
  diceMode: boolean;
  npcWaves?: NPCWave[];
}

export interface MapLayout {
  width: number;
  height: number;
  zones: ZoneDefinition[];
  coverTiles: Position[];
  highGroundTiles: Position[];
  hazardTiles: Position[];
}

export interface ZoneDefinition {
  type: MapZone;
  positions: Position[];
  modifier?: {
    armorBonus?: number;
    damageBonus?: number;
    movementCost?: number;
  };
}

export interface Position {
  x: number;
  y: number;
}

export interface TeamConfig {
  id: string;
  name: string;
  units: UnitConfig[];
  deckSource: 'personal' | 'hybrid' | 'tech';
  startingPositions: Position[];
}

export interface UnitConfig {
  class: Player['class'];
  hp?: number;
  maxHp?: number;
  energy?: number;
  maxEnergy?: number;
  stats?: {
    movement?: number;
    attack?: number;
    defense?: number;
  };
}

export interface WinCondition {
  type: 'elimination' | 'objective' | 'survival' | 'points';
  targetValue?: number;
  description: string;
}

export interface NPCWave {
  round: number;
  units: UnitConfig[];
  spawnPositions: Position[];
  behavior: 'aggressive' | 'defensive' | 'patrol' | 'boss';
}

/**
 * Define all playtest scenarios
 */
export const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'skirmish_2v2',
    name: '2v2 Skirmish',
    description: 'Basic combat scenario with 2 players per team',
    mapLayout: {
      width: 12,
      height: 12,
      zones: [
        {
          type: 'open',
          positions: generateGridPositions(4, 4, 4, 4),
        },
        {
          type: 'cover',
          positions: [{ x: 5, y: 5 }, { x: 7, y: 7 }],
          modifier: { armorBonus: 1 },
        },
        {
          type: 'highground',
          positions: [{ x: 2, y: 10 }, { x: 10, y: 2 }],
          modifier: { damageBonus: 2, armorBonus: 1 },
        },
      ],
      coverTiles: [{ x: 5, y: 5 }, { x: 7, y: 7 }, { x: 6, y: 3 }, { x: 3, y: 9 }],
      highGroundTiles: [{ x: 2, y: 10 }, { x: 10, y: 2 }],
      hazardTiles: [],
    },
    teams: [
      {
        id: 'team_a',
        name: 'Team A',
        units: [
          { class: 'warrior', hp: 16, maxHp: 16 },
          { class: 'mage', hp: 15, maxHp: 15 },
        ],
        deckSource: 'personal',
        startingPositions: [{ x: 1, y: 1 }, { x: 2, y: 1 }],
      },
      {
        id: 'team_b',
        name: 'Team B',
        units: [
          { class: 'engineer', hp: 15, maxHp: 15 },
          { class: 'trickster', hp: 15, maxHp: 15 },
        ],
        deckSource: 'personal',
        startingPositions: [{ x: 10, y: 10 }, { x: 11, y: 10 }],
      },
    ],
    winCondition: {
      type: 'elimination',
      description: 'Eliminate all enemy units',
    },
    maxRounds: 20,
    diceMode: false,
  },
  
  {
    id: 'skirmish_3v3',
    name: '3v3 Skirmish',
    description: 'Larger combat scenario with 3 players per team',
    mapLayout: {
      width: 16,
      height: 16,
      zones: [
        {
          type: 'open',
          positions: generateGridPositions(6, 6, 5, 5),
        },
        {
          type: 'cover',
          positions: [
            { x: 7, y: 7 }, { x: 9, y: 9 }, { x: 7, y: 9 }, { x: 9, y: 7 },
          ],
          modifier: { armorBonus: 1 },
        },
        {
          type: 'highground',
          positions: [{ x: 3, y: 13 }, { x: 13, y: 3 }, { x: 8, y: 8 }],
          modifier: { damageBonus: 2, armorBonus: 1 },
        },
      ],
      coverTiles: [
        { x: 7, y: 7 }, { x: 9, y: 9 }, { x: 7, y: 9 }, { x: 9, y: 7 },
        { x: 4, y: 12 }, { x: 12, y: 4 },
      ],
      highGroundTiles: [{ x: 3, y: 13 }, { x: 13, y: 3 }, { x: 8, y: 8 }],
      hazardTiles: [{ x: 8, y: 2 }, { x: 2, y: 8 }],
    },
    teams: [
      {
        id: 'team_a',
        name: 'Team A',
        units: [
          { class: 'warrior', hp: 16, maxHp: 16 },
          { class: 'mage', hp: 15, maxHp: 15 },
          { class: 'engineer', hp: 15, maxHp: 15 },
        ],
        deckSource: 'personal',
        startingPositions: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
      },
      {
        id: 'team_b',
        name: 'Team B',
        units: [
          { class: 'warrior', hp: 16, maxHp: 16 },
          { class: 'trickster', hp: 15, maxHp: 15 },
          { class: 'mage', hp: 15, maxHp: 15 },
        ],
        deckSource: 'personal',
        startingPositions: [{ x: 14, y: 14 }, { x: 14, y: 15 }, { x: 15, y: 14 }],
      },
    ],
    winCondition: {
      type: 'elimination',
      description: 'Eliminate all enemy units',
    },
    maxRounds: 30,
    diceMode: false,
  },

  {
    id: 'boss_gate_siege',
    name: 'Boss Gate Siege',
    description: 'Team vs Boss with NPC waves',
    mapLayout: {
      width: 14,
      height: 18,
      zones: [
        {
          type: 'objective',
          positions: [{ x: 7, y: 16 }],
        },
        {
          type: 'cover',
          positions: [
            { x: 4, y: 8 }, { x: 10, y: 8 }, { x: 7, y: 12 },
          ],
          modifier: { armorBonus: 1 },
        },
        {
          type: 'highground',
          positions: [{ x: 2, y: 6 }, { x: 12, y: 6 }],
          modifier: { damageBonus: 2, armorBonus: 1 },
        },
        {
          type: 'hazard',
          positions: [{ x: 7, y: 4 }],
          modifier: { movementCost: 2 },
        },
      ],
      coverTiles: [{ x: 4, y: 8 }, { x: 10, y: 8 }, { x: 7, y: 12 }],
      highGroundTiles: [{ x: 2, y: 6 }, { x: 12, y: 6 }],
      hazardTiles: [{ x: 7, y: 4 }, { x: 6, y: 4 }, { x: 8, y: 4 }],
    },
    teams: [
      {
        id: 'heroes',
        name: 'Heroes',
        units: [
          { class: 'warrior', hp: 16, maxHp: 16 },
          { class: 'mage', hp: 15, maxHp: 15 },
          { class: 'engineer', hp: 15, maxHp: 15 },
          { class: 'trickster', hp: 15, maxHp: 15 },
        ],
        deckSource: 'hybrid',
        startingPositions: [
          { x: 5, y: 1 }, { x: 7, y: 1 }, { x: 9, y: 1 }, { x: 7, y: 2 },
        ],
      },
      {
        id: 'boss',
        name: 'Boss',
        units: [
          { 
            class: 'warrior', 
            hp: 50, 
            maxHp: 50,
            stats: { attack: 5, defense: 3, movement: 2 },
          },
        ],
        deckSource: 'tech',
        startingPositions: [{ x: 7, y: 16 }],
      },
    ],
    winCondition: {
      type: 'elimination',
      description: 'Defeat the boss',
    },
    maxRounds: 25,
    diceMode: false,
    npcWaves: [
      {
        round: 5,
        units: [
          { class: 'warrior', hp: 10, maxHp: 10 },
          { class: 'warrior', hp: 10, maxHp: 10 },
        ],
        spawnPositions: [{ x: 3, y: 10 }, { x: 11, y: 10 }],
        behavior: 'aggressive',
      },
      {
        round: 10,
        units: [
          { class: 'mage', hp: 12, maxHp: 12 },
          { class: 'engineer', hp: 12, maxHp: 12 },
        ],
        spawnPositions: [{ x: 2, y: 12 }, { x: 12, y: 12 }],
        behavior: 'defensive',
      },
      {
        round: 15,
        units: [
          { class: 'warrior', hp: 15, maxHp: 15 },
          { class: 'trickster', hp: 12, maxHp: 12 },
        ],
        spawnPositions: [{ x: 5, y: 14 }, { x: 9, y: 14 }],
        behavior: 'aggressive',
      },
    ],
  },

  {
    id: 'tech_heavy_environment',
    name: 'Tech-Heavy Environment',
    description: 'Scenario focusing on structures and programs',
    mapLayout: {
      width: 14,
      height: 14,
      zones: [
        {
          type: 'open',
          positions: generateGridPositions(5, 5, 4, 4),
        },
        {
          type: 'cover',
          positions: generateCirclePositions(7, 7, 3, 8),
          modifier: { armorBonus: 1 },
        },
      ],
      coverTiles: generateCirclePositions(7, 7, 3, 8),
      highGroundTiles: [],
      hazardTiles: [],
    },
    teams: [
      {
        id: 'team_a',
        name: 'Team A',
        units: [
          { class: 'engineer', hp: 15, maxHp: 15 },
          { class: 'engineer', hp: 15, maxHp: 15 },
          { class: 'mage', hp: 15, maxHp: 15 },
        ],
        deckSource: 'tech',
        startingPositions: [{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 3 }],
      },
      {
        id: 'team_b',
        name: 'Team B',
        units: [
          { class: 'engineer', hp: 15, maxHp: 15 },
          { class: 'mage', hp: 15, maxHp: 15 },
          { class: 'trickster', hp: 15, maxHp: 15 },
        ],
        deckSource: 'tech',
        startingPositions: [{ x: 11, y: 11 }, { x: 11, y: 12 }, { x: 12, y: 11 }],
      },
    ],
    winCondition: {
      type: 'elimination',
      description: 'Eliminate all enemy units',
    },
    maxRounds: 25,
    diceMode: false,
  },

  {
    id: 'control_vs_burst',
    name: 'Control vs Burst',
    description: 'Scenario testing control effects vs high damage',
    mapLayout: {
      width: 10,
      height: 10,
      zones: [
        {
          type: 'open',
          positions: generateGridPositions(3, 3, 3, 3),
        },
        {
          type: 'highground',
          positions: [{ x: 5, y: 5 }],
          modifier: { damageBonus: 2, armorBonus: 1 },
        },
      ],
      coverTiles: [{ x: 3, y: 5 }, { x: 7, y: 5 }],
      highGroundTiles: [{ x: 5, y: 5 }],
      hazardTiles: [],
    },
    teams: [
      {
        id: 'control_team',
        name: 'Control Team',
        units: [
          { class: 'mage', hp: 15, maxHp: 15 },
          { class: 'trickster', hp: 15, maxHp: 15 },
        ],
        deckSource: 'personal',
        startingPositions: [{ x: 1, y: 5 }, { x: 2, y: 5 }],
      },
      {
        id: 'burst_team',
        name: 'Burst Team',
        units: [
          { class: 'warrior', hp: 16, maxHp: 16 },
          { class: 'warrior', hp: 16, maxHp: 16 },
        ],
        deckSource: 'personal',
        startingPositions: [{ x: 8, y: 5 }, { x: 9, y: 5 }],
      },
    ],
    winCondition: {
      type: 'elimination',
      description: 'Eliminate all enemy units',
    },
    maxRounds: 15,
    diceMode: false,
  },
];

/**
 * Get scenario by ID
 */
export function getScenarioById(id: string): ScenarioConfig | undefined {
  return SCENARIOS.find(s => s.id === id);
}

/**
 * Get all scenario IDs
 */
export function getAllScenarioIds(): string[] {
  return SCENARIOS.map(s => s.id);
}

/**
 * Helper: Generate grid of positions
 */
function generateGridPositions(
  startX: number,
  startY: number,
  width: number,
  height: number
): Position[] {
  const positions: Position[] = [];
  for (let x = startX; x < startX + width; x++) {
    for (let y = startY; y < startY + height; y++) {
      positions.push({ x, y });
    }
  }
  return positions;
}

/**
 * Helper: Generate circle of positions
 */
function generateCirclePositions(
  centerX: number,
  centerY: number,
  radius: number,
  count: number
): Position[] {
  const positions: Position[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI;
    const x = Math.round(centerX + radius * Math.cos(angle));
    const y = Math.round(centerY + radius * Math.sin(angle));
    positions.push({ x, y });
  }
  return positions;
}

