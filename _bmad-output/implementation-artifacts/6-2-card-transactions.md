---
story_id: 6.2
story_key: 6-2-card-transactions
epic: 6
epic_title: Batch & Card Operations
title: Card Transactions
status: story-created
source_files:
  - prd.md §4.3.5
  - architecture.md §3.1
  - ux-design-specification.md §3.9
  - epics.md §Story 6.2
created: 2026-05-02
dependencies:
  - 3-4-cash-transactions-menu
---

# Story 6.2: Card Transactions

## User Story
As a bank officer, I want to access card deposit, withdrawal, balance check, and statement features when a POS terminal is connected so that card-based operations are supported.

## Business Context
Card transactions extend the teller's capabilities to POS-based operations. However, POS integration is complex and may not be available in the initial MVP. This story creates the menu and placeholder screens so the feature area is ready for future POS integration.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Card menu
  Given I am on the Card Transactions screen
  Then I see 4 options:
    - Card Deposit
    - Card Withdrawal
    - Card Balance Check
    - Card Statement
  And an info banner: "POS Terminal Required"

Scenario: POS not connected
  Given no POS terminal is connected
  When I tap any card option
  Then a message appears: "Please connect a POS terminal device"

Scenario: POS connected
  Given a POS terminal is connected
  When I tap "Card Deposit"
  Then the card deposit flow begins
  (Full flow TBD based on POS integration specs)
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/components/MenuItem/MenuItem.tsx` | Reusable menu item (Story 3.4) |
| `src/contexts/NavigationContext.tsx` | Navigation (Story 1.3) |

**What does NOT exist yet:**
- Card Transactions screen
- POS connection detection (placeholder)
- Card operation placeholder screens

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/card-transactions/CardTransactionsScreen.tsx` | Menu with 4 card options + info banner |
| `src/features/card-transactions/card-transactions.module.css` | Styles |
| `src/features/card-transactions/CardDepositScreen.tsx` | Placeholder |
| `src/features/card-transactions/CardWithdrawalScreen.tsx` | Placeholder |
| `src/features/card-transactions/CardBalanceScreen.tsx` | Placeholder |
| `src/features/card-transactions/CardStatementScreen.tsx` | Placeholder |
| `src/hooks/usePosStatus.ts` | Placeholder hook returning `{ isConnected: false }` |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add card screen types |

---

## Technical Requirements

### POS Status

For MVP, POS is always "not connected":
```typescript
function usePosStatus() {
  return { isConnected: false }
}
```

Future: Detect connected USB/Bluetooth POS terminal.

### Info Banner

- Background: `rgba(59, 130, 246, 0.15)` (blue tint)
- Text: `#3b82f6` (blue)
- Content: "POS Terminal Required. Please connect a POS terminal device to use card transactions."
- Border-radius: `--radius-md`
- Padding: 12px 16px

### Placeholder Screens

When POS is not connected, tapping any option shows a centered message:
- Icon: 💳 or card icon
- Title: "POS Terminal Required"
- Subtitle: "Please connect a POS terminal device"

---

## File Structure Requirements

```
src/
  features/
    card-transactions/
      CardTransactionsScreen.tsx   ← NEW
      card-transactions.module.css ← NEW
      CardDepositScreen.tsx        ← NEW (placeholder)
      CardWithdrawalScreen.tsx     ← NEW (placeholder)
      CardBalanceScreen.tsx        ← NEW (placeholder)
      CardStatementScreen.tsx      ← NEW (placeholder)
  hooks/
    usePosStatus.ts                ← NEW (placeholder)
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `CardTransactionsScreen` | Renders 4 options and info banner |
| `usePosStatus` | Returns `isConnected: false` for MVP |

---

## Common Pitfalls to Avoid

1. **DO NOT** implement actual POS communication — this is a placeholder for future integration
2. **DO NOT** forget the info banner — officers need to know why card transactions don't work

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 3.4** (Cash Transactions Menu) | Card Transactions accessed from Transact menu |
| **Story 1.3** (Navigation) | Inner screens for card operations |

---

## Completion Checklist

- [ ] `CardTransactionsScreen` with 4 options
- [ ] Info banner about POS requirement
- [ ] Placeholder screens for each option
- [ ] `usePosStatus` placeholder hook
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
