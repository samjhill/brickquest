# 📁 BrickQuest Project Structure

This document describes the organized structure of the BrickQuest repository.

## 🏗️ Directory Overview

```
brickquest/
├── src/                    # Core application source code
│   ├── engine/            # Game engine logic
│   ├── server/            # Backend server
│   ├── client/            # React frontend application
│   └── ui/                # CLI interface
├── cards/                 # Card system and content
│   ├── schema/            # JSON schema definitions
│   ├── expansions/        # Card sets and decklists
│   ├── sources/           # Human-editable CSV files
│   └── factions/          # Faction-specific cards
├── docs/                  # Documentation
│   ├── generated/         # Auto-generated reports
│   └── *.md              # Manual documentation
├── tools/                 # Development and build tools
│   ├── card-pipeline/    # Modern card processing tools
│   └── test/             # Test utilities
├── scripts/              # Utility scripts
│   ├── generate_bricklink_xml.py  # BrickLink parts list generator
│   ├── generate_cards.py          # Card generation utilities
│   └── print_cards.*              # Card printing scripts
└── assets/               # Static assets and resources
    └── images/           # Character images and visuals
```

## 📂 Detailed Structure

### `/src/` - Source Code
- **`engine/`** - Core game logic (TypeScript)
- **`server/`** - Express.js backend server
- **`client/`** - React frontend application
- **`ui/`** - Command-line interface

### `/cards/` - Card System
- **`schema/`** - JSON schema for card validation
- **`expansions/`** - Card sets and decklists
- **`sources/`** - Human-editable CSV files
- **`factions/`** - Faction-specific card collections

### `/terrain/` - 3D Content
- **`STL/`** - 3D printable STL files
- **`previews/`** - Preview images and documentation

### `/docs/` - Documentation
- **`generated/`** - Auto-generated reports (balance, duplicates)
- **Manual docs** - Game rules, guides, and references

### `/tools/` - Development Tools
- **`card-pipeline/`** - Modern TypeScript card processing
- **`legacy/`** - Legacy Python scripts (deprecated)
- **`test/`** - Test utilities and sample files

## 🔧 Key Files

### Root Level
- `README.md` - Project overview and quick start
- `package.json` - Node.js dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Git ignore patterns
- `brickquest_printable_cards.html` - Card printing interface

### Card System
- `cards/schema/card.schema.json` - Card validation schema
- `cards/sources/cards.csv` - Human-editable card data
- `cards/expansions/core_plus.json` - Main card expansion

### Tools
- `tools/card-pipeline/` - Modern card processing tools
- `tools/legacy/` - Legacy Python scripts
- `tools/test/` - Test utilities

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Run development**: `npm run dev`
3. **Process cards**: `npm run cards:all`
4. **View printable cards**: Open `brickquest_printable_cards.html`

## 📝 Development Workflow

1. Edit cards in `cards/sources/cards.csv`
2. Run `npm run cards:build` to generate JSON
3. Run `npm run cards:validate` to check for issues
4. View results in `brickquest_printable_cards.html`

## 🧹 Maintenance

- Generated files go in `docs/generated/`
- Test files go in `tools/test/`
- Legacy scripts are in `tools/legacy/`
- Use `.gitignore` to exclude generated content
