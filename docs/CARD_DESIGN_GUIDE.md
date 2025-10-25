# BrickQuest Card Design Guide

## Overview

This guide provides comprehensive guidelines for designing balanced and engaging cards for BrickQuest. Follow these principles to create cards that enhance gameplay while maintaining balance.

## Core Design Principles

### 1. Clear Action Verbs
Always start card text with a clear, active verb:
- ✅ "Deal 2 damage to target enemy"
- ✅ "Heal 3 and remove one status"
- ✅ "Attach to a friendly robot"
- ❌ "Target enemy takes 2 damage"
- ❌ "Healing of 3 and status removal"

### 2. Counter-Play Requirements
Any card with hard control effects must include counter-play options:

**Required for:**
- Stun effects
- Immobilize/Root effects
- Silence effects
- Area denial
- Trap cards
- Weather effects

**Counter-play examples:**
- `"rules": {"counters": ["shield", "dispel", "leap"]}`
- `"rules": {"counters": ["detect", "disarm"]}`
- `"rules": {"counters": ["move", "teleport"]}`

### 3. Physical Integration
Structure cards must specify physical build requirements:

```json
"buildReq": {
  "lego": ["2x4_brick:2", "pipe:1"],
  "stl": ["turret_base"],
  "footprint": "1-hex"
}
```

## Faction Identity

### Steampunk
- **Theme**: Gears, pressure, steam vents, mechanical complexity
- **Favors**: Structures, Blueprints, Steam-based effects
- **Keywords**: Steam, Pressure, Gear, Mechanical
- **Playstyle**: Defensive, building-focused, resource management

### Cyber
- **Theme**: Sensors, overclock, EMP, digital warfare
- **Favors**: Programs, Reactions, Data manipulation
- **Keywords**: Data, Scan, Overclock, Neural, EMP
- **Playstyle**: Aggressive, tech-focused, disruption

### Arcane
- **Theme**: Crystals, runes, storms, magical energy
- **Favors**: Weather, Auras, Crystal effects
- **Keywords**: Crystal, Storm, Rift, Resonance, Void
- **Playstyle**: Control, area effects, magical synergy

### Neutral
- **Theme**: Universal, adaptable, foundational
- **Favors**: Basic actions, utility, flexible effects
- **Keywords**: Tactical, Basic, Universal, Utility
- **Playstyle**: Versatile, foundational, balanced

## Card Type Guidelines

### Action Cards
- **Purpose**: Immediate effects, one-time abilities
- **Energy Range**: 0-4E typically
- **Design Focus**: Clear, immediate impact
- **Examples**: Damage, movement, card draw, utility

### Reaction Cards
- **Purpose**: Interrupt other players' actions
- **Energy Range**: 1-3E typically
- **Design Focus**: Timing, counter-play
- **Examples**: Damage prevention, counter-attacks, interrupts

### Structure Cards
- **Purpose**: Persistent battlefield presence
- **Energy Range**: 2-6E typically
- **Design Focus**: Long-term value, positioning
- **Requirements**: Must have `buildReq` for physical builds
- **Examples**: Generators, turrets, sensors, defensive walls

### Program Cards
- **Purpose**: Temporary buffs and ongoing effects
- **Duration**: 1-3 rounds typically
- **Design Focus**: Synergy, timing windows
- **Examples**: Stat boosts, special abilities, team buffs

### Trap Cards
- **Purpose**: Hidden threats, area denial
- **Energy Range**: 1-3E typically
- **Design Focus**: Positioning, timing, counter-play
- **Requirements**: Must specify trigger conditions
- **Examples**: Damage traps, status effects, area denial

### Aura Cards
- **Purpose**: Ongoing effects attached to units
- **Energy Range**: 1-4E typically
- **Design Focus**: Synergy, positioning, stacking rules
- **Examples**: Stat buffs, passive abilities, area effects

### Quest Cards
- **Purpose**: Multi-stage objectives with rewards
- **Design Focus**: Team coordination, long-term goals
- **Requirements**: 2-3 stages, meaningful rewards
- **Examples**: Control objectives, building requirements, collection goals

### Weather Cards
- **Purpose**: Zone-wide environmental effects
- **Duration**: 2-4 rounds typically
- **Design Focus**: Affects all players, strategic timing
- **Examples**: Damage over time, movement restrictions, buffs/debuffs

### Consumable Cards
- **Purpose**: One-time use items
- **Energy Range**: 0-3E typically
- **Design Focus**: Immediate value, resource management
- **Examples**: Healing, damage, utility, status effects

### Blueprint Cards
- **Purpose**: Modify or enhance other cards
- **Energy Range**: 1-4E typically
- **Design Focus**: Synergy, cost reduction, special abilities
- **Examples**: Structure discounts, special builds, enhanced effects

