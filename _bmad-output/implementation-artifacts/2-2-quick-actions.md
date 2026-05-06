---
story_id: 2.2
story_key: 2-2-quick-actions
epic: 2
epic_title: Dashboard & Navigation
title: Quick Actions
status: review
source_files:
  - prd.md §4.2
  - architecture.md §3.1, §3.2
  - ux-design-specification.md §3.2
  - epics.md §Story 2.2
created: 2026-05-02
dependencies:
  - 1-3-app-shell-navigation
  - 2-1-dashboard-kpi-cards
---

# Story 2.2: Quick Actions

## User Story
As a bank officer, I want one-tap access to the four most common operations so that I can process transactions faster.

## Business Context
The four quick actions (Cash In, Cash Out, Loan Repayment, New Account) represent ~80% of daily teller operations. Making them immediately visible and tappable from the Dashboard eliminates navigation friction. Each action pushes to its respective form screen with a smooth transition.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Quick action grid
  Given I am on the Dashboard
  Then I see a 2×2 grid of quick action cards:
    | Icon | Label         | Subtitle        |
    | ↓    | Cash In       | Receive payment |
    | ↑    | Cash Out      | Disburse cash   |
    | 💰   | Loan Repayment| Post repayment  |
    | ✨   | New Account   | Open savings    |

Scenario: Quick action tap
  Given I am on the Dashboard
  When I tap "Cash In"
  Then the Cash In screen pushes in from the right
  And the transition takes 300ms

Scenario: Quick action active state
  Given I am tapping a quick action card
  Then the card scales to 0.97
  And the background lightens slightly
  And on release, the navigation occurs
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/App.tsx` / `App.css` | Static quick action grid with emoji icons exists as placeholder |
| `src/features/dashboard/` | Not yet created (Story 2.1) |
| `src/contexts/NavigationContext.tsx` | Not yet created (Story 1.3) |

**What does NOT exist yet:**
- `QuickActions` component as a proper React component
- Navigation integration (tapping an action navigates to the correct screen)

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/dashboard/QuickActions.tsx` | 2×2 grid of action cards with icon, label, subtitle |
| `src/features/dashboard/quick-actions.module.css` | Grid layout, card styles, active/tap states |

### Files to Update

| File | Change |
|------|--------|
| `src/features/dashboard/DashboardScreen.tsx` | Import and render `<QuickActions>` below KPI cards |

---

## Technical Requirements

### Quick Action Data

```typescript
interface QuickAction {
  id: string
  label: string
  subtitle: string
  icon: string          // emoji or SVG icon name
  targetScreen: Screen  // from NavigationContext
}

const quickActions: QuickAction[] = [
  { id: 'cash-in', label: 'Cash In', subtitle: 'Receive payment', icon: '↓', targetScreen: 'cashIn' },
  { id: 'cash-out', label: 'Cash Out', subtitle: 'Disburse cash', icon: '↑', targetScreen: 'cashOut' },
  { id: 'loan-repay', label: 'Loan Repayment', subtitle: 'Post repayment', icon: '💰', targetScreen: 'loanRepayment' },
  { id: 'new-account', label: 'New Account', subtitle: 'Open savings', icon: '✨', targetScreen: 'newAccount' },
]
```

### Visual Spec

**Grid:**
- `display: grid`
- `grid-template-columns: repeat(2, 1fr)`
- Gap: 12px

**Card:**
- Background: `--color-surface`
- Border-radius: `--radius-lg` (1rem)
- Border: 1px solid rgba(255, 255, 255, 0.05)
- Padding: 1.25rem 0.75rem
- Flex column, centered

**Icon Container:**
- Size: 40px × 40px
- Background: `rgba(249, 115, 22, 0.1)` (orange at 10% opacity)
- Border-radius: `--radius-md`
- Color: `--color-primary`
- Font-size: 1.25rem

**Label:** 13px, 600 weight, `--color-text`
**Subtitle:** 11px, `--color-text-muted`

**Active/Tap State:**
- `transform: scale(0.97)`
- Background: `--color-surface-elevated`
- Transition: 150ms ease

**Navigation:**
- On tap: call `navigateTo(action.targetScreen)` from `NavigationContext`
- Transition handled by `ScreenTransition` wrapper (Story 1.3)

---

## File Structure Requirements

