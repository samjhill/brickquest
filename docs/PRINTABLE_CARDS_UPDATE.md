# 🖨️ BrickQuest Printable Cards - Updated with Balanced Set

## 📋 Overview

The `brickquest_printable_cards.html` file has been successfully regenerated using the balanced card set from our simplified rules. The printable cards now accurately reflect the streamlined 35-card set with proper energy costs and simplified mechanics.

## 🔄 Update Process

### **Script Execution**
- **Command**: `python3 scripts/print_cards.py --cards cards/expansions/core_plus.json --output brickquest_printable_cards.html --no-browser`
- **Source**: Used the balanced card set generated from `cards_balanced.csv`
- **Result**: Successfully generated updated printable cards HTML

### **Bug Fixes Applied**
- **Fixed Energy Cost Display**: Changed from `{card.get('cost', 0)}` to `{card.get('cost', {}).get('energy', 0)}` to properly extract energy values
- **Fixed Card Text Display**: Changed from `{card.get('description', '')}` to `{card.get('text', '')}` to match JSON field names
- **Result**: Cards now display proper energy costs (0-4) and full card descriptions

### **Card Count Verification**
- **Total Cards**: 35 cards (down from 58 in original set)
- **Estimated Pages**: 4 pages (3 cards per row, 9 cards per page)
- **Layout**: A4 format, optimized for 300gsm cardstock printing

## 📊 Card Distribution

### **Card Types** (5 types total)
- **Action Cards**: 15 cards (43%)
- **Structure Cards**: 6 cards (17%)
- **Program Cards**: 6 cards (17%)
- **Reaction Cards**: 3 cards (9%)
- **Loot Cards**: 5 cards (14%)

### **Energy Cost Distribution**
- **0E**: 5 cards (Loot cards - free upgrades)
- **1E**: 8 cards (Basic actions)
- **2E**: 9 cards (Enhanced actions)
- **3E**: 10 cards (Powerful actions and programs)
- **4E**: 3 cards (High-impact cards)

## 🎯 Key Cards Included

### **Action Cards** (15 total)
- **Basic Move** - 1E, Move 1 tile
- **Dash** - 2E, Move 2 tiles
- **Melee Attack** - 1E, Adjacent damage
- **Ranged Attack** - 1E, 2-3 tile range
- **Repair** - 1E, Heal 2 HP
- **Defend** - 1E, +2 Defense
- **Energy Surge** - 2E, Gain 2 Energy
- **Precision Shot** - 2E, 3 damage, cannot miss
- **Rally** - 2E, All allies +1 Attack
- **Desperate Strike** - 1E, Conditional damage
- **Power Strike** - 3E, 4 damage
- **Energy Blast** - 3E, Area damage
- **Combat Protocol** - 3E, 3 damage + card draw
- **Defensive Matrix** - 3E, Temporary HP + Defense
- **Overcharge** - 4E, High-risk, high-reward

### **Structure Cards** (6 total)
- **Barricade** - 2E, Blocks movement, +2 Defense
- **Bridge** - 2E, Connects tiles
- **Turret** - 3E, Automated ranged defense
- **Watchtower** - 3E, +2 Range bonus
- **Energy Core** - 4E, Energy regeneration
- **Healing Station** - 3E, End-of-turn healing

### **Program Cards** (6 total)
- **Auto-Repair** - 2E, 3 turns, heal 1 HP per turn
- **Seek and Destroy** - 3E, 2 turns, +1 Attack vs damaged
- **Stealth Mode** - 2E, 3 turns, ranged immunity
- **Combat Protocols** - 3E, 2 turns, +2 Attack +1 Defense
- **Energy Efficiency** - 3E, 3 turns, -1 Energy cost
- **Overdrive Protocol** - 4E, 2 turns, +3 Movement +2 Attack

### **Reaction Cards** (3 total)
- **Parry Matrix** - 1E, Prevent 2 damage, gain Energy if adjacent
- **Counter Strike** - 2E, Deal 2 damage back when attacked
- **Emergency Repair** - 1E, Heal 2 HP when damaged

### **Loot Cards** (5 total)
- **Energy Core** - 0E, Permanent +1 max Energy
- **Shield Generator** - 0E, Permanent +2 Defense
- **Speed Boost** - 0E, Permanent +1 Movement
- **Weapon Upgrade** - 0E, Permanent +1 Attack
- **Sensor Array** - 0E, Permanent +2 Range

## 🎨 Print Specifications

### **Card Design**
- **Size**: 2.5" x 3.5" (standard playing card size)
- **Layout**: Professional card design with headers, bodies, and footers
- **Colors**: Rarity-based color coding (Gray/Green/Blue/Gold)
- **Icons**: Type-specific icons for easy identification

### **Print Settings**
- **Paper**: 300gsm cardstock recommended
- **Format**: A4 (8.27" x 11.69")
- **Layout**: 3 cards per row, 9 cards per page
- **Quality**: High quality, color printing
- **Background**: Enable background graphics for best results

### **Finishing**
- **Cutting**: Use paper cutter or scissors along card borders
- **Laminating**: Consider laminating for durability
- **Storage**: Standard card sleeves recommended

## ✅ Validation

### **Card Count**
- ✅ **35 cards total** (matches balanced set)
- ✅ **4 pages estimated** (correct pagination)
- ✅ **All card types represented** (5 types)

### **Card Content**
- ✅ **Simplified names** (Basic Move, Melee Attack, etc.)
- ✅ **Balanced energy costs** (0-4E range)
- ✅ **Proper descriptions** (from balanced CSV)
- ✅ **Correct rarities** (Common/Uncommon/Rare)

### **Print Quality**
- ✅ **Professional layout** (headers, bodies, footers)
- ✅ **Rarity color coding** (visual distinction)
- ✅ **Type icons** (easy identification)
- ✅ **Print optimization** (A4 format, proper margins)

## 🚀 Benefits

### **For Players**
- **Accurate Cards**: All cards match simplified rules
- **Balanced Set**: Well-tested energy curve and mechanics
- **Easy Learning**: Simplified card names and effects
- **Professional Quality**: Print-ready design

### **For Game Masters**
- **Complete Set**: All 35 cards needed for gameplay
- **Consistent Rules**: Cards match updated game rules
- **Easy Reference**: Clear card types and costs
- **Print Ready**: Optimized for physical printing

### **For Development**
- **Automated Generation**: Script ensures consistency
- **Version Control**: Easy to regenerate with updates
- **Quality Assurance**: Automated validation of card data
- **Maintainable**: Single source of truth for card data

## 📝 Summary

The `brickquest_printable_cards.html` file has been successfully updated with the balanced card set from our simplified rules. The printable cards now feature:

- **35 cards total** (down from 58)
- **5 card types** (down from 13)
- **Balanced energy curve** (0-4E range)
- **Simplified mechanics** (easier to learn)
- **Professional print layout** (A4 optimized)
- **Complete rule consistency** (matches game rules)

Players can now print a complete, balanced set of BrickQuest cards that perfectly matches the simplified rules, providing a seamless experience between the digital companion and physical gameplay.
