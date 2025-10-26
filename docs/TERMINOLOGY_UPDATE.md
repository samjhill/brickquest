# 🔄 BrickQuest Terminology Update: Tiles → Studs

## 📋 Overview

Successfully updated all instances of "tiles" and "tile" terminology throughout the BrickQuest codebase to use "studs" and "stud" instead. This change aligns the game terminology with LEGO building conventions, where "studs" refer to the small cylindrical protrusions on LEGO bricks that connect pieces together.

## 🔄 Files Updated

### **Documentation Files**
- ✅ `docs/GAME_RULES.md` - Updated all movement and positioning references
- ✅ `docs/MOVEMENT_GUIDE.md` - Updated movement cost explanations
- ✅ `docs/RANGED_ATTACK_GUIDE.md` - Updated range and positioning references
- ✅ `docs/RULE_SIMPLIFICATIONS.md` - Updated simplified rule descriptions
- ✅ `docs/COMPANION_DASHBOARD_UPDATES.md` - Updated dashboard documentation

### **Card Data Files**
- ✅ `cards/sources/cards_balanced.csv` - Updated card descriptions and rules
- ✅ `cards/expansions/core_plus.json` - Updated JSON card data
- ✅ `cards/sources/cards_simplified.csv` - Updated simplified card set
- ✅ `cards/sources/cards.csv` - Updated original card set

### **Game Engine Code**
- ✅ `src/engine/turn.ts` - Updated terrain and positioning logic
- ✅ `src/engine/combat.ts` - Updated combat positioning (no changes found)
- ✅ `src/engine/encounter.ts` - Updated encounter positioning (no changes found)

### **Frontend Components**
- ✅ `src/client/src/features/dashboard/GameRulesPanel.tsx` - Updated UI text
- ✅ `src/client/src/components/GameBoard.tsx` - Updated terrain rendering
- ✅ `src/client/src/context/GameContext.tsx` - Updated game state (no changes found)

### **Generated Files**
- ✅ `brickquest_printable_cards.html` - Regenerated with updated terminology

## 📊 Terminology Changes

### **Movement System**
- **Before**: "Move 1 tile" / "Move 2 tiles"
- **After**: "Move 1 stud" / "Move 2 studs"
- **Context**: Basic movement actions and dash abilities

### **Combat System**
- **Before**: "target within 2 tiles" / "within 3 tiles"
- **After**: "target within 2 studs" / "within 3 studs"
- **Context**: Ranged attack ranges and area effects

### **Structure System**
- **Before**: "Connects two tiles" / "from this tile"
- **After**: "Connects two studs" / "from this stud"
- **Context**: Bridge and watchtower structures

### **Terrain System**
- **Before**: "terrain tile" / "tile position"
- **After**: "terrain stud" / "stud position"
- **Context**: Game board positioning and terrain rendering

## 🎯 Key Benefits

### **LEGO Authenticity**
- **Aligned Terminology**: Uses authentic LEGO building language
- **Familiar Concepts**: Players familiar with LEGO will immediately understand
- **Consistent Branding**: Reinforces the LEGO-based theme

### **Clarity and Precision**
- **Specific Measurement**: "Studs" is more precise than generic "tiles"
- **Visual Reference**: Players can physically count studs on LEGO pieces
- **Building Context**: Connects game mechanics to physical building

### **Professional Presentation**
- **Industry Standard**: Uses terminology familiar to LEGO enthusiasts
- **Marketing Appeal**: More appealing to LEGO community
- **Educational Value**: Teaches proper LEGO terminology

## ✅ Verification Results

### **Card Descriptions Updated**
- **Basic Move**: "Move 1 stud." ✅
- **Dash**: "Move 2 studs." ✅
- **Ranged Attack**: "target within 2 studs" ✅
- **Precision Shot**: "target within 3 studs" ✅
- **Bridge**: "Connects two studs" ✅
- **Watchtower**: "from this stud" ✅

### **Documentation Updated**
- **Game Rules**: All movement and positioning references ✅
- **Movement Guide**: Cost explanations and examples ✅
- **Ranged Attack Guide**: Range and cover mechanics ✅
- **Companion Dashboard**: UI text and descriptions ✅

### **Code Updated**
- **Game Engine**: Terrain and positioning logic ✅
- **Frontend**: UI components and game board ✅
- **Card Data**: All card descriptions and rules ✅

## 🚀 Impact

### **For Players**
- **Immediate Understanding**: LEGO terminology is intuitive
- **Physical Reference**: Can count studs on actual LEGO pieces
- **Consistent Experience**: Terminology matches building experience

### **For Game Masters**
- **Clear Instructions**: More precise movement and positioning
- **LEGO Integration**: Easier to explain using physical LEGO
- **Professional Presentation**: Authentic LEGO terminology

### **For Development**
- **Consistent Codebase**: All files use same terminology
- **Maintainable**: Clear, consistent naming throughout
- **Extensible**: Easy to add new stud-based mechanics

## 📝 Summary

The terminology update from "tiles" to "studs" has been successfully implemented across the entire BrickQuest codebase. This change:

- **Improves Authenticity**: Uses proper LEGO building terminology
- **Enhances Clarity**: More precise and intuitive language
- **Maintains Consistency**: All components use the same terminology
- **Preserves Functionality**: No gameplay changes, only terminology

The game now uses authentic LEGO terminology throughout, making it more appealing to LEGO enthusiasts and providing clearer, more precise language for movement, positioning, and combat mechanics.

**All 35 cards, documentation, and code components now consistently use "studs" instead of "tiles"!**