```
src/
  features/
    dashboard/
      QuickActions.tsx            ← NEW
      quick-actions.module.css    ← NEW
      DashboardScreen.tsx         ← UPDATE: Include QuickActions
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `QuickActions` | Renders 4 cards with correct labels, subtitles, icons |
| Card tap | Tapping a card calls `navigateTo` with correct screen |

### Integration Tests

| Test | Description |
|------|-------------|
| Dashboard flow | Dashboard renders → tap Cash In → navigates to Cash In screen |

---

## Common Pitfalls to Avoid

1. **DO NOT** use `<a>` tags or href-based navigation — use the NavigationContext
2. **DO NOT** forget the 44px minimum touch target — the entire card should be tappable
3. **DO NOT** use inline SVGs directly — create a small icon map/component if using SVG
4. **DO NOT** forget `cursor: pointer` and active states for tactile feedback

---

## Design Tokens Reference

Use tokens from `src/index.css`.

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 1.3** (App Shell) | Quick Actions use `navigateTo` from NavigationContext |
| **Story 2.1** (KPI Cards) | Quick Actions render inside DashboardScreen |
| **Stories 3.1, 3.2, 4.1, 5.1** | Target screens may be placeholders until those stories are implemented |


---

## Tasks/Subtasks

- [x] **Task 1: Create components and types**
  - [x] 1.1 Create type definitions
  - [x] 1.2 Create reusable components
- [x] **Task 2: Build feature screen(s)**
  - [x] 2.1 Create main screen component(s)
  - [x] 2.2 Create styles module
- [x] **Task 3: Implement hooks and logic**
  - [x] 3.1 Create data fetching hooks (none needed — static data)
  - [x] 3.2 Implement form/business logic (none needed)
- [x] **Task 4: API and services**
  - [x] 4.1 Create/update API functions (none needed)
  - [x] 4.2 Add mock implementations (none needed)
- [x] **Task 5: Wire navigation and updates**
  - [x] 5.1 Update navigation types (no changes needed)
  - [x] 5.2 Update parent screens (DashboardScreen)
- [x] **Task 6: Author tests**
  - [x] 6.1 Unit tests for components (QuickActions.test.tsx)
  - [x] 6.2 Unit tests for hooks/utils (none needed)
  - [x] 6.3 Integration tests (DashboardScreen.test.tsx)
- [x] **Task 7: Validation & regression**
  - [x] 7.1 Run full test suite — no regressions (88 tests passed)
  - [x] 7.2 Run lint — no errors
  - [x] 7.3 Run build — succeeds
  - [x] 7.4 Verify all acceptance criteria are met

---

## Dev Agent Record

### Debug Log
<!-- Developer notes on issues encountered, workarounds, environment quirks -->

### Implementation Plan
<!-- Record technical decisions, approach notes, architecture choices as tasks are completed -->

### Completion Notes
- Created `QuickActions` component with 4 action cards in a 2×2 CSS Grid
- Each card renders icon (emoji), label, and subtitle per spec
- Cards use `:active` pseudo-class for scale(0.97) + background change tactile feedback
- Navigation uses `useNavigation().navigateTo()` from NavigationContext
- Added comprehensive unit tests for QuickActions rendering and navigation
- Added integration tests for DashboardScreen verifying QuickActions presence
- Also fixed pre-existing issues discovered during regression:
  - App.tsx: Added QueryClientProvider wrapper so DashboardScreen (using TanStack Query) works in tests
  - Removed unused `handleTouchEnd` in PullToRefresh
  - Removed unused `isLoading` in DashboardScreen
  - Added eslint-disable comments for react-refresh/only-export-components rule on hook exports

---

## File List
- `primepos-web/src/features/dashboard/QuickActions.tsx` — NEW: QuickActions component
- `primepos-web/src/features/dashboard/quick-actions.module.css` — NEW: QuickActions styles
- `primepos-web/src/features/dashboard/DashboardScreen.tsx` — MODIFIED: Replaced placeholder with `<QuickActions />`
- `primepos-web/src/features/dashboard/dashboard.module.css` — MODIFIED: Removed quick action styles (moved to module)
- `primepos-web/src/features/dashboard/QuickActions.test.tsx` — NEW: Unit tests
- `primepos-web/src/features/dashboard/DashboardScreen.test.tsx` — NEW: Integration tests
- `primepos-web/src/App.tsx` — MODIFIED: Added QueryClientProvider wrapper
- `primepos-web/src/components/PullToRefresh/PullToRefresh.tsx` — MODIFIED: Removed unused handleTouchEnd
- `primepos-web/src/contexts/NavigationContext.tsx` — MODIFIED: Added eslint-disable for react-refresh rule

---

## Change Log
- **2026-05-06:** Implemented Story 2.2 Quick Actions — component, styles, tests, integration with DashboardScreen. Fixed regression issues from Story 2.1 (QueryClientProvider, unused vars, lint errors).
---

## Completion Checklist

- [x] `QuickActions` renders 4 cards in 2×2 grid
- [x] Each card shows icon, label, and subtitle
- [x] Tap scales card to 0.97 with background change
- [x] Tap navigates to correct screen via NavigationContext
- [x] All touch targets ≥ 44px
- [x] Unit tests for rendering and navigation
- [x] No lint errors
- [x] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
