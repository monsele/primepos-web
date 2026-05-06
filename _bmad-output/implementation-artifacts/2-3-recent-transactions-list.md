---
story_id: 2.3
story_key: 2-3-recent-transactions-list
epic: 2
epic_title: Dashboard & Navigation
title: Recent Transactions List
status: ready-for-dev
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

- [ ] `RecentTransactions` renders up to 5 transaction items
- [ ] Each item shows avatar, name, type+time, amount, status badge
- [ ] `StatusBadge` is reusable with correct colors for POSTED/PENDING
- [ ] `Avatar` generates consistent colors from name hash
- [ ] Amounts formatted with `formatNaira`
- [ ] Times formatted as "HH:MM AM/PM"
- [ ] Empty state shown when no transactions
- [ ] `useRecentTransactions` uses TanStack Query
- [ ] Mock API returns realistic data
- [ ] Unit tests for formatter, badge, avatar, list
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
