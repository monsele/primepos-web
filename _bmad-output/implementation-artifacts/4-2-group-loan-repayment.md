---
story_id: 4.2
story_key: 4-2-group-loan-repayment
epic: 4
epic_title: Loan Management
title: Group Loan Repayment
status: story-created
source_files:
  - prd.md §4.6
  - architecture.md §3.1
  - ux-design-specification.md §3.5
  - epics.md §Story 4.2
created: 2026-05-02
dependencies:
  - 4-1-loan-repayment
---

# Story 4.2: Group Loan Repayment

## User Story
As a bank officer, I want to process repayments for group loans by selecting the group and posting the payment so that group lending operations are supported.

## Business Context
Group lending is a core microfinance product. Officers need to select a group first, then see the group's consolidated loan details before posting a repayment. The flow is nearly identical to individual loan repayment but with a group selection step upfront.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Group selection
  Given I am on the Group Loan Repayment screen
  When I tap "Select Group"
  Then a modal opens with a searchable group list
  When I select a group
  Then the group loan details appear

Scenario: Group repayment flow
  Given a group is selected
  Then the repayment flow mirrors individual loan repayment
  With group name displayed in the details card
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/features/loan-repayment/` | Created in Story 4.1 |
| `src/components/LoanCard/LoanCard.tsx` | Reusable loan card |
| `src/api/loans.ts` | Loan search and repayment API |

**What does NOT exist yet:**
- Group selection modal/bottom sheet
- Group list API
- Group Loan Repayment screen

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/group-loan-repayment/GroupLoanRepaymentScreen.tsx` | Group selection + repayment flow |
| `src/features/group-loan-repayment/group-loan-repayment.module.css` | Styles |
| `src/features/group-loan-repayment/useGroupLoanRepayment.ts` | Form logic with group state |
| `src/components/GroupSelect/GroupSelect.tsx` | Bottom sheet modal with searchable group list |
| `src/components/GroupSelect/GroupSelect.module.css` | Modal styles |
| `src/types/group.ts` | `Group` interface |
| `src/api/groups.ts` | `fetchGroups()`, `searchGroups(query)` |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'groupLoanRepayment'` to `Screen` type |
| `src/api/loans.ts` | Add group loan search variant |

---

## Technical Requirements

### Group Type

```typescript
interface Group {
  id: string
  groupCode: string
  groupName: string
  branchId: string
  memberCount: number
}
```

### Group Loan Type

Extends `Loan` with:
```typescript
interface GroupLoan extends Loan {
  groupId: string
  groupName: string
}
```

### Bottom Sheet Modal

- Position: fixed, bottom-aligned
- Animation: slide up from bottom, 250ms ease-out
- Backdrop: semi-transparent black, tap to close
- Content: search input + scrollable group list
- List item: group name + group code + member count

### API Spec

```typescript
// GET /api/groups?branchId={id}
// GET /api/loans/group?groupId={id}
// POST /api/transactions/group-loan-repayment
```

---

## File Structure Requirements

```
src/
  features/
    group-loan-repayment/
      GroupLoanRepaymentScreen.tsx   ← NEW
      group-loan-repayment.module.css ← NEW
      useGroupLoanRepayment.ts       ← NEW
  components/
    GroupSelect/
      GroupSelect.tsx                ← NEW
      GroupSelect.module.css         ← NEW
  types/
    group.ts                         ← NEW
  api/
    groups.ts                        ← NEW
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `GroupSelect` | Renders group list, filters by search, calls onSelect |
| `useGroupLoanRepayment` | Sets group, then validates repayment |

---

## Common Pitfalls to Avoid

1. **DO NOT** reuse the individual loan search directly — group loans need group filtering
2. **DO NOT** forget to close the modal after group selection
3. **DO NOT** forget to handle empty group list state

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 4.1** (Loan Repayment) | Reuses repayment flow, LoanCard, validation |
| **Story 1.3** (Navigation) | Inner screen |
| **Story 8.2** (Queue Manager) | Offline queue |

---

## Completion Checklist

- [ ] `GroupLoanRepaymentScreen` with group selection step
- [ ] `GroupSelect` bottom sheet modal with search
- [ ] Group list fetched from API
- [ ] Repayment flow mirrors individual loan repayment
- [ ] Group name shown in loan card
- [ ] Offline queue support
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
