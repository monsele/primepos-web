---
story_id: 4.2
story_key: 4-2-group-loan-repayment
epic: 4
epic_title: Loan Management
title: Group Loan Repayment
status: done
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

### Review Findings

- [x] [Review][Patch] Extra SEARCH step contradicts AC [GroupLoanRepaymentScreen.tsx] — Implemented auto-search when group is selected per AC ("When I select a group / Then the group loan details appear").
- [x] [Review][Patch] Stale loan search result when switching groups [GroupLoanRepaymentScreen.tsx] — Added AbortController to cancel stale loan searches when switching groups.
- [x] [Review][Patch] Race condition in concurrent group searches [useGroupSearch.ts] — Added guard with ref/counter to prevent overlapping async operations.
- [x] [Review][Patch] Group-search errors silently swallowed [GroupLoanRepaymentScreen.tsx, useGroupSearch.ts] — Added error state rendering in modal with proper error messages.
- [x] [Review][Patch] Runtime crash risk from non-null assertions [useGroupLoanRepayment.ts] — Removed non-null assertions (`!`) and added proper null checks with early returns.
- [x] [Review][Patch] Floating-point precision loss in kobo conversion [useGroupLoanRepayment.ts] — Used precise decimal math via string splitting instead of Math.round(num * 100).
- [x] [Review][Patch] Missing loan-property validation allows max-repayment bypass [useGroupLoanRepayment.ts] — Added validation for undefined balance/interest properties.
- [x] [Review][Patch] Network status race between offline check and POST [useGroupLoanRepayment.ts] — Re-check network status before POST to fall back to offline queue if needed.
- [x] [Review][Patch] Stale LoanCard remains after successful repayment [GroupLoanRepaymentScreen.tsx] — Clear groupLoan state when resetForm runs.
- [x] [Review][Patch] No navigation entry point to Group Loan Repayment screen [QuickActions.tsx, TransactMenuScreen.tsx] — Added groupLoanRepayment to QuickActions and TransactMenuScreen.
- [x] [Review][Patch] Modal missing keyboard accessibility [GroupSelect.tsx] — Added Escape key listener, focus management, and ARIA attributes (role="dialog", aria-modal).
- [x] [Review][Patch] Backdrop click handler is brittle [GroupSelect.tsx] — Fixed with proper event target checking using dedicated backdrop element.
- [x] [Review][Patch] Loan search allows rapid-fire requests [GroupLoanRepaymentScreen.tsx] — Added searching state guard to prevent multiple parallel requests.
- [x] [Review][Patch] Currency input accepts scientific notation [useGroupLoanRepayment.ts] — Added validation to reject scientific notation numbers.
- [x] [Review][Patch] Empty officerId silently queued/posted [useGroupLoanRepayment.ts] — Added validation for officerId with toast error if empty.
- [x] [Review][Patch] Search query persists after closing modal without selection [GroupSelect.tsx] — Reset search query when modal closes without selection.
- [x] [Review][Patch] Loan search errors homogenized to generic message [GroupLoanRepaymentScreen.tsx] — Added specific error handling for different error types.
- [x] [Review][Patch] Form amount persists after group/loan change [GroupLoanRepaymentScreen.tsx] — Clear amount when group changes.
- [x] [Review][Patch] No scroll lock while modal is open [GroupSelect.tsx] — Added body scroll lock when modal is open.
- [x] [Review][Defer] Type guard relies on duck-typing [LoanCard.tsx] — `isGroupLoan` checks `'groupName' in loan`. If base `Loan` ever gains an optional `groupName`, this will misclassify. Current code is correct; risk is future-facing.
- [x] [Review][Defer] Local state duplicates React Query responsibilities [useGroupSearch.ts] — Manual useState for groups/isLoading/error re-implements what useQuery already provides. Technical debt; not a functional bug.

---

## Dev Agent Record

### Debug Log
<!-- Developer notes on issues encountered, workarounds, environment quirks -->

### Implementation Plan
- Reused existing `LoanCard` component with extension to display `groupName` for `GroupLoan` types via type guard.
- Created `GroupSelect` bottom-sheet modal component with backdrop tap-to-close, search filtering, and slide-up animation.
- Mirrored individual loan repayment flow: group selection → loan search → amount input → post repayment.
- Added offline queue support using existing `addToQueue` infrastructure with new transaction type `GroupLoanRepayment`.
- API mocks follow the same pattern as Story 4.1 (`searchGroupLoan`, `postGroupLoanRepayment`).

