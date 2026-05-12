---
story_id: 5.3
story_key: 5-3-account-statement
epic: 5
epic_title: Account Services
title: Account Statement
status: done
source_files:
  - prd.md Â§4.4.3
  - architecture.md Â§3.1, Â§6.1
  - ux-design-specification.md Â§3.13
  - epics.md Â§Story 5.3
created: 2026-05-02
dependencies:
  - 5-2-account-balance-inquiry
---

# Story 5.3: Account Statement

## User Story
As a bank officer, I want to fetch a customer's account statement for a specific date range so that I can review their transaction history with them.

## Business Context
Account statements are essential for customer service and dispute resolution. Officers need to quickly pull statements for any date range. The display should be clear and scannable, showing debits, credits, and running balance.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Statement fetch
  Given I am on the Account Statement screen
  When I enter an account number
  And I select a From Date
  And I select a To Date
  And I tap "FETCH STATEMENT"
  Then a transaction history table appears
  With columns: Date, Description, Debit, Credit, Balance

Scenario: Date validation
  Given I select a To Date earlier than the From Date
  When I tap "FETCH STATEMENT"
  Then an error shows: "To date must be after From date"
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/components/Input/Input.tsx` | Reusable input |
| `src/components/Button/Button.tsx` | Reusable button |
| `src/utils/date.ts` | Date formatting utility |

**What does NOT exist yet:**
- Account Statement screen
- Date range picker
- Statement table component
- Statement API

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/account-statement/AccountStatementScreen.tsx` | Search + date range + statement table |
| `src/features/account-statement/account-statement.module.css` | Styles |
| `src/features/account-statement/useAccountStatement.ts` | TanStack Query hook for statement API |
| `src/components/StatementTable/StatementTable.tsx` | Table with Date, Description, Debit, Credit, Balance |
| `src/components/StatementTable/StatementTable.module.css` | Table styles |
| `src/components/DateRangeInput/DateRangeInput.tsx` | From/To date inputs with validation |
| `src/components/DateRangeInput/DateRangeInput.module.css` | Date range styles |
| `src/api/accounts.ts` | Add `fetchStatement(number, from, to)` |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'accountStatement'` to `Screen` type |

---

## Technical Requirements

### Statement Entry Type

```typescript
interface StatementEntry {
  date: string          // ISO 8601
  description: string
  debit: number | null  // kobo
  credit: number | null // kobo
  balance: number       // kobo
}
```

### API Spec

```
GET /api/accounts/statement?number={accountNumber}&from={YYYY-MM-DD}&to={YYYY-MM-DD}
```

### Date Validation

- From Date must be before or equal to To Date
- To Date must be after or equal to From Date
- Error: "To date must be after From date"

### Table Visual

- Header row: uppercase, 11px, `--color-text-muted`, border-bottom
- Data rows: 13px, `--color-text`
- Debit: `--color-danger` (red) when present
- Credit: `--color-success` (green) when present
- Balance: `--color-text`
- Alternating row backgrounds for readability (subtle)
- Horizontal scroll if needed (but optimize for mobile width)

### Date Inputs

- Native date picker (`<input type="date">`) styled to match dark theme
- Display format: DD/MM/YYYY

---

## File Structure Requirements

```
src/
  features/
    account-statement/
      AccountStatementScreen.tsx    â† NEW
      account-statement.module.css  â† NEW
      useAccountStatement.ts        â† NEW
  components/
    StatementTable/
      StatementTable.tsx            â† NEW
      StatementTable.module.css     â† NEW
    DateRangeInput/
      DateRangeInput.tsx            â† NEW
      DateRangeInput.module.css     â† NEW
  api/
    accounts.ts                     â† UPDATE
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `DateRangeInput` | Validates from <= to; shows error otherwise |
| `StatementTable` | Renders entries with correct colors for debit/credit |
| `useAccountStatement` | Fetches statement for given range |

---

## Common Pitfalls to Avoid

