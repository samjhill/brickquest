# BrickQuest Simulation Guide

This guide explains how to use the simulation/playtest pipeline to balance BrickQuest.

## Quick Start

### Running Simulations

```bash
# Full simulation suite (5000 games, 32 seeds)
npm run sim:run

# Generate balance report
npm run sim:report

# Complete CI pipeline
npm run sim:ci
```

### Faster Iterations

For rapid testing during development:

```bash
# Specific scenario, fewer games
npm run sim:run -- --scenarios skirmish_2v2 --games 100 --seeds 4

# Multiple scenarios
npm run sim:run -- --scenarios skirmish_2v2,control_vs_burst --games 500 --seeds 8

# With dice mode (non-deterministic)
npm run sim:run -- --dice true --games 1000 --seeds 16
```

## Scenarios

The simulation system includes several pre-configured scenarios:

### 1. skirmish_2v2
- **Description**: Basic 2v2 combat
- **Teams**: 2 players each
- **Map**: 12x12 with cover and high ground
- **Purpose**: Test basic balance and combat flow

### 2. skirmish_3v3
- **Description**: Larger 3v3 battles
- **Teams**: 3 players each
- **Map**: 16x16 with varied terrain
- **Purpose**: Test scaling and team dynamics

### 3. boss_gate_siege
- **Description**: 4 heroes vs 1 boss with NPC waves
- **Teams**: 4 heroes vs 1 super-powered boss
- **Map**: 14x18 with objective points
- **Purpose**: Test asymmetric balance and PvE mechanics

### 4. tech_heavy_environment
- **Description**: Structure and program focused
- **Teams**: 3v3 with engineer focus
- **Map**: 14x14 with build opportunities
- **Purpose**: Test structure balance and tech deck viability

### 5. control_vs_burst
- **Description**: Control team vs damage team
- **Teams**: 2v2 with specialized strategies
- **Map**: 10x10 compact arena
- **Purpose**: Test control card balance vs burst damage

## Understanding Balance Reports

The generated `docs/BALANCE.md` includes:

### Executive Summary
- Total games simulated
- Scenarios tested
- Average Time to Kill (TTK)
- Damage per Energy ratio
- Number of balance issues

### Scenario Analysis
For each scenario:
- Team win rates
- Class win rates
- Card type distribution
- Damage curves
- Control prevalence
- Armor effectiveness

### Recommendations
Prioritized list of suggested balance changes:
- **High Priority**: Critical issues affecting gameplay
- **Medium Priority**: Minor imbalances
- **Low Priority**: Fine-tuning suggestions

## Balance Rails

The simulation enforces these balance guidelines:

| Guideline | Target | Tolerance |
|-----------|--------|-----------|
| Damage per Energy | 2.0 | ±0.3 |
| Control Prevalence | 10-25% | ±5% |
| Armor Mitigation | 20-30% | ±5% |
| Class Win Rates | 40-60% | ±10% |
| Height Bonus | +2 max | Hard cap |
| Cover Bonus | +1 AR | Stacks |

### Card Value Guidelines

**Actions:**
- 1E ≈ 2 damage (no control)
- 2E ≈ 4 damage OR 2 damage + minor effect
- 3E ≈ 6 damage OR 4 damage + control

**Repeatable (Non-Exhaust):**
- Value ≤ 2×E + 1
- Must not dominate with spam

**Hard Control:**
- Minimum Rare rarity
- Minimum 2E cost
- Should be counterable

**Structures:**
- Utility: HP 4-6, AR 0-1, cost 2-3E
- Turret: HP 6-10, AR 1-2, cost 3-5E or bricks

## Applying Balance Changes

### Manual Changes

1. Edit card JSON files in `cards/` directories
2. Run `npm run cards:lint` to validate
3. Re-run simulations to test changes

### Automated Mutation

For systematic changes:

1. Create `mutations.json`:
```json
[
  {
    "cardId": "BQ-ACT-0003",
    "changes": [
      { "field": "damage", "operation": "add", "value": -1 }
    ],
    "reason": "Pulse Strike too strong - reduce damage 2→1"
  }
]
```

2. Preview changes:
```bash
npm run sim:mutate
```

3. Apply changes:
```bash
npm run sim:mutate -- --apply
```

4. Verify:
```bash
npm run cards:lint
npm run sim:run
```

## Interpreting Results

