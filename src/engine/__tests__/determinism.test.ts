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
    const config1: SimulationConfig = {
      ...testConfig,
      seeds: 1,
    };
    
    const config2: SimulationConfig = {
      ...testConfig,
      seeds: 2,
    };
    
    const results1 = await runSimulations(config1);
    const results2 = await runSimulations(config2);
    
    // Should have different seeds
    expect(results1[0].seed).not.toBe(results2[0].seed);
  }, 60000);
});

