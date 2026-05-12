---
story_id: 9.3
story_key: 9-3-settings-sign-out
epic: 9
epic_title: Menu, Profile & Settings
title: Settings & Sign Out
status: done
source_files:
  - prd.md §4.8
  - architecture.md §3.1, §6.1
  - ux-design-specification.md §3.15
  - epics.md §Story 9.3
created: 2026-05-02
dependencies:
  - 9-1-menu-offline-data
  - 1-1-officer-login
---

# Story 9.3: Settings & Sign Out

## User Story
As a bank officer, I want to change my password, manually sync data, and sign out securely so that I can manage my account and app state.

## Business Context
Self-service settings reduce IT support load. Password changes are a security requirement. Manual sync gives officers control over when to refresh data. Secure sign-out ensures no sensitive data remains accessible on shared devices.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Change password
  Given I tap "Change Password"
  Then a form appears:
    - Current Password
    - New Password
    - Confirm New Password
  When I submit
  Then the password is updated via API
  And a success message appears

Scenario: Manual sync
  Given I tap "Sync Data"
  Then a sync process begins
  And a progress indicator is shown
  And on completion, a success toast appears

Scenario: Sign out
  Given I tap "Sign Out"
  Then a confirmation dialog appears: "Are you sure you want to sign out?"
  When I confirm
  Then I am logged out
  And all sensitive memory is cleared
  And I am returned to the Login screen
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/contexts/AuthContext.tsx` | Auth state with logout action (Story 1.1) |
| `src/components/Input/Input.tsx` | Reusable input |
| `src/components/Button/Button.tsx` | Reusable button |
| `src/services/backgroundSync.ts` | Background sync (Story 8.3) |
| `src/components/ProgressBar/ProgressBar.tsx` | Progress indicator (Story 8.2) |

**What does NOT exist yet:**
- Change Password screen
- Manual sync trigger
- Confirmation dialog component
- Secure sign-out cleanup

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/settings/SettingsScreen.tsx` | Settings menu (Change Password, Sync Data, App Settings) |
| `src/features/settings/settings.module.css` | Styles |
| `src/features/settings/ChangePasswordScreen.tsx` | Change password form |
| `src/features/settings/change-password.module.css` | Styles |
| `src/features/settings/useChangePassword.ts` | Password change logic |
| `src/components/ConfirmDialog/ConfirmDialog.tsx` | Reusable confirmation dialog |
| `src/components/ConfirmDialog/ConfirmDialog.module.css` | Dialog styles |
| `src/api/auth.ts` | Add `changePassword(payload)` (update existing) |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'settings'`, `'changePassword'` to `Screen` type |
| `src/contexts/AuthContext.tsx` | Ensure logout clears all sensitive state |

---

## Technical Requirements

### Change Password Validation

- Current Password: required
- New Password: required, minimum 8 characters
- Confirm New Password: must match New Password
- Error: "Passwords do not match"

### Manual Sync

```typescript
async function handleManualSync() {
  setIsSyncing(true)
  try {
    await backgroundSync.syncOfflineData(officerId)
    showToast({ message: 'Data synced successfully', type: 'success' })
  } catch (error) {
    showToast({ message: 'Sync failed. Please try again.', type: 'error' })
  } finally {
    setIsSyncing(false)
  }
}
```

### Secure Sign Out

1. Show confirmation dialog
2. On confirm:
   - Call `logout()` from AuthContext
   - Clear in-memory token
   - Clear AuthContext state
   - Optionally clear non-essential IndexedDB data (keep officer cache for offline login)
   - Navigate to Login screen

### Confirmation Dialog

- Backdrop: semi-transparent black
- Modal: centered, `--color-surface` bg, `--radius-lg`
- Title: 18px bold
- Message: 14px, `--color-text-muted`
- Buttons: "Cancel" (secondary) + "Confirm" (danger/red)

---

## File Structure Requirements

```
src/
  features/
    settings/
      SettingsScreen.tsx           ← NEW
      settings.module.css          ← NEW
      ChangePasswordScreen.tsx     ← NEW
      change-password.module.css   ← NEW
      useChangePassword.ts         ← NEW
  components/
    ConfirmDialog/
      ConfirmDialog.tsx            ← NEW
      ConfirmDialog.module.css     ← NEW
  api/
    auth.ts                        ← UPDATE
  contexts/
    AuthContext.tsx                ← UPDATE
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `useChangePassword` | Validates passwords match, calls API, handles success/error |
| `ConfirmDialog` | Renders title, message, Cancel and Confirm buttons |
| Sign out | Clears auth state, navigates to login |

