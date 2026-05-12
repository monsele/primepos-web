---
story_id: 3.3
story_key: 3-3-new-account-deposit
epic: 3
epic_title: Cash Transactions
title: New Account Deposit
status: done
source_files:
  - prd.md §4.3.3
  - architecture.md §3.1, §5.2
  - ux-design-specification.md §3.3
  - epics.md §Story 3.3
created: 2026-05-02
dependencies:
  - 3-1-cash-in-deposit
  - 5-1-new-savings-account
---

# Story 3.3: New Account Deposit

## User Story
As a bank officer, I want to open a new savings account and make an initial deposit in a single flow so that new customers can be onboarded quickly.

## Business Context
New Account Deposit combines account creation and funding into one flow — critical for customer onboarding at the teller window. Officers need to collect KYC info, select a product, and post the initial deposit without switching screens. This reduces onboarding time and data entry errors.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Create and fund new account
  Given I am on the New Account Deposit screen
  When I enter customer details (name, gender, BVN)
  And I select a savings product
  And I enter an initial deposit amount
  And I tap "Submit"
  Then a new account is created
  And the initial deposit is posted
  And a success message shows the new account number

Scenario: BVN validation
  Given I enter a BVN of "123"
  When I attempt to submit
  Then the BVN field shows "BVN must be 11 digits"
  And submission is blocked
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/components/Input/Input.tsx` | Reusable input (Story 1.1) |
| `src/components/Button/Button.tsx` | Reusable button (Story 1.1) |
| `src/features/cash-in/` | Cash In patterns for form handling |

**What does NOT exist yet:**
- New Account Deposit screen
- Product selection component
- BVN validation utility
- Combined account+deposit API

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/new-account/NewAccountDepositScreen.tsx` | Form with customer details, product select, amount, submit |
| `src/features/new-account/new-account-deposit.module.css` | Screen styles |
| `src/features/new-account/useNewAccountDeposit.ts` | Form logic, validation, API call |
| `src/components/ProductSelect/ProductSelect.tsx` | Dropdown/select for savings products |
| `src/components/ProductSelect/ProductSelect.module.css` | Select styles |
| `src/utils/validation.ts` | `isValidBvn(bvn: string): boolean` |
| `src/api/accounts.ts` | Add `createAccountWithDeposit(payload)` (update existing) |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'newAccount'` to `Screen` type |
| `src/api/accounts.ts` | Add combined create+deposit endpoint |

---

## Technical Requirements

### Form State

```typescript
interface NewAccountDepositForm {
  firstName: string
  surname: string
  otherName: string
  gender: 'Male' | 'Female'
  bvn: string
  productId: string
  initialDeposit: string
}
```

### API Spec

```typescript
// POST /api/accounts (creates account + initial deposit)
interface NewAccountDepositRequest {
  firstName: string
  surname: string
  otherName: string
  gender: 'Male' | 'Female'
  bvn: string
  productId: string
  initialDeposit: number    // in kobo
  officerId: string
}

interface NewAccountDepositResponse {
  accountNumber: string
  accountName: string
  nuban: string
  depositStatus: 'POSTED' | 'PENDING'
}
```

### Validation Rules

- First Name: required
- Surname: required
- BVN: required, exactly 11 digits (`/^\d{11}$/`)
- Product: required
- Initial Deposit: required, > 0

### Product Select

```typescript
interface SavingsProduct {
  id: string
  name: string
  minDeposit: number
  description: string
}
```

For MVP, mock products:
```typescript
const mockProducts: SavingsProduct[] = [
  { id: '1', name: 'Prime Savings', minDeposit: 100000, description: 'Standard savings account' },
  { id: '2', name: 'Better Life Savings', minDeposit: 50000, description: 'Group microfinance savings' },
]
```

### Success Flow

1. Submit valid form
2. API returns new account details
3. Show success modal/toast: "Account created successfully. Account Number: {nuban}"
4. Reset form for next customer

---

## File Structure Requirements

```
src/
  features/
    new-account/
      NewAccountDepositScreen.tsx   ← NEW
      new-account-deposit.module.css ← NEW
      useNewAccountDeposit.ts       ← NEW
  components/
    ProductSelect/
      ProductSelect.tsx             ← NEW
      ProductSelect.module.css      ← NEW
  utils/
    validation.ts                   ← NEW: isValidBvn
  api/
    accounts.ts                     ← UPDATE: Add createAccountWithDeposit
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `isValidBvn` | `"12345678901" → true`, `"123" → false`, `"abc" → false` |
| `useNewAccountDeposit` | Validates all fields, calls API, shows success |
| `ProductSelect` | Renders options, calls onChange with selected product |

