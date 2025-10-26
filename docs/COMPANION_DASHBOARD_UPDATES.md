# 🎯 Companion Dashboard Updates - Simplified Rules

## 📋 Overview

The companion dashboard has been updated to reflect the simplified BrickQuest rules, ensuring consistency between the game rules and the digital companion interface.

## 🔄 Changes Made

### 1. **Phase System Updates**

#### **Types Updated**
- **File**: `src/client/src/types/index.ts`
- **Change**: `PhaseId` type reduced from 6 phases to 3 phases
- **Before**: `"DRAW" | "ACTION" | "BUILD" | "PROGRAM" | "ENCOUNTER" | "END"`
- **After**: `"DRAW" | "ACTION" | "END"`

#### **Phase Logic Updated**
- **File**: `src/client/src/lib/sm/phases.ts`
- **Changes**:
  - `PHASE_ORDER` array reduced from 6 to 3 phases
  - `getPhaseDisplayName()` updated with simplified phase names
  - `getPhaseDescription()` updated with simplified phase descriptions

#### **Turn Rail Component Updated**
- **File**: `src/client/src/features/dashboard/TurnRail.tsx`
- **Change**: Phase pills array reduced from 6 to 3 phases
- **Before**: `['DRAW', 'ACTION', 'BUILD', 'PROGRAM', 'ENCOUNTER', 'END']`
- **After**: `['DRAW', 'ACTION', 'END']`

### 2. **Game Rules Panel Updates**

#### **Phase Information Simplified**
- **File**: `src/client/src/features/dashboard/GameRulesPanel.tsx`
- **Changes**:
  - Reduced from 6 phase items to 3 phase items
  - Updated Action Phase description to include building and programming
  - Removed separate Build, Program, and Encounter phases

#### **Card Types Updated**
- **Changes**:
  - Removed Event Cards (no longer exist)
  - Updated energy cost ranges to reflect simplified cards
  - Added Reaction Cards section
  - Updated Structure Cards description

#### **New Sections Added**
- **Movement System**: Added section explaining simplified 1E per tile movement
- **Combat System**: Added section explaining simplified combat mechanics

### 3. **Game Context Updates**

#### **State Interface Updated**
- **File**: `src/client/src/context/GameContext.tsx`
- **Changes**:
  - `GameState.phase` type reduced from 6 to 3 phases
  - `NEXT_PHASE` reducer updated with simplified phase array
  - Phase cycling logic updated

## 📊 Updated Phase Descriptions

### **Draw Phase**
- **Description**: "Draw cards up to hand limit (5 cards), shuffle discard pile if needed, process start of turn effects"
- **Purpose**: Card acquisition and turn setup

### **Action Phase** (Expanded)
- **Description**: "Play action cards, build structures, install programs, move your robot, attack enemies, use special abilities"
- **Purpose**: All player actions consolidated into single phase
- **Includes**: 
  - Card play
  - Structure building
  - Program installation
  - Movement
  - Combat
  - Special abilities

### **End Phase**
- **Description**: "Reset energy to maximum, process active programs, check win conditions"
- **Purpose**: Turn cleanup and effect processing

## 🎮 Updated Card Type Information

### **Action Cards**
- **Energy Range**: 1-4 energy (updated from 1-3)
- **Purpose**: Movement, attack, defend, repair

### **Structure Cards**
- **Energy Range**: 2-4 energy (updated from 2-5)
- **Purpose**: Create physical objects with Lego building

### **Program Cards**
- **Energy Range**: 2-4 energy (updated from 1-3)
- **Duration**: 2-3 turns
- **Purpose**: Give temporary AI to your robot

### **Reaction Cards** (New Section)
- **Energy Range**: 1-2 energy
- **Purpose**: Speed-play during other players' phases

### **Loot & Upgrade Cards**
- **Energy Cost**: 0 energy (unchanged)
- **Purpose**: Permanent improvements found as rewards

## 🏃‍♂️ New Movement System Section

### **Basic Movement**
- **Cost**: 1 Energy per tile moved
- **Simplification**: Linear energy-to-movement ratio

### **Movement Stats by Class**
- **Engineer/Warrior**: 2 tiles
- **Mage Core**: 3 tiles  
- **Trickster**: 4 tiles

### **Restrictions**
- Cannot move through enemy spaces (except Trickster)
- Terrain may affect movement costs

## ⚔️ New Combat System Section

### **Melee Attack**
- **Range**: Adjacent only
- **Damage**: Equal to attack stat

### **Ranged Attack**
- **Range**: 2-3 tiles
- **Damage**: Attack stat -1

### **Hit Mechanics**
- **Base Hit Chance**: 80%
- **Cover Effect**: Reduces accuracy by 20%
- **Simplified**: No complex line of sight calculations

## 🔍 Validation

### **No Linting Errors**
All updated files pass TypeScript linting without errors.

### **Consistent Interface**
The companion dashboard now accurately reflects the simplified game rules:
- ✅ 3 phases instead of 6
- ✅ Updated card type information
- ✅ Simplified movement and combat rules
- ✅ Consistent phase descriptions
- ✅ Updated energy cost ranges

## 🚀 Benefits

### **For Players**
- **Consistent Experience**: Digital companion matches physical game rules
- **Accurate Reference**: Quick reference panel shows correct simplified rules
- **Easier Learning**: Dashboard reinforces simplified phase structure

### **For Game Masters**
- **Accurate Tracking**: Turn rail shows correct 3-phase structure
- **Proper Guidance**: Rules panel provides correct simplified information
- **Streamlined Interface**: Less complex phase management

### **For Developers**
- **Consistent Codebase**: All components use same simplified phase definitions
- **Maintainable**: Single source of truth for phase definitions
- **Future-Proof**: Easy to extend with additional simplified mechanics

## 📝 Summary

The companion dashboard has been successfully updated to reflect the simplified BrickQuest rules. All phase references, card type information, and game mechanics descriptions now accurately represent the streamlined 3-phase system with consolidated Action Phase that includes building and programming.

The digital companion now provides a consistent and accurate reference for players using the simplified rules, ensuring a seamless experience between the physical game and digital tools.
