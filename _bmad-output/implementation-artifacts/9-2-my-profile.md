---
story_id: 9.2
story_key: 9-2-my-profile
epic: 9
epic_title: Menu, Profile & Settings
title: My Profile
status: done
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

- [x] **Task 1: Create components and types**
  - [x] 1.1 Create type definitions
  - [x] 1.2 Create reusable components
- [x] **Task 2: Build feature screen(s)**
  - [x] 2.1 Create main screen component(s)
  - [x] 2.2 Create styles module
- [x] **Task 3: Implement hooks and logic** (N/A - reads from AuthContext directly)
- [x] **Task 4: API and services** (N/A - no API calls needed for read-only display)
- [x] **Task 5: Wire navigation and updates**
  - [x] 5.1 Navigation type already exists in Screen type
  - [x] 5.2 Update parent screens (MenuScreen)
- [x] **Task 6: Author tests**
  - [x] 6.1 Unit tests for components
  - [x] 6.2 Unit tests for hooks/utils (N/A - no custom hooks)
  - [x] 6.3 Integration tests (N/A - covered by unit tests)
- [x] **Task 7: Validation & regression**
  - [x] 7.1 Run full test suite — no regressions
  - [x] 7.2 Run lint — no errors
  - [x] 7.3 Run build — pre-existing project build issues not related to changes
  - [x] 7.4 Verify all acceptance criteria are met

---

## Dev Agent Record

### Debug Log
<!-- Developer notes on issues encountered, workarounds, environment quirks -->

### Implementation Plan
<!-- Record technical decisions, approach notes, architecture choices as tasks are completed -->

Created `DetailList` reusable component with `DetailItem` interface for label-value pairs. Used CSS modules for styling with proper typography and border styling per spec. Created `ProfileScreen` using AuthContext data and navigation context for Change Password navigation. Added "My Profile" menu item to MenuScreen for access.

### Completion Notes
<!-- Summarize what was actually implemented and tested -->
- `DetailList` component with `DetailItem` interface (label, value)
- `ProfileScreen` reads officer data from AuthContext and displays all fields
- System date formatted as DD/MM/YYYY
- Change Password button navigates to 'changePassword' screen
- Added "My Profile" to MenuScreen settings section
- Unit tests for both DetailList and ProfileScreen
- All acceptance criteria verified

---

## File List
<!-- New, modified, and deleted files relative to repo root -->

### New Files
- primepos-web/src/components/DetailList/DetailList.tsx
- primepos-web/src/components/DetailList/DetailList.module.css
- primepos-web/src/components/DetailList/DetailList.test.tsx
- primepos-web/src/features/profile/ProfileScreen.tsx
- primepos-web/src/features/profile/profile.module.css
- primepos-web/src/features/profile/ProfileScreen.test.tsx

### Modified Files
- primepos-web/src/features/menu/MenuScreen.tsx (added My Profile menu item)
- primepos-web/src/features/menu/MenuScreen.test.tsx (added profile navigation test)

---

## Change Log
<!-- Summary of changes per session -->

**2026-05-10** - Implemented My Profile feature:
- Created DetailList reusable component for label-value display
- Created ProfileScreen with all officer fields from AuthContext
- Added "My Profile" menu item to MenuScreen
- Added unit tests for DetailList and ProfileScreen components
---

## Completion Checklist

- [x] `ProfileScreen` with all officer details
- [x] `DetailList` reusable component
- [x] Change Password button navigates to settings
- [x] Data read from AuthContext
- [x] Unit tests
- [x] No lint errors
- [x] Build - pre-existing project build issues not related to changes

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
