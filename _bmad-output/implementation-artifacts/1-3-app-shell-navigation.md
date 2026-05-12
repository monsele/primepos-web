---
story_id: 1.3
story_key: 1-3-app-shell-navigation
epic: 1
epic_title: Authentication & App Shell
title: App Shell & Navigation
status: done
source_files:
  - prd.md §4.1, §4.2
  - architecture.md §3.1, §3.2, §3.3
  - ux-design-specification.md §2.3, §2.4, §3.2
  - epics.md §Story 1.3
created: 2026-05-02
dependencies:
  - 1-1-officer-login
  - 1-2-connection-status-offline-awareness
---

# Story 1.3: App Shell & Navigation

## User Story
As a bank officer, I want a consistent app shell with bottom navigation so that I can quickly access any feature from anywhere in the app.

## Business Context
The app shell is the container that every screen lives inside. It provides brand identity, navigation affordances, and consistent layout boundaries. Without a proper shell, each screen feels disconnected. The bottom navigation is the primary way officers move between major feature areas — it must be always visible on main tabs and gracefully hidden on inner (detail/form) screens.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Bottom navigation visibility
  Given I am logged in
  Then the bottom navigation is visible on all main tabs
  And it has 5 items: Home, Transact, Services, Reports, More

Scenario: Tab switching
  Given I am on the Home tab
  When I tap "Transact"
  Then the Transact screen appears with a fade transition
  And the "Transact" tab is highlighted in orange
  And the other tabs are muted

Scenario: Active tab indicator
  Given I am on any tab
  Then the active tab shows an orange icon and label
  And a small orange dot appears below the label

Scenario: Safe area handling
  Given I am using a phone with a notch or home indicator
  Then the header respects safe-area-inset-top
  And the bottom nav respects safe-area-inset-bottom
  And no content is obscured

Scenario: Inner screen navigation
  Given I am on the Dashboard
  When I tap "Cash In"
  Then the Cash In screen pushes in from the right
  And a back arrow (←) appears in the header
  And the bottom nav is hidden
  When I tap the back arrow
  Then I return to the Dashboard with a pop transition
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/App.tsx` | Basic app shell with header, main content area, and bottom nav (static HTML). No state-driven routing. |
| `src/App.css` | Styles for `.app-header`, `.app-main`, `.bottom-nav`, `.brand`, `.logo`, `.connection-status` |
| `src/index.css` | Design tokens, safe-area variables, base reset |
| `src/hooks/useNetworkStatus.ts` | Basic network status hook |

**What does NOT exist yet:**
- Screen state management (current screen, screen history stack)
- `BottomNav` component (as a proper React component with active state)
- `Header` component (dashboard vs inner-screen variants)
- Screen transition animations (slide in/out)
- App-level state for navigation

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/BottomNav/BottomNav.tsx` | 5-tab bottom navigation with active state, icons, dot indicator |
| `src/components/BottomNav/BottomNav.module.css` | Bottom nav styles with safe-area-inset-bottom |
| `src/components/Header/Header.tsx` | Two-mode header: dashboard (brand + connection pill) and inner-screen (back + title + optional action) |
| `src/components/Header/Header.module.css` | Header styles with safe-area-inset-top |
| `src/components/ScreenTransition/ScreenTransition.tsx` | Wrapper that applies CSS slide transitions based on navigation direction |
| `src/components/ScreenTransition/ScreenTransition.module.css` | `@keyframes slideInRight`, `slideOutRight`, `slideInLeft`, `slideOutLeft` |
| `src/contexts/NavigationContext.tsx` | Tracks `currentScreen`, `screenHistory`, `navigateTo(screen)`, `goBack()` |
| `src/types/navigation.ts` | Screen enum/type definitions |

### Files to Update

| File | Change |
|------|--------|
| `src/App.tsx` | Replace static shell with `NavigationContext.Provider`, render current screen based on nav state, wire `BottomNav` and `Header` |
| `src/App.css` | Remove bottom-nav and header styles (moved to modules), keep `.app-container` and `.app-main` layout shells |

---

## Technical Requirements

### Architecture Compliance

