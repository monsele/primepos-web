---
story_id: 9.2
story_key: 9-2-my-profile
epic: 9
epic_title: Menu, Profile & Settings
title: My Profile
status: ready-for-dev
source_files:
  - prd.md §4.8
  - architecture.md §3.1
  - ux-design-specification.md §3.16
  - epics.md §Story 9.2
created: 2026-05-02
dependencies:
  - 9-1-menu-offline-data
---

# Story 9.2: My Profile

## User Story
As a bank officer, I want to view my profile details so that I can verify my account information.

## Business Context
Officers occasionally need to verify their own details (branch, till account, etc.) especially when switching devices or during audits. The profile screen is read-only except for the Change Password action.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Profile display
  Given I tap my officer card or "My Profile"
  Then I see a detail view:
    - Name, Staff ID
    - Mobile, Email
    - Branch, Department
    - Till Account, System Date
    - Change Password button
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/contexts/AuthContext.tsx` | Officer data (Story 1.1) |
| `src/components/OfficerCard/OfficerCard.tsx` | Officer card (Story 9.1) |

**What does NOT exist yet:**
- My Profile screen
- Read-only detail list component

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/profile/ProfileScreen.tsx` | Read-only profile details |
| `src/features/profile/profile.module.css` | Styles |
| `src/components/DetailList/DetailList.tsx` | Reusable read-only detail list |
| `src/components/DetailList/DetailList.module.css` | List styles |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'profile'` to `Screen` type |

---

## Technical Requirements

### Detail List

```typescript
interface DetailItem {
  label: string
  value: string
}
```

- Label: 12px, uppercase, `--color-text-muted`
- Value: 16px, `--color-text`
- Border-bottom: 1px solid rgba(255, 255, 255, 0.05)
- Padding: 12px 0

### Profile Fields

Read from AuthContext `user`:
- Name
- Staff ID
- Mobile
- Email
- Branch
- Department
- Till Account
- System Date (current date)

### Change Password Button

- Full-width button at bottom
- Background: `--color-primary`
- Text: white
- Navigates to Change Password screen (Story 9.3)

---

## File Structure Requirements

```
src/
  features/
    profile/
      ProfileScreen.tsx         ← NEW
      profile.module.css        ← NEW
  components/
    DetailList/
      DetailList.tsx            ← NEW
      DetailList.module.css     ← NEW
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `DetailList` | Renders label-value pairs |
| `ProfileScreen` | Renders all officer fields from AuthContext |

---

## Common Pitfalls to Avoid

1. **DO NOT** make profile fields editable — this is read-only
2. **DO NOT** forget to format the system date as DD/MM/YYYY

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 1.1** (Login) | Officer data from AuthContext |
| **Story 9.1** (Menu) | Profile accessed from menu |
| **Story 9.3** (Settings) | Change Password navigated from profile |


---

## Tasks/Subtasks

- [ ] **Task 1: Create components and types**
  - [ ] 1.1 Create type definitions
  - [ ] 1.2 Create reusable components
- [ ] **Task 2: Build feature screen(s)**
  - [ ] 2.1 Create main screen component(s)
  - [ ] 2.2 Create styles module
- [ ] **Task 3: Implement hooks and logic**
  - [ ] 3.1 Create data fetching hooks
  - [ ] 3.2 Implement form/business logic
- [ ] **Task 4: API and services**
  - [ ] 4.1 Create/update API functions
  - [ ] 4.2 Add mock implementations
- [ ] **Task 5: Wire navigation and updates**
  - [ ] 5.1 Update navigation types
  - [ ] 5.2 Update parent screens
- [ ] **Task 6: Author tests**
  - [ ] 6.1 Unit tests for components
  - [ ] 6.2 Unit tests for hooks/utils
  - [ ] 6.3 Integration tests
- [ ] **Task 7: Validation & regression**
  - [ ] 7.1 Run full test suite — no regressions
  - [ ] 7.2 Run lint — no errors
  - [ ] 7.3 Run build — succeeds
  - [ ] 7.4 Verify all acceptance criteria are met

---

## Dev Agent Record

### Debug Log
<!-- Developer notes on issues encountered, workarounds, environment quirks -->

### Implementation Plan
<!-- Record technical decisions, approach notes, architecture choices as tasks are completed -->

### Completion Notes
<!-- Summarize what was actually implemented and tested -->

---

## File List
<!-- New, modified, and deleted files relative to repo root -->

---

## Change Log
<!-- Summary of changes per session -->
---

## Completion Checklist

- [ ] `ProfileScreen` with all officer details
- [ ] `DetailList` reusable component
- [ ] Change Password button navigates to settings
- [ ] Data read from AuthContext
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
