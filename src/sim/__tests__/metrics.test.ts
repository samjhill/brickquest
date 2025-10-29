/**
 * Tests for metrics aggregation
 */

import {
  aggregateMetrics,
  generateRecommendations,
  generateSparkline,
  generateSummaryStats,
} from '../metrics';
import { SimulationResult } from '../runner';

describe('Metrics', () => {
  const mockResults: SimulationResult[] = [
    {
      scenarioId: 'test_scenario',
      gameId: 1,
      seed: 123,
      winner: 'team_a',
      totalRounds: 10,
      playersStats: [
        {
          playerId: 'player_1',
          playerClass: 'warrior',
          teamId: 'team_a',
          damageDealt: 20,
          damageTaken: 10,
          energySpent: 15,
          cardsPlayed: 5,
          cardsByType: { action: 3, structure: 2 },
          controlTurns: 2,
          survivedRounds: 10,
          finalHp: 6,
        },
        {
          playerId: 'player_2',
          playerClass: 'mage',
          teamId: 'team_b',
          damageDealt: 15,
          damageTaken: 20,
          energySpent: 12,
          cardsPlayed: 4,
          cardsByType: { action: 4 },
          controlTurns: 1,
          survivedRounds: 10,
          finalHp: 0,
        },
      ],
      events: [],
    },
    {
      scenarioId: 'test_scenario',
      gameId: 2,
      seed: 456,
      winner: 'team_b',
      totalRounds: 12,
      playersStats: [
        {
          playerId: 'player_3',
          playerClass: 'warrior',
          teamId: 'team_a',
          damageDealt: 18,
          damageTaken: 22,
          energySpent: 14,
          cardsPlayed: 5,
          cardsByType: { action: 5 },
          controlTurns: 0,
          survivedRounds: 12,
          finalHp: 0,
        },
        {
          playerId: 'player_4',
          playerClass: 'engineer',
          teamId: 'team_b',
          damageDealt: 22,
          damageTaken: 18,
          energySpent: 16,
          cardsPlayed: 6,
          cardsByType: { action: 3, structure: 3 },
          controlTurns: 3,
          survivedRounds: 12,
          finalHp: 5,
        },
      ],
      events: [],
    },
  ];

  test('should aggregate metrics from results', () => {
    const metrics = aggregateMetrics(mockResults);
    expect(metrics.size).toBe(1);
    
    const scenarioMetrics = metrics.get('test_scenario');
    expect(scenarioMetrics).toBeDefined();
    expect(scenarioMetrics?.totalGames).toBe(2);
  });

  test('should calculate class win rates', () => {
    const metrics = aggregateMetrics(mockResults);
    const scenarioMetrics = metrics.get('test_scenario')!;
    
    expect(scenarioMetrics.classWinRates).toBeDefined();
    expect(scenarioMetrics.classWinRates['warrior']).toBeDefined();
  });

  test('should calculate average damage per energy', () => {
    const metrics = aggregateMetrics(mockResults);
    const scenarioMetrics = metrics.get('test_scenario')!;
    
    expect(scenarioMetrics.avgDamagePerEnergy).toBeGreaterThan(0);
  });

  test('should generate recommendations', () => {
    const metrics = aggregateMetrics(mockResults);
    const recommendations = generateRecommendations(metrics);
    
    expect(Array.isArray(recommendations)).toBe(true);
  });

  test('recommendations should be prioritized', () => {
    const metrics = aggregateMetrics(mockResults);
    const recommendations = generateRecommendations(metrics);
    
    if (recommendations.length > 1) {
      const priorities = recommendations.map(r => r.priority);
      const highFirst = priorities.indexOf('high') <= priorities.lastIndexOf('medium');
      expect(highFirst).toBe(true);
    }
  });

  test('should generate sparkline', () => {
    const values = [1, 2, 3, 4, 5];
    const sparkline = generateSparkline(values, 10);
    
    expect(sparkline).toBeTruthy();
    expect(sparkline.length).toBeGreaterThan(0);
  });

  test('sparkline should handle empty array', () => {
    const sparkline = generateSparkline([], 10);
    expect(sparkline).toBe('');
  });

  test('sparkline should handle uniform values', () => {
    const values = [5, 5, 5, 5];
    const sparkline = generateSparkline(values, 10);
    expect(sparkline).toBeTruthy();
  });

  test('should generate summary stats', () => {
    const metrics = aggregateMetrics(mockResults);
    const summary = generateSummaryStats(metrics);
    
    expect(summary.totalGames).toBe(2);
    expect(summary.avgTTK).toBeGreaterThan(0);
    expect(summary.avgDamagePerEnergy).toBeGreaterThan(0);
    expect(summary.scenarioCount).toBe(1);
  });
});

