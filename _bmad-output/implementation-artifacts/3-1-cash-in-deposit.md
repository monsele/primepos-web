---
story_id: 3.1
story_key: 3-1-cash-in-deposit
epic: 3
epic_title: Cash Transactions
title: Cash In (Deposit)
status: story-created
source_files:
  - prd.md §4.3.1
  - architecture.md §3.1, §5.2, §6.1
  - ux-design-specification.md §3.3
  - epics.md §Story 3.1
created: 2026-05-02
dependencies:
  - 1-3-app-shell-navigation
  - 2-1-dashboard-kpi-cards
---

# Story 3.1: Cash In (Deposit)

## User Story
As a bank officer, I want to receive a cash deposit from a customer by searching their account and posting the transaction so that the deposit is recorded accurately.

## Business Context
Cash In (deposit) is the most frequent teller operation. The flow must be fast and error-proof: search account → verify details → enter amount → post. Officers handle dozens of these per day, so every tap counts. Offline support is critical because deposits happen in branches with intermittent connectivity.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Account search and display
  Given I am on the Cash In screen
  When I enter a valid account number
  And I tap "SEARCH"
  Then an "Account Found" card slides in showing:
    - Account Name
    - Book Balance
    - Usable Balance

Scenario: Account not found
  Given I am on the Cash In screen
  When I enter an invalid account number
  And I tap "SEARCH"
  Then the input shows an error state
  And a message appears: "Account not found"

Scenario: Successful cash in posting
  Given I have found a valid account
  When I enter a payee name
  And I enter a transaction amount
  And I check "Send SMS notification to customer"
  And I tap "POST TRANSACTION"
  Then the transaction is posted successfully
  And a success toast appears: "Transaction posted"
  And the form resets for the next transaction

Scenario: Offline cash in
  Given I am offline
  When I complete the Cash In form
  And I tap "POST TRANSACTION"
  Then the transaction is saved to the local queue
  And a toast appears: "Saved offline. Will sync when online."
  And the Dashboard pending sync count increases

Scenario: Amount validation
  Given I enter an amount of 0
  When I tap "POST TRANSACTION"
  Then the amount field shows "Amount must be greater than 0"
  And the transaction is not posted
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/components/Input/Input.tsx` | Created in Story 1.1 (reusable input with label) |
| `src/components/Button/Button.tsx` | Created in Story 1.1 (reusable button) |
| `src/contexts/NavigationContext.tsx` | Not yet created (Story 1.3) |
| `src/contexts/SyncContext.tsx` | Not yet created (Story 1.2) |
| `src/services/storage/queue.ts` | Not yet created (Story 8.2) |

**What does NOT exist yet:**
- Cash In screen component
- Account search API/hook
- Account display card component
- `Account` type definition
- Transaction posting API/hook
- Offline queue write logic

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/cash-in/CashInScreen.tsx` | Main cash in screen with search, account card, form, post button |
| `src/features/cash-in/cash-in.module.css` | Cash in screen styles |
| `src/features/cash-in/useCashIn.ts` | Form logic, validation, API call, offline fallback |
| `src/features/cash-in/useAccountSearch.ts` | TanStack Query hook for `GET /api/accounts/search?number={n}` |
| `src/components/AccountCard/AccountCard.tsx` | Reusable account details card (name, book balance, usable balance) |
| `src/components/AccountCard/AccountCard.module.css` | Card styles |
| `src/types/account.ts` | `Account` interface |
| `src/api/transactions.ts` | `postCashIn(payload)` API function |
| `src/api/accounts.ts` | `searchAccount(number)` API function |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'cashIn'` to `Screen` type (Story 1.3) |

---

## Technical Requirements

### Account Type

```typescript
interface Account {
  accountNumber: string
  accountName: string
  bookBalance: number      // in kobo
  usableBalance: number    // in kobo
  nuban?: string
  branchId: string
}
```

### Cash In Form State

```typescript
interface CashInForm {
  accountNumber: string
  payeeName: string
  amount: string            // raw input, validated before posting
  sendSms: boolean
}
```

### API Spec

```typescript
// GET /api/accounts/search?number={accountNumber}
// Returns: Account

