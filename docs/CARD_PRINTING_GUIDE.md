# 🖨️ BrickQuest Card Printing Guide

## 📋 Overview

This guide explains how to convert your generated BrickQuest cards into printable physical cards for tabletop gaming.

## 🚀 Quick Start

### 1. Generate Cards (if not already done)
```bash
cd scripts
python3 generate_cards.py --count 20 --type action
```

### 2. Create Printable Cards
```bash
cd scripts
python3 print_cards.py --cards ../cards/generated_cards.json
```

### 3. Print Cards
- Open `cards/printable_cards.html` in your browser
- Press `Ctrl+P` (or `Cmd+P` on Mac)
- Select your printer and print settings
- Print on cardstock or photo paper

## 🎨 Card Design Features

### Visual Elements
- **Rarity Colors**: Common (Gray), Uncommon (Green), Rare (Blue), Legendary (Gold)
- **Type Icons**: Action (⚡), Structure (🏗️), Program (💻), Event (🎲), Upgrade (⬆️)
- **Card Stats**: Damage (⚔️), Range (🎯), Duration (⏱️)
- **Professional Layout**: Clean, readable design optimized for printing

### Card Information
- **Name**: Card title
- **Type**: Action, Structure, Program, Event, or Upgrade
- **Cost**: Energy cost (top-right corner)
- **Description**: Card effect text
- **Effects**: Detailed effect descriptions
- **Stats**: Damage, range, duration values
- **Rarity**: Color-coded rarity level

## 📄 Print Settings

### Recommended Paper
- **Cardstock**: 300gsm (110lb) for durability
- **Photo Paper**: 200-250gsm for color quality
- **Standard Paper**: 80-100gsm for testing

### Print Configuration
- **Size**: A4 (8.27" x 11.69")
- **Layout**: 3 cards per row, 9 cards per page
- **Quality**: High/Photo quality
- **Color**: Full color printing
- **Background Graphics**: Enable for best results

### Browser Print Settings
1. Open `printable_cards.html` in your browser
2. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
3. Select your printer
4. Click "More settings"
5. Enable "Background graphics"
6. Set paper size to A4
7. Print!

## ✂️ Cutting and Finishing

### Cutting Tools
- **Paper Cutter**: Best for straight, clean cuts
- **Scissors**: Good for small batches
- **Guillotine**: Professional results

### Cutting Guidelines
- Cut along the card borders
- Leave small margin for error
- Use a ruler for straight cuts
- Consider using a corner rounder for professional look

### Finishing Options
- **Lamination**: Protects cards from wear
- **Sleeves**: Standard card sleeves (2.5" x 3.5")
- **Corner Rounding**: Professional appearance
- **Gloss Coating**: Enhanced durability

## 🛠️ Advanced Options

### Custom Card Counts
```bash
# Generate specific number of cards
python3 generate_cards.py --count 50 --type action

# Print specific cards
python3 print_cards.py --cards my_cards.json --output my_printable.html
```

### Card Types
- **Action Cards**: ⚡ Player abilities and attacks
- **Structure Cards**: 🏗️ Buildings and defensive items
- **Program Cards**: 💻 Robot programming and upgrades
- **Event Cards**: 🎲 Random events and encounters
- **Upgrade Cards**: ⬆️ Equipment and modifications

### Rarity Distribution
- **Common (Gray)**: 60% of cards
- **Uncommon (Green)**: 25% of cards
- **Rare (Blue)**: 12% of cards
- **Legendary (Gold)**: 3% of cards

## 📊 Card Statistics

### Standard Deck Sizes
- **Starter Deck**: 30 cards
- **Full Deck**: 60 cards
- **Tournament Deck**: 100+ cards

### Print Estimates
- **9 cards per page** (A4)
- **30 cards = 4 pages**
- **60 cards = 7 pages**
- **100 cards = 12 pages**

## 🎯 Quality Tips

### Best Results
1. Use high-quality cardstock (300gsm+)
2. Enable background graphics in print settings
3. Use color printing for rarity indicators
4. Cut carefully along borders
5. Consider laminating for durability

### Troubleshooting
- **Cards too small**: Check print scale settings
- **Colors not printing**: Enable background graphics
- **Cards cut off**: Check page margins
- **Poor quality**: Use higher DPI settings

## 📁 File Structure

```
brickquest/
├── cards/
│   ├── generated_cards.json      # Generated card data
│   └── printable_cards.html      # Printable HTML file
├── scripts/
│   ├── generate_cards.py         # Card generation script
│   ├── print_cards.py           # Card printing script
│   └── print_cards.sh           # Shell wrapper script
└── docs/
    └── CARD_PRINTING_GUIDE.md   # This guide
```

## 🔧 Command Reference

### Generate Cards
```bash
# Basic generation
python3 scripts/generate_cards.py

# Custom options
python3 scripts/generate_cards.py --count 20 --type action --rarity rare

# With validation
python3 scripts/generate_cards.py --count 10 --validate --print
```

### Print Cards
```bash
# Basic printing
python3 scripts/print_cards.py

# Custom output
python3 scripts/print_cards.py --cards my_cards.json --output my_cards.html

# No browser auto-open
python3 scripts/print_cards.py --no-browser
```

### Shell Scripts
```bash
# Generate and print in one command
./scripts/print_cards.sh
```

## 🎉 Success!

Your BrickQuest cards are now ready for printing! The HTML file contains all the styling and layout needed for professional-looking cards. Simply open it in your browser and print to create your physical card deck.

Happy gaming! 🎲⚡🤖
