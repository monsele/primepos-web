---
story_id: 3.3
story_key: 3-3-new-account-deposit
epic: 3
epic_title: Cash Transactions
title: New Account Deposit
status: story-created
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

## Completion Checklist

- [ ] `NewAccountDepositScreen` with all form fields
- [ ] BVN validation (11 digits)
- [ ] Product selection dropdown
- [ ] Amount validation (> 0)
- [ ] Success message with new account number
- [ ] Form reset after success
- [ ] Mock API for account creation
- [ ] Unit tests for validation and hook
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
