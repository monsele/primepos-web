---
story_id: 3.2
story_key: 3-2-cash-out-withdrawal
epic: 3
epic_title: Cash Transactions
title: Cash Out (Withdrawal)
status: done
source_files:
  - prd.md §4.3.2
  - architecture.md §3.1, §5.2
  - ux-design-specification.md §3.4
  - epics.md §Story 3.2
created: 2026-05-02
dependencies:
  - 3-1-cash-in-deposit
---

# Story 3.2: Cash Out (Withdrawal)

## User Story
As a bank officer, I want to process a cash withdrawal by verifying the customer's balance and posting the transaction so that the withdrawal is recorded and funds are disbursed.

## Business Context
Cash Out is the second most frequent operation. The critical difference from Cash In is balance validation — officers must ensure the account has sufficient usable balance before disbursing cash. A failed withdrawal due to insufficient funds is embarrassing and wastes time, so real-time balance checking is essential.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Balance validation
  Given an account has a usable balance of ₦91.05
  When I enter a withdrawal amount of ₦100
  And I tap "POST TRANSACTION"
  Then the amount field shows "Amount exceeds usable balance"
  And the transaction is blocked

Scenario: Successful withdrawal
  Given an account has sufficient balance
  When I enter a valid withdrawal amount
  And I tap "POST TRANSACTION"
  Then the transaction posts successfully
  And the account balance is reduced accordingly

Scenario: Same flow as Cash In
  Given the Cash In flow is implemented
  Then Cash Out reuses the same screen pattern
  With title "Cash Out (Withdrawal)"
  And additional balance validation
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/features/cash-in/` | Created in Story 3.1 — full Cash In implementation |
| `src/components/AccountCard/` | Created in Story 3.1 — reusable account details card |
| `src/types/account.ts` | Created in Story 3.1 — Account interface |
| `src/api/accounts.ts` | Created in Story 3.1 — account search API |

**What does NOT exist yet:**
- Cash Out screen component
- Balance validation logic
- Cash Out API function

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/cash-out/CashOutScreen.tsx` | Cash out screen — reuses Cash In pattern with balance validation |
| `src/features/cash-out/cash-out.module.css` | Cash out styles (may be identical to cash-in) |
| `src/features/cash-out/useCashOut.ts` | Form logic with balance validation |
| `src/api/transactions.ts` | Add `postCashOut(payload)` (update existing file from Story 3.1) |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'cashOut'` to `Screen` type |
| `src/api/transactions.ts` | Add `postCashOut` function |

---

## Technical Requirements

### Architecture Decision: Reuse vs. Duplicate

**Approach:** Create a shared `CashTransactionScreen` component that accepts a `mode: 'in' | 'out'` prop, OR create separate screens that import shared sub-components. Recommendation: **Create separate screen files** that both import and reuse `AccountCard`, `useAccountSearch`, and form patterns. This keeps the code simple and avoids over-abstraction while still minimizing duplication.

### Cash Out Form State

```typescript
interface CashOutForm {
  accountNumber: string
  payeeName: string
  amount: string
  sendSms: boolean
}
```

### Additional Validation

```typescript
function validateCashOut(form: CashOutForm, account: Account | null): string | null {
  const amount = parseFloat(form.amount)
  if (isNaN(amount) || amount <= 0) return 'Amount must be greater than 0'
  if (account && amount * 100 > account.usableBalance) {
    return 'Amount exceeds usable balance'
  }
  return null
}
```

Note: Amount entered is in NGN; `usableBalance` is in kobo. Multiply amount by 100 for comparison.

### API Spec

```typescript
// POST /api/transactions/cash-out
interface CashOutRequest {
  accountNumber: string
  payeeName: string
  amount: number        // in kobo
  sendSms: boolean
  officerId: string
}
```

### Visual Differences from Cash In

- Screen title: "Cash Out (Withdrawal)" instead of "Cash In (Deposit)"
- Post button label: "POST WITHDRAWAL" (or keep "POST TRANSACTION")
- Account card may show usable balance in a more prominent color (orange warning if low)
- Amount field shows real-time validation error if exceeding balance

---

## File Structure Requirements

```
src/
  features/
    cash-out/
      CashOutScreen.tsx       ← NEW
      cash-out.module.css     ← NEW
      useCashOut.ts           ← NEW
  api/
    transactions.ts           ← UPDATE: Add postCashOut
  types/
    navigation.ts             ← UPDATE: Add 'cashOut'
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `useCashOut` | Validates amount > 0; blocks if > usableBalance; allows if <= usableBalance |
| Balance edge case | Exactly equal to usableBalance should be allowed |

### Integration Tests

| Test | Description |
|------|-------------|
| Cash Out flow | Search account → enter amount > balance → error → enter valid amount → post → success |

---

## Common Pitfalls to Avoid

1. **DO NOT** duplicate the entire Cash In screen — reuse `AccountCard`, `useAccountSearch`, Input/Button components
2. **DO NOT** forget the kobo/NGN conversion when comparing amount to balance
3. **DO NOT** show the balance validation error before the user has searched for an account
4. **DO NOT** allow posting if balance validation fails

---

## Design Tokens Reference

