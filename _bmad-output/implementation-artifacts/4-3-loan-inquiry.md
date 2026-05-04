---
story_id: 4.3
story_key: 4-3-loan-inquiry
epic: 4
epic_title: Loan Management
title: Loan Inquiry
status: story-created
source_files:
  - prd.md §4.4.1
  - architecture.md §3.1, §5.4
  - ux-design-specification.md §3.11
  - epics.md §Story 4.3
created: 2026-05-02
dependencies:
  - 4-1-loan-repayment
---

# Story 4.3: Loan Inquiry

## User Story
As a bank officer, I want to look up a customer's loan details by account or loan number so that I can answer their questions about balances, maturity dates, and payment history.

## Business Context
Loan Inquiry is a read-only customer service tool. Officers use it at the teller window to answer customer questions. Because it is read-only, it must work offline using cached data — officers should be able to answer questions even without connectivity.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Loan lookup
  Given I am on the Loan Inquiry screen
  When I enter an account or loan number
  And I tap "SEARCH"
  Then loan details display:
    | Field               | Example          |
    | Product Name        | Micro Business Loan |
    | Loan Purpose        | Stock Purchase   |
    | Loan Amount         | ₦50,000          |
    | Start Date          | 01/10/2025       |
    | Maturity Date       | 01/04/2026       |
    | Current Balance     | ₦32,500          |
    | Outstanding Interest| ₦2,800           |
    | Status              | POSTED           |

Scenario: Loan not found
  Given I enter an invalid number
  When I search
  Then a "Loan not found" message appears
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/features/loan-repayment/useLoanSearch.ts` | Loan search hook |
| `src/components/LoanCard/LoanCard.tsx` | Loan display card |
| `src/types/loan.ts` | Loan interface |
| `src/api/loans.ts` | Loan search API |

**What does NOT exist yet:**
- Dedicated Loan Inquiry screen (read-only, no form)
- Offline cache indicator

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/loan-inquiry/LoanInquiryScreen.tsx` | Search + read-only loan details display |
| `src/features/loan-inquiry/loan-inquiry.module.css` | Styles |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'loanInquiry'` to `Screen` type |

---

## Technical Requirements

### Read-Only Display

No form fields, no post button. Just:
1. Search input + button
2. LoanCard (expanded with all fields)
3. "Cached data" indicator when served from IndexedDB

### Offline Cache Indicator

When data comes from IndexedDB instead of API:
- Show subtle text: "Cached data" in `--color-text-muted`, 11px
- Position: below the loan card

### API Spec

Reuse `searchLoan` from `src/api/loans.ts`.

---

## File Structure Requirements

```
src/
  features/
    loan-inquiry/
      LoanInquiryScreen.tsx      ← NEW
      loan-inquiry.module.css    ← NEW
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `LoanInquiryScreen` | Search shows loan card; not-found shows message |

---

## Common Pitfalls to Avoid

1. **DO NOT** add a post button — this is read-only
2. **DO NOT** forget the cached data indicator for offline

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 4.1** (Loan Repayment) | Reuses search hook, LoanCard, types, API |
| **Story 8.3** (Offline Cache) | Cached loan data for offline inquiry |

---

## Completion Checklist

- [ ] `LoanInquiryScreen` with search and read-only display
- [ ] Reuses `LoanCard` for details
- [ ] "Cached data" indicator when offline
- [ ] "Loan not found" message
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