---

## Common Pitfalls to Avoid

1. **DO NOT** allow submission with invalid BVN — this is a regulatory requirement
2. **DO NOT** forget to include officerId in the payload
3. **DO NOT** use a native `<select>` without styling — match the dark theme design
4. **DO NOT** clear the form until the success message is acknowledged

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 3.1** (Cash In) | Reuses form patterns, Input, Button components |
| **Story 5.1** (New Savings Account) | Overlaps with KYC collection; this story is the streamlined teller version |
| **Story 1.2** (Connection Status) | ToastProvider for messages |
| **Story 1.3** (Navigation) | New Account is an inner screen |


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

---

## Dev Agent Record

### Debug Log
- Added `maxLength` prop to `Input` component to support BVN 11-digit constraint. No issues encountered.
<!-- Developer notes on issues encountered, workarounds, environment quirks -->

### Implementation Plan
- Reused existing `useCashIn` hook pattern for form state, validation, and offline queueing
- Created `ProductSelect` reusable component with styled native `<select>` (dark-theme compatible)
- Added `maxLength` support to shared `Input` component
- Implemented `createAccountWithDeposit` API with mock response generating random NUBAN
- Included offline queue support via `addToQueue` for consistency with other transaction features
- Success state handled via in-card banner (not toast-only) to show account number prominently
<!-- Record technical decisions, approach notes, architecture choices as tasks are completed -->

### Completion Notes
✅ Story 3.3 implementation complete. All acceptance criteria met.

**Implemented:**
- `NewAccountDepositScreen` with full form (firstName, surname, otherName, gender, BVN, product select, initial deposit)
- `useNewAccountDeposit` hook with validation, API call, offline queueing, success handling, form reset
- `ProductSelect` reusable component with dark theme styling
- `isValidBvn` utility with `/^\d{11}$/` validation
- `createAccountWithDeposit` API function with mock implementation
- Wired `newAccount` screen into App.tsx routing
- Added `maxLength` prop to shared `Input` component

**Tests:**
- `validation.test.ts` (6 tests) — BVN validation edge cases
- `ProductSelect.test.tsx` (4 tests) — rendering, options, onChange, errors
- `useNewAccountDeposit.test.ts` (8 tests) — validation, submission, offline queueing, reset
- `NewAccountDepositScreen.test.tsx` (5 tests) — rendering, success state, errors, submit
- Full regression: 169 tests pass, 0 failures
- Lint: clean
- Build: succeeds
<!-- Summarize what was actually implemented and tested -->

---

## File List
- `primepos-web/src/utils/validation.ts` (new)
- `primepos-web/src/utils/validation.test.ts` (new)
- `primepos-web/src/components/ProductSelect/ProductSelect.tsx` (new)
- `primepos-web/src/components/ProductSelect/ProductSelect.module.css` (new)
- `primepos-web/src/components/ProductSelect/ProductSelect.test.tsx` (new)
- `primepos-web/src/components/Input/Input.tsx` (modified — added maxLength prop)
- `primepos-web/src/features/new-account/NewAccountDepositScreen.tsx` (new)
- `primepos-web/src/features/new-account/NewAccountDepositScreen.test.tsx` (new)
- `primepos-web/src/features/new-account/useNewAccountDeposit.ts` (new)
- `primepos-web/src/features/new-account/useNewAccountDeposit.test.ts` (new)
- `primepos-web/src/features/new-account/new-account-deposit.module.css` (new)
- `primepos-web/src/api/accounts.ts` (modified — added createAccountWithDeposit)
- `primepos-web/src/App.tsx` (modified — wired newAccount screen)

---

## Change Log
- 2026-05-06: Implemented Story 3.3 New Account Deposit — full feature with screen, hook, components, API, tests, lint/build clean.
---

## Completion Checklist

- [x] `NewAccountDepositScreen` with all form fields
- [x] BVN validation (11 digits)
- [x] Product selection dropdown
- [x] Amount validation (> 0)
- [x] Success message with new account number
- [x] Form reset after success
- [x] Mock API for account creation
- [x] Unit tests for validation and hook
- [x] No lint errors
- [x] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
