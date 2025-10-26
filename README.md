# 🧱 BrickQuest

A hybrid **tabletop + maker** game combining card mechanics, D&D-style storytelling, Lego building, and 3D printed terrain.

## 🎮 Game Overview

BrickQuest is a story-driven skirmish adventure with:
- 🃏 **Card game mechanics** for actions, events, and upgrades
- 🧠 **Light D&D-style storytelling** and character progression  
- 🧱 **Lego building** for dynamic in-game construction
- 🖨️ **3D printed terrain and parts** for modular, fast setup

## 🤖 Meet Your Characters

Build, customize, and upgrade your LEGO robot heroes! Each character class offers unique abilities and upgrade paths.

### Starter Characters
*[Image: Four BrickQuest starter characters in 2x2 grid - Engineer, Warrior, MageCore, Trickster]*

**From left to right:**
- **🔧 Engineer** - Light bluish-gray with yellow accents, master of construction and repair
- **⚔️ Warrior** - Dark bluish-gray with red armor, combat specialist with sword and shield
- **🔮 MageCore** - White with translucent blue elements, energy manipulation and sensors
- **🎭 Trickster** - White with orange accents, mobility expert with jetpack and grapple

### Mid-Game Upgrades
*[Image: Four upgraded BrickQuest characters in a line - showing progression and enhanced capabilities]*

**Enhanced capabilities:**
- **Engineer** - Advanced tool arms, sensor arrays, and construction drones
- **Warrior** - Dual sword arms, enhanced armor, and defensive systems
- **MageCore** - Advanced sensor domes, energy cores, and mystical artifacts
- **Trickster** - Stealth panels, enhanced jetpacks, and grappling systems

*Ready to build your own? Check out our [LEGO Parts Guide](#-table-setup) below!*

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run the CLI prototype
npm run play

# Generate card templates
python scripts/generate_cards.py

# Card expansion system
npm run cards:build      # Convert CSV to JSON
npm run cards:lint       # Validate cards
npm run cards:balance    # Generate balance report
npm run cards:validate   # Run all validation
```

## 🃏 Card System

BrickQuest features 13 card types with a complete content pipeline:

### Card Types
- **Action**: Movement, attack, defend, repair
- **Structure**: Create physical objects with Lego/3D terrain
- **Program**: Give temporary AI to your robot
- **Event**: Dungeon/world effects
- **Loot & Upgrade**: Permanent or temporary improvements
- **Reaction**: Speed-play during other players' phases
- **Trap**: Face-down cards that trigger on conditions
- **Aura (Mod)**: Attaches to units for ongoing effects
- **Quest**: Multi-stage team objectives
- **Weather/Hazard**: Zone-wide environmental effects
- **Consumable**: One-shot items and potions
- **Blueprint**: Discounts and unlocks for structures
- **Boss Technique**: DM/NPC only powerful effects

### Faction Themes
- **Steampunk** - Gears, pressure, steam vents, mechanical complexity
- **Cyber** - Sensors, overclock, EMP, digital warfare  
- **Arcane** - Crystals, runes, storms, magical energy
- **Neutral** - Universal, adaptable, foundational

### Robot Classes
- **Engineer**: Build efficiency
- **Warrior**: Combat focus
- **Mage Core**: Energy manipulation
- **Trickster**: Mobility and sabotage

## 🛠️ Content Pipeline

- **CSV to JSON ETL** - Convert human-editable CSV to validated JSON
- **Card Linter** - Schema validation and design rule enforcement
- **Balance Report** - Energy curve analysis and balance recommendations
- **Duplicate Detection** - Find near-duplicate card designs
- **Printable Cards** - Generate print-ready card layouts

## 📁 Project Structure

```
brickquest/
├── src/engine/          # Core game engine
├── cards/              # Card definitions and expansions
│   ├── schema/         # JSON schema definitions
│   ├── expansions/     # Card sets and decklists
│   ├── sources/        # Human-editable CSV files
│   └── factions/       # Faction-specific cards
├── terrain/            # 3D printable STL files
├── docs/               # Game rules and guides
└── scripts/            # Helper utilities
```

## 🖨️ Printing

### 3D Terrain
Check `terrain/STL/` for printable components:
- Base hex tiles, turret platforms, trap tiles, robot upgrade parts

### Printable Cards
- HTML Generator - `brickquest_printable_cards.html` for print-ready layouts
- Multiple Card Sets - Switch between expansions, factions, and base sets
- Print Optimized - A4 layout, 3 cards per row, 9 cards per page
- High Quality - Designed for 300gsm cardstock printing

## 🧱 Table Setup

### LEGO Parts for Starter Characters
BrickQuest characters are built with LEGO bricks! Get started with our curated parts list:

- **Parts Specification**: See [BrickLink Parts Spec](docs/bricklink_parts_spec.md) for complete details
- **BrickLink Wanted List**: Import `brickquest_starter_bricklink_wantedlist.xml` directly to [bricklink.com](https://bricklink.com)
- **Regenerate XML**: Run `python3 scripts/generate_bricklink_xml.py` to update the parts list

The starter set includes parts for 4 character classes (Engineer, Warrior, MageCore, Trickster) plus upgrade mods and spare parts for customization.

## 📚 Documentation

- [Game Rules](docs/GAME_RULES.md)
- [Card Reference](docs/CARD_REFERENCE.md)
- [Printing Guide](docs/PRINTING_GUIDE.md)
- [Lore & Story](docs/LORE.md)
- [Card Design Guide](docs/CARD_DESIGN_GUIDE.md) - Comprehensive card design principles
- [Icon Map](docs/ICON_MAP.md) - Complete icon-to-emoji mapping
- [Balance Report](docs/BALANCE.md) - Generated balance analysis
- [Duplicate Report](docs/DUPLICATES.md) - Duplicate card detection

## 🤝 Contributing

This is an open-source project! Feel free to:
- Add new cards - Use the CSV format in `cards/sources/` for easy editing
- Create expansions - Follow the card design guide for balanced content
- Design terrain pieces - Add STL files and update build requirements
- Improve the game engine - Enhance the core mechanics and systems
- Create campaign content - Write quests, encounters, and storylines
- Add new factions - Create themed card sets with unique mechanics
- Improve tooling - Enhance the content pipeline and validation tools

### Card Creation Workflow
1. Edit `cards/sources/cards.csv` with new card data
2. Run `npm run cards:build` to generate JSON
3. Run `npm run cards:validate` to check for issues
4. View `brickquest_printable_cards.html` to see the results
5. Submit a pull request with your additions!

## 📄 License

MIT License - see LICENSE file for details.