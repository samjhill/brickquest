# 🧱 BrickQuest Virtual Playtest Report

## 📋 Executive Summary

Detailed virtual playtest simulation of BrickQuest with 4 players representing all classes. This playtest demonstrates core mechanics, reveals gameplay patterns, and identifies both strengths and areas for improvement.

**Test Date**: 2024-01-15  
**Players**: 4 (Engineer, Warrior, Mage Core, Trickster)  
**Duration**: 6 turns (1.5 full rounds)  
**Board**: 5x5 grid  

---

## 🎮 Players & Starting Conditions

### Player Setup
| Player | Class | Starting HP | Max Energy | Attack | Defense | Movement | Starting Bricks |
|--------|-------|-------------|------------|--------|---------|----------|----------------|
| **Alice** | 🔧 Engineer | 20 | 6 | 2 | 3 | 2 | 6 |
| **Bob** | ⚔️ Warrior | 21 | 5 | 5 | 1 | 2 | 6 |
| **Charlie** | ⚡ Mage Core | 20 | 7 | 3 | 2 | 3 | 6 |
| **Diana** | 🎭 Trickster | 20 | 5 | 3 | 1 | 4 | 6 |

### Board Setup
```
5x5 Grid:
  A B C D E
1 . . . . .
2 . A . . .
3 . . . . .
4 . . . . .
5 . . . . .

Starting Positions (marked with class initial):
- Alice (Engineer): (2,B)
- Bob (Warrior): (2,E)
- Charlie (Mage Core): (4,C)
- Diana (Trickster): (1,A)

Shared Brick Pool: 50 bricks
```

### Deck Configuration
Each player draws 5 cards from a shuffled deck containing all current BrickQuest cards.

---

## 📊 Turn-by-Turn Analysis

### Turn 1: Opening Moves

#### Alice - Engineer (Turn 1)
**Draw Phase**:
- Gains +2 Energy (now 6/6)
- Gains +2 Bricks (now 8)
- Draws 2 cards (hand now 7)
- Current cards: ["Basic Move", "Barricade", "Auto-Repair", "Defend", "Repair", "Energy Core", "Weapon Upgrade"]

**Action Phase**:
- Plays "Barricade" (2E) - Builds defensive wall at (2,A)
  - Spends 4 bricks from personal pile
  - Barricade placed, provides +2 Defense to adjacent units
- Movement: Moves to (3,B) to support the barricade
- Attacks: No attacks this turn

**Board State**: Engineer has established first defensive position

#### Bob - Warrior (Turn 1)
**Draw Phase**:
- Gains +2 Energy (now 7/5 → capped at 5)
- Gains +2 Bricks (now 8)
- Draws 2 cards
- Current cards: ["Charge", "Power Strike", "Rally", "Overcharge", "Seek and Destroy", "Defend", "Combat Protocol"]

**Action Phase**:
- Plays "Charge" (2E) towards Charlie
  - Moves from (2,E) to (3,E)
  - Deals 2 damage to Charlie (Charlie now 18/20 HP)
- Movement: Positioned for next turn's attack
- Energy remaining: 3

**Board State**: Warrior has closed distance with Mage

#### Charlie - Mage Core (Turn 1)
**Draw Phase**:
- Gains +2 Energy (now 5/7)
- Gains +2 Bricks (now 8)
- Draws 2 cards
- Current cards: ["Ranged Attack", "Stealth Mode", "Energy Blast", "Defensive Matrix", "Healing Station", "Energy Efficiency", "Repair"]

