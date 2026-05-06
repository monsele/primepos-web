---
story_id: 4.1
story_key: 4-1-loan-repayment
epic: 4
epic_title: Loan Management
title: Loan Repayment
status: review
source_files:
  - prd.md §4.5
  - architecture.md §3.1, §5.2
  - ux-design-specification.md §3.5
  - epics.md §Story 4.1
created: 2026-05-02
dependencies:
  - 1-3-app-shell-navigation
  - 3-1-cash-in-deposit
---

# Story 4.1: Loan Repayment

## User Story
As a bank officer, I want to search for a customer's loan and post a repayment so that their loan balance is updated and the payment is recorded.

## Business Context
Loan repayment is a revenue-critical operation. Officers must verify loan details before posting to avoid misallocation. The repayment amount cannot exceed the outstanding balance plus interest. Offline support ensures repayments are never lost even in poor connectivity.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Loan search and details
  Given I am on the Loan Repayment screen
  When I enter a loan account number
  And I tap "SEARCH"
  Then a loan details card appears showing:
    - Customer Name
    - Product (e.g., Micro Business Loan)
    - Loan Amount, Current Balance, Outstanding Interest
    - Maturity Date, Status

Scenario: Repayment posting
  Given loan details are displayed
  When I enter a repayment amount
  And I tap "POST REPAYMENT"
  Then the repayment is processed
  And the loan balance is reduced
  And a success message appears

Scenario: Repayment amount validation
  Given the current balance is ₦32,500
  When I enter a repayment of ₦40,000
  Then an error shows: "Repayment exceeds outstanding balance"

Scenario: Offline repayment
  Given I am offline
  When I post a repayment
  Then it is queued for sync
  And the loan details are cached locally
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/components/Input/Input.tsx` | Reusable input |
| `src/components/Button/Button.tsx` | Reusable button |
| `src/features/cash-in/useAccountSearch.ts` | Search pattern from Cash In |
| `src/components/AccountCard/AccountCard.tsx` | Card pattern (may adapt for loans) |

**What does NOT exist yet:**
- Loan Repayment screen
- Loan search API/hook
- Loan details card component
- Repayment validation logic

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/loan-repayment/LoanRepaymentScreen.tsx` | Search + loan card + repayment form |
| `src/features/loan-repayment/loan-repayment.module.css` | Styles |
| `src/features/loan-repayment/useLoanRepayment.ts` | Form logic, validation, API call |
| `src/features/loan-repayment/useLoanSearch.ts` | TanStack Query hook for loan search |
| `src/components/LoanCard/LoanCard.tsx` | Loan details display card |
| `src/components/LoanCard/LoanCard.module.css` | Card styles |
| `src/types/loan.ts` | `Loan` interface |
| `src/api/loans.ts` | `searchLoan(number)`, `postLoanRepayment(payload)` |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'loanRepayment'` to `Screen` type |

---

## Technical Requirements

### Loan Type

```typescript
interface Loan {
  loanNumber: string
  customerName: string
  product: string
  loanPurpose: string
  loanAmount: number        // kobo
  currentBalance: number    // kobo
  outstandingInterest: number // kobo
  startDate: string
  maturityDate: string
  status: 'POSTED' | 'ACTIVE' | 'CLOSED'
}
```

### Repayment Validation

```typescript
const maxRepayment = loan.currentBalance + loan.outstandingInterest
if (amount > maxRepayment) {
  return 'Repayment exceeds outstanding balance'
}
```

### API Spec

```typescript
// GET /api/loans/search?number={loanNumber}
// POST /api/transactions/loan-repayment
interface LoanRepaymentRequest {
  loanNumber: string
  amount: number           // kobo
  officerId: string
}
```

### Loan Card Visual

- Border-left: 3px solid `--color-primary`
- Shows all loan fields in a clean 2-column layout where appropriate
- Amounts formatted with `formatNaira`
- Dates formatted as DD/MM/YYYY

---

## File Structure Requirements

```
src/
  features/
    loan-repayment/
      LoanRepaymentScreen.tsx   ← NEW
      loan-repayment.module.css ← NEW
      useLoanRepayment.ts       ← NEW
      useLoanSearch.ts          ← NEW
  components/
    LoanCard/
      LoanCard.tsx              ← NEW
      LoanCard.module.css       ← NEW
  types/
    loan.ts                     ← NEW
  api/
    loans.ts                    ← NEW
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `useLoanSearch` | Returns loan on success, null on not-found |
| `useLoanRepayment` | Validates amount <= balance + interest |
| `LoanCard` | Renders all loan fields correctly |

