---
story_id: 3.4
story_key: 3-4-cash-transactions-menu
epic: 3
epic_title: Cash Transactions
title: Cash Transactions Menu
status: ready-for-dev
source_files:
  - prd.md §4.3
  - architecture.md §3.1
  - ux-design-specification.md §3.7
  - epics.md §Story 3.4
created: 2026-05-02
dependencies:
  - 1-3-app-shell-navigation
  - 3-1-cash-in-deposit
---

# Story 3.4: Cash Transactions Menu

## User Story
As a bank officer, I want a centralized menu of all cash transaction types so that I can navigate to the correct operation quickly.

## Business Context
The Transact tab is the gateway to all transaction operations. A well-organized menu prevents officers from hunting for the right screen. Grouping items by category (CASH, CARD) reduces cognitive load and makes the app feel organized.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Menu items
  Given I am on the Transact tab
  Then I see a grouped list:
    CASH:
      - Cash In →
      - Cash Out →
      - New Account Deposit →
      - Batch BBLS Deposit →
    CARD:
      - Card Transactions →

Scenario: Search filtering
  Given I type "cash" in the search bar
  Then only "Cash In" and "Cash Out" are visible
  And "Card Transactions" is hidden
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/contexts/NavigationContext.tsx` | Screen navigation (Story 1.3) |
| `src/components/Input/Input.tsx` | Reusable input with search icon variant needed |

**What does NOT exist yet:**
- Transact menu screen
- Searchable grouped list component
- Menu item component

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/transact-menu/TransactMenuScreen.tsx` | Grouped menu with search bar |
| `src/features/transact-menu/transact-menu.module.css` | Menu styles |
| `src/components/MenuItem/MenuItem.tsx` | Single menu row with label, arrow, optional subtitle |
| `src/components/MenuItem/MenuItem.module.css` | Menu item styles |
| `src/components/SearchInput/SearchInput.tsx` | Input with search icon, clear button |
| `src/components/SearchInput/SearchInput.module.css` | Search input styles |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'transactMenu'` to `Screen` type |

---

## Technical Requirements

### Menu Data

```typescript
interface MenuGroup {
  title: string
  items: MenuItem[]
}

interface MenuItem {
  id: string
  label: string
  subtitle?: string
  targetScreen: Screen
}

const transactMenu: MenuGroup[] = [
  {
    title: 'CASH',
    items: [
      { id: 'cash-in', label: 'Cash In', subtitle: 'Receive payment', targetScreen: 'cashIn' },
      { id: 'cash-out', label: 'Cash Out', subtitle: 'Disburse cash', targetScreen: 'cashOut' },
      { id: 'new-account-deposit', label: 'New Account Deposit', subtitle: 'Open & fund account', targetScreen: 'newAccount' },
      { id: 'batch-bbls', label: 'Batch BBLS Deposit', subtitle: 'Group deposit', targetScreen: 'batchDeposit' },
    ],
  },
  {
    title: 'CARD',
    items: [
      { id: 'card-transactions', label: 'Card Transactions', subtitle: 'POS operations', targetScreen: 'cardTransactions' },
    ],
  },
]
```

### Search Filtering

```typescript
const filteredMenu = useMemo(() => {
  if (!searchQuery.trim()) return transactMenu
  const q = searchQuery.toLowerCase()
  return transactMenu
    .map(group => ({
      ...group,
      items: group.items.filter(item =>
        item.label.toLowerCase().includes(q) ||
        (item.subtitle?.toLowerCase().includes(q) ?? false)
      ),
    }))
    .filter(group => group.items.length > 0)
}, [searchQuery])
```

### Visual Spec

**Search Bar:**
- Full width, sticky at top
- Background: `--color-surface`
- Border-radius: `--radius-md`
- Padding: 12px 16px
- Search icon (🔍) on left, `--color-text-muted`
- Clear button (✕) on right when text entered

**Group Title:**
- Font: 11px, 600 weight, uppercase
- Color: `--color-text-muted`
- Letter-spacing: 0.05em
- Padding: 16px 16px 8px

**Menu Item:**
- Background: `--color-surface`
- Border-bottom: 1px solid rgba(255, 255, 255, 0.05)
- Padding: 16px
- Flex row, space-between
- Left: Label (14px, 600) + Subtitle (12px, muted) stacked
- Right: Arrow (→) in `--color-text-muted`

**Tap State:**
- Background lightens slightly on active

---

## File Structure Requirements

```
src/
  features/
    transact-menu/
      TransactMenuScreen.tsx       ← NEW
      transact-menu.module.css     ← NEW
  components/
    MenuItem/
      MenuItem.tsx                 ← NEW
      MenuItem.module.css          ← NEW
    SearchInput/
      SearchInput.tsx              ← NEW
      SearchInput.module.css       ← NEW
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `MenuItem` | Renders label, subtitle, arrow; calls onClick |
| `SearchInput` | Renders search icon; clear button appears with text; calls onChange |
| Filtering | "cash" filters to Cash In, Cash Out; "card" filters to Card Transactions |

---

## Common Pitfalls to Avoid

1. **DO NOT** show empty groups when filtering — filter out groups with no matching items
2. **DO NOT** case-sensitive search — always lowercase before comparing
3. **DO NOT** forget the clear button on search — officers need quick reset

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 1.3** (Navigation) | TransactMenu is a main tab screen |
| **Story 3.1–3.3, 6.1, 6.2** | Menu items navigate to screens implemented in other stories |


---

## Tasks/Subtasks

- [ ] **Task 1: Create components and types**
  - [ ] 1.1 Create type definitions
  - [ ] 1.2 Create reusable components
- [ ] **Task 2: Build feature screen(s)**
  - [ ] 2.1 Create main screen component(s)
  - [ ] 2.2 Create styles module
- [ ] **Task 3: Implement hooks and logic**
  - [ ] 3.1 Create data fetching hooks
  - [ ] 3.2 Implement form/business logic
- [ ] **Task 4: API and services**
  - [ ] 4.1 Create/update API functions
  - [ ] 4.2 Add mock implementations
- [ ] **Task 5: Wire navigation and updates**
  - [ ] 5.1 Update navigation types
  - [ ] 5.2 Update parent screens
- [ ] **Task 6: Author tests**
  - [ ] 6.1 Unit tests for components
  - [ ] 6.2 Unit tests for hooks/utils
  - [ ] 6.3 Integration tests
- [ ] **Task 7: Validation & regression**
  - [ ] 7.1 Run full test suite — no regressions
  - [ ] 7.2 Run lint — no errors
  - [ ] 7.3 Run build — succeeds
  - [ ] 7.4 Verify all acceptance criteria are met

---

## Dev Agent Record

### Debug Log
<!-- Developer notes on issues encountered, workarounds, environment quirks -->

### Implementation Plan
<!-- Record technical decisions, approach notes, architecture choices as tasks are completed -->

### Completion Notes
<!-- Summarize what was actually implemented and tested -->

---

## File List
<!-- New, modified, and deleted files relative to repo root -->

---

## Change Log
<!-- Summary of changes per session -->
---

## Completion Checklist

- [ ] `TransactMenuScreen` with grouped list
- [ ] Search bar filters items in real-time
- [ ] `MenuItem` reusable component
- [ ] Tapping item navigates to correct screen
- [ ] Empty groups hidden when filtering
- [ ] Unit tests for filtering and components
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
