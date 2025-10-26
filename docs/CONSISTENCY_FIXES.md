# 🔧 Documentation Consistency Fixes

## Issues Found and Fixed

### 1. HP Values Inconsistent ✓
**Issue**: Documents showed HP 20/21 instead of updated HP 15/16

**Files Fixed**:
- `docs/INTRO_QUICKSTART.md` - Updated all class HP values (20→15, 21→16)
- `docs/GAME_RULES.md` - Added explicit HP values to class descriptions

**Changes**:
- Engineer: HP 20 → **HP 15**
- Warrior: HP 21 → **HP 16**
- Mage Core: HP 20 → **HP 15**
- Trickster: HP 20 → **HP 15**

### 2. Energy Debt Rules Missing ✓
**Issue**: Game rules didn't clearly state that energy can never go below 0

**Files Fixed**:
- `docs/GAME_RULES.md` - Added explicit energy debt prevention rule in Draw Phase
- `docs/GAME_RULES.md` - Added note to standard actions about energy requirements

**Changes**:
```markdown
**Important**: Energy can never go below 0. You must have sufficient energy to play cards.
```

### 3. Hand Size Limit Enforcement ✓
**Issue**: Rules mentioned hand limit but didn't explain enforcement

**Files Fixed**:
- `docs/GAME_RULES.md` - Clarified hand size enforcement in Draw Phase

**Changes**:
```markdown
**Hand size limit**: Maximum 5 cards - discard excess if you have more
```

---

## Summary of Consistency Updates

### Before
- ❌ HP values: 20/21 (inconsistent across docs)
- ❌ Energy rules: Not clearly stated
- ❌ Hand size: Mentioned but not enforced

### After
- ✅ HP values: 15/16 (consistent across all docs)
- ✅ Energy rules: Clearly stated - never goes below 0
- ✅ Hand size: Explicitly enforced and explained

---

## Files Modified

1. **docs/GAME_RULES.md**
   - Added HP values to class descriptions
   - Added energy debt prevention rule
   - Clarified hand size limit enforcement

2. **docs/INTRO_QUICKSTART.md**
   - Updated all class HP values from 20/21 to 15/16

---

## Verification

All key documents now consistently show:
- HP: 15 (Engineer, Mage Core, Trickster) / 16 (Warrior)
- Hand size: Maximum 5 cards with enforcement
- Energy: Can never go below 0

---

*Consistency fixes completed: $(date)*
*All documentation now aligned with latest game rules*

