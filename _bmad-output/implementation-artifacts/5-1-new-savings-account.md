---
story_id: 5.1
story_key: 5-1-new-savings-account
epic: 5
epic_title: Account Services
title: New Savings Account (3-Step Wizard)
status: review
source_files:
  - prd.md §4.4.4
  - architecture.md §3.1, §6.1
  - ux-design-specification.md §3.6
  - epics.md §Story 5.1
created: 2026-05-02
dependencies:
  - 1-3-app-shell-navigation
  - 3-3-new-account-deposit
---

# Story 5.1: New Savings Account (3-Step Wizard)

## User Story
As a bank officer, I want to open a new savings account for a customer through a guided multi-step form so that all required KYC data is collected accurately.

## Business Context
New account opening is a regulated process requiring complete KYC data. The 3-step wizard breaks a long form into manageable chunks: Bio Info -> Contact -> Account. This reduces cognitive load and allows officers to go back and correct errors without losing data. Stepper visualization shows progress and builds confidence.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Step 1 - Bio Info
  Given I start the New Savings Account flow
  Then I see a 3-step stepper (Bio Info -> Contact -> Account)
  And Step 1 is active
  When I fill in:
    - Branch
    - First Name, Other Name, Surname
    - Gender (Male/Female toggle)
    - Date of Birth (DD/MM/YYYY)
  And I tap "Continue"
  Then I advance to Step 2

Scenario: Step 2 - Contact
  Given I am on Step 2
  Then the stepper shows Step 1 complete, Step 2 active
  When I fill in:
    - Home Address, Business Address
    - Phone Number, Email
    - BVN (11 digits)
    - Next of Kin details
  And I tap "Continue"
  Then I advance to Step 3
  When I tap "Back"
  Then I return to Step 1 with data preserved

Scenario: Step 3 - Account
  Given I am on Step 3
  Then the stepper shows Steps 1-2 complete
  When I select a Product Type
  And I enter an Initial Deposit amount
  And I tap "Submit"
  Then the account is created
  And a success modal shows the new account number
  And I am returned to the Dashboard

Scenario: Validation per step
  Given I am on Step 1
  When I tap "Continue" without filling required fields
  Then empty required fields show red borders
  And error messages appear below each field
  And I cannot proceed