### Completion Notes
- ✅ Created `Group` and `GroupLoan` type definitions in `src/types/group.ts`
- ✅ Created `GroupSelect` bottom-sheet modal with search, empty state, and animations
- ✅ Created `GroupLoanRepaymentScreen` with group selection + repayment flow
- ✅ Created `useGroupSearch` hook for fetching groups by branch
- ✅ Created `useGroupLoanRepayment` hook with validation, online post, and offline queue
- ✅ Created `src/api/groups.ts` with `fetchGroups` and `searchGroups`
- ✅ Updated `src/api/loans.ts` with `searchGroupLoan` and `postGroupLoanRepayment`
- ✅ Updated `src/components/LoanCard/LoanCard.tsx` to display `groupName` when present
- ✅ Wired `groupLoanRepayment` screen in `src/App.tsx`
- ✅ Added 24 new unit tests (GroupSelect: 8, useGroupLoanRepayment: 11, GroupLoanRepaymentScreen: 5)
- ✅ Updated LoanCard test to cover group name display
- ✅ Full test suite: 409 tests passing, 0 regressions
- ✅ Lint: clean
- ✅ Build: clean (no warnings)

### Fixes Applied for Review Findings
- ✅ Auto-search loan details when group is selected (per AC)
- ✅ Added AbortController to cancel stale loan searches
- ✅ Added guard to prevent race conditions in concurrent searches
- ✅ Added error state rendering in GroupSelect modal
- ✅ Removed non-null assertions and added proper null checks
- ✅ Fixed floating-point precision using precise decimal math
- ✅ Added loan property validation for undefined values
- ✅ Added re-check of network status before POST
- ✅ Clear LoanCard when form is reset
- ✅ Added Group Loan Repayment to QuickActions and TransactMenuScreen
- ✅ Added keyboard accessibility (Escape key, ARIA attributes) to GroupSelect modal
- ✅ Fixed backdrop click handler with proper target checking
- ✅ Added guard to prevent rapid-fire loan searches
- ✅ Added validation to reject scientific notation in currency input
- ✅ Added validation for empty officerId with toast error
- ✅ Reset search query when modal closes without selection
- ✅ Added specific error handling for different error types
- ✅ Clear amount when group changes
- ✅ Added body scroll lock when modal is open

---

## File List
- `primepos-web/src/types/group.ts` (new)
- `primepos-web/src/api/groups.ts` (new)
- `primepos-web/src/components/GroupSelect/GroupSelect.tsx` (new)
- `primepos-web/src/components/GroupSelect/GroupSelect.module.css` (new)
- `primepos-web/src/components/GroupSelect/GroupSelect.test.tsx` (new)
- `primepos-web/src/features/group-loan-repayment/GroupLoanRepaymentScreen.tsx` (new)
- `primepos-web/src/features/group-loan-repayment/group-loan-repayment.module.css` (new)
- `primepos-web/src/features/group-loan-repayment/useGroupSearch.ts` (new)
- `primepos-web/src/features/group-loan-repayment/useGroupLoanRepayment.ts` (new)
- `primepos-web/src/features/group-loan-repayment/GroupLoanRepaymentScreen.test.tsx` (new)
- `primepos-web/src/features/group-loan-repayment/useGroupLoanRepayment.test.tsx` (new)
- `primepos-web/src/api/loans.ts` (modified)
- `primepos-web/src/components/LoanCard/LoanCard.tsx` (modified)
- `primepos-web/src/components/LoanCard/LoanCard.module.css` (modified)
- `primepos-web/src/components/LoanCard/LoanCard.test.tsx` (modified)
- `primepos-web/src/App.tsx` (modified)

---

## Change Log
- 2026-05-11: Fixed all 18 review findings for Story 4.2
  - Auto-search loan details when group is selected (per AC)
  - Added AbortController for cancelling stale loan searches
  - Added network status re-check to avoid race conditions
  - Added error state rendering in GroupSelect modal
  - Removed non-null assertions and added proper null checks
  - Fixed floating-point precision using string-based kobo conversion
  - Added loan property validation for undefined values
  - Added Group Loan Repayment to QuickActions and TransactMenuScreen navigation
  - Added keyboard accessibility (Escape key, ARIA attributes) to GroupSelect modal
  - Added body scroll lock when modal is open
  - All 409 tests passing, lint clean
- 2026-05-06: Implemented Group Loan Repayment feature (Story 4.2)
  - Created group types, API, bottom-sheet modal, screen, hooks, and tests
  - Extended LoanCard to show group name for group loans
  - Wired navigation in App.tsx
  - All tests pass (231 total), lint clean, build clean
---

## Completion Checklist

- [x] `GroupLoanRepaymentScreen` with group selection step
- [x] `GroupSelect` bottom sheet modal with search
- [x] Group list fetched from API
- [x] Repayment flow mirrors individual loan repayment
- [x] Group name shown in loan card
- [x] Offline queue support
- [x] Unit tests
- [x] No lint errors
- [x] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
