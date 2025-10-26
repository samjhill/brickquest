# BrickQuest Icon Map

This document maps icon keys used in card definitions to their visual representations in the UI.

## Core Icons

### Combat & Damage
- `damage` = ⚔️
- `heal` = ❤️
- `shield` = 🛡️
- `explosive` = 💥
- `counter` = 🔄
- `stun` = ⚡
- `immobilize` = 🧊
- `silence` = 🤐

### Movement & Positioning
- `move` = 👟
- `teleport` = ✨
- `push` = 👊
- `pull` = 🧲
- `trap` = 🕳️
- `area` = 📍

### Energy & Resources
- `energy` = ⚡
- `bolt` = ⚡
- `exhaust` = 😴
- `sacrifice` = 💀

### Technology & Cyber
- `data` = 💾
- `scan` = 📡
- `sensor` = 📡
- `neural` = 🧠
- `emp` = 📡
- `pulse` = 📡
- `program` = 💻
- `override` = 🔓
- `lock` = 🔒

### Steampunk & Mechanical
- `steam` = 💨
- `gear` = ⚙️
- `pressure` = 📊
- `pipe` = 🔧
- `turret` = 🛞
- `mechanical` = 🔩
- `explosion` = 💥

### Arcane & Magical
- `crystal` = 💎
- `storm` = ⛈️
- `rift` = 🌌
- `void` = 🕳️
- `resonance` = 🌊
- `focus` = 🔍
- `shard` = 💎
- `aura` = 🌀

### Status Effects
- `heat` = 🔥
- `cold` = ❄️
- `poison` = ☠️
- `blind` = 👁️
- `charm` = 💕
- `fear` = 😨
- `root` = 🌱
- `cleanse` = 💧

### Structures & Building
- `structure` = 🏗️
- `blueprint` = 📐
- `build` = 🔨
- `gate` = 🚪
- `wall` = 🧱
- `platform` = 📦

### Quest & Objectives
- `quest` = 🗺️
- `objective` = 🎯
- `reward` = 🏆
- `stage` = 📋

### Weather & Environment
- `fog` = 🌫️
- `rain` = 🌧️
- `snow` = ❄️
- `wind` = 💨
- `hazard` = ⚠️

### Boss & Special
- `boss` = 👑
- `mythic` = ✨
- `special` = ⭐
- `technique` = 🥋

### Utility & General
- `utility` = 🔧
- `tactical` = 🎯
- `defense` = 🛡️
- `offense` = ⚔️
- `support` = 🤝
- `control` = 🎮
- `disrupt` = 💥
- `enhance` = ⬆️

## Icon Usage Guidelines

### Primary Icons
Each card should have 1-2 primary icons that represent the main effect:
- Action cards: `damage`, `heal`, `move`, etc.
- Structure cards: `structure`, `turret`, `sensor`, etc.
- Program cards: `program`, `overdrive`, `resonance`, etc.

### Secondary Icons
Additional icons can be used for:
- Faction identity: `steam`, `data`, `crystal`
- Status effects: `stun`, `immobilize`, `heat`
- Special mechanics: `trap`, `aura`, `quest`

### Icon Combinations
Common combinations:
- `shield` + `bolt` = Defensive reaction
- `steam` + `damage` = Steampunk attack
- `data` + `lock` = Cyber disruption
- `crystal` + `focus` = Arcane enhancement
- `trap` + `immobilize` = Control trap
- `aura` + `heat` = Damaging aura

## Faction Icon Themes

### Steampunk
Primary: `steam`, `gear`, `pressure`, `pipe`
Secondary: `mechanical`, `explosion`, `turret`

### Cyber
Primary: `data`, `scan`, `neural`, `emp`
Secondary: `program`, `lock`, `pulse`, `sensor`

### Arcane
Primary: `crystal`, `storm`, `rift`, `resonance`
Secondary: `focus`, `shard`, `void`, `aura`

### Neutral
Primary: `tactical`, `utility`, `defense`, `offense`
Secondary: `support`, `control`, `enhance`

## Icon Size and Display

### In Card UI
- **Primary icons**: 24x24px, displayed prominently
- **Secondary icons**: 16x16px, displayed smaller
- **Maximum per card**: 3 icons total
- **Layout**: Horizontal row, left to right

### In Lists and Menus
- **Single icon**: 20x20px
- **Multiple icons**: 16x16px each
- **Spacing**: 4px between icons

## Adding New Icons

When adding new icons:

1. **Choose appropriate emoji**: Use clear, recognizable emojis
2. **Update this map**: Add the mapping here
3. **Update UI components**: Ensure the icon renders properly
4. **Test display**: Verify the icon looks good at different sizes
5. **Document usage**: Add guidelines for when to use the icon

## Icon Accessibility

- **Alt text**: Each icon should have descriptive alt text
- **Color contrast**: Ensure icons are visible against card backgrounds
- **Size**: Icons should be large enough to be easily recognizable
- **Consistency**: Use the same icon for the same concept across all cards

## Examples

### Reaction Card
```json
{
  "name": "Parry Matrix",
  "icons": ["shield", "bolt"],
  "text": "When your automaton would take damage, prevent 2..."
}
```

### Structure Card
```json
{
  "name": "Steam Generator",
  "icons": ["steam", "energy"],
  "text": "At round start, gain 1 Energy..."
}
```

### Trap Card
```json
{
  "name": "Snapjaw Floor",
  "icons": ["trap", "immobilize"],
  "text": "Arm on an adjacent stud. First enemy entering..."
}
```

### Aura Card
```json
{
  "name": "Overclock Field",
  "icons": ["aura", "heat"],
  "text": "Attach to a friendly robot. +1 Energy per turn..."
}
```

### Quest Card
```json
{
  "name": "Seal the Breach",
  "icons": ["quest", "gate"],
  "text": "Stage I: Control the center for 1 round..."
}
```

### Weather Card
```json
{
  "name": "Voltaic Storm",
  "icons": ["storm", "sensor"],
  "text": "Lasts 3 rounds. At round end, each unit in exposed studs..."
}
```

### Consumable Card
```json
{
  "name": "Nanite Repair Kit",
  "icons": ["heal", "cleanse"],
  "text": "Heal 2 and remove one non-boss status."
}
```

### Blueprint Card
```json
{
  "name": "Turret Blueprint: Mk I",
  "icons": ["blueprint", "turret"],
  "text": "Your next Turret Structure this turn costs −1 Energy..."
}
```

### Boss Technique Card
```json
{
  "name": "Overlord's Pulse",
  "icons": ["boss", "stun"],
  "text": "Two-step attack: (1) Push all enemies 1 and deal 2 damage..."
}
```

This icon system provides a consistent visual language for BrickQuest cards while maintaining clarity and accessibility.