Scenario: BVN validation
  Given I enter "12345" in the BVN field
  When I attempt to continue
  Then the field shows "BVN must be exactly 11 digits"
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/components/Input/Input.tsx` | Reusable input |
| `src/components/Button/Button.tsx` | Reusable button |
| `src/utils/validation.ts` | `isValidBvn` (Story 3.3) |
| `src/components/ProductSelect/ProductSelect.tsx` | Product dropdown (Story 3.3) |

**What does NOT exist yet:**
- 3-step wizard screen
- Stepper component
- Gender toggle component
- Date input component (DD/MM/YYYY)
- Multi-step form state management
- Success modal

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/new-savings-account/NewSavingsAccountScreen.tsx` | Wizard container with stepper and step content |
| `src/features/new-savings-account/new-savings-account.module.css` | Wizard styles |
| `src/features/new-savings-account/useNewSavingsAccount.ts` | Multi-step form state, validation per step, submission |
| `src/features/new-savings-account/StepBioInfo.tsx` | Step 1 content |
| `src/features/new-savings-account/StepContact.tsx` | Step 2 content |
| `src/features/new-savings-account/StepAccount.tsx` | Step 3 content |
| `src/components/Stepper/Stepper.tsx` | 3-step progress indicator |
| `src/components/Stepper/Stepper.module.css` | Stepper styles |
| `src/components/GenderToggle/GenderToggle.tsx` | Male/Female toggle |
| `src/components/GenderToggle/GenderToggle.module.css` | Toggle styles |
| `src/components/DateInput/DateInput.tsx` | DD/MM/YYYY date input with validation |
| `src/components/DateInput/DateInput.module.css` | Date input styles |
| `src/components/SuccessModal/SuccessModal.tsx` | Modal showing new account number |
| `src/components/SuccessModal/SuccessModal.module.css` | Modal styles |
| `src/api/accounts.ts` | `createSavingsAccount(payload)` |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'newSavingsAccount'` to `Screen` type |

---

## Technical Requirements

### Wizard State

```typescript
interface WizardState {
  currentStep: 1 | 2 | 3
  formData: {
    // Step 1
    branch: string
    firstName: string
    otherName: string
    surname: string
    gender: 'Male' | 'Female' | ''
    dateOfBirth: string
    // Step 2
    homeAddress: string
    businessAddress: string
    phoneNumber: string
    email: string
    bvn: string
    nextOfKinName: string
    nextOfKinPhone: string
    // Step 3
    productId: string
    initialDeposit: string
  }
  errors: Record<string, string>
}
```

### Stepper Visual

- 3 circles connected by lines
- Active step: filled orange circle with white number
- Completed step: filled green circle with checkmark
- Future step: empty circle, muted border
- Labels below each circle: "Bio Info", "Contact", "Account"

### Validation Per Step

**Step 1 (Bio Info):**
- firstName: required
- surname: required
- gender: required
- dateOfBirth: required, valid DD/MM/YYYY

**Step 2 (Contact):**
- phoneNumber: required
- bvn: required, valid 11 digits
- nextOfKinName: required

**Step 3 (Account):**
- productId: required
- initialDeposit: required, > 0

### Date Input

- Format: DD/MM/YYYY
- Validation: valid date, age >= 18
- Use 3 separate inputs or a single masked input

### Success Modal

- Backdrop: semi-transparent black
- Modal: centered, `--color-surface` bg, `--radius-lg`
- Content: green checkmark icon, "Account Created Successfully", account number in large bold text, "Copy" button, "Done" button
- On "Done": close modal, navigate to Dashboard

### API Spec

```typescript
// POST /api/accounts
interface CreateSavingsAccountRequest {
  branch: string
  firstName: string
  otherName: string
  surname: string
  gender: 'Male' | 'Female'
  dateOfBirth: string       // DD/MM/YYYY
  homeAddress: string
  businessAddress: string
  phoneNumber: string
  email: string
  bvn: string
  nextOfKinName: string
  nextOfKinPhone: string
  productId: string
  initialDeposit: number    // kobo
  officerId: string
}
```

---

## File Structure Requirements

```
src/
  features/
    new-savings-account/
      NewSavingsAccountScreen.tsx   <- NEW
      new-savings-account.module.css <- NEW
      useNewSavingsAccount.ts       <- NEW
      StepBioInfo.tsx               <- NEW
      StepContact.tsx               <- NEW
      StepAccount.tsx               <- NEW
  components/
    Stepper/
      Stepper.tsx                   <- NEW
      Stepper.module.css            <- NEW
    GenderToggle/
      GenderToggle.tsx              <- NEW
      GenderToggle.module.css       <- NEW
    DateInput/
      DateInput.tsx                 <- NEW
      DateInput.module.css          <- NEW
    SuccessModal/
      SuccessModal.tsx              <- NEW
      SuccessModal.module.css       <- NEW
  api/
    accounts.ts                     <- UPDATE
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `Stepper` | Shows correct active/completed/future states |
| `GenderToggle` | Toggles between Male/Female |
| `DateInput` | Validates DD/MM/YYYY format |
| `useNewSavingsAccount` | Validates per step, advances, goes back, preserves data |
| `SuccessModal` | Renders account number, closes on Done |

---

## Common Pitfalls to Avoid