**Action Phase**:
- Plays "Stealth Mode" (2E)
  - Program activated: Cannot be targeted by ranged attacks for 3 turns
  - Damage taken: 0 (takes 2 from Bob's Charge)
- Movement: Moves to (5,C) to gain distance
- Energy remaining: 5 (after -2 for Stealth Mode)

**Board State**: Mage is protected from ranged attacks

#### Diana - Trickster (Turn 1)
**Draw Phase**:
- Gains +2 Energy (now 7/5 → capped at 5)
- Gains +2 Bricks (now 8)
- Draws 2 cards
- Current cards: ["Juke", "Flanking Strike", "Shadow Step", "Rush", "Counter Strike", "Misdirection", "Emergency Repair"]

**Action Phase**:
- Plays "Shadow Step" (3E)
  - Teleports from (1,A) to (1,D)
  - Positioned for potential flank
- Movement: Already moved via Shadow Step
- Energy remaining: 2

**Board State**: Trickster is mobile and unpredictable

**End of Turn State**:
- Alice (Engineer): 20/20 HP, 4 Energy, 4 Bricks, Barricade built
- Bob (Warrior): 21/21 HP, 3 Energy, 8 Bricks, damaged Charlie
- Charlie (Mage): 18/20 HP, 5 Energy, 8 Bricks, Stealth Mode active
- Diana (Trickster): 20/20 HP, 2 Energy, 8 Bricks

---

### Turn 2: Combat Develops

#### Alice - Engineer (Turn 2)
**Draw Phase**:
- Gains +2 Energy (now 6/6)
- Gains +2 Bricks (now 6)
- Draws 2 cards (removed 2 from hand, now at 7)
- Current cards include: ["Watchtower", "Repair", "Modular Base"]

**Action Phase**:
- Plays "Watchtower" (3E) at (3,C)
  - Spends 6 bricks (now 0 bricks)
  - Watchtower provides +2 Range bonus
- Movement: Moves to (3,B) back behind Barricade
- Action: Uses "Repair" (1E) on self, heals 2 HP (still at 20/20)
- Energy remaining: 2

**Board State**: Engineer has fortified defensive position with two structures

#### Bob - Warrior (Turn 2)
**Draw Phase**:
- Gains +2 Energy (now 5/5)
- Gains +2 Bricks (now 10)
- Current cards include: ["Seek and Destroy", "Overdrive", "Basic Move"]

**Action Phase**:
- Plays "Seek and Destroy" (3E)
  - Program activated: +1 Attack vs damaged enemies for 2 turns
- Movement: Moves to (3,D) to engage Charlie
- Attacks Charlie (Mage) with basic attack
  - Bob's Attack: 5
  - Bob's VS Damaged bonus: +1 (total 6)
  - Charlie's Defense: 2
  - Damage: 6 - 2 = 4
  - Charlie now 14/20 HP
- Energy remaining: 2

**Board State**: Warrior is hunting damaged Mage

#### Charlie - Mage Core (Turn 2)
**Draw Phase**:
- Gains +2 Energy (now 7/7)
- Gains +2 Bricks (now 10)
- Current hand includes: ["Energy Blast", "Defensive Matrix"]

**Action Phase**:
- Plays "Energy Blast" (3E)
  - Targets Bob at range 2
  - Deals 2 damage to Bob (Bob now 19/21 HP)
- Movement: Moves to (5,B) to increase distance
- Energy remaining: 4

**Board State**: Mage attempting to maintain range

#### Diana - Trickster (Turn 2)
**Draw Phase**:
- Gains +2 Energy (now 4/5)
- Gains +2 Bricks (now 10)
- Current hand includes: ["Flanking Strike", "Emergency Repair", "Juke"]

**Action Phase**:
- Movement: Moves from (1,D) to (3,E) to flank Bob
- Plays "Flanking Strike" (1E) on Bob
  - Diana's Attack: 3
  - Flanking bonus: +1 (total 4)
  - Bob's Defense: 1
  - Damage: 4 - 1 = 3
  - Bob now 16/21 HP
- Energy remaining: 3

**Board State**: Trickster creates pincer movement with Charlie

**End of Turn State**:
- Alice (Engineer): 20/20 HP, 2 Energy, 0 Bricks, 2 Structures
- Bob (Warrior): 16/21 HP, 2 Energy, 10 Bricks, Seek and Destroy active
- Charlie (Mage): 14/20 HP, 4 Energy, 10 Bricks, Stealth Mode active (2 turns left)
- Diana (Trickster): 20/20 HP, 3 Energy, 10 Bricks

---

### Turn 3: Alliances Form

#### Alice - Engineer (Turn 3)
**Draw Phase**:
- Gains +2 Energy (now 4/6)
- Gains +2 Bricks (now 2)
- Current hand includes: ["Defend", "Energy Core", "Modular Base"]

**Action Phase**:
- Plays "Energy Core" (4E)
  - Spends 8 bricks (now 6)
  - Placed at (4,B)
  - Will provide +1 Energy to adjacent units
- Movement: Moves to (3,B) to be near structures
- Energy remaining: 0

**Board State**: Engineer creating energy infrastructure

#### Bob - Warrior (Turn 3)
**Draw Phase**:
- Gains +2 Energy (now 4/5)
- Gains +2 Bricks (now 12)
- Current hand includes: ["Overdrive", "Rally", "Defend"]

**Action Phase**:
- Plays "Rally" (2E)
  - All allies within range gain +1 Attack this turn
  - (No allies in range 2)
  - Plays "Overdrive" (2E)
    - Doubles movement to 4
    - Charges toward Charlie at (5,B)
    - Moves to (5,C)
- Attacks Charlie with basic attack
  - Bob's Attack: 5
  - VS Damaged bonus: +1
  - Rally bonus (self): +1
  - Total: 7
  - Charlie's Defense: 2
  - Damage: 7 - 2 = 5
  - Charlie now 9/20 HP
- Energy remaining: 0

**Board State**: Warrior aggressively pursuing damaged Mage

#### Charlie - Mage Core (Turn 3)
**Draw Phase**:
- Gains +1 Energy from Energy Core nearby (now 8/7 → capped at 7)
- Gains +2 Energy standard (now 9/7 → capped at 7)
- Gains +2 Bricks (now 12)
- Current hand includes: ["Defensive Matrix", "Retreat"]

**Action Phase**:
- Plays "Defensive Matrix" (3E)
  - Gains 3 temporary HP (now 9+3/20 HP)
  - Gains +1 Defense (now 3 total)
- Movement: Moves to (4,A) toward Alice's structures
- Energy remaining: 4

**Board State**: Mage seeking protection and support from Engineer

#### Diana - Trickster (Turn 3)
**Draw Phase**:
- Gains +2 Energy (now 5/5)
- Gains +2 Bricks (now 12)
- Current hand includes: ["Juke", "Emergency Repair", "Retreat"]

**Action Phase**:
- Plays "Juke" (1E)
  - Moves 1 tile to (3,D)
  - Cannot be attacked this turn
- Movement: Already moved via Juke
- Doesn't attack, maintains position
- Energy remaining: 4

**Board State**: Trickster evades and positions strategically

**End of Turn State**:
- Alice (Engineer): 20/20 HP, 0 Energy, 6 Bricks, 3 Structures including Energy Core
- Bob (Warrior): 16/21 HP, 0 Energy, 12 Bricks, Seek and Destroy active
- Charlie (Mage): 9/20 HP, 4 Energy, 12 Bricks, Stealth Mode (1 turn left), +3 temp HP, +1 Defense
- Diana (Trickster): 20/20 HP, 4 Energy, 12 Bricks, Dodge active this turn

---

### Turn 4: Critical Decisions

#### Alice - Engineer (Turn 4)
**Draw Phase**:
- Gains +2 Energy (now 2/6)
- Gains +2 Bricks (now 8)
- Current hand includes: ["Repair", "Bridge", "Defend"]

**Action Phase**:
- Plays "Bridge" (2E) connecting (3,B) to (3,C)
  - Spends 6 bricks (now 2)
  - Connects barricade area to watchtower area
- Uses standard action to Repair Charlie
  - Heals 2 HP (Charlie now 9+2/20 = 11/20 HP)
- Energy remaining: 0

**Board State**: Engineer building connectivity and supporting allies

#### Bob - Warrior (Turn 4)
**Draw Phase**:
- Gains +2 Energy (now 2/5)
- Gains +2 Bricks (now 14)
- Current hand includes: ["Counter Strike"]

**Action Phase**:
- Energy from Seek and Destroy expired
- Movement: Moves to (4,C) to maintain pressure on Charlie
- Attacks Charlie with basic attack
  - Bob's Attack: 5
  - Charlie's Defense: 3 (from Defensive Matrix)
  - Damage: 5 - 3 = 2
  - Charlie now 11-2 = 9/20 HP
- Energy remaining: 2

**Board State**: Warrior continues assault on weakened Mage

#### Charlie - Mage Core (Turn 4)
**Draw Phase**:
- Gains +1 Energy from Energy Core (now 5/7)
- Gains +2 Energy (now 7/7)
- Gains +2 Bricks (now 14)
- Temp HP expires, Defense bonus expires
- Stealth Mode expires
- Current hand includes: ["Energy Efficiency", "Retreat", "Basic Move"]

**Action Phase**:
- Plays "Energy Efficiency" (3E)
  - All cards cost -1 Energy for 3 turns
- Movement: Retreats to (5,A) to maximize distance
- Energy remaining: 4

**Board State**: Mage using efficiency to overcome energy constraints

#### Diana - Trickster (Turn 4)
**Draw Phase**:
- Gains +2 Energy (now 6/5 → capped at 5)
- Gains +2 Bricks (now 14)
- Current hand includes: ["Shadow Step", "Counter Strike", "Emergency Repair"]

**Action Phase**:
- Plays "Counter Strike" as Reaction card (2E)
  - Sets up to counter next attack
- Movement: Moves to (2,D) to get in range
- Plays "Flanking Strike" (1E, discounted by Alice?) on Bob
  - Diana's Attack: 3
  - Flanking bonus: +1
  - Bob's Defense: 1
  - Damage: 4 - 1 = 3
  - Bob now 16-3 = 13/21 HP
- Energy remaining: 2 (after Counter Strike cost of 2)

**Board State**: Trickster actively supporting Mage against Warrior

**End of Turn State**:
- Alice (Engineer): 20/20 HP, 0 Energy, 2 Bricks, 3 Structures
- Bob (Warrior): 13/21 HP, 2 Energy, 14 Bricks, Seek and Destroy expired
- Charlie (Mage): 9/20 HP, 4 Energy, 14 Bricks, Energy Efficiency active (3 turns)
- Diana (Trickster): 20/20 HP, 2 Energy, 14 Bricks, Counter Strike reaction set

---

### Turn 5: Escalation

#### Alice - Engineer (Turn 5)
**Draw Phase**:
- Gains +2 Energy (now 2/6)
- Gains +2 Bricks (now 4)
- Current hand includes: ["Modular Base", "Auto-Repair", "Defend"]

**Action Phase**:
- Plays "Modular Base" (3E, but has Energy Efficiency - 2E effectively)
  - Spends 5 bricks (now 1)
  - Placed at (4,B) near Energy Core
- Plays "Auto-Repair" (2E)
  - Will heal 1 HP at start of each turn for 3 turns
- Movement: Moves to (3,B)
- Energy remaining: 0

**Board State**: Engineer building towards modular structure system

#### Bob - Warrior (Turn 5)
**Draw Phase**:
- Gains +2 Energy (now 4/5)
- Gains +2 Bricks (now 16)
- Current hand includes: ["Overcharge", "Defend", "Combat Protocol"]

**Action Phase**:
- Plays "Overcharge" (4E)
  - Deals 5 damage to Charlie
  - Takes 2 self-damage (now 13-2 = 11/21 HP)
  - Charlie now 9-5 = 4/20 HP
- Energy remaining: 0

**Board State**: Warrior delivers devastating blow to critically wounded Mage

#### Charlie - Mage Core (Turn 5)
**Draw Phase**:
- Gains +1 Energy from Energy Core
- Gains +2 Energy (now 7/7)
- Gains +2 Bricks (now 16)
- Auto-Repair heals +1 HP (now 4+1 = 5/20 HP)
- Current hand includes: ["Repair", "Defensive Matrix"]

**Action Phase**:
- Plays "Defensive Matrix" (3E, discounted to 2E by Energy Efficiency)
  - Gains +3 temp HP
  - Gains +1 Defense
  - Now effectively 5+3 = 8 HP
- Plays "Repair" (1E, discounted to 0E by Energy Efficiency)
  - Heals 2 HP (now 5+2 = 7/20 HP with 3 temp HP)
- Movement: Stays at (5,A) - vulnerable position
- Energy remaining: 4

**Board State**: Mage in critical condition, desperately defending

#### Diana - Trickster (Turn 5)
**Draw Phase**:
- Gains +2 Energy (now 4/5)
- Gains +2 Bricks (now 16)
- Current hand includes: ["Shadow Step", "Emergency Repair"]

**Action Phase**:
- Bob triggers Counter Strike when attacking Charlie
  - Diana deals 2 damage back to Bob
  - Bob now 11-2 = 9/21 HP
- Plays "Shadow Step" (3E)
  - Teleports to (4,E) to position for attack on Bob
- Attacks Bob with basic attack
  - Diana's Attack: 3
  - Bob's Defense: 1
  - Damage: 3 - 1 = 2
  - Bob now 9-2 = 7/21 HP
- Energy remaining: 1

**Board State**: Trickster avenging Charlie, Warrior now on the ropes

**End of Turn State**:
- Alice (Engineer): 20/20 HP, 0 Energy, 1 Brick, 4 Structures, Auto-Repair active
- Bob (Warrior): 7/21 HP, 0 Energy, 16 Bricks
- Charlie (Mage): 7/20 HP, 4 Energy, 16 Bricks, Energy Efficiency active (2 turns), Defensive Matrix active
- Diana (Trickster): 20/20 HP, 1 Energy, 16 Bricks

---

### Turn 6: Climax

#### Alice - Engineer (Turn 6)
**Draw Phase**:
- Gains +2 Energy (now 2/6)
- Gains +2 Bricks (now 3)
- Auto-Repair heals 1 HP (20/20 - fully healthy)
- Current hand includes: ["Bridge", "Defend"]

**Action Phase**:
- Action: Standard repair action on Bob (alliance formed?)
  - Heals 2 HP (Bob now 7+2 = 9/21 HP)
- Movement: Moves to (4,B) near structures
- Energy remaining: 2

**Board State**: Engineer uses turn to heal Warrior - strategic alliance?

#### Bob - Warrior (Turn 6)
**Draw Phase**:
- Gains +2 Energy (now 2/5)
- Gains +2 Bricks (now 18)
- Current hand includes: ["Power Strike", "Defend"]

**Action Phase**:
- Plays "Power Strike" (3E)
  - Deals 4 damage to Charlie
  - Charlie's Defensive Matrix absorbs 3, then takes 1
  - Charlie now 7-1 = 6/20 HP
- Movement: Retreats to (3,E)
- Energy remaining: -1 (debt - cannot play more)

**Board State**: Warrior deals critical damage but energy exhausted

#### Charlie - Mage Core (Turn 6)
**Draw Phase**:
- Gains +1 Energy from Energy Core
- Gains +2 Energy (now 7/7)
- Gains +2 Bricks (now 18)
- Auto-Repair heals 1 HP (now 6+1 = 7/20 HP)
- Defensive Matrix expires
- Current hand includes: ["Ranged Attack", "Repair"]

**Action Phase**:
- Plays "Repair" (1E, discounted to 0E by Energy Efficiency)
  - Heals 2 HP (now 7+2 = 9/20 HP)
- Plays "Ranged Attack" (1E, discounted to 0E by Energy Efficiency) on Bob
  - Charlie's Attack: 3 - 1 = 2
  - Range: 2 (Bob at distance 2)
  - Bob's Defense: 1
  - Damage: 2 - 1 = 1
  - Bob now 9-1 = 8/21 HP
- Movement: Retreats to (5,B)
- Energy remaining: 7

**Board State**: Mage stabilized but vulnerable

#### Diana - Trickster (Turn 6)
**Draw Phase**:
- Gains +2 Energy (now 3/5)
- Gains +2 Bricks (now 18)
- Current hand includes: ["Rush", "Emergency Repair", "Juke"]

**Action Phase**:
- Plays "Rush" (3E)
  - Moves 3 tiles from (4,E) to (3,D)
  - Can move through enemy spaces
- Plays "Flanking Strike" (1E) on Bob
  - Diana's Attack: 3 + 1 = 4
  - Bob's Defense: 1
  - Damage: 4 - 1 = 3
  - Bob now 8-3 = 5/21 HP
- Energy remaining: -1 (cannot play more)

**Board State**: Trickster delivers finishing blow attempt

**End of Turn State**:
- Alice (Engineer): 20/20 HP, 2 Energy, 3 Bricks, 4 Structures, Auto-Repair active (2 turns)
- Bob (Warrior): 5/21 HP, -1 Energy, 18 Bricks, critically wounded
- Charlie (Mage): 9/20 HP, 7 Energy, 18 Bricks, Energy Efficiency active (1 turn), recovering
- Diana (Trickster): 20/20 HP, -1 Energy, 18 Bricks, in control

---

## 📊 Analysis & Observations

### ✅ Strengths Demonstrated

#### 1. **Clear Class Identity**
- **Engineer**: Dominated structure building (4 structures in 6 turns), supporting role evident
- **Warrior**: High damage output (17 total damage dealt), aggressive positioning
- **Mage**: Energy management (used Energy Efficiency effectively), survived 3 attacks
- **Trickster**: Maximum mobility (used 4 movement plus special abilities), flanking specialist

#### 2. **Resource Management is Critical**
- **Energy Economy**: Players had to make tough decisions between multiple cards
- **Brick Scarcity**: Engineers needs more bricks by turn 6
- **Card Synergies**: Energy Efficiency + discounted cards created powerful combos

#### 3. **Tactical Positioning Matters**
- Players actively moved to control battlefield
- Structures (Barricade, Watchtower) provided tangible advantages
- Distance management crucial for ranged combat

#### 4. **Multi-Turn Planning**
- Programs (Stealth Mode, Seek and Destroy, Auto-Repair, Energy Efficiency) created multi-turn strategies
- Players had to plan around program durations

### ⚠️ Issues Identified

#### 1. **Game Length Concerns**
- **6 turns and no eliminations**: Game may run too long for target audience
- **HP pools may be too high**: 20-21 HP means 10-15 turns to eliminate
- **Recommendation**: Reduce starting HP to 15, or implement alternative win conditions

#### 2. **Energy Balance Issues**
- **Energy debt**: Players ending at -1 energy indicates system flaw
- **Some turns wasted**: Players couldn't act when energy exhausted early
- **Recommendation**: Prevent energy debt or add minimum energy guarantee

#### 3. **Hand Management Gap**
- **Large hands**: Drawing up to 5 cards means 7-10 cards in hand
- **Decision paralysis**: Too many options per turn
- **Recommendation**: Limit hand size to 5 cards max or increase card draw costs

#### 4. **Player Interaction Still Limited**
- **Only 3 reaction cards**: Few chances to interact during opponent turns
- **Linear sequencing**: Mostly "wait for your turn" gameplay
- **Recommendation**: Add 5-7 more reaction cards, encourage defensive play

#### 5. **Structure Building Impact**
- **Structures too powerful**: Energy Core created massive energy advantage
- **Investment required**: 8 bricks is huge commitment
- **Recommendation**: Balance structure costs or reduce effects

#### 6. **Lack of Tension**
- **No escalation**: Game feels similar across all turns
- **No time pressure**: No deadline to create urgency
- **Recommendation**: Add global event deck with increasing threats

---

## 🎯 Specific Improvements Needed

### High Priority Fixes

1. **HP Reduction**: Change starting HP from 20 to 15 for faster games
2. **Energy Debt Prevention**: Change energy system to never go below 0
3. **Hand Size Limit**: Enforce maximum hand size of 5 cards
4. **More Reaction Cards**: Add 5-7 defensive/response cards
5. **Game Timer**: Add optional 8-turn limit with objective-based win conditions

### Medium Priority Improvements

6. **Structure Balance**: Reduce Energy Core cost from 8 to 6 bricks
7. **Program Duration**: Reduce program durations by 1 turn (3→2, 2→1)
8. **Movement Cards**: Add more movement variety (climb, swim, fly)
9. **Loot Integration**: Have loot in starting hands or easier acquisition
10. **Class Cards**: Add 1 class-specific card per class to starting deck

### Low Priority Enhancements

11. **Victory Points**: Add VP system alongside elimination
12. **Boss Events**: Add boss encounter cards for cooperative mode
13. **Terrain Variety**: Add more terrain types (water, ruins, hazards)
14. **Campaign Progression**: Persistent upgrades between games
15. **Digital Companion**: App for rule reference and tracking

---

## 🏆 Final Verdict

**Playtest Status**: **PARTIALLY SUCCESSFUL**

### What Works
- Core mechanics are solid
- Classes feel distinct
- Tactical positioning matters
- Resource management creates interesting decisions
- Structure building adds unique tactical layer

### What Needs Work
- Game length (too long for casual play)
- Hand management (too many cards)
- Energy system (debt issue)
- Player interaction (need more reactions)
- Win conditions (need alternatives to elimination)

### Overall Assessment
BrickQuest has strong bones but needs refinement. The hybrid concept is unique and the mechanics work, but the game needs to be faster and more interactive. With the recommended changes, this could be an excellent skirmish game.

**Recommended Next Steps**:
1. Implement HP reduction (20→15)
2. Fix energy debt system
3. Add 5 new reaction cards
4. Test with 8-turn time limit
5. Validate changes with 2-player games

---

*Virtual Playtest completed: 2024-01-15*  
*Next Playtest: Target 3-player and 5-player scenarios*

