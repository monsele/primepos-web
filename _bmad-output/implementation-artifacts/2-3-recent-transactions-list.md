---
story_id: 2.3
story_key: 2-3-recent-transactions-list
epic: 2
epic_title: Dashboard & Navigation
title: Recent Transactions List
status: done
source_files:
  - prd.md §4.2
  - architecture.md §3.1, §6.1
  - ux-design-specification.md §3.2
  - epics.md §Story 2.3
created: 2026-05-02
dependencies:
  - 1-3-app-shell-navigation
  - 2-1-dashboard-kpi-cards
---

# Story 2.3: Recent Transactions List

## User Story
As a bank officer, I want to see my most recent transactions on the Dashboard so that I can verify recent activity at a glance.

## Business Context
Officers need to quickly verify that their last few transactions posted correctly. Seeing recent activity on the Dashboard builds confidence and allows immediate spot-checking without navigating to a separate screen. The list is intentionally limited to the last 5 transactions to avoid clutter.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Transaction list display
  Given I am on the Dashboard
  Then I see a "RECENT TRANSACTIONS" section
  And it shows the last 5 transactions

Scenario: Transaction item structure
  Given a transaction exists
  Then each item shows:
    - Avatar or initial letter in a colored circle
    - Customer name (bold)
    - Transaction type and time (e.g., "Cash In · 10:42 AM")
    - Amount (bold, right-aligned)
    - Status badge (POSTED = green, PENDING = yellow)

Scenario: Empty state
  Given no transactions exist today
  Then the section shows "No transactions yet"
  And optionally hides the section

Scenario: Scroll behavior
  Given there are many transactions
  Then the Dashboard scrolls vertically
  And the bottom nav stays fixed
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/App.tsx` / `App.css` | Static transaction list placeholder with 2 hardcoded items |
| `src/features/dashboard/` | Not yet created (Stories 2.1, 2.2) |

**What does NOT exist yet:**
- `RecentTransactions` component
- `useRecentTransactions` hook
- `Transaction` type definition
- Avatar/initials component
- Status badge component (reusable)

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/dashboard/RecentTransactions.tsx` | Section header + list of transaction items |
| `src/features/dashboard/recent-transactions.module.css` | List and item styles |
| `src/features/dashboard/useRecentTransactions.ts` | TanStack Query hook for `/api/transactions?officerId={id}&date=today&limit=5` |
| `src/components/StatusBadge/StatusBadge.tsx` | Reusable POSTED/PENDING badge |
| `src/components/StatusBadge/StatusBadge.module.css` | Badge styles |
| `src/components/Avatar/Avatar.tsx` | Initials avatar with colored background |
| `src/components/Avatar/Avatar.module.css` | Avatar circle styles |
| `src/types/transaction.ts` | `Transaction` interface |
| `src/utils/date.ts` | Time formatting: `"10:42 AM"` from ISO string |

### Files to Update

| File | Change |
|------|--------|
| `src/features/dashboard/DashboardScreen.tsx` | Import and render `<RecentTransactions>` below Quick Actions |

---

## Technical Requirements

### Transaction Type

```typescript
interface Transaction {
  id: string
  customerName: string
  type: 'Cash In' | 'Cash Out' | 'Loan Repay' | 'New Account' | 'Batch Deposit'
  amount: number           // in kobo
  status: 'POSTED' | 'PENDING'
  createdAt: string        // ISO 8601
}
```

### API Spec

```
GET /api/transactions?officerId={staffId}&date=today&limit=5
```

Mock for MVP:
```typescript
export async function fetchRecentTransactions(officerId: string): Promise<Transaction[]> {
  await new Promise(r => setTimeout(r, 500))
  return [
    { id: '1', customerName: 'Adediran Blessing', type: 'Cash In', amount: 500000, status: 'POSTED', createdAt: '2026-05-02T10:42:00Z' },
    { id: '2', customerName: 'Adejumo Olusegun', type: 'Loan Repay', amount: 1250000, status: 'POSTED', createdAt: '2026-05-02T10:18:00Z' },
  ]
}
```

### Transaction Item Visual Spec

**Container:**
- Background: `--color-surface`
- Border-radius: `--radius-md`
- Border: 1px solid rgba(255, 255, 255, 0.05)
- Padding: 0.875rem 1rem
- Flex row, space-between

**Left side:**
- Avatar: 36px circle, colored background (hash customer name to pick from a palette), white initials
- Name: 14px, 600 weight
- Type + time: 12px, `--color-text-muted`, format: `"Cash In · 10:42 AM"`

**Right side:**
- Amount: 14px, 700 weight, formatted with `formatNaira`
- StatusBadge: below amount

**Status Badge:**
- POSTED: `background: rgba(34, 197, 94, 0.15)`, text: `--color-success`
- PENDING: `background: rgba(234, 179, 8, 0.15)`, text: `--color-warning`
- Font: 10px, 700 weight, uppercase, padding 2px 8px, pill shape

### Avatar Color Palette