1. **DO NOT** lose form data when going back - preserve all state in the wizard
2. **DO NOT** validate all steps at once - only validate the current step
3. **DO NOT** use a native date picker without DD/MM/YYYY formatting
4. **DO NOT** forget to copy the account number to clipboard in the success modal

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 3.3** (New Account Deposit) | Overlaps KYC fields; this is the full wizard version |
| **Story 1.2** (Connection Status) | ToastProvider for errors |
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
- Built the new wizard in `primepos-web` without touching unrelated dirty work already present in the repo.
- Fixed one TypeScript fixture mismatch in `NewSavingsAccountScreen.test.tsx` after the first build attempt.

### Implementation Plan
- Implemented the wizard as a dedicated feature module with step-specific presentational components and a single stateful hook to preserve data across back and forward navigation.
- Added reusable `Stepper`, `GenderToggle`, `DateInput`, and `SuccessModal` components so the flow follows existing shared-component patterns instead of using one-off inline UI.
- Extended `src/api/accounts.ts` with mocked savings products and account creation APIs, then rendered the new screen from `App.tsx` and returned officers to the dashboard after success.
- Validated date-of-birth and BVN rules in shared validation helpers so the same behavior is reusable in tests and future stories.

### Completion Notes
- Implemented the full 3-step New Savings Account wizard with per-step validation, preserved form state when navigating backward, and a success modal with clipboard copy plus dashboard return flow.
- Added mocked savings product loading and savings-account creation support in `src/api/accounts.ts`, including offline queue handling consistent with existing transaction stories.
- Added component, hook, screen, navigation, and validation coverage for the new story behavior.
- Verified with `npm test`, `npm run lint`, and `npm run build`.

---

## File List
- primepos-web/src/App.tsx
- primepos-web/src/api/accounts.ts
- primepos-web/src/components/DateInput/DateInput.module.css
- primepos-web/src/components/DateInput/DateInput.test.tsx
- primepos-web/src/components/DateInput/DateInput.tsx
- primepos-web/src/components/GenderToggle/GenderToggle.module.css
- primepos-web/src/components/GenderToggle/GenderToggle.test.tsx
- primepos-web/src/components/GenderToggle/GenderToggle.tsx
- primepos-web/src/components/Stepper/Stepper.module.css
- primepos-web/src/components/Stepper/Stepper.test.tsx
- primepos-web/src/components/Stepper/Stepper.tsx
- primepos-web/src/components/SuccessModal/SuccessModal.module.css
- primepos-web/src/components/SuccessModal/SuccessModal.test.tsx
- primepos-web/src/components/SuccessModal/SuccessModal.tsx
- primepos-web/src/features/new-savings-account/NewSavingsAccountScreen.test.tsx
- primepos-web/src/features/new-savings-account/NewSavingsAccountScreen.tsx
- primepos-web/src/features/new-savings-account/StepAccount.tsx
- primepos-web/src/features/new-savings-account/StepBioInfo.tsx
- primepos-web/src/features/new-savings-account/StepContact.tsx
- primepos-web/src/features/new-savings-account/new-savings-account.module.css
- primepos-web/src/features/new-savings-account/useNewSavingsAccount.test.ts
- primepos-web/src/features/new-savings-account/useNewSavingsAccount.ts
- primepos-web/src/features/new-savings-account/useSavingsProducts.ts
- primepos-web/src/types/navigation.test.ts
- primepos-web/src/utils/validation.test.ts
- primepos-web/src/utils/validation.ts

---

## Change Log
- 2026-05-08: Implemented the New Savings Account 3-step wizard, reusable supporting components, mocked account services, navigation wiring, and full automated validation coverage.
---

## Completion Checklist

- [ ] 3-step wizard with stepper
- [ ] Step 1: Bio Info with validation
- [ ] Step 2: Contact with BVN validation
- [ ] Step 3: Account with product select and deposit
- [ ] Back button preserves data
- [ ] Success modal shows account number
- [ ] Navigate to Dashboard on completion
- [ ] Mock API for account creation
- [ ] Unit tests for all components and hook
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
