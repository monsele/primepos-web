---
story_id: 9.3
story_key: 9-3-settings-sign-out
epic: 9
epic_title: Menu, Profile & Settings
title: Settings & Sign Out
status: story-created
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

## Completion Checklist

- [ ] `SettingsScreen` with Change Password, Sync Data, App Settings
- [ ] `ChangePasswordScreen` with validation
- [ ] `ConfirmDialog` reusable component
- [ ] Sign out with confirmation dialog
- [ ] Sign out clears sensitive memory, keeps officer cache
- [ ] Manual sync with progress and success toast
- [ ] Mock API for password change
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
