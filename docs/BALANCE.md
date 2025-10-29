# BrickQuest Balance Report

*Generated: 2025-10-29*

---

## Executive Summary

- **Total Games Simulated**: Pending first simulation run
- **Scenarios Tested**: 0
- **Average TTK (Time to Kill)**: TBD
- **Average Damage per Energy**: TBD (Target: 2.0)
- **Balance Issues Found**: TBD

## Instructions

This file will be auto-generated when you run simulations:

```bash
# Run full simulation suite (5000 games, 32 seeds)
npm run sim:run

# Generate this report
npm run sim:report
```

For faster iterations during development:

```bash
# Run reduced simulations (100 games, 4 seeds)
npm run sim:run -- --scenarios skirmish_2v2 --games 100 --seeds 4
npm run sim:report
```

## Balance Rails Reference

These are the target guidelines for card balance:

1. **Energy to Damage**: 1 Energy ≈ 2 Damage (single-target, no control)
2. **Repeatable Actions**: Value ≤ 2×E + 1
3. **Ranged Height Bonus**: Caps at +2 damage
4. **Cover Bonus**: +1 AR, stacks with base AR
5. **Hard Control** (stun/immobilize): Rare+, usually 2E minimum
6. **Structures**:
   - Utility: HP 4-6, AR 0-1
   - Turret: HP 6-10, AR 1-2 (requires bricks or Blueprint discount)
7. **Control Prevalence**: Target 10-25% of turns
8. **Armor Mitigation**: Target 20-30% damage reduction
9. **Class Win Rates**: Target 40-60% (within 10% of each other)

## Methodology

This report is generated from automated game simulations using:

- **Deterministic AI**: Simple policy-based decision making
- **Seeded RNG**: Reproducible results across runs
- **Multiple Scenarios**: Varied map layouts, team compositions, and objectives
- **Large Sample Size**: Thousands of games per scenario

The AI policy prioritizes:
1. Moving to high ground when beneficial
2. Actions with best (expected damage - enemy AR)
3. Control effects for objective denial or power turn prevention
4. Energy efficiency (leftover E ≤ 1 at end of turn)
5. Reactions when threatened

---

*This report is auto-generated. Review recommendations carefully before applying changes.*