Use tokens from `src/index.css`.

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 3.1** (Cash In) | Reuses AccountCard, useAccountSearch, Input, Button, patterns |
| **Story 1.2** (Connection Status) | ToastProvider for messages |
| **Story 1.3** (Navigation) | Cash Out is an inner screen |
| **Story 8.2** (Queue Manager) | Offline queue for cash-out transactions |


---

### Review Findings

- [x] [Review][Patch] Floating-point arithmetic used for money conversion [useCashOut.ts:~123,~151] — Fixed: extracted `parseAmountToKobo()` using integer arithmetic (splits on decimal, no float intermediates).
- [x] [Review][Patch] Duplicated amount-parsing logic [useCashOut.ts:~123,~151] — Fixed: both `validate` and `handleSubmit` now call shared `parseAmountToKobo()`.
- [x] [Review][Patch] No test coverage for API failure path [useCashOut.test.tsx] — Fixed: added test `'shows error toast when API fails'`.
- [x] [Review][Patch] Non-null assertion on account after validation [useCashOut.ts:~154] — Fixed: added explicit `if (!account)` guard before payload construction.
- [x] [Review][Patch] Async state update after potential unmount [useCashOut.ts:~182-184] — Fixed: added `mountedRef` with cleanup; `setIsSubmitting(false)` guarded by `mountedRef.current`.
- [x] [Review][Patch] Missing screen title "Cash Out (Withdrawal)" [App.tsx:SCREEN_TITLES] — Fixed: updated `SCREEN_TITLES['cashOut']` to `'Cash Out (Withdrawal)'`.
- [x] [Review][Patch] Balance validation is not real-time [useCashOut.ts] — Fixed: `useCashOut` now accepts `account` parameter; `setAmount` performs real-time balance check and shows error immediately.
- [x] [Review][Defer] Account validation error swallowed by UI [CashOutScreen.tsx] — Button is disabled when no account (same as Cash In pattern). Pre-existing.
- [x] [Review][Defer] Hardcoded error message masks search failures [CashOutScreen.tsx] — UI always renders "Account not found" regardless of actual error. Pre-existing Cash In pattern.
- [x] [Review][Defer] Cross-feature import creates tight coupling [CashOutScreen.tsx] — Importing `useAccountSearch` from `../cash-in/` is by spec design ("reuse Cash In patterns").
- [x] [Review][Defer] Stale account card and form data persist across searches [CashOutScreen.tsx] — No reset on search input change. Pre-existing Cash In pattern.
- [x] [Review][Defer] Empty officerId silently accepted [useCashOut.ts] — `user?.staffId || ''` falls back to empty string. Pre-existing Cash In pattern.
- [x] [Review][Defer] No keyboard accessibility for search [CashOutScreen.tsx] — No Enter key handler on account input. Pre-existing Cash In pattern.
- [x] [Review][Defer] Excessive mock duplication in screen tests [CashOutScreen.test.tsx] — Follows same pattern as CashInScreen tests. Style preference, not a bug.
- [x] [Review][Defer] Missing src/types/navigation.ts update — `cashOut` is already present in the Screen type (added previously). False positive.

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
<!-- Developer notes on issues encountered, workarounds, environment quirks -->

### Implementation Plan
- Reused `useAccountSearch` from `features/cash-in` to avoid duplication.
- Created `useCashOut` hook based on `useCashIn` with added balance validation (amount * 100 > usableBalance blocks submission).
- Created `CashOutScreen` mirroring `CashInScreen` layout, with title "Cash Out (Withdrawal)".
- Added `postCashOut` mock API in `src/api/transactions.ts`.
- Registered `CashOutScreen` in `App.tsx` for `cashOut` route.
- Offline support: queues transactions with type `'CashOut'` via IndexedDB queue.

### Completion Notes
- CashOutScreen reuses Cash In patterns (AccountCard, useAccountSearch, Input, Button).
- Balance validation prevents withdrawal > usable balance with error message.
- Successful posting shows success toast and resets form.
- Offline transactions are queued for sync.
- All 143 tests pass (including 14 new cash-out tests).
- Lint passes with zero errors.
- Production build succeeds.

---

## File List
- `primepos-web/src/features/cash-out/useCashOut.ts` (new)
- `primepos-web/src/features/cash-out/CashOutScreen.tsx` (new)
- `primepos-web/src/features/cash-out/cash-out.module.css` (new)
- `primepos-web/src/features/cash-out/useCashOut.test.tsx` (new)
- `primepos-web/src/features/cash-out/CashOutScreen.test.tsx` (new)
- `primepos-web/src/api/transactions.ts` (updated: added CashOutRequest, CashOutResponse, postCashOut)
- `primepos-web/src/App.tsx` (updated: registered CashOutScreen for cashOut route)

---

## Change Log
- Implemented Cash Out (Withdrawal) feature with balance validation, offline queue support, and full test coverage (2026-05-06).

## Completion Checklist

- [ ] `CashOutScreen` reuses Cash In patterns
- [ ] Balance validation prevents withdrawal > usable balance
- [ ] Error message shown when amount exceeds balance
- [ ] Successful posting shows success toast
- [ ] Form resets after success
- [ ] Offline support (queue transaction)
- [ ] Mock API for cash-out post
- [ ] Unit tests for balance validation
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
