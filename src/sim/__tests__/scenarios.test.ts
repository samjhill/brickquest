/**
 * Tests for simulation scenarios
 */

import { SCENARIOS, getScenarioById, getAllScenarioIds } from '../scenarios';

describe('Scenarios', () => {
  test('should have at least 5 scenarios defined', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(5);
  });

  test('all scenarios should have unique IDs', () => {
    const ids = SCENARIOS.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('all scenarios should have valid configurations', () => {
    SCENARIOS.forEach(scenario => {
      expect(scenario.id).toBeTruthy();
      expect(scenario.name).toBeTruthy();
      expect(scenario.description).toBeTruthy();
      expect(scenario.mapLayout).toBeDefined();
      expect(scenario.teams).toBeDefined();
      expect(scenario.teams.length).toBeGreaterThanOrEqual(2);
      expect(scenario.winCondition).toBeDefined();
      expect(scenario.maxRounds).toBeGreaterThan(0);
    });
  });

  test('should get scenario by ID', () => {
    const scenario = getScenarioById('skirmish_2v2');
    expect(scenario).toBeDefined();
    expect(scenario?.name).toBe('2v2 Skirmish');
  });

  test('should return undefined for invalid scenario ID', () => {
    const scenario = getScenarioById('invalid_id');
    expect(scenario).toBeUndefined();
  });

  test('should get all scenario IDs', () => {
    const ids = getAllScenarioIds();
    expect(ids.length).toBe(SCENARIOS.length);
    expect(ids).toContain('skirmish_2v2');
    expect(ids).toContain('skirmish_3v3');
  });

  test('map layouts should have valid dimensions', () => {
    SCENARIOS.forEach(scenario => {
      expect(scenario.mapLayout.width).toBeGreaterThan(0);
      expect(scenario.mapLayout.height).toBeGreaterThan(0);
      expect(scenario.mapLayout.zones).toBeDefined();
    });
  });

  test('teams should have valid starting positions', () => {
    SCENARIOS.forEach(scenario => {
      scenario.teams.forEach(team => {
        expect(team.units.length).toBeGreaterThan(0);
        expect(team.startingPositions.length).toBeGreaterThanOrEqual(team.units.length);
        
        team.startingPositions.forEach(pos => {
          expect(pos.x).toBeGreaterThanOrEqual(0);
          expect(pos.y).toBeGreaterThanOrEqual(0);
          expect(pos.x).toBeLessThan(scenario.mapLayout.width);
          expect(pos.y).toBeLessThan(scenario.mapLayout.height);
        });
      });
    });
  });
});