1. **No heavy router:** Use React Context + state for navigation. Do NOT install React Router, TanStack Router, or Wouter.
2. **Screen as state:** `currentScreen` is a string/enum value in context. Screens are conditionally rendered.
3. **History stack:** Array of previous screens for `goBack()` support.
4. **Animation:** CSS keyframes only. No Framer Motion, React Transition Group, etc.
5. **Safe areas:** Use `env(safe-area-inset-*)` CSS variables already defined in `index.css`.

### Navigation Context Spec

```typescript
type Screen =
  | 'dashboard'
  | 'transactMenu'
  | 'servicesMenu'
  | 'reports'
  | 'more'
  | 'cashIn'
  | 'cashOut'
  | 'loanRepayment'
  | 'newAccount'
  | 'batchDeposit'
  | 'accountBalance'
  | 'accountStatement'
  | 'loanInquiry'
  | 'settings'
  | 'profile'
  // ... extend as needed

interface NavigationState {
  currentScreen: Screen
  screenHistory: Screen[]
  transitionDirection: 'push' | 'pop' | 'none'
}

type NavigationAction =
  | { type: 'NAVIGATE'; payload: Screen }
  | { type: 'GO_BACK' }
  | { type: 'REPLACE'; payload: Screen }

// NavigationContext exposes:
function navigateTo(screen: Screen): void
function goBack(): void
function replace(screen: Screen): void
const currentScreen: Screen
const isInnerScreen: boolean  // true when not a main tab
```

### Bottom Navigation Spec

**Tabs:**
| Tab | Screen | Icon (emoji or SVG) |
|-----|--------|---------------------|
| Home | `dashboard` | 🏠 |
| Transact | `transactMenu` | ⚡ |
| Services | `servicesMenu` | ⊞ |
| Reports | `reports` | 📊 |
| More | `more` | ⋯ |

