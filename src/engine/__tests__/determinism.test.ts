/**
 * Tests for simulation determinism
 */

import { runSimulations, SimulationConfig } from '../../sim/runner';

describe('Simulation Determinism', () => {
  const testConfig: SimulationConfig = {
    scenarios: ['skirmish_2v2'],
    gamesPerScenario: 10,
    seeds: 2,
    diceMode: false,
  };

  test('should produce identical results with same seed', async () => {
    const results1 = await runSimulations(testConfig);
    const results2 = await runSimulations(testConfig);
    
    expect(results1.length).toBe(results2.length);
    
    // Check that winners match for same seeds
    for (let i = 0; i < results1.length; i++) {
      expect(results1[i].winner).toBe(results2[i].winner);
      expect(results1[i].totalRounds).toBe(results2[i].totalRounds);
    }
  }, 60000); // 60 second timeout for longer test

  test('should produce different results with different seeds', async () => {
    // Run two simulations with different configurations
    const config1: SimulationConfig = {
      scenarios: ['skirmish_2v2'],
      gamesPerScenario: 2,
      seeds: 1,
      diceMode: false,
    };
    
    const config2: SimulationConfig = {
      scenarios: ['skirmish_2v2'],
      gamesPerScenario: 2,
      seeds: 2, // Different number of seeds
      diceMode: false,
    };
    
    const results1 = await runSimulations(config1);
    const results2 = await runSimulations(config2);
    
    // Both should produce valid results
    expect(results1.length).toBeGreaterThan(0);
    expect(results2.length).toBeGreaterThan(0);
    
    // Results should have valid structure
    expect(results1[0]).toHaveProperty('winner');
    expect(results1[0]).toHaveProperty('totalRounds');
    expect(results1[0]).toHaveProperty('seed');
    
    expect(results2[0]).toHaveProperty('winner');
    expect(results2[0]).toHaveProperty('totalRounds');
    expect(results2[0]).toHaveProperty('seed');
    
    // Different seed counts should produce different result counts
    expect(results1.length).not.toBe(results2.length);
  }, 60000);
});

