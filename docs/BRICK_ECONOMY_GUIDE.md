# 🧱 BrickQuest Brick Economy Guide

## Overview

The Brick Economy system transforms BrickQuest into a truly tactile, physical experience where Lego bricks themselves become the primary resource for building structures. This system eliminates digital tracking complexity while reinforcing the game's maker-centric philosophy.

## 🎯 Core Principles

### 1. Physical Resource Management
- **Bricks are the resource** - no digital tracking needed
- Players physically manage their brick inventory
- Visual and tactile feedback enhances gameplay

### 2. Table-Only Implementation
- No UI changes required for basic functionality
- Digital system tracks energy, phases, and game state
- Physical bricks handle resource management

### 3. Natural Scarcity
- Shared brick pool creates strategic tension
- Destruction returns bricks to pool
- Encourages tactical building decisions

## 🎮 Game Integration

### Turn Structure Integration
The brick economy seamlessly integrates with existing phases:

```
DRAW → ACTION → BUILD → PROGRAM → ENCOUNTER → END
                    ↑
              +2 Bricks gained here
```

### Phase Descriptions
- **Build Phase**: "Gain +2 Bricks from shared pool, play structure cards (spend bricks to build), place terrain tiles, connect Lego/3D printed components"

## 📊 Scaling by Player Count

| Group Size | Starting Bricks | Per Turn Gain | Shared Pool | Brick Cap |
|------------|----------------|---------------|-------------|-----------|
| 2-3 players | 6 total | +2 | 50 total | 8 (optional) |
| 4-5 players | 4 total | +2 | 70 total | 8 (optional) |
| 6+ players | 3 total | +1-2 | 100 total | 8 (optional) |

### Brick Composition
- **Regular Bricks** (🟥): Standard 2x4, 2x2, 1x4 pieces
- **Plates** (🟨): Thin pieces for bases and connections
- **Special Pieces** (🟦): Hinges, technic pieces, decorative elements

## 🏗️ Structure Building

### Card Integration
Structure cards now include brick costs:

```json
{
  "cost": { "energy": 3, "bricks": 8 },
  "buildReq": {
    "bricks": { "regular": 6, "plates": 1, "special": 1, "total": 8 }
  },
  "text": "Ranged attack: 3 damage, 3 range. Cost: 8 bricks (6 regular, 1 plate, 1 special)."
}
```

### Building Process
1. **Check Resources**: Verify you have required bricks
2. **Spend Bricks**: Physically remove bricks from your pile
3. **Build Structure**: Construct using Lego/3D printed components
4. **Place on Board**: Position according to game rules

## 🔄 Brick Flow Mechanics

### Brick Sources
- **Starting Allocation**: Based on player count
- **Turn Income**: +2 bricks per Build Phase
- **Trading**: Players can trade bricks during their turn
- **Destruction Refunds**: Returned to shared pool

### Brick Sinks
- **Structure Building**: Primary use of bricks
- **Upgrades**: Adding to existing structures
- **Custom Builds**: Creative terrain modifications

### Destruction & Refunds
- **Combat Destruction**: All bricks return to shared pool
- **Voluntary Dismantling**: Half bricks (rounded down) return to pool
- **Event Collapse**: Varies by card/GM ruling

## 🎨 Card Design Guidelines

### Cost Display
Structure cards should clearly show brick requirements:

```
"Cost: 8 bricks (6 regular, 1 plate, 1 special)"
```

### Color Coding
Use consistent visual indicators:
- 🟥 Regular bricks
- 🟨 Plate pieces  
- 🟦 Special pieces

### Complexity Scaling
- **Common**: 2-4 bricks, simple structures
- **Uncommon**: 5-8 bricks, moderate complexity
- **Rare**: 9-12 bricks, complex structures
- **Mythic**: 13+ bricks, epic constructions

## 🎲 Optional Rules

### Brick Cap
- **Soft Cap**: 8 bricks per player
- **Overflow**: Don't gain more if over cap
- **Trading**: Allows redistribution of resources

### Advanced Trading
- **Turn-Based**: Only during your turn
- **Negotiation**: Players can make deals
- **Alliances**: Temporary resource sharing

### Scarcity Events
- **Brick Shortage**: Reduce per-turn gain
- **Pool Depletion**: No gains until bricks freed
- **Resource Wars**: Compete for limited bricks

## 🛠️ Implementation Notes

### Digital System Changes
- **Schema Updates**: Added brick cost fields
- **Type Definitions**: Brick inventory tracking
- **Phase Descriptions**: Updated Build Phase text
- **Scaling Rules**: Player count-based allocation

### Physical Setup
- **Brick Containers**: Separate regular, plates, special
- **Shared Pool**: Central container for all players
- **Player Areas**: Individual brick piles
- **Building Space**: Adequate construction area

### Card Printing
- **Cost Display**: Prominent brick requirements
- **Visual Indicators**: Color-coded brick types
- **Instructions**: Clear building guidelines

## 🎯 Strategic Considerations

### Resource Management
- **Early Game**: Build simple structures for immediate benefit
- **Mid Game**: Invest in complex structures for long-term advantage
- **Late Game**: Use remaining bricks for tactical positioning

### Timing Decisions
- **Build Phase Priority**: When to spend vs. save bricks
- **Destruction Timing**: When to dismantle for refunds
- **Trading Opportunities**: When to negotiate with other players

### Faction Synergies
- **Engineer**: More efficient brick usage
- **Warrior**: Focus on defensive structures
- **Mage Core**: Energy-efficient building
- **Trickster**: Mobile, temporary structures

## 🚀 Future Enhancements

### Advanced Mechanics
- **Brick Quality**: Different brick types have different values
- **Modular Building**: Structures can be upgraded over time
- **Destruction Events**: Environmental hazards affect structures
- **Resource Trading**: More complex economic interactions

### Digital Integration
- **Brick Tracking**: Optional digital inventory management
- **Building Guides**: 3D construction instructions
- **Resource Calculator**: Help with complex builds
- **Trading Interface**: Digital negotiation tools

## 📚 Example Cards

### Crystal Wall (Common)
- **Cost**: 2 Energy, 4 Bricks (4 regular)
- **Effect**: +2 Defense cover for adjacent units
- **Build Time**: 1 turn

### Mystic Turret (Uncommon)  
- **Cost**: 3 Energy, 8 Bricks (6 regular, 1 plate, 1 special)
- **Effect**: 3 damage ranged attack, 3 range
- **Build Time**: 2 turns

### Portal Gateway (Rare)
- **Cost**: 5 Energy, 12 Bricks (8 regular, 2 plates, 2 special)
- **Effect**: Teleportation network for allies
- **Build Time**: 3 turns

This brick economy system transforms BrickQuest into a truly unique hybrid experience, combining the strategic depth of card games with the creative satisfaction of physical building. The tactile nature of brick management adds a new dimension to gameplay while maintaining the game's core mechanics and accessibility.
