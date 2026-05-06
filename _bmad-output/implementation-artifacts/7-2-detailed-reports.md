---
story_id: 7.2
story_key: 7-2-detailed-reports
epic: 7
epic_title: Reports & Analytics
title: Detailed Reports (Placeholder)
status: ready-for-dev
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

- [ ] 5 placeholder report screens
- [ ] Reusable `PlaceholderScreen` component
- [ ] Each screen has appropriate title and icon
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
