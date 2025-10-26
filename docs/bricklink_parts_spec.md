# 🧱 BrickQuest — Starter Character Parts List & BrickLink Generator Spec

## 📜 Purpose

Create and maintain a starter Bill of Materials (BOM) for BrickQuest player characters and their first wave of upgrades, and generate a BrickLink Wanted List (.xml) file that can be imported directly to bricklink.com.

This list covers:

- 4 starter characters (Engineer, Warrior, MageCore, Trickster)
- Mid-game upgrades (tools, shields, jetpacks, sensors)
- Spare parts for small customization and rebuilds.

## 📦 1. Core LEGO System Parts

| Part No. | Name | Qty | Color | Purpose |
|----------|------|-----|-------|---------|
| 3002 | Brick 2×3 | 20 | Light Bluish Gray (86) | Engineer torso + spares |
| 3003 | Brick 2×2 | 20 | Dark Bluish Gray (85) | Warrior torso |
| 3004 | Brick 1×2 | 30 | White (1) | Trickster/MageCore torso |
| 3022 | Plate 2×2 | 40 | Black (0) | Base feet |
| 3023 | Plate 1×2 | 40 | Black (0) | Jetpack mounts, connection plates |
| 3040 | Slope 30° 1×2 | 20 | Bright Orange (106) | Trickster front panel |
| 3747 | Inverted Slope 1×2 | 10 | Light Bluish Gray (86) | Optional armor shaping |
| 4085b | Clip Plate 1×1 | 30 | Black (0) | Arm sockets |
| 48729 | Bar 1L with Clip | 30 | Black (0) | Arms, weapons |
| 4589 | Cone 1×1 | 20 | Black (0) | Emitters, jetpack nozzles |
| 4073 | Round Plate 1×1 | 20 | Translucent Blue (41) | Sensors, cores |
| 3068b | Tile 2×2 | 10 | Dark Bluish Gray (85) | Shield faces |
| 30367 | Dome 2×2 | 10 | White (1) | MageCore sensor dome |
| 3957 | Antenna 4H | 10 | Black (0) | Sensor arrays |

## Accent Parts

| Part No. | Qty | Color ID | Description | Use |
|----------|-----|----------|-------------|-----|
| 3002 | 8 | 24 (Yellow) | Engineer accent | Shoulders |
| 3003 | 8 | 4 (Red) | Warrior accent | Chest armor |
| 3040 | 8 | 106 (Orange) | Trickster accent | Slope front |

## 🧰 2. Upgrade Mod Assemblies

| Mod Name | Required Parts | Used By |
|----------|----------------|---------|
| Tool Arm | Clip + Bar + Cone | Engineer |
| Shield Arm | Clip + Tile 2×2 | Warrior |
| Sword Arm | Clip + Bar | Warrior, Trickster |
| Sensor Array | 2× Round Plates + Antenna | Engineer, MageCore |
| Jetpack | Plate 1×2 + 2× Cone | Trickster |
| Grapple | Clip + Bar + Cone | Trickster |
| Stealth Panel | Slope 30° 1×2 | Trickster |
| Drone | Plate 1×1 + Cone | MageCore |

All mods are attachable with standard clip and bar connections.

## 🧠 3. Color Guidelines (Recommended)

| Class | Body Color | Accent | Sensors/Details |
|-------|------------|--------|-----------------|
| Engineer | Light Gray | Yellow | Black base, gray tools |
| Warrior | Dark Gray | Red | Black base, dark plates |
| MageCore | White | Translucent Blue | White + crystal |
| Trickster | White | Orange | Black base, orange slope |

## 🛒 4. BrickLink Wanted List Generator

We maintain a simple Python script (`scripts/generate_bricklink_xml.py`) that outputs a valid XML for BrickLink Wanted Lists.

Sample structure:

```xml
<INVENTORY>
  <ITEM>
    <ITEMTYPE>P</ITEMTYPE>
    <ITEMID>3002</ITEMID>
    <COLOR>86</COLOR>
    <MINQTY>20</MINQTY>
    <CONDITION>N</CONDITION>
  </ITEM>
</INVENTORY>
```

## 📁 5. Suggested Folder Structure

```
/docs
  └── bricklink_parts_spec.md        # This spec
/scripts
  └── generate_bricklink_xml.py      # Script to regenerate XML
/assets
  └── images/characters/              # Visual renders of starter & modded bots
      ├── starter.png                # Base character builds
      └── upgraded.png               # Mid-game upgraded characters
```

## 🖼️ Visual Reference

See the character images in `/assets/images/characters/` for visual building guides:

- **`starter.png`** - Shows the four base character classes in their initial state (2x2 grid layout)
- **`upgraded.png`** - Demonstrates the same characters with mid-game upgrades and mods (line layout)

These images provide clear visual reference for:
- Color schemes and part placement
- Upgrade mod assembly examples
- Character progression from starter to mid-game state
- Building techniques and part combinations
- Exact LEGO part usage and positioning

## 📈 6. Extending the System

- Add more mod part bundles for advanced upgrades (legs, cannons, sensors).
- Allow multiple XML outputs (e.g., starter_set.xml, expansion_set.xml).
- Tie the parts list to the card expansion system, so expansions generate their required part orders automatically.

## ✅ Usage

1. Run `python scripts/generate_bricklink_xml.py` to generate the XML file
2. Import `brickquest_starter_bricklink_wantedlist.xml` directly to BrickLink under Wanted Lists
3. Use the parts list to build your starter BrickQuest characters and upgrades
