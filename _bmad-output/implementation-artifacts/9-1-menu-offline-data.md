---
story_id: 9.1
story_key: 9-1-menu-offline-data
epic: 9
epic_title: Menu, Profile & Settings
title: Menu & Offline Data
status: ready-for-dev
source_files:
  - prd.md §4.8
  - architecture.md §3.1
  - ux-design-specification.md §3.15
  - epics.md §Story 9.1
created: 2026-05-02
dependencies:
  - 1-3-app-shell-navigation
  - 8-1-indexeddb-local-storage
---

# Story 9.1: Menu & Offline Data

## User Story
As a bank officer, I want a menu screen where I can access my profile, offline data, settings, and sign out so that I can manage my app experience.

## Business Context
The "More" tab is the self-service hub. Officers access their profile, view offline data status, manage settings, and sign out from here. The officer profile card at the top provides instant identity verification and a personalized touch.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Menu screen
  Given I am on the More tab
  Then I see:
    - Officer Profile Card (orange gradient)
    - Offline Data section (Unposted, Better Life, Portfolio, Groups, Loan Records)
    - Settings section (Change Password, Sync Data, App Settings)
    - Sign Out button

Scenario: Officer card
  Given the menu is displayed
  Then the officer card shows:
    - Initials avatar
    - Name, Staff ID, Branch, Till Account
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/contexts/AuthContext.tsx` | Auth state with officer data (Story 1.1) |
| `src/components/MenuItem/MenuItem.tsx` | Menu item component (Story 3.4) |
| `src/contexts/SyncContext.tsx` | Sync state with pendingCount (Story 1.2) |

**What does NOT exist yet:**
- More menu screen
- Officer profile card component
- Offline data section with counts

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/menu/MenuScreen.tsx` | More tab with profile card, offline data, settings, sign out |
| `src/features/menu/menu.module.css` | Styles |
| `src/components/OfficerCard/OfficerCard.tsx` | Profile card with orange gradient |
| `src/components/OfficerCard/OfficerCard.module.css` | Card styles |

### Files to Update

| File | Change |
|------|--------|
| `src/types/navigation.ts` | Add `'more'` to `Screen` type |

---

## Technical Requirements

### Officer Card

- Background: linear gradient from `#f97316` to `#ea580c`
- Border-radius: `--radius-lg`
- Padding: 1.25rem
- Avatar: 48px circle, white bg, orange text, initials
- Name: 18px, bold, white
- Details: 13px, white at 90% opacity
- Staff ID, Branch, Till Account listed vertically

### Menu Sections

**Offline Data:**
- Unposted Transactions → (shows pending count badge)
- Better Life Records →
- Portfolio Data →
- Groups →
- Loan Records →

**Settings:**
- Change Password →
- Sync Data →
- App Settings →

**Sign Out:**
- Full-width button at bottom
- Background: transparent, border: 1px solid `--color-danger`
- Text: `--color-danger`

### Badge on Unposted

Show pending count as a red badge circle on the right side of the menu item.

---

## File Structure Requirements

```
src/
  features/
    menu/
      MenuScreen.tsx             ← NEW
      menu.module.css            ← NEW
  components/
    OfficerCard/
      OfficerCard.tsx            ← NEW
      OfficerCard.module.css     ← NEW
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `OfficerCard` | Renders officer data with gradient background |
| `MenuScreen` | Renders all sections, shows pending count badge |

---

## Common Pitfalls to Avoid

1. **DO NOT** forget the pending count badge on Unposted Transactions
2. **DO NOT** hardcode officer data — read from AuthContext

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 1.1** (Login) | Officer data from AuthContext |
| **Story 1.2** (Connection Status) | SyncContext for pending count |
| **Story 8.2** (Queue Manager) | Unposted count from queue |
| **Story 9.2** (Profile) | My Profile navigated from menu |
| **Story 9.3** (Settings) | Settings navigated from menu |


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

- [ ] `MenuScreen` with profile card, offline data, settings, sign out
- [ ] `OfficerCard` with orange gradient, initials avatar, officer details
- [ ] Pending count badge on Unposted Transactions
- [ ] All menu items navigate to correct screens
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
