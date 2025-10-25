# BrickQuest Companion UI — Product Spec

## 1) Goals & Non-Goals

### Goals
- Track players, teams, and Hero Automata stats (HP, Energy, Armor, Statuses, Upgrades)
- Run a turn/phase tracker with a visible current player, phase, and round
- Provide quick actions: damage/heal, gain/spend energy, add/remove status, draw/discard markers, program timers
- Log all changes with undo/redo
- Persist sessions, export/import state, and support hotseat/TV display

### Non-Goals
- No map, movement, line-of-sight, dice physics, or card rules resolution
- No rules enforcement beyond the phase/turn state machine

## 2) Users & Modes

### Table Host / DM
- Configures session, adds NPCs/monsters, triggers encounters (optional)

### Players
- View & adjust their own stats (optionally restricted)

### Spectator / Wallboard
- Read-only, large display of turn order & phase

### Roles
- **Owner**: full control
- **DM**: add/edit NPCs, trigger encounters, override phases
- **Player**: edit self, propose changes (owner/DM can lock)
- **Viewer**: read-only

## 3) Core Entities (Data Model)

TypeScript interfaces are canonical for both FE state and API.

```typescript
type Id = string;

export type PhaseId = "DRAW" | "ACTION" | "BUILD_PROGRAM" | "ENCOUNTER" | "END";

export interface StatBlock {
  hp: { current: number; max: number };
  energy: { current: number; max: number };
  armor?: number;
  speed?: number;
  range?: number;
  custom?: Record<string, number>; // e.g., "Heat", "Shield", "XP"
}

export interface StatusEffect {
  id: Id;
  name: string;                 // "Burning", "Stunned", "Overheated"
  icon?: string;                // emoji or key for icon set
  stacks?: number;
  expires?: number | "end_of_round" | "end_of_phase";
  notes?: string;
}

export interface UpgradeTag {
  id: Id;
  name: string;                 // "Flamethrower Arm", "Sensor Array"
  slot?: "weapon" | "sensor" | "mobility" | "core" | "other";
  bonus?: Partial<StatBlock>;
}

export interface Participant {
  id: Id;
  name: string;
  team?: string;                // "Party", "Rivals", "DM"
  kind: "PLAYER" | "NPC";
  class?: "Engineer" | "Warrior" | "MageCore" | "Trickster" | string;
  color?: string;               // UI accent
  stats: StatBlock;
  statuses: StatusEffect[];
  upgrades: UpgradeTag[];
  notes?: string;
  isDown?: boolean;
}

export interface TurnOrder {
  order: Id[];              // participant ids
  index: number;            // whose turn (index into order)
  round: number;
  phase: PhaseId;
}

export interface LogEvent {
  id: Id;
  ts: number;
  actorId?: Id;             // who made the change in UI
  targetId?: Id;
  type:
    | "STAT_SET" | "STAT_DELTA"
    | "STATUS_ADD" | "STATUS_UPDATE" | "STATUS_REMOVE"
    | "UPGRADE_ADD" | "UPGRADE_REMOVE"
    | "TURN_NEXT" | "PHASE_SET" | "ROUND_ADVANCE"
    | "PARTICIPANT_ADD" | "PARTICIPANT_REMOVE" | "PARTICIPANT_UPDATE"
    | "NOTE";
  payload: any;
  undo?: any;               // payload snapshot for undo
}

export interface Session {
  id: Id;
  name: string;
  createdAt: number;
  ownerRole: "Owner" | "DM" | "Player";
  participants: Record<Id, Participant>;
  turn: TurnOrder;
  settings: {
    lockPlayerEdits?: boolean;
    showSpectatorUrl?: boolean;
    timers?: { perTurnSec?: number; perPhaseSec?: number };
    houseRules?: Record<string, any>;
  };
  log: LogEvent[];
  version: number;          // for migrations
}
```

## 4) State Machine (Phases & Flow)

### Phases (per turn)
DRAW → ACTION → BUILD_PROGRAM → ENCOUNTER → END

### Transitions
- `SET_PHASE(nextPhase)`
- `NEXT_PHASE()` rolls forward; after END, advance to next participant and DRAW
- `NEXT_TURN()` shortcut: END → advance index; if last, ROUND+1, index=0

### Guards
- DM/Owner can override to any phase
- Optional validation hooks: prevent skip if timers/required steps incomplete (toggable)

### Timers (optional)
- Per-turn or per-phase countdown; auto-ping, never auto-advance (safety)

## 5) Screens & Components

### A) Session Lobby
- Create/Load session; set name, number of players
- Add participants (quick add templates for classes)
- Build turn order (drag to sort); color pickers; team tags
- Settings: lock edits, enable spectator link, timers

