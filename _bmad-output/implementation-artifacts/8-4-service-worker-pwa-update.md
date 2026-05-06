---
story_id: 8.4
story_key: 8-4-service-worker-pwa-update
epic: 8
epic_title: Offline-First Infrastructure
title: Service Worker & PWA Update Flow
status: ready-for-dev
source_files:
  - prd.md §7
  - architecture.md §8
  - ux-design-specification.md §2.1
  - epics.md §Story 8.4
created: 2026-05-02
dependencies:
  - 1-1-officer-login
---

# Story 8.4: Service Worker & PWA Update Flow

## User Story
As a user, I want the app to work offline and update automatically when a new version is available so that I always have the latest features.

## Business Context
The PWA must function fully offline after the first visit. The service worker caches the app shell and assets. When a new version is deployed, the SW detects the update and prompts the user to reload. This ensures officers always have bug fixes and new features.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Offline app shell
  Given the app has been visited before
  When I open it offline
  Then the app shell loads from cache
  And all static assets are served from cache

Scenario: API caching
  Given the app is offline
  When I request cached API data
  Then it is served from the Cache API

Scenario: Update available
  Given a new app version is deployed
  When the app detects the update
  Then an update banner appears: "Update available"
  And a "Reload" button is shown
  When I tap "Reload"
  Then the new version activates immediately
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `vite.config.ts` | `vite-plugin-pwa` configured with `registerType: 'autoUpdate'`, runtime caching for API and fonts |
| `src/main.tsx` | Manual SW registration via `virtual:pwa-register` |
| `src/components/OfflineIndicator.tsx` | Shows SW update banner (static, basic) |

**What does NOT exist yet:**
- Proper SW update detection and user prompt
- API response caching in Workbox
- Offline fallback page

### Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/usePWAUpdate.ts` | Detects SW updates, exposes `needRefresh` and `updateServiceWorker` |
| `src/components/UpdateBanner/UpdateBanner.tsx` | Banner with "Update available" + Reload button |
| `src/components/UpdateBanner/UpdateBanner.module.css` | Banner styles |

### Files to Update

| File | Change |
|------|--------|
| `src/App.tsx` | Replace `OfflineIndicator` with `UpdateBanner` (or keep both with clear separation) |
| `vite.config.ts` | Enhance runtime caching: add API response caching with expiration |
| `src/main.tsx` | Ensure SW registration handles update events correctly |

---

## Technical Requirements

### SW Update Detection

```typescript
// usePWAUpdate.ts
import { useRegisterSW } from 'virtual:pwa-register/react'

export function usePWAUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // r is the service worker registration
      console.log('SW registered:', r)
    },
    onRegisterError(error) {
      console.error('SW registration error:', error)
    },
  })

  return { needRefresh, updateServiceWorker }
}
```

### Update Banner

- Position: top of app, below header or as a floating banner
- Background: `--color-primary`
- Text: white, 13px, 600 weight
- Button: white bg, `--color-primary` text, "Reload" label
- Dismissible with tap on "✕"

### Workbox Runtime Caching

Update `vite.config.ts`:
```typescript
workbox: {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\./,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: { maxEntries: 100, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\./,
      handler: 'CacheFirst',
      options: {
        cacheName: 'font-cache',
        expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
  ],
},
```

### Offline Fallback

Create a simple offline fallback HTML page that shows "You are offline" if the app shell fails to load. This is a safety net.

---

## File Structure Requirements

```
src/
  hooks/
    usePWAUpdate.ts              ← NEW
  components/
    UpdateBanner/
      UpdateBanner.tsx           ← NEW
      UpdateBanner.module.css    ← NEW
  App.tsx                        ← UPDATE
  main.tsx                       ← UPDATE (if needed)
  vite.config.ts                 ← UPDATE
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `usePWAUpdate` | Exposes needRefresh and updateServiceWorker |
| `UpdateBanner` | Renders when needRefresh is true; calls updateServiceWorker on Reload |

---

## Common Pitfalls to Avoid

1. **DO NOT** auto-reload without user consent — officers may be in the middle of a transaction
2. **DO NOT** cache API responses indefinitely — set reasonable expiration
3. **DO NOT** forget to handle SW registration errors gracefully

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 1.1** (Login) | SW caches the app shell including login screen |
| **All stories** | SW caching affects how updates are delivered |


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

- [ ] `usePWAUpdate` hook detects SW updates
- [ ] `UpdateBanner` shows when update is available
- [ ] Reload button activates new SW
- [ ] Workbox runtime caching configured for API and fonts
- [ ] API cache has expiration (24h)
- [ ] App works offline after first visit
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