// POST /api/transactions/cash-in
interface CashInRequest {
  accountNumber: string
  payeeName: string
  amount: number            // in kobo
  sendSms: boolean
  officerId: string
}

// Mock implementation for MVP
```

### Offline Behavior

When offline (`!isOnline`):
1. Validate form (same as online)
2. Generate a local UUID for the transaction
3. Write to IndexedDB `transactionQueue` store:
   ```typescript
   {
     id: 'local-uuid',
     type: 'CashIn',
     payload: CashInRequest,
     status: 'PENDING',
     createdAt: new Date().toISOString(),
   }
   ```
4. Show warning toast: "Saved offline. Will sync when online."
5. Increment `SyncContext` pending count
6. Reset form for next transaction

### Account Card Visual Spec

- Background: `--color-surface`
- Border-radius: `--radius-lg`
- Border-left: 3px solid `--color-primary`
- Padding: 1rem
- Title: "Account Found" — 12px, uppercase, `--color-text-muted`
- Account Name: 16px, bold, `--color-text`
- Balances: label (11px muted) + value (14px bold, green for usable)

### Amount Validation

- Required: "Amount is required"
- Must be > 0: "Amount must be greater than 0"
- Must be numeric: "Enter a valid amount"
- Parse: Remove commas, parse as number, convert to kobo for API

---

## File Structure Requirements

```
src/
  features/
    cash-in/
      CashInScreen.tsx         ← NEW
      cash-in.module.css       ← NEW
      useCashIn.ts             ← NEW
      useAccountSearch.ts      ← NEW
  components/
    AccountCard/
      AccountCard.tsx          ← NEW
      AccountCard.module.css   ← NEW
  types/
    account.ts                 ← NEW
  api/
    transactions.ts            ← NEW
    accounts.ts                ← NEW
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `useAccountSearch` | Returns account on success, null on not-found, loading state |
| `useCashIn` | Validates fields, calls API, handles success/failure, resets form |
| `AccountCard` | Renders account details with correct formatting |
| Amount validation | Rejects 0, empty, non-numeric; accepts valid amounts |

### Integration Tests

| Test | Description |
|------|-------------|
| Cash In flow | Enter account → search → card appears → fill form → post → success toast → form resets |
| Offline flow | Go offline → complete form → post → queued toast → form resets |

---

## Common Pitfalls to Avoid

1. **DO NOT** post amount as string — convert to number (kobo) before API call
2. **DO NOT** forget to include `officerId` in the API payload
3. **DO NOT** allow posting without a valid account search result
4. **DO NOT** clear the account search result when resetting the form — officers often process multiple deposits for the same account
5. **DO NOT** forget to handle the offline case — this is critical for field operations
6. **DO NOT** use `window.alert` — use ToastProvider from Story 1.2

---

## Design Tokens Reference

Use tokens from `src/index.css`.

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 1.1** (Login) | Officer ID from AuthContext needed in API payload |
| **Story 1.2** (Connection Status) | ToastProvider for success/warning messages; offline detection |
| **Story 1.3** (Navigation) | Cash In is an inner screen; needs back navigation |
| **Story 2.1** (KPI Cards) | After posting, Dashboard KPIs may need refresh (invalidate queries) |
| **Story 8.1** (IndexedDB) | Offline queue requires IndexedDB storage layer |
| **Story 8.2** (Queue Manager) | Full queue management and sync logic |

---

## Completion Checklist

- [ ] `CashInScreen` with search input, account card, form fields, post button
- [ ] `useAccountSearch` hook with TanStack Query
- [ ] `AccountCard` reusable component
- [ ] Amount validation (required, > 0, numeric)
- [ ] Success toast on post
- [ ] Form resets after successful post
- [ ] Offline: transaction queued in IndexedDB with warning toast
- [ ] Mock API for account search and cash-in post
- [ ] Unit tests for hooks, components, validation
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