1. **DO NOT** use a heavy table library â€” a simple flex/grid layout is sufficient
2. **DO NOT** forget to format amounts with `formatNaira`
3. **DO NOT** show null debits/credits as "0" â€” leave blank

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 5.2** (Balance Inquiry) | Reuses account search patterns |
| **Story 1.3** (Navigation) | Inner screen |


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
  - [x] 7.1 Run full test suite - no regressions
  - [x] 7.2 Run lint - no errors
  - [x] 7.3 Run build - succeeds
  - [x] 7.4 Verify all acceptance criteria are met

---

## Dev Agent Record

### Debug Log
<!-- Developer notes on issues encountered, workarounds, environment quirks -->
- `npm run lint` initially failed on `react-refresh/only-export-components` after colocating date-range validation with the component; resolved by moving the validator into `src/components/DateRangeInput/dateRange.ts`.

### Implementation Plan
<!-- Record technical decisions, approach notes, architecture choices as tasks are completed -->
- Build the statement flow in the existing `account-balance` style: local form state in the screen, TanStack Query-backed fetch hook, and mock API support in `src/api/accounts.ts`.
- Create a dedicated `DateRangeInput` wrapper using native `type="date"` fields and centralize range validation so the screen can block invalid fetches before querying.
- Render statement rows in a lightweight custom table with horizontal overflow, mobile-friendly spacing, formatted dates, and `formatNaira` for debit/credit/balance values.

### Completion Notes
<!-- Summarize what was actually implemented and tested -->
- Implemented the Account Statement flow with account number search, native date-range entry, client-side date validation, and a responsive transaction history table showing Date, Description, Debit, Credit, and Balance.
- Added `fetchStatement` mock API support plus a TanStack Query-backed `useAccountStatement` hook with cache detection and reset behavior; wired the Services Menu route to render the new screen through `App.tsx`.
- Added focused unit and integration tests for date-range validation, statement-table rendering, hook fetching, and screen interactions, then verified the full app with `npm test`, `npm run lint`, and `npm run build`.
- Confirmed `accountStatement` was already present in `src/types/navigation.ts`, so Task 5.1 was satisfied by validating the existing route type while wiring the screen into the app shell.

---

## File List
<!-- New, modified, and deleted files relative to repo root -->
- `primepos-web/src/App.tsx`
- `primepos-web/src/api/accounts.ts`
- `primepos-web/src/components/DateRangeInput/DateRangeInput.module.css`
- `primepos-web/src/components/DateRangeInput/DateRangeInput.test.tsx`
- `primepos-web/src/components/DateRangeInput/DateRangeInput.tsx`
- `primepos-web/src/components/DateRangeInput/dateRange.ts`
- `primepos-web/src/components/StatementTable/StatementTable.module.css`
- `primepos-web/src/components/StatementTable/StatementTable.test.tsx`
- `primepos-web/src/components/StatementTable/StatementTable.tsx`
- `primepos-web/src/features/account-statement/account-statement.module.css`
- `primepos-web/src/features/account-statement/AccountStatementScreen.test.tsx`
- `primepos-web/src/features/account-statement/AccountStatementScreen.tsx`
- `primepos-web/src/features/account-statement/useAccountStatement.test.tsx`
- `primepos-web/src/features/account-statement/useAccountStatement.ts`
- `primepos-web/src/types/account.ts`
- `primepos-web/src/utils/date.ts`

---

## Change Log
<!-- Summary of changes per session -->
- 2026-05-09: Implemented Story 5.3 end-to-end with account statement UI, mock API/query hook support, reusable date-range and statement-table components, routing, and full test/lint/build validation.
---

## Completion Checklist

- [ ] `AccountStatementScreen` with account search, date range, table
- [ ] `StatementTable` with Date, Description, Debit, Credit, Balance
- [ ] Debit in red, Credit in green
- [ ] Date validation (To >= From)
- [ ] Amounts formatted
- [ ] Mock API for statement
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for review.*
