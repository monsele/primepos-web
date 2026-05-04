---
story_id: 6.1
story_key: 6-1-batch-bbls-deposit
epic: 6
epic_title: Batch & Card Operations
title: Batch BBLS Deposit
status: story-created
source_files:
  - prd.md §4.3.4
  - architecture.md §3.1, §5.2
  - ux-design-specification.md §3.8
  - epics.md §Story 6.1
created: 2026-05-02
dependencies:
  - 3-1-cash-in-deposit
  - 3-4-cash-transactions-menu
---

# Story 6.1: Batch BBLS Deposit

## User Story
As a bank officer, I want to process deposits for multiple customers in a group simultaneously so that group savings collections are efficient.

## Business Context
BBLS (Better Life Savings) group deposits are central to microfinance operations. Officers collect from 10–50 group members at once. The batch interface must allow rapid entry of amounts per member, show a running total, and submit all deposits as a single batch. This saves enormous time compared to processing each member individually.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Group selection
  Given I am on the Batch BBLS Deposit screen
  When I enter a payee/collector name
  And I select a branch
  And I tap "SELECT" for group
  Then a modal opens with a searchable group list
  When I select a group
  Then the modal closes
  And group details appear:
    - Group Code
    - Group Name
    - Total (initially ₦0.00)

Scenario: Enter customer amounts
  Given a group is selected
  Then a table appears with group members
  When I enter amounts for each customer
  Then the Total updates live
  And the customer count is shown

Scenario: Submit batch
  Given all amounts are entered
  When I check "Send SMS notification"
  And I tap "SUBMIT BATCH"
  Then all deposits are posted as a batch
  And a success message shows the batch reference

Scenario: Offline batch
  Given I am offline
  When I submit a batch
  Then the entire batch is queued locally
  And each entry is marked pending
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/components/Input/Input.tsx` | Reusable input |
| `src/components/Button/Button.tsx` | Reusable button |
| `src/components/GroupSelect/GroupSelect.tsx` | Group selection modal (Story 4.2) |
| `src/types/group.ts` | Group interface |
| `src/api/groups.ts` | Group list API |

**What does NOT exist yet:**
- Batch deposit screen
- Member amount input table
- Live total calculation
- Batch submission API

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/batch-deposit/BatchDepositScreen.tsx` | Full batch deposit flow |
| `src/features/batch-deposit/batch-deposit.module.css` | Styles |
| `src/features/batch-deposit/useBatchDeposit.ts` | Form logic, total calculation, batch submission |
| `src/features/batch-deposit/useGroupMembers.ts` | Fetch group members after group selection |
| `src/components/MemberAmountTable/MemberAmountTable.tsx` | Table of members with amount inputs |
| `src/components/MemberAmountTable/MemberAmountTable.module.css` | Table styles |
| `src/types/group.ts` | Add `GroupMember` interface |
| `src/api/transactions.ts` | Add `postBatchDeposit(payload)` |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'batchDeposit'` to `Screen` type |

---

## Technical Requirements

### Group Member Type

```typescript
interface GroupMember {
  id: string
  customerName: string
  accountNumber: string
  amount: number | null   // kobo, entered by officer
}
```

### Batch Form State

```typescript
interface BatchDepositForm {
  payeeName: string
  branchId: string
  groupId: string
  members: GroupMember[]
  sendSms: boolean
}
```

### Live Total Calculation

```typescript
const total = useMemo(() => {
  return members.reduce((sum, m) => sum + (m.amount || 0), 0)
}, [members])
```

Display total with `formatNaira`.

### Member Amount Table

- Columns: #, Customer Name, Account Number, Amount Input
- Amount input: numeric, right-aligned, formatted on blur
- Show running total at bottom
- Customer count: number of members with non-zero amounts

### API Spec

```typescript
// GET /api/groups/{groupId}/members
// POST /api/transactions/batch-deposit
interface BatchDepositRequest {
  payeeName: string
  branchId: string
  groupId: string
  deposits: {
    accountNumber: string
    amount: number     // kobo
  }[]
  sendSms: boolean
  officerId: string
}

interface BatchDepositResponse {
  batchReference: string
  totalAmount: number
  postedCount: number
  failedCount: number
}
```

### Offline Behavior

Queue the entire batch as a single queue item:
```typescript
{
  id: 'local-uuid',
  type: 'BatchDeposit',
  payload: BatchDepositRequest,
  status: 'PENDING',
}
```

---

## File Structure Requirements

```
src/
  features/
    batch-deposit/
      BatchDepositScreen.tsx       ← NEW
      batch-deposit.module.css     ← NEW
      useBatchDeposit.ts           ← NEW
      useGroupMembers.ts           ← NEW
  components/
    MemberAmountTable/
      MemberAmountTable.tsx        ← NEW
      MemberAmountTable.module.css ← NEW
  api/
    transactions.ts                ← UPDATE
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `useBatchDeposit` | Calculates total correctly; validates at least one deposit |
| `MemberAmountTable` | Renders members, inputs update amounts |
| Live total | Updates when member amounts change |

---

## Common Pitfalls to Avoid

1. **DO NOT** calculate total on every keystroke — use `useMemo`
2. **DO NOT** allow submission with zero total — show error
3. **DO NOT** forget to handle large groups (50+ members) — table must scroll

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 4.2** (Group Loan) | Reuses GroupSelect component |
| **Story 3.1** (Cash In) | Reuses amount input patterns |
| **Story 1.2** (Connection Status) | ToastProvider, offline detection |
| **Story 8.2** (Queue Manager) | Offline batch queue |

---

## Completion Checklist

- [ ] `BatchDepositScreen` with group selection
- [ ] `MemberAmountTable` with amount inputs per member
- [ ] Live total updates as amounts change
- [ ] Customer count shown
- [ ] Submit batch with SMS option
- [ ] Success message with batch reference
- [ ] Offline: entire batch queued
- [ ] Mock API for group members and batch submission
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
