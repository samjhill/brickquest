# 🧱 BrickQuest Quick Reference

<div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 20px;">
  <div>📅 Turn Structure</div>
  <div>🕹️ Actions</div>
  <div>⚔️ Combat</div>
  <div>🛡️ Armor & Cover</div>
</div>

---

## 📅 Turn Structure

| Phase | Description | Key Actions |
|-------|-------------|-------------|
| **1. Draw** | Refresh hand, resolve start effects | Draw up to 5 cards |
| **2. Action** | Play cards, move, attack, build, program | All actions in one phase |
| **3. End** | Status cleanup, shield refresh | Reset energy, process programs |

---

## 🕹️ Standard Actions

| Action | Cost | Effect |
|--------|------|--------|
| **Melee Attack** | 1E | Base attack dmg, adjacent studs |
| **Ranged Attack** | 1E | Base attack -1 dmg, 2-3 studs |
| **Defend** | 1E | +2 Defense until next turn |
| **Move** | Free | Move up to Movement stat |
| **Repair** | 1E | Restore 2 HP to self/ally |

---

## ⚔️ Combat Resolution

1. **Determine Base Damage** → Card/weapon damage
2. **Apply Height Bonus** → +1 dmg per level (max +2)
3. **Add Attacker Modifiers** → Cards, upgrades
4. **Subtract Armor + Cover** → Damage reduction
5. **Apply Shield First** → Temporary HP
6. **Apply to HP** → Permanent damage
7. **Resolve On-Hit Effects** → Status, reactions

---

## 🛡️ Armor & Cover

| AR | Typical Source | Effect |
|----|----------------|--------|
| **0** | Trickster | Vulnerable |
| **1** | Light armor / partial cover | Negates chip damage |
| **2** | Standard bot | Strong vs small hits |
| **3+** | Fortified structure / boss | Requires piercing or burst |

**Special Rules:**
- **Pierce X** → ignore X armor
- **Armor Break** → ignore all armor  
- **Ignore Cover** → bypass +1 cover bonus
- **Cover** → +1 AR vs ranged if line passes through low wall

---

## 🧱 Terrain & Brick Economy *(Tabletop Only)*

**Turn Start:** +2 bricks from shared pool

**Spend Bricks in Build Phase:**
- Raise walls (2–4 bricks)
- Build turrets (5+ bricks)  
- Fortify positions
- Custom structures

**Brick Pool Scaling:**
- **2-3 players:** 6 bricks each, 50 shared
- **4-5 players:** 4 bricks each, 70 shared
- **6+ players:** 3 bricks each, 100 shared

**Destruction:** Destroyed structures return bricks to pool

---

## 🌀 Reaction Windows

| Trigger | Timing | Examples |
|---------|--------|----------|
| **On Targeted** | Before attack resolves | Parry, Dodge |
| **On Enter Tile** | Triggers trap | Snapjaw Floor |
| **On Hit** | After damage applied | Counter-attack |
| **On Destroy** | When ally/structure destroyed | Last Stand |

---

## ☠️ Common Status Effects

| Status | Effect |
|--------|--------|
| **Prone** | −1 SPD, +1 dmg from ranged, stand costs 1 stud |
| **Immobilized** | SPD 0 |
| **Stunned** | −1 Action next Action Phase |
| **Burning** | 1 dmg at End Phase, +1 Heat |
| **Marked** | Next attack vs target +1 dmg |
| **Shield X** | Temporary HP, expires next turn |
| **Overheated** | −1 Action this turn, can't Overclock |

*Most statuses expire end of round unless stated.*

---

## 🧠 NPC AI

**Target Priority:**
1. Lowest HP in LOS
2. Closest target  
3. Objective holder

**Actions:** 2 per turn (move, melee, ranged)
**Behavior:** Use programmed behavior if scripted

---

## 🔥 Common Icons

| Icon | Meaning | Icon | Meaning |
|------|---------|------|---------|
| ⚔️ | Damage | 🛡️ | Armor/Shield |
| ❤️ | Heal | ⛰️ | High Ground |
| 🕳️ | Trap | ⚡ | Reaction/Energy |
| 🧊 | Immobilize | 💥 | Stun/Explosive |
| 🔥 | Burn/Heat | 🧱 | Brick/Structure |
| 🌀 | Aura | 📡 | Sensor/Scan |
| 💾 | Data | ⚙️ | Gear/Mechanical |
| 💎 | Crystal | 🌊 | Resonance |
| 🔧 | Utility | 🎯 | Tactical |

---

## 🤖 Robot Classes

| Class | Focus | Starting Stats | Special Ability |
|-------|-------|----------------|-----------------|
| **🔧 Engineer** | Build efficiency | +2 Defense, +1 Energy | Build structures for 1 less energy |
| **⚔️ Warrior** | Combat and damage | +3 Attack, +1 HP | Deal +1 damage with attack cards |
| **⚡ Mage Core** | Energy manipulation | +2 Energy, +1 Movement | Draw extra card when playing energy cards |
| **🎭 Trickster** | Mobility and sabotage | +2 Movement, +1 Attack | Move through enemy spaces |

---

## 🃏 Card Types

| Type | Purpose | Cost | Duration |
|------|---------|------|----------|
| **Action** | Movement, attack, defend | 1-3 energy | Immediate |
| **Structure** | Create physical objects | 2-5 energy | Permanent |
| **Program** | Give temporary AI | 1-3 energy | 2-3 turns |
| **Event** | Dungeon/world effects | 0 energy | Varies |
| **Loot** | Permanent improvements | 0 energy | Permanent |

---

*BrickQuest Cheat Sheet v1.0 - Print in landscape for best results*