### B) Live Dashboard
- Header: Session name • Round • Current Player chip • Phase pills (clickable)
- Turn/Phase Rail: Large "Now Playing" panel; Prev/Next buttons; Skip, Hold, End Turn
- Participants Grid/List: cards with HP/energy bars, armor, statuses, upgrades
- Quick actions (+/− HP; +/− Energy; Add Status; Add Upgrade)
- Collapse/expand details (notes, custom stats)
- Log Drawer: chronological, filterable, click-to-undo
- Timers: phase/turn countdown, pause/reset, subtle sound cue toggle
- Encounter Quick Panel (optional): add NPC, mass-apply status, round events

### C) Spectator / Wallboard
- Read-only, high-contrast, minimal controls
- Current player & phase are huge; turn queue visible
- Optional QR to join as viewer

### D) Participant Detail Modal
- Full edit of stats, statuses (stacking & expiry), upgrades (with slots), notes
- Presets for common statuses (e.g., "Overheated: −1 Action, expires end_of_round")

### E) Settings & Data
- Import/Export JSON
- Theme (dark, high-contrast), font scaling, color-blind palette
- Hotkeys list and remapping

## 6) Interaction & Hotkeys (MVP)

- `N` Next Phase • `T` End Turn • `[/]` Previous/Next Player
- `H/Shift+H` −/+ 1 HP on selected participant
- `E/Shift+E` −/+ 1 Energy
- `U` Undo • `R` Redo
- `G` Add Status • `P` Add Upgrade
- `.` Start/Stop timer

## 7) Accessibility & UX

- WCAG 2.1 AA: keyboard-first navigation, focus rings, ARIA live regions (announce phase/turn changes)
- Color-blind safe palettes for team and status icons
- "Large Tiles" mode for TV viewing from distance

## 8) Persistence & Sync

- Local-first: IndexedDB for autosave every action
- Export/Import: one-click JSON with version stamp
- Sync (optional later): WebSocket room; role-based permissions; CRDT or server-side log merge
- Conflict strategy: last-writer-wins on same field + full undo history

## 9) API (optional server; simple REST)

```
GET    /sessions/:id
POST   /sessions              // create
PATCH  /sessions/:id          // update meta/settings
POST   /sessions/:id/events   // append LogEvent (server replicates & applies)
GET    /sessions/:id/events?since=<ts>
WS     /rooms/:id             // realtime broadcast of events
```

All mutations are event-based; the server applies events and returns updated session snapshot + event id for undo.

## 10) Component Architecture (React + Zustand/Redux)

```
/src
  /app
    AppShell.tsx
    routes.tsx
  /features/session
    useSessionStore.ts  // state, actions, undo/redo stack
    SessionLoader.ts
    ExportImport.ts
  /features/turn
    TurnRail.tsx
    PhasePills.tsx
    Timer.tsx
  /features/participants
    ParticipantCard.tsx
    ParticipantGrid.tsx
    ParticipantModal.tsx
    QuickActions.tsx
  /features/log
    LogDrawer.tsx
    LogItem.tsx
  /features/settings
    SettingsPanel.tsx
  /lib
    sm/phases.ts        // state machine helpers
    ids.ts, time.ts
    persist.ts          // IndexedDB
    a11y.ts
```

## 11) Design System (Tokens)

- Colors: primary, success, danger, warning, neutral grays; color-blind safe variants
- Density: compact (desktop) and spacious (TV)
- Iconography: status icons (🔥 overheat, ⚡ energy, 🛡 armor, 💥 stunned, 🧩 upgrade)
- Feedback: toast for saves, subtle chime on phase/turn change

## 12) Validation & Error States

- HP/energy clamped to [0, max]
- Prevent negative stacks; confirm delete on participant/status removal
- "Downed" auto-flag if HP hits 0 (toggleable)

## 13) Seed & Presets

- Quick add buttons: "Engineer 20/6/2", "Warrior 24/4/3", "Mage Core 18/8/1", "Trickster 20/5/2"
- Status library with defaults (duration & stacks)
- Upgrade library (no mechanics—just tags for reference)

## 14) Testing & Acceptance Criteria

MVP must pass:

1. Create session, add 4 players + 2 NPCs; reorder; save and reload state
2. Run 3 full rounds with phase changes; timers running; no crashes
3. Adjust HP/Energy via hotkeys and UI; log records all; undo/redo works
4. Export JSON, clear cache, import JSON; state restored 1:1
5. Spectator mode shows correct player/phase and updates live (local or synced)
6. A11y: complete keyboard flow; screen reader announces phase/turn changes

## 15) Roadmap

- **v0.1 MVP**: local-only; dashboard, turn rail, participants, log, undo/redo, import/export, timers
- **v0.2 Roles & Wallboard**: spectator URL, lock player edits
- **v0.3 Sync**: lightweight WS room; player self-service on mobile
- **v0.4 Quality**: theming, hotkey remap, status/upgrade libraries editor
- **v1.0**: auth, multi-session management, template gallery, cloud save