### Damage per Energy < 1.5
**Problem**: Cards are too weak, games too slow
**Solution**: 
- Increase damage on key cards by 1
- Reduce energy costs by 1
- Add more efficient commons

### Damage per Energy > 2.5
**Problem**: Cards are too strong, games too fast
**Solution**:
- Reduce damage on powerful cards
- Increase energy costs
- Add more defensive options

### Control Prevalence > 30%
**Problem**: Control is oppressive
**Solution**:
- Increase cost of control cards
- Reduce duration
- Add counterplay cards

### Class Win Rate < 40% or > 60%
**Problem**: Class is underpowered or overpowered
**Solution**:
- Adjust base stats (HP, AR, energy)
- Review class-specific cards
- Consider deck composition

### Armor Too Effective (>40%)
**Problem**: Combat is too grindy
**Solution**:
- Reduce base AR
- Lower AR on structures
- Add armor-piercing mechanics

### Armor Too Weak (<15%)
**Problem**: No defensive counterplay
**Solution**:
- Increase base AR
- Buff cover bonuses
- Add defensive cards

## AI Decision Policy

The simulation AI uses this priority order:

1. **Finishing Moves**: Kill low-HP enemies (highest priority)
2. **High Ground**: Move to elevated positions when safe
3. **Damage Efficiency**: Play cards with best (damage - enemy AR) ratio
4. **Control**: Use stuns/immobilizes to deny enemy turns
5. **Energy Efficiency**: Spend energy to minimize waste (<1 leftover)
6. **Escape**: Retreat when HP < 30% and in danger
7. **Healing**: Use heal cards when HP < 50%

This policy represents a competent but not optimal player, ensuring results reflect realistic gameplay.

## Using SimLab (Dev UI)

Access the development UI at `http://localhost:3000/?dev=1`:

1. Select scenarios to test
2. Configure game count and seeds
3. Enable/disable dice mode
4. Click "Run Simulations"
5. View real-time results:
   - Win rates by team/class
   - Damage per energy
   - Control prevalence
   - Detailed statistics

## Continuous Integration

GitHub Actions automatically:
- Runs 500 games (8 seeds) on every PR
- Generates balance report
- Comments warnings on PRs
- Uploads artifacts

View results in:
- Actions tab → Latest run → Artifacts
- `simulation-results-*.json`
- `docs/BALANCE.md`

## Best Practices

### Before Submitting Changes

1. Run full simulation suite
2. Review balance report carefully
3. Ensure no new high-priority issues
4. Update card documentation if rules changed
5. Regenerate cheatsheets if needed

### Iterative Balancing

1. Run baseline simulations
2. Identify top 3-5 issues
3. Apply conservative fixes
4. Re-run simulations
5. Verify improvements
6. Repeat until balanced

### Testing Specific Cards

To test a specific card:
1. Create a scenario focusing on that card
2. Run 1000+ games with that scenario
3. Analyze play rate and win rate correlation
4. Adjust if outlier (>2 std dev from mean)

## Troubleshooting

### Simulations Taking Too Long
- Reduce games: `--games 100`
- Reduce seeds: `--seeds 4`
- Run single scenario: `--scenarios skirmish_2v2`

### Inconsistent Results
- Ensure deterministic mode (no dice)
- Use same seed values
- Check for RNG leaks in code

### Balance Report Empty
- Check `sim_results.json` exists
- Verify simulations completed
- Re-run `npm run sim:report`

## Advanced Topics

### Adding New Scenarios

Edit `src/sim/scenarios.ts`:

```typescript
{
  id: 'my_scenario',
  name: 'My Scenario',
  description: 'Custom test scenario',
  mapLayout: { /* ... */ },
  teams: [ /* ... */ ],
  winCondition: { /* ... */ },
  maxRounds: 20,
  diceMode: false,
}
```

### Customizing AI Behavior

Edit `src/sim/runner.ts` → `SimpleAI` class:
- Modify `selectCardToPlay()` for action selection
- Modify `scoreCard()` for card evaluation
- Modify `selectMovement()` for positioning

### Exporting Results

Results are saved as JSON for external analysis:

```bash
# Run and save
npm run sim:run

# Results in: sim_results.json
# Schema: SimulationResult[]
```

Use with Python, R, or Excel for deeper analysis.

---

For questions or issues, see main [README.md](../README.md) or open an issue.