**Active State:**
- Icon color: `--color-primary` (#f97316)
- Label color: `--color-primary`
- 2px orange dot below label (border-radius: 9999px)

**Inactive State:**
- Icon + label color: `--color-text-muted`

**Behavior:**
- Tapping a tab calls `navigateTo(screen)` with `transitionDirection: 'none'` (no animation for tab switching)
- Bottom nav is hidden when `isInnerScreen === true`

### Header Spec

**Dashboard Mode** (`isInnerScreen === false`):
```
┌─────────────────────────────────┐
│  [P] PrimePOS         [Online]  │
│       Mobile Teller Platform    │
└─────────────────────────────────┘
```
- Left: 40px orange square "P" logo + "PrimePOS" + subtitle
- Right: `<ConnectionPill>` from Story 1.2

**Inner Screen Mode** (`isInnerScreen === true`):
```
┌─────────────────────────────────┐
│  ←  Cash In               [ ]   │
└─────────────────────────────────┘
```
- Left: Back arrow button (←), 44px touch target, calls `goBack()`
- Center: Screen title, 18px bold
- Right: Optional action slot (for future use)

### Screen Transition Spec

**Tab Switch:** No animation (instant swap).

**Push (main → inner):**
- New screen slides in from right (`translateX(100%) → translateX(0)`)
- Duration: 300ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

**Pop (inner → main):**
- Current screen slides out to right (`translateX(0) → translateX(100%)`)
- Duration: 300ms
- Easing: same

**Implementation:** Apply transition class to a wrapper div around the screen content. Use `animation-fill-mode: forwards`.

### Safe Area Handling

- Header padding-top: `calc(0.75rem + var(--safe-top))`
- Bottom nav padding-bottom: `calc(0.5rem + var(--safe-bottom))`
- Main content padding-bottom must account for bottom nav height when visible

---

## File Structure Requirements

```
src/
  contexts/
    NavigationContext.tsx        ← NEW: Screen state + history stack
  components/
    BottomNav/
      BottomNav.tsx              ← NEW: 5-tab navigation
      BottomNav.module.css
    Header/
      Header.tsx                 ← NEW: Dashboard / Inner-screen modes
      Header.module.css
    ScreenTransition/
      ScreenTransition.tsx       ← NEW: Animation wrapper
      ScreenTransition.module.css
  types/
    navigation.ts                ← NEW: Screen union type
  App.tsx                        ← UPDATE: Wire NavigationContext, render current screen
  App.css                        ← UPDATE: Keep layout shell only
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| Navigation reducer | `NAVIGATE` sets current screen and pushes to history; `GO_BACK` pops history; `REPLACE` replaces current without pushing |
| `BottomNav` | Renders 5 tabs, highlights active tab, calls `navigateTo` on tap |
| `Header` | Dashboard mode shows brand; inner mode shows back button and title; back button calls `goBack` |
| `isInnerScreen` | Returns `false` for main tabs, `true` for all other screens |

### Integration Tests

| Test | Description |
|------|-------------|
| Tab switching | Tap "Transact" → current screen changes → active tab highlighted → no animation |
| Inner navigation | Tap "Cash In" from Dashboard → Cash In screen appears → BottomNav hidden → Header shows back arrow |
| Back navigation | Tap back arrow → returns to Dashboard → BottomNav visible → Header shows brand |

---

## Common Pitfalls to Avoid

1. **DO NOT** install a routing library — conditional rendering based on context state is sufficient for 14-20 screens
2. **DO NOT** nest Routers or use URL-based routing — this is a mobile PWA, not a website
3. **DO NOT** forget to hide the bottom nav on inner screens
4. **DO NOT** forget to reset scroll position when navigating to a new screen
5. **DO NOT** use `history.pushState` or manipulate the URL — it is unnecessary complexity
6. **DO NOT** animate tab switches — only animate push/pop between main and inner screens
7. **DO NOT** forget `prefers-reduced-motion` media query for accessibility

---

## Design Tokens Reference

Use tokens from `src/index.css`. Key ones:
- `--color-bg`, `--color-surface`, `--color-primary`, `--color-text-muted`
- `--safe-top`, `--safe-bottom`
- `--radius-md`

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 1.1** (Login) | After login, user lands on Dashboard. NavigationContext is initialized. |
| **Story 1.2** (Connection Status) | Header contains `<ConnectionPill>`; ConnectionBanner sits below header. Coordinate z-index and spacing. |
| **Story 2.1–2.3** (Dashboard) | Dashboard is the first screen (`currentScreen = 'dashboard'`). |
| **All future stories** | Every new screen must be added to the `Screen` type and navigation reducer. |

---

## Tasks/Subtasks

- [x] **Task 1: Create type definitions and navigation context**
  - [x] 1.1 Create `src/types/navigation.ts` with `Screen` union type
  - [x] 1.2 Create `src/contexts/NavigationContext.tsx` with reducer, state, provider, and hooks
- [x] **Task 2: Create BottomNav component**
  - [x] 2.1 Create `src/components/BottomNav/BottomNav.tsx`
  - [x] 2.2 Create `src/components/BottomNav/BottomNav.module.css`
- [x] **Task 3: Create Header component**
  - [x] 3.1 Create `src/components/Header/Header.tsx`
  - [x] 3.2 Create `src/components/Header/Header.module.css`
- [x] **Task 4: Create ScreenTransition component**
  - [x] 4.1 Create `src/components/ScreenTransition/ScreenTransition.tsx`
  - [x] 4.2 Create `src/components/ScreenTransition/ScreenTransition.module.css`
- [x] **Task 5: Update App.tsx and App.css**
  - [x] 5.1 Refactor `src/App.tsx` to use `NavigationContext`, render current screen, wire `BottomNav` and `Header`
  - [x] 5.2 Update `src/App.css` to keep layout shell only
- [x] **Task 6: Author tests**
  - [x] 6.1 Unit test: Navigation reducer (NAVIGATE, GO_BACK, REPLACE)
  - [x] 6.2 Unit test: `BottomNav` renders 5 tabs, highlights active, calls navigateTo
  - [x] 6.3 Unit test: `Header` dashboard vs inner-screen modes, back button calls goBack
  - [x] 6.4 Unit test: `isInnerScreen` returns correct boolean for main tabs vs inner screens
- [x] **Task 7: Validation & regression**
  - [x] 7.1 Run full test suite — no regressions
  - [x] 7.2 Run lint — no errors
  - [x] 7.3 Run build — succeeds
  - [x] 7.4 Verify all acceptance criteria are met

---

## Dev Agent Record

### Debug Log
- Fixed reducer logic: navigating to any main tab now clears history and sets transition to 'none', regardless of current screen state. This prevents history accumulation when switching tabs from inner screens.

### Implementation Plan
- **Architecture:** React Context + useReducer for navigation state. No routing library installed.
- **Screen type:** Union type covering all 28 screens (5 main tabs + 23 inner screens), extensible for future stories.
- **Reducer design:** NAVIGATE to main tab → instant switch, clear history. NAVIGATE to inner screen → push to history, animate. GO_BACK → pop history, reverse animate. REPLACE → swap current screen, no animation.
- **AppShell pattern:** App.tsx wraps all screens in a consistent container with Header (fixed top), main content area with ScreenTransition, and conditional BottomNav (fixed bottom). Each screen renders only its content, not the shell.

### Completion Notes
- Created `Screen` union type with 28 screen identifiers and `MAIN_TAB_SCREENS` constant for inner-screen detection.
- Built `NavigationContext` with reducer exposing `navigateTo`, `goBack`, `replace`, `currentScreen`, `isInnerScreen`, and `transitionDirection`.
- Implemented `BottomNav` with 5 tabs, active state (orange icon/label + dot indicator), and `navigateTo` on tap.
- Implemented `Header` with dashboard mode (brand logo + ConnectionPill) and inner-screen mode (back arrow + title + action slot).
- Implemented `ScreenTransition` with CSS keyframe animations (slideInRight/slideOutRight) and `prefers-reduced-motion` support.
- Refactored `App.tsx` to use `NavigationProvider`, `AppShell` pattern with conditional `BottomNav`, and placeholder screens for unimplemented features.
- Removed header and bottom-nav styles from `App.css`, keeping only layout shell and dashboard content styles.
- Wrote 20 unit tests across navigation reducer (9), BottomNav (5), and Header (6). All 78 project tests pass with zero regressions.
- Build succeeds with no TypeScript or Vite errors.

---

## File List

### New Files
- `primepos-web/src/types/navigation.ts`
- `primepos-web/src/types/navigation.test.ts`
- `primepos-web/src/contexts/NavigationContext.tsx`
- `primepos-web/src/components/BottomNav/BottomNav.tsx`
- `primepos-web/src/components/BottomNav/BottomNav.module.css`
- `primepos-web/src/components/BottomNav/BottomNav.test.tsx`
- `primepos-web/src/components/Header/Header.tsx`
- `primepos-web/src/components/Header/Header.module.css`
- `primepos-web/src/components/Header/Header.test.tsx`
- `primepos-web/src/components/ScreenTransition/ScreenTransition.tsx`
- `primepos-web/src/components/ScreenTransition/ScreenTransition.module.css`

### Modified Files
- `primepos-web/src/App.tsx`
- `primepos-web/src/App.css`
- `primepos-web/src/App.test.tsx` (indirectly — component imports changed but test logic intact)

---

## Change Log

**2026-05-05** — Story 1.3 implementation complete
- Created navigation system (types, context, reducer)
- Created BottomNav, Header, ScreenTransition components
- Refactored App.tsx to state-driven shell architecture
- Added 20 unit tests, all passing (78/78 total)
- Build succeeds

---

## Completion Checklist

- [ ] `NavigationContext` with reducer created (currentScreen, history, navigateTo, goBack, replace)
- [ ] `Screen` type includes all planned screens
- [ ] `BottomNav` renders 5 tabs with correct active/inactive styling
- [ ] Active tab shows orange icon, label, and dot indicator
- [ ] `Header` shows brand logo in dashboard mode, back arrow + title in inner mode
- [ ] Bottom nav hidden on inner screens
- [ ] Screen push animation (slide from right) works
- [ ] Screen pop animation (slide to right) works
- [ ] Tab switches are instant (no animation)
- [ ] Safe area insets respected on header and bottom nav
- [ ] `App.tsx` wires all providers and renders current screen
- [ ] Unit tests for reducer, BottomNav, Header
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
