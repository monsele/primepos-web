---
story_id: 7.2
story_key: 7-2-detailed-reports
epic: 7
epic_title: Reports & Analytics
title: Detailed Reports (Placeholder)
status: done
source_files:
  - prd.md §4.7
  - architecture.md §3.1
  - ux-design-specification.md §3.14
  - epics.md §Story 7.2
created: 2026-05-02
dependencies:
  - 7-1-reports-dashboard
---

# Story 7.2: Detailed Reports (Placeholder)

## User Story
As a bank officer, I want to view detailed reports for each report type so that I can analyze specific aspects of my work.

## Business Context
Detailed reports require backend APIs that may not be available in the initial MVP. This story creates placeholder screens for each report type so the UI structure is complete. Full report implementation is future work.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Report types
  Given the Reports Dashboard is implemented
  Then each report type opens a detail view:
    - Loans Booked: List of new disbursements with customer, amount, date
    - E-Ledger: Electronic ledger entries with debit/credit
    - LO PAR Report: Portfolio at risk metrics
    - Transaction Reports: Filterable transaction history
    - LO Performance: Officer metrics and rankings
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/features/reports/ReportsDashboardScreen.tsx` | Reports menu (Story 7.1) |
| `src/contexts/NavigationContext.tsx` | Navigation |

**What does NOT exist yet:**
- Placeholder report detail screens

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/reports/LoansBookedReportScreen.tsx` | Placeholder |
| `src/features/reports/ELedgerReportScreen.tsx` | Placeholder |
| `src/features/reports/LoParReportScreen.tsx` | Placeholder |
| `src/features/reports/TransactionReportsScreen.tsx` | Placeholder |
| `src/features/reports/LoPerformanceReportScreen.tsx` | Placeholder |
| `src/components/PlaceholderScreen/PlaceholderScreen.tsx` | Reusable placeholder with icon + title + subtitle |
| `src/components/PlaceholderScreen/PlaceholderScreen.module.css` | Placeholder styles |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add report screen types |

---

## Technical Requirements

### Placeholder Screen

```typescript
interface PlaceholderScreenProps {
  icon: string
  title: string
  subtitle: string
}
```

- Centered content
- Icon: 48px, `--color-primary`
- Title: 18px, bold
- Subtitle: 14px, `--color-text-muted`
- Message: "This report will be available in a future update."

---

## File Structure Requirements

```
src/
  features/
    reports/
      LoansBookedReportScreen.tsx       ← NEW
      ELedgerReportScreen.tsx           ← NEW
      LoParReportScreen.tsx             ← NEW
      TransactionReportsScreen.tsx      ← NEW
      LoPerformanceReportScreen.tsx     ← NEW
  components/
    PlaceholderScreen/
      PlaceholderScreen.tsx             ← NEW
      PlaceholderScreen.module.css      ← NEW
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `PlaceholderScreen` | Renders icon, title, subtitle |

---

## Common Pitfalls to Avoid

1. **DO NOT** leave the screens completely empty — a placeholder message is better UX

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 7.1** (Reports Dashboard) | Placeholders navigated from dashboard |


---

## Tasks/Subtasks

- [x] **Task 1: Create components and types**
  - [x] 1.1 Create type definitions
  - [x] 1.2 Create reusable components
- [x] **Task 2: Build feature screen(s)**
  - [x] 2.1 Create main screen component(s)
  - [x] 2.2 Create styles module
- [x] **Task 3: Implement hooks and logic** (N/A — placeholder screens have no data fetching)
  - [x] 3.1 Create data fetching hooks
  - [x] 3.2 Implement form/business logic
- [x] **Task 4: API and services** (N/A — placeholder screens have no backend)
  - [x] 4.1 Create/update API functions
  - [x] 4.2 Add mock implementations
- [x] **Task 5: Wire navigation and updates**
  - [x] 5.1 Update navigation types (already existed from Story 7.1)
  - [x] 5.2 Update parent screens (App.tsx switch cases added)
- [x] **Task 6: Author tests**
  - [x] 6.1 Unit tests for components
  - [x] 6.2 Unit tests for hooks/utils (N/A)
  - [x] 6.3 Integration tests (N/A — placeholder screens, covered by unit tests)
- [x] **Task 7: Validation & regression**
  - [x] 7.1 Run full test suite — no regressions (294 tests passed)
  - [x] 7.2 Run lint — no errors (4 pre-existing warnings unrelated)
  - [x] 7.3 Run build — succeeds
  - [x] 7.4 Verify all acceptance criteria are met

---

## Dev Agent Record

### Debug Log
<!-- Developer notes on issues encountered, workarounds, environment quirks -->

### Implementation Plan
Created a reusable `PlaceholderScreen` component with icon, title, and subtitle props. Each of the 5 report types uses this component with specific content. Navigation types already existed from Story 7.1; only App.tsx needed switch case entries. Tasks 3 (hooks) and 4 (API) are not applicable for placeholder screens — no data fetching or backend integration is needed.

### Completion Notes
Implemented 5 placeholder report detail screens using a shared `PlaceholderScreen` component. All screens display descriptive icons, titles, and "available in future update" messages. Added 2 new test files (PlaceholderScreen.test.tsx, LoansBookedReportScreen.test.tsx) with 3 tests total. Full test suite passes (294 tests, 0 regressions). Production build succeeds. All acceptance criteria satisfied.

---

## File List

| Path | Action |
|------|--------|
| `src/components/PlaceholderScreen/PlaceholderScreen.tsx` | NEW |
| `src/components/PlaceholderScreen/PlaceholderScreen.module.css` | NEW |
| `src/components/PlaceholderScreen/PlaceholderScreen.test.tsx` | NEW |
| `src/features/reports/LoansBookedReportScreen.tsx` | NEW |
| `src/features/reports/ELedgerReportScreen.tsx` | NEW |
| `src/features/reports/LoParReportScreen.tsx` | NEW |
| `src/features/reports/TransactionReportsScreen.tsx` | NEW |
| `src/features/reports/LoPerformanceReportScreen.tsx` | NEW |
| `src/features/reports/LoansBookedReportScreen.test.tsx` | NEW |
| `src/App.tsx` | MODIFIED |

---

## Change Log
- 2026-05-09: Implemented 5 placeholder report screens with reusable PlaceholderScreen component. Updated App.tsx with navigation switch cases. Added unit tests. Build + test suite pass. Story complete.
---

## Completion Checklist

- [x] 5 placeholder report screens
- [x] Reusable `PlaceholderScreen` component
- [x] Each screen has appropriate title and icon
- [x] Unit tests
- [x] No lint errors
- [x] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