---

## Common Pitfalls to Avoid

1. **DO NOT** clear the officer cache on sign out — it is needed for offline login
2. **DO NOT** forget the confirmation dialog on sign out — prevents accidental logout
3. **DO NOT** show new password in plain text — use password input type

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 1.1** (Login) | AuthContext logout, password change API |
| **Story 8.3** (Offline Cache) | Manual sync triggers backgroundSync |
| **Story 9.1** (Menu) | Settings accessed from menu |
| **Story 9.2** (Profile) | Change Password accessed from profile |


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

---

## Dev Agent Record

### Debug Log
<!-- Developer notes on issues encountered, workarounds, environment quirks -->

### Implementation Plan
<!-- Record technical decisions, approach notes, architecture choices as tasks are completed -->

### Completion Notes
<!-- Summarize what was actually implemented and tested -->
- Created ConfirmDialog reusable component with accessibility support and keyboard escape handling
- Created SettingsScreen with sections for Account, Data & Sync, and App Settings
- Created ChangePasswordScreen with form validation (current password required, new password min 8 chars, passwords must match)
- Implemented useChangePassword hook with validation and API integration
- Added changePassword API function to auth.ts with mock implementation
- Updated MenuScreen to show confirmation dialog before logout
- All 409 tests pass with no regressions
- Lint passes (only pre-existing warnings in other files)

---

## File List
<!-- New, modified, and deleted files relative to repo root -->
- `primepos-web/src/components/ConfirmDialog/ConfirmDialog.tsx` (NEW)
- `primepos-web/src/components/ConfirmDialog/ConfirmDialog.module.css` (NEW)
- `primepos-web/src/components/ConfirmDialog/ConfirmDialog.test.tsx` (NEW)
- `primepos-web/src/features/settings/SettingsScreen.tsx` (NEW)
- `primepos-web/src/features/settings/settings.module.css` (NEW)
- `primepos-web/src/features/settings/ChangePasswordScreen.tsx` (NEW)
- `primepos-web/src/features/settings/change-password.module.css` (NEW)
- `primepos-web/src/features/settings/useChangePassword.ts` (NEW)
- `primepos-web/src/features/settings/useChangePassword.test.ts` (NEW)
- `primepos-web/src/api/auth.ts` (MODIFIED - added changePassword)
- `primepos-web/src/features/menu/MenuScreen.tsx` (MODIFIED - added confirmation dialog)
- `primepos-web/src/features/menu/MenuScreen.test.tsx` (MODIFIED - updated tests)
- `primepos-web/src/App.tsx` (MODIFIED - added screen routes)

## Change Log
<!-- Summary of changes per session -->
- 2026-05-11: Implemented Settings & Sign Out feature including ConfirmDialog component, SettingsScreen, ChangePasswordScreen with validation, password change API, and manual sync functionality.

---

## Completion Checklist

- [x] `SettingsScreen` with Change Password, Sync Data, App Settings
- [x] `ChangePasswordScreen` with validation
- [x] `ConfirmDialog` reusable component
- [x] Sign out with confirmation dialog
- [x] Sign out clears sensitive memory, keeps officer cache
- [x] Manual sync with progress and success toast
- [x] Mock API for password change
- [x] Unit tests
- [x] No lint errors
- [x] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for code review.*
