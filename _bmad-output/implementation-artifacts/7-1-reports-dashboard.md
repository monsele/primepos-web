---
story_id: 7.1
story_key: 7-1-reports-dashboard
epic: 7
epic_title: Reports & Analytics
title: Reports Dashboard
status: ready-for-dev
source_files:
  - prd.md §4.7
  - architecture.md §3.1, §6.1
  - ux-design-specification.md §3.14
  - epics.md §Story 7.1
created: 2026-05-02
dependencies:
  - 2-1-dashboard-kpi-cards
  - 1-3-app-shell-navigation
---

# Story 7.1: Reports Dashboard

## User Story
As a bank officer, I want to see a summary of my daily performance and access detailed reports so that I can track my metrics.

## Business Context
Self-service reporting reduces back-office dependency. Officers can view their collections, transaction counts, and access various report types without requesting reports from HQ. This empowers officers to self-manage their performance.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Reports overview
  Given I am on the Reports tab
  Then I see 2 summary cards:
    - Total Collections: ₦ amount
    - Transactions Today: count
  And a list of report types:
    - Loans Booked
    - E-Ledger
    - LO PAR Report
    - Transaction Reports
    - LO Performance

Scenario: Report navigation
  Given I am on the Reports screen
  When I tap "Loans Booked"
  Then the Loans Booked report screen appears
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/features/dashboard/useDashboardKPIs.ts` | KPI data hook (Story 2.1) |
| `src/components/MenuItem/MenuItem.tsx` | Menu item component (Story 3.4) |
| `src/contexts/NavigationContext.tsx` | Navigation (Story 1.3) |

**What does NOT exist yet:**
- Reports Dashboard screen
- Report type list
- Placeholder report detail screens

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/reports/ReportsDashboardScreen.tsx` | Summary cards + report type list |
| `src/features/reports/reports-dashboard.module.css` | Styles |
| `src/features/reports/useReportsSummary.ts` | TanStack Query hook for summary |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'reports'` to `Screen` type |

---

## Technical Requirements

### Summary Data

Reuse `useDashboardKPIs` or create a dedicated hook:
```typescript
interface ReportsSummary {
  totalCollections: number   // kobo
  transactionsToday: number
}
```

### Report Types

```typescript
const reportTypes = [
  { id: 'loans-booked', label: 'Loans Booked', targetScreen: 'loansBookedReport' },
  { id: 'e-ledger', label: 'E-Ledger', targetScreen: 'eLedgerReport' },
  { id: 'lo-par', label: 'LO PAR Report', targetScreen: 'loParReport' },
  { id: 'transaction-reports', label: 'Transaction Reports', targetScreen: 'transactionReports' },
  { id: 'lo-performance', label: 'LO Performance', targetScreen: 'loPerformanceReport' },
]
```

### Visual

- Summary cards: same KPI card style as Dashboard
- Report list: same menu item style as Transact menu
- Each item has an arrow (→) indicating navigation

---

## File Structure Requirements

```
src/
  features/
    reports/
      ReportsDashboardScreen.tsx    ← NEW
      reports-dashboard.module.css  ← NEW
      useReportsSummary.ts          ← NEW
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `ReportsDashboardScreen` | Renders summary cards and report list |

---

## Common Pitfalls to Avoid

1. **DO NOT** fetch data if already cached by Dashboard — share the query key

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 2.1** (KPI Cards) | Reuses KPI data and card styles |
| **Story 3.4** (Cash Menu) | Reuses menu item pattern |
| **Story 7.2** (Detailed Reports) | Report types navigate to placeholder screens |


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

- [ ] `ReportsDashboardScreen` with summary cards
- [ ] Report type list with navigation
- [ ] Reuses existing data hooks where possible
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
