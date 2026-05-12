---
story_id: 5.2
story_key: 5-2-account-balance-inquiry
epic: 5
epic_title: Account Services
title: Account Balance Inquiry
status: done
source_files:
  - prd.md Â§4.4.2
  - architecture.md Â§3.1, Â§5.4
  - ux-design-specification.md Â§3.12
  - epics.md Â§Story 5.2
created: 2026-05-02
dependencies:
  - 3-1-cash-in-deposit
---

# Story 5.2: Account Balance Inquiry

## User Story
As a bank officer, I want to check a customer's account balance by entering their CASA account number so that I can provide accurate balance information.

## Business Context
Balance inquiry is one of the most common customer requests. Officers need a fast, reliable way to look up balances. The screen must work offline using cached data so officers can answer balance questions even without connectivity.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Balance lookup
  Given I am on the Account Balance screen
  When I enter a CASA account number
  And I tap "SEARCH"
  Then the results show:
    - Account Name
    - Book Balance (green)
    - Usable Balance (green)
    - NUBAN

Scenario: Reset search
  Given results are displayed
  When I tap "RESET"
  Then the results clear
  And the search input is cleared
  And the screen returns to empty state
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/features/cash-in/useAccountSearch.ts` | Account search hook |
| `src/components/AccountCard/AccountCard.tsx` | Account display card |
| `src/types/account.ts` | Account interface |
| `src/api/accounts.ts` | Account search API |

**What does NOT exist yet:**
- Dedicated Account Balance Inquiry screen
- Reset functionality

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/account-balance/AccountBalanceScreen.tsx` | Search + balance display with reset |
| `src/features/account-balance/account-balance.module.css` | Styles |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'accountBalance'` to `Screen` type |

---

## Technical Requirements

### Balance Display

When account is found, show:
- Account Name: 18px bold
- NUBAN: 14px, `--color-text-muted`
- Book Balance: label + value (green, 20px bold)
- Usable Balance: label + value (green, 20px bold)

Both balances formatted with `formatNaira`.

### Reset Button

- Appears only when results are displayed
- Clears search input, account data, and errors
- Returns screen to empty state

### Offline

Use cached account data from IndexedDB when offline. Show "Cached data" indicator.

---

## File Structure Requirements

```
src/
  features/
    account-balance/
      AccountBalanceScreen.tsx    â† NEW
      account-balance.module.css  â† NEW
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `AccountBalanceScreen` | Search shows balances; reset clears everything |

---

## Common Pitfalls to Avoid

1. **DO NOT** show balances in red â€” balances are positive, use green
2. **DO NOT** forget the reset button â€” officers need to quickly check another account

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 3.1** (Cash In) | Reuses account search, AccountCard |
| **Story 8.3** (Offline Cache) | Cached account data for offline inquiry |


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
  - [x] 7.1 Run full test suite â€” no regressions
  - [x] 7.2 Run lint â€” no errors
  - [x] 7.3 Run build â€” succeeds
  - [x] 7.4 Verify all acceptance criteria are met

---

## Dev Agent Record

### Debug Log
<!-- Developer notes on issues encountered, workarounds, environment quirks -->
- `vitest run --runInBand` is not supported in this repo's Vitest version; targeted test runs used `npm test -- <files>` before the full suite.

### Implementation Plan
<!-- Record technical decisions, approach notes, architecture choices as tasks are completed -->
- Built a dedicated `account-balance` feature with a focused hook that reuses the existing account search API and React Query cache to surface cached-result feedback.
- Extended `AccountCard` so the new inquiry flow could reuse an existing component while adding NUBAN and the required green balance styling.
- Wired the feature into `App.tsx` because the navigation/menu metadata already referenced `accountBalance`; the missing piece was the actual screen route.

### Completion Notes
<!-- Summarize what was actually implemented and tested -->
- Implemented `AccountBalanceScreen` with CASA search, cached-data indicator, empty state, and reset behavior that clears the input and current result state.
- Added `useAccountBalance` to manage account lookup, loading/error state, cache detection, and reset handling while reusing the existing mock account API.
- Updated `AccountCard` presentation to include NUBAN and render both balance values in green with larger typography matching the story requirements.
- Added targeted tests for the new screen and hook, updated the account card test, and verified the full Vitest suite, ESLint, and production build all pass.

---

## File List
<!-- New, modified, and deleted files relative to repo root -->
- primepos-web/src/App.tsx
- primepos-web/src/components/AccountCard/AccountCard.module.css
- primepos-web/src/components/AccountCard/AccountCard.test.tsx
- primepos-web/src/components/AccountCard/AccountCard.tsx
- primepos-web/src/features/account-balance/AccountBalanceScreen.test.tsx
- primepos-web/src/features/account-balance/AccountBalanceScreen.tsx
- primepos-web/src/features/account-balance/account-balance.module.css
- primepos-web/src/features/account-balance/useAccountBalance.test.tsx
- primepos-web/src/features/account-balance/useAccountBalance.ts

---

## Change Log
<!-- Summary of changes per session -->
- 2026-05-08: Implemented the Account Balance Inquiry screen, added cached-result/reset behavior, extended the reusable account card, added tests, and validated with full test/lint/build runs.
---

## Completion Checklist

- [ ] `AccountBalanceScreen` with search and balance display
- [ ] Balances shown in green, formatted
- [ ] Reset button clears search and results
- [ ] Offline support with cached data indicator
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