---

## Common Pitfalls to Avoid

1. **DO NOT** forget to add outstanding interest to the max repayment calculation
2. **DO NOT** allow repayment on closed loans — check status
3. **DO NOT** forget the kobo/NGN conversion

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 3.1** (Cash In) | Reuses search pattern, form patterns, Input/Button |
| **Story 1.2** (Connection Status) | ToastProvider, offline detection |
| **Story 1.3** (Navigation) | Inner screen |
| **Story 8.2** (Queue Manager) | Offline queue |


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
  - [x] 5.1 Update navigation types (already existed)
  - [x] 5.2 Update parent screens (App.tsx)
- [x] **Task 6: Author tests**
  - [x] 6.1 Unit tests for components
  - [x] 6.2 Unit tests for hooks/utils
  - [x] 6.3 Integration tests
- [x] **Task 7: Validation & regression**
  - [x] 7.1 Run full test suite — no regressions
  - [x] 7.2 Run lint — no errors
  - [x] 7.3 Run build — succeeds
  - [x] 7.4 Verify all acceptance criteria are met

---

## Dev Agent Record

### Debug Log
<!-- Developer notes on issues encountered, workarounds, environment quirks -->

### Implementation Plan
<!-- Record technical decisions, approach notes, architecture choices as tasks are completed -->

### Completion Notes

- Created `Loan` type definition with all required fields (amounts in kobo)
- Built `searchLoan` and `postLoanRepayment` API functions with mock implementations
- Created `LoanCard` component displaying all loan fields with `formatNaira` and DD/MM/YYYY date formatting
- Implemented `useLoanSearch` hook using TanStack Query pattern (consistent with `useAccountSearch`)
- Implemented `useLoanRepayment` hook with validation:
  - Amount must be > 0
  - Amount cannot exceed `currentBalance + outstandingInterest`
  - Closed loans cannot be repaid
  - Offline transactions queued via IndexedDB
- Built `LoanRepaymentScreen` following Cash In screen layout patterns
- Wired `loanRepayment` screen into `App.tsx` navigation
- Wrote 19 tests covering:
  - `LoanCard` rendering (2 tests)
  - `useLoanSearch` success/error/loading states (3 tests)
  - `useLoanRepayment` validation, online posting, offline queuing, form reset (9 tests)
  - `LoanRepaymentScreen` rendering, search, error, submission (5 tests)
- Full regression: 206 tests pass, 0 lint errors, build succeeds

---

## File List

### New Files
- `primepos-web/src/types/loan.ts`
- `primepos-web/src/api/loans.ts`
- `primepos-web/src/components/LoanCard/LoanCard.tsx`
- `primepos-web/src/components/LoanCard/LoanCard.module.css`
- `primepos-web/src/features/loan-repayment/LoanRepaymentScreen.tsx`
- `primepos-web/src/features/loan-repayment/loan-repayment.module.css`
- `primepos-web/src/features/loan-repayment/useLoanSearch.ts`
- `primepos-web/src/features/loan-repayment/useLoanRepayment.ts`
- `primepos-web/src/components/LoanCard/LoanCard.test.tsx`
- `primepos-web/src/features/loan-repayment/LoanRepaymentScreen.test.tsx`
- `primepos-web/src/features/loan-repayment/useLoanSearch.test.tsx`
- `primepos-web/src/features/loan-repayment/useLoanRepayment.test.tsx`

### Modified Files
- `primepos-web/src/App.tsx`

---

## Change Log
- 2026-05-06: Implemented loan repayment feature — types, API, LoanCard component, search/repayment hooks, screen, wiring, and comprehensive tests. All 206 tests pass, lint clean, build succeeds.
---

## Completion Checklist

- [x] `LoanRepaymentScreen` with search, loan card, form
- [x] `LoanCard` displays all loan details
- [x] Repayment validation (<= balance + interest)
- [x] Success toast on post
- [x] Offline queue support
- [x] Mock API for loan search and repayment
- [x] Unit tests
- [x] No lint errors
- [x] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