### Boss Technique Cards
- **Purpose**: Powerful effects for DM/NPC use
- **Energy Range**: 3-6E typically
- **Design Focus**: High impact, multi-step effects
- **Examples**: Area damage, status effects, complex sequences

## Balance Guidelines

### Energy Curve
- **0E**: Utility only, no damage or card draw
- **1E**: Up to 2 damage or +2 movement or single buff
- **2E**: Up to 4 damage or 2 effects of 1E tier
- **3E**: Up to 6 damage or strong utility (stun/immobilize)
- **4E+**: Multi-target, summon, or tempo swing (should exhaust or be Rare+)

### Structure Balance
- **Common utility**: HP 4-6, Armor 0-1
- **Defensive/turret**: HP 6-10, Armor 1-2, requires buildReq
- **High HP structures**: Should have significant build requirements

### Program Duration
- **1 round**: Baseline duration
- **2 rounds**: Must be Rare+ or include drawback
- **3+ rounds**: Mythic rarity or significant cost

### Trap Design
- **Trigger**: Must be explicit and clear
- **Counter-play**: Must include detection/disarm options
- **Positioning**: Should require strategic placement

### Aura Stacking
- **Default**: No stacking unless specified
- **Stacking allowed**: Cap at 3 stacks maximum
- **Diminishing returns**: Consider for high-stack auras

### Quest Design
- **Stages**: 2-3 stages maximum
- **Completion time**: Each stage completable in 1-2 rounds
- **Reward value**: Total ≈ 4-6E of value
- **Team coordination**: Should require multiple players

## Text Guidelines

### Length Limits
- **Maximum**: 220 characters for UI compatibility
- **Recommended**: 150 characters or less
- **Flavor text**: Separate from rules text

### Clarity
- Use active voice
- Be specific about targets and conditions
- Avoid ambiguous language
- Include range and area specifications

### Examples
```
✅ "Deal 2 damage to target enemy within 2 hexes"
✅ "Heal 3 and remove one negative status from target ally"
✅ "Attach to a friendly robot. +1 Energy per turn."

❌ "Target takes 2 damage"
❌ "Heal and remove status"
❌ "Attach to robot for energy"
```

## Rules Object Guidelines

### Common Properties
- `damage`: Number (damage dealt)
- `heal`: Number (healing amount)
- `move`: Number (movement points)
- `draw`: Number (cards drawn)
- `energy`: Number (energy gained)
- `range`: Number (range in hexes)
- `area`: Number (area of effect in hexes)
- `duration`: Number (rounds)
- `trigger`: String (activation condition)
- `target`: String (valid targets)
- `statusAdd`: Array (status effects to apply)
- `statusRemove`: Array (status effects to remove)

### Conditional Effects
```json
"rules": {
  "damage": 2,
  "conditional": {
    "if": "adjacentToEnemy",
    "then": {"energy": 1}
  }
}
```

### Area Effects
```json
"rules": {
  "damage": 1,
  "area": 2,
  "target": "enemies"
}
```

### Status Effects
```json
"rules": {
  "statusAdd": [
    {"name": "Stunned", "dur": 1},
    {"name": "Immobilized", "dur": "end_of_round"}
  ]
}
```

## Quality Checklist

Before finalizing a card, verify:

- [ ] Text is clear and under 220 characters
- [ ] Energy cost is appropriate for effect
- [ ] Hard control effects have counter-play options
- [ ] Structure cards have buildReq if needed
- [ ] Faction identity is clear and consistent
- [ ] Rules object is properly formatted
- [ ] Card serves a unique purpose
- [ ] Balance guidelines are followed
- [ ] Physical integration is specified (if applicable)
- [ ] Icons are appropriate and consistent

## Common Mistakes to Avoid

1. **Overpowered effects**: High damage with low cost
2. **Missing counter-play**: Control effects without answers
3. **Unclear targeting**: Ambiguous "target" specifications
4. **Inconsistent faction**: Effects that don't match faction theme
5. **Missing buildReq**: Structures without physical requirements
6. **Text too long**: Exceeding 220 character limit
7. **Duplicate effects**: Cards that are too similar to existing ones
8. **Poor energy curve**: Effects that don't match energy cost
9. **Missing limits**: No per-deck or per-field restrictions
10. **Incomplete rules**: Missing essential rule properties

## Testing Guidelines

1. **Playtest**: Test cards in actual gameplay
2. **Balance check**: Run balance report after changes
3. **Duplicate check**: Use dedupe script to find similar cards
4. **Lint check**: Run lint script for validation
5. **Faction review**: Ensure cards fit faction identity
6. **Physical review**: Verify buildReq makes sense
7. **Counter-play review**: Ensure hard control has answers
8. **Text review**: Check clarity and length
9. **Icon review**: Verify icons match effects
10. **Integration review**: Test with existing cards

Remember: Good card design enhances the game experience for all players while maintaining balance and strategic depth.
