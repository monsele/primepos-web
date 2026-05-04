---
story_id: 5.2
story_key: 5-2-account-balance-inquiry
epic: 5
epic_title: Account Services
title: Account Balance Inquiry
status: story-created
source_files:
  - prd.md §4.4.2
  - architecture.md §3.1, §5.4
  - ux-design-specification.md §3.12
  - epics.md §Story 5.2
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
      AccountBalanceScreen.tsx    ← NEW
      account-balance.module.css  ← NEW
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `AccountBalanceScreen` | Search shows balances; reset clears everything |

---

## Common Pitfalls to Avoid

1. **DO NOT** show balances in red — balances are positive, use green
2. **DO NOT** forget the reset button — officers need to quickly check another account

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 3.1** (Cash In) | Reuses account search, AccountCard |
| **Story 8.3** (Offline Cache) | Cached account data for offline inquiry |

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
