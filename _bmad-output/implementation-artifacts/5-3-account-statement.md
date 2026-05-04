---
story_id: 5.3
story_key: 5-3-account-statement
epic: 5
epic_title: Account Services
title: Account Statement
status: story-created
source_files:
  - prd.md §4.4.3
  - architecture.md §3.1, §6.1
  - ux-design-specification.md §3.13
  - epics.md §Story 5.3
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
      AccountStatementScreen.tsx    ← NEW
      account-statement.module.css  ← NEW
      useAccountStatement.ts        ← NEW
  components/
    StatementTable/
      StatementTable.tsx            ← NEW
      StatementTable.module.css     ← NEW
    DateRangeInput/
      DateRangeInput.tsx            ← NEW
      DateRangeInput.module.css     ← NEW
  api/
    accounts.ts                     ← UPDATE
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

1. **DO NOT** use a heavy table library — a simple flex/grid layout is sufficient
2. **DO NOT** forget to format amounts with `formatNaira`
3. **DO NOT** show null debits/credits as "0" — leave blank

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 5.2** (Balance Inquiry) | Reuses account search patterns |
| **Story 1.3** (Navigation) | Inner screen |

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
*Ready for development.*