Hash the customer name to pick from a fixed palette of 6 muted colors:
```css
--avatar-1: #3b82f6; --avatar-2: #8b5cf6; --avatar-3: #ec4899;
--avatar-4: #10b981; --avatar-5: #f59e0b; --avatar-6: #ef4444;
```
Initials: first letter of first name + first letter of last name (or just first letter if single name).

### Empty State

Show centered text: "No transactions yet" in `--color-text-muted`, 14px.

---

## File Structure Requirements

```
src/
  features/
    dashboard/
      RecentTransactions.tsx         ← NEW
      recent-transactions.module.css ← NEW
      useRecentTransactions.ts       ← NEW
      DashboardScreen.tsx            ← UPDATE
  components/
    StatusBadge/
      StatusBadge.tsx                ← NEW
      StatusBadge.module.css         ← NEW
    Avatar/
      Avatar.tsx                     ← NEW
      Avatar.module.css              ← NEW
  types/
    transaction.ts                   ← NEW
  utils/
    date.ts                          ← NEW: formatTime("2026-05-02T10:42:00Z") → "10:42 AM"
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `formatTime` | ISO string → local time format; handles UTC conversion |
| `StatusBadge` | Renders correct text and color for POSTED/PENDING |
| `Avatar` | Renders initials, applies color from hash |
| `RecentTransactions` | Renders list items with correct data; shows empty state when no data |

### Integration Tests

| Test | Description |
|------|-------------|
| Dashboard transactions | DashboardScreen renders RecentTransactions with data from hook |

---

## Common Pitfalls to Avoid

1. **DO NOT** show full date — use time only for today's transactions
2. **DO NOT** forget to sort by `createdAt` descending (newest first)
3. **DO NOT** hardcode avatar colors — use the hash function for consistency
4. **DO NOT** fetch more than 5 transactions on the Dashboard — keep it lightweight
5. **DO NOT** forget the empty state — first-time users will have no transactions

---

## Design Tokens Reference

Use tokens from `src/index.css`.

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 2.1** (KPI Cards) | Recent Transactions sits below Quick Actions on DashboardScreen |
| **Story 2.2** (Quick Actions) | Layout ordering: KPIs → Quick Actions → Recent Transactions |
| **Story 3.1+** (Transactions) | Transaction types expand as new features are added |
| **Story 8.2** (Queue Manager) | PENDING transactions may come from the offline queue |


---

## Tasks/Subtasks

- [x] **Task 1: Create components and types**
  - [x] 1.1 Create type definitions
  - [x] 1.2 Create reusable components
- [x] **Task 2: Build feature screen(s)**
  - [x] 2.1 Create main screen component(s)
  - [x] 2.2 Create styles module
- [x] **Task 3: Implement hooks and logic**
  - [x] 3.1 Create data fetching hooks
  - [x] 3.2 Implement form/business logic
- [x] **Task 4: API and services**
  - [x] 4.1 Create/update API functions
  - [x] 4.2 Add mock implementations
- [x] **Task 5: Wire navigation and updates**
  - [x] 5.1 Update navigation types
  - [x] 5.2 Update parent screens
- [x] **Task 6: Author tests**
  - [x] 6.1 Unit tests for components
  - [x] 6.2 Unit tests for hooks/utils
  - [x] 6.3 Integration tests
- [x] **Task 7: Validation & regression**
  - [x] 7.1 Run full test suite — no regressions
  - [x] 7.2 Run lint — no errors
  - [x] 7.3 Run build — succeeds
  - [x] 7.4 Verify all acceptance criteria are met

### Review Findings

- [x] [Review][Patch] **Transactions not capped at 5** [RecentTransactions.tsx] — Fixed: Added `.slice(0, 5)` to limit rendered items
- [x] [Review][Patch] **Mock data not sorted by createdAt descending** [useRecentTransactions.ts] — Fixed: Added `.sort()` by `createdAt` descending
- [x] [Review][Patch] **Missing error state handling** [DashboardScreen.tsx, RecentTransactions.tsx] — Fixed: Passed `error` from hook to component; added error UI with `role="alert"`
- [x] [Review][Patch] **DashboardScreen test too shallow** [DashboardScreen.test.tsx] — Fixed: Added `staffId` to auth mock; test now waits for and verifies real transaction data renders
- [x] [Review][Patch] **`|| []` fallback masks loading/error states** [DashboardScreen.tsx:69] — Fixed: Pass `undefined` directly; component handles with `?? []` internally
- [x] [Review][Patch] **Avatar lacks `role="img"`** [Avatar.tsx:29] — Fixed: Added `role="img"`
- [x] [Review][Patch] **Non-semantic list markup** [RecentTransactions.tsx] — Fixed: Replaced divs with `<ul role="list">` and `<li>`; added `.listItem` CSS
- [x] [Review][Patch] **Loading/empty states lack ARIA semantics** [RecentTransactions.tsx] — Fixed: Added `aria-busy`, `role="status"`, `aria-live="polite"` to loading/empty states
- [x] [Review][Patch] **StatusBadge silent fallback + null guard** [StatusBadge.tsx:5] — Fixed: Added null check; explicit variant mapping with `console.warn` for unknown statuses
- [x] [Review][Patch] **formatTime no input validation** [date.ts:2] — Fixed: Added `isNaN(date.getTime())` check returning `'--:--'` with console warning
- [x] [Review][Patch] **Avatar name/size guards** [Avatar.tsx:20, Avatar.tsx:25] — Fixed: Added `safeName` fallback to `'?'`; `safeSize` clamped to `Math.max(1, size)`
- [x] [Review][Patch] **officerId whitespace-only enables query** [useRecentTransactions.ts:14] — Fixed: Changed `Boolean(officerId)` to `Boolean(officerId?.trim())`
- [x] [Review][Defer] **React Query gcTime not configured** [useRecentTransactions.ts] — Pre-existing pattern across codebase (useDashboardKPIs also lacks it)
- [x] [Review][Defer] **Mock API omits date=today parameter** [useRecentTransactions.ts] — Temporary stub for MVP; real API integration will add params

---

## Dev Agent Record

### Debug Log
<!-- Developer notes on issues encountered, workarounds, environment quirks -->

### Implementation Plan
<!-- Record technical decisions, approach notes, architecture choices as tasks are completed -->

### Completion Notes
<!-- Summarize what was actually implemented and tested -->
- Created `Transaction` type in `src/types/transaction.ts`
- Built reusable `Avatar` component with name-hash color palette and initials generation
- Built reusable `StatusBadge` component with POSTED/PENDING styles
- Created `formatTime` utility for ISO → local "HH:MM AM/PM" formatting
- Built `RecentTransactions` component with loading, empty, and populated states
- Created `useRecentTransactions` TanStack Query hook with mock API returning 2 sample transactions
- Wired `RecentTransactions` into `DashboardScreen` below QuickActions
- Removed old static placeholder markup and styles from DashboardScreen/dashboard.module.css
- Wrote 21 new tests: Avatar (4), StatusBadge (4), date utils (3), RecentTransactions (6), useRecentTransactions (3), DashboardScreen integration (1)
- Full suite: 109 tests pass, zero regressions
- Lint clean, build succeeds

---

## File List
<!-- New, modified, and deleted files relative to repo root -->
- `primepos-web/src/types/transaction.ts` (new)
- `primepos-web/src/utils/date.ts` (new)
- `primepos-web/src/utils/date.test.ts` (new)
- `primepos-web/src/components/Avatar/Avatar.tsx` (new)
- `primepos-web/src/components/Avatar/Avatar.module.css` (new)
- `primepos-web/src/components/Avatar/Avatar.test.tsx` (new)
- `primepos-web/src/components/StatusBadge/StatusBadge.tsx` (new)
- `primepos-web/src/components/StatusBadge/StatusBadge.module.css` (new)
- `primepos-web/src/components/StatusBadge/StatusBadge.test.tsx` (new)
- `primepos-web/src/features/dashboard/RecentTransactions.tsx` (new)
- `primepos-web/src/features/dashboard/recent-transactions.module.css` (new)
- `primepos-web/src/features/dashboard/RecentTransactions.test.tsx` (new)
- `primepos-web/src/features/dashboard/useRecentTransactions.ts` (new)
- `primepos-web/src/features/dashboard/useRecentTransactions.test.tsx` (new)
- `primepos-web/src/features/dashboard/DashboardScreen.tsx` (modified)
- `primepos-web/src/features/dashboard/DashboardScreen.test.tsx` (modified)
- `primepos-web/src/features/dashboard/dashboard.module.css` (modified)

---

## Change Log
<!-- Summary of changes per session -->
- 2026-05-06: Implemented Story 2.3 — Recent Transactions List. Created types, reusable components (Avatar, StatusBadge), feature component (RecentTransactions), TanStack Query hook (useRecentTransactions), date utility, wired into DashboardScreen. Added 21 tests. All 109 tests pass, lint clean, build succeeds.
- 2026-05-06: Code review — 12 patch findings addressed: capped transactions at 5, sorted mock data descending, added error state handling, improved DashboardScreen integration test, removed `|| []` fallback, added Avatar `role="img"`, semantic list markup (ul/li), ARIA live semantics, StatusBadge explicit fallback + null guard, formatTime input validation, Avatar name/size guards, officerId whitespace trim. All 113 tests pass, lint clean, build succeeds.

## Completion Checklist

- [x] `RecentTransactions` renders up to 5 transaction items
- [x] Each item shows avatar, name, type+time, amount, status badge
- [x] `StatusBadge` is reusable with correct colors for POSTED/PENDING
- [x] `Avatar` generates consistent colors from name hash
- [x] Amounts formatted with `formatNaira`
- [x] Times formatted as "HH:MM AM/PM"
- [x] Empty state shown when no transactions
- [x] `useRecentTransactions` uses TanStack Query
- [x] Mock API returns realistic data
- [x] Unit tests for formatter, badge, avatar, list
- [x] No lint errors
- [x] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
