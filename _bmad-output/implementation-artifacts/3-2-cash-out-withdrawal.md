---
story_id: 3.2
story_key: 3-2-cash-out-withdrawal
epic: 3
epic_title: Cash Transactions
title: Cash Out (Withdrawal)
status: story-created
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
