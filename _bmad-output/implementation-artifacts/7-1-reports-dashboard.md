---
story_id: 7.1
story_key: 7-1-reports-dashboard
epic: 7
epic_title: Reports & Analytics
title: Reports Dashboard
status: story-created
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
