---
story_id: 1.2
story_key: 1-2-connection-status-offline-awareness
epic: 1
epic_title: Authentication & App Shell
title: Connection Status & Offline Awareness
status: story-created
source_files:
  - prd.md §4.1, §4.9
  - architecture.md §3.1, §5.1, §6.2
  - ux-design-specification.md §2.2, §2.3
  - epics.md §Story 1.2
created: 2026-05-02
dependencies:
  - 1-1-officer-login
---

# Story 1.2: Connection Status & Offline Awareness

## User Story
As a bank officer, I want to see my network connection status at all times so that I know whether my transactions will post immediately or be queued.

## Business Context
Bank officers work in branches with unreliable connectivity. Knowing the connection status in real-time prevents confusion about whether a transaction was posted to the server or saved locally. The connection status must be visible on every screen without being intrusive — a subtle but persistent indicator builds trust in the system.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Online status display
  Given the app is open
  When the device has an active internet connection
  Then a green banner shows "Connected — All features available"
  And the header shows an "Online" pill badge

Scenario: Offline status display
  Given the app is open
  When the device loses internet connection
  Then a yellow banner shows "Offline — Limited features available"
  And the header shows an "Offline" pill badge in red
  And an offline banner appears below the header

Scenario: Status transitions
  Given I am using the app
  When the connection drops
  Then the status changes to offline within 3 seconds
  And a toast appears: "You are offline. Transactions will be saved locally."
  When the connection returns
  Then the status changes to online
  And a toast appears: "Back online. Syncing pending transactions..."

Scenario: Network type detection
  Given the device is online
  When I am on a slow connection (2G/3G)
  Then the app continues to function
  And API calls show loading states appropriately
```

---

## Developer Context

### What Exists Today

The project `primepos-web/` currently has a **basic** network status implementation:

| File | Current State |
|------|---------------|
| `src/hooks/useNetworkStatus.ts` | Returns `{ isOnline, connectionType }` via `navigator.onLine` and `navigator.connection`. No timestamps, no transition events. |
| `src/components/OfflineIndicator.tsx` | Shows SW update banner only. Not related to network status. |
| `src/App.tsx` | Shows a simple `offline-banner` when `!isOnline`. No connection banner when online. No toasts. No transition animations. |
| `src/App.css` | Basic `.offline-banner`, `.connection-status.online/offline` styles exist but are static. |
| `src/index.css` | Design tokens exist (`--color-success`, `--color-warning`, `--color-danger`). No toast or animation utilities. |

**What does NOT exist yet:**
- Toast/notification system for transition messages
- Connection status banner component (dedicated, animated)
- `SyncContext` for tracking pending sync count (needed for "Syncing pending transactions" toast)
- Transition detection (detecting when online→offline or offline→online changes)
- Timestamp tracking for "since when" display
- `idb-keyval` integration for offline queue awareness

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/ConnectionBanner/ConnectionBanner.tsx` | Persistent banner below header showing online/offline state with text and icon |
| `src/components/ConnectionBanner/ConnectionBanner.module.css` | Banner styles with fade transition |
| `src/components/ConnectionPill/ConnectionPill.tsx` | Small pill badge for header (Online/Offline) |
| `src/components/ConnectionPill/ConnectionPill.module.css` | Pill badge styles |
| `src/components/Toast/Toast.tsx` | Toast notification component for transition messages |
| `src/components/Toast/Toast.module.css` | Toast slide-in/slide-out animation styles |
| `src/components/Toast/ToastProvider.tsx` | Context provider managing toast queue and auto-dismiss |
| `src/contexts/SyncContext.tsx` | Tracks pending sync count, sync state (idle \| syncing \| error) |
| `src/hooks/useConnectionTransition.ts` | Detects online→offline and offline→online transitions, triggers toasts |
| `src/services/storage/queue.ts` | IndexedDB queue storage for pending transactions count |

### Files to Update

| File | Change |
|------|--------|
| `src/hooks/useNetworkStatus.ts` | Add `since` timestamp (Date when state last changed), expose `wasOffline` helper, improve Network Information typing |
| `src/App.tsx` | Wire `SyncContext.Provider`, `ToastProvider`, replace inline offline banner with `<ConnectionBanner>`, add `<ConnectionPill>` to header |
| `src/App.css` | Remove old `.offline-banner` and `.connection-status` styles (moved to modules), add toast animation keyframes if needed |
| `src/index.css` | Add `fade-in`, `fade-out`, `slide-up` utility keyframes for banner and toast transitions |

---

## Technical Requirements

### Architecture Compliance

1. **State Management:** Use React Context for sync state. Do NOT install Redux, Zustand, or Jotai.
2. **Storage:** Use `idb-keyval` for offline queue count (already in `package.json` as dependency from Story 1.1). Do NOT use localStorage.
3. **Styling:** Use CSS Modules with CSS custom properties. Do NOT install Tailwind, Styled Components, or Emotion.
4. **Animation:** Use CSS transitions and keyframes. Do NOT install Framer Motion or similar libraries.
5. **Network API:** Use native `navigator.onLine` + Network Information API. No external network libraries needed.

### Enhanced `useNetworkStatus` Hook Spec

```typescript
interface NetworkStatus {
  isOnline: boolean
  connectionType: string   // '4g' | '3g' | '2g' | 'slow-2g' | 'unknown'
  since: Date | null       // When the current state started
}

// Returns NetworkStatus + a derived flag for transition detection
function useNetworkStatus(): NetworkStatus
```

**Changes from current implementation:**
- Track `since` timestamp: update when `isOnline` changes
- Type the `navigator.connection` object properly (create a `NetworkInformation` interface)
- Handle browsers without Network Information API gracefully

### `useConnectionTransition` Hook Spec

```typescript
interface ConnectionTransition {
  wentOffline: boolean   // true on the render cycle after online→offline
  cameOnline: boolean    // true on the render cycle after offline→online
}

function useConnectionTransition(): ConnectionTransition
```

**Logic:**
- Compare previous `isOnline` value with current
- `wentOffline` = previous true, current false
- `cameOnline` = previous false, current true
- Reset flags after toast is triggered (one-shot)

### Sync Context Spec

```typescript
interface SyncState {
  pendingCount: number
  status: 'idle' | 'syncing' | 'error'
  lastSyncedAt: Date | null
}

type SyncAction =
  | { type: 'QUEUE_ITEM' }
  | { type: 'SYNC_START' }
  | { type: 'SYNC_SUCCESS'; payload: number }  // items synced
  | { type: 'SYNC_FAILURE'; payload: string }
  | { type: 'SET_PENDING'; payload: number }
```

For this story, `SyncContext` can be a placeholder with mock data (0 pending). Full queue implementation comes in Epic 8 (Offline Engine).

### Connection Banner Spec

**Props:**
```typescript
interface ConnectionBannerProps {
  isOnline: boolean
}
```

**Visual (Online):**
- Height: 24px
- Background: transparent (subtle, no bg needed — text only on dark bg)
- Text: `#22c55e` (success), "Connected — All features available"
- Font: 11px, 500 weight, centered
- Icon: small green dot (●) or Wi-Fi icon

**Visual (Offline):**
- Height: 24px
- Background: transparent
- Text: `#eab308` (warning), "Offline — Limited features available"
- Font: 11px, 500 weight, centered
- Icon: warning triangle or crossed Wi-Fi

**Transition:**
- Fade in/out, 200ms ease
- Conditionally rendered based on `isOnline`
- Positioned directly below the header

### Connection Pill Spec

**Props:**
```typescript
interface ConnectionPillProps {
  isOnline: boolean
}
```

**Visual (Online):**
- Background: `rgba(34, 197, 94, 0.15)`
- Text: `#22c55e`, "Online"
- Font: 10px, 600 weight, uppercase, letter-spacing 0.05em
- Padding: 4px 10px
- Border-radius: 9999px (pill)

**Visual (Offline):**
- Background: `rgba(239, 68, 68, 0.15)`
- Text: `#ef4444`, "Offline"
- Same sizing as online

### Toast Spec

**Props:**
```typescript
interface ToastOptions {
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  duration?: number   // ms, default 4000
}

// ToastProvider exposes:
function showToast(options: ToastOptions): void
function dismissToast(id: string): void
```

**Visual:**
- Position: bottom of screen, above bottom nav, centered
- Background: `--color-surface-elevated` with subtle border
- Text: `--color-text`, 13px
- Left border accent: 3px solid matching `type` color
- Padding: 12px 16px
- Border-radius: `--radius-md`
- Shadow: `--shadow-md`
- Animation: slide up from bottom, 250ms ease-out; auto-dismiss with fade-out

**Toast Messages:**
| Trigger | Message | Type |
|---------|---------|------|
| Online → Offline | "You are offline. Transactions will be saved locally." | `warning` |
| Offline → Online | "Back online. Syncing pending transactions..." | `success` |

### Screen Layout (Updated App Shell)

```
┌─────────────────────────────────┐
│  P  PrimePOS          [Online]  │  ← Header (ConnectionPill)
│        Mobile Teller Platform   │
├─────────────────────────────────┤
│  ● Connected — All features     │  ← ConnectionBanner (online)
├─────────────────────────────────┤
│                                 │
│      [Screen content]           │
│                                 │
├─────────────────────────────────┤
│  🔔 Toast (if transition)       │  ← Toast (absolute, bottom)
├─────────────────────────────────┤
│  🏠 ⚡ ⊞ 📊 ⋯                  │  ← BottomNav (future)
└─────────────────────────────────┘
```

Offline variant:
```
┌─────────────────────────────────┐
│  P  PrimePOS         [Offline]  │  ← Header (red pill)
├─────────────────────────────────┤
│  ⚠ Offline — Limited features   │  ← ConnectionBanner (yellow)
├─────────────────────────────────┤
│      [Screen content]           │
│                                 │
└─────────────────────────────────┘
```

---

## File Structure Requirements

```
src/
  contexts/
    SyncContext.tsx              ← NEW: Sync state (pending count, sync status)
  components/
    ConnectionBanner/
      ConnectionBanner.tsx       ← NEW: Persistent status banner
      ConnectionBanner.module.css
    ConnectionPill/
      ConnectionPill.tsx         ← NEW: Header pill badge
      ConnectionPill.module.css
    Toast/
      Toast.tsx                  ← NEW: Individual toast item
      Toast.module.css
      ToastProvider.tsx          ← NEW: Toast queue context provider
  hooks/
    useNetworkStatus.ts          ← UPDATE: Add `since` timestamp
    useConnectionTransition.ts   ← NEW: Transition detection hook
  services/
    storage/
      queue.ts                   ← NEW: IndexedDB queue count (placeholder)
  App.tsx                        ← UPDATE: Wire providers, replace banner
  App.css                        ← UPDATE: Remove migrated styles
  index.css                      ← UPDATE: Add animation keyframes
```

---

## Testing Requirements

### Unit Tests (Vitest)

| Test | Description |
|------|-------------|
| `useNetworkStatus` | Returns correct initial state, updates on `online`/`offline` events, tracks `since` timestamp |
| `useConnectionTransition` | Detects `wentOffline` on online→offline, `cameOnline` on offline→online, resets after trigger |
| `ConnectionBanner` | Renders online text when `isOnline=true`, offline text when `isOnline=false` |
| `ConnectionPill` | Renders "Online" in green when online, "Offline" in red when offline |
| `ToastProvider` | Queues and renders toasts, auto-dismisses after duration, supports manual dismiss |
| `SyncContext` reducer | Handles all action types correctly, pendingCount updates properly |

### Integration Tests (Vitest + RTL)

| Test | Description |
|------|-------------|
| Offline flow | Trigger `offline` event → banner shows offline → toast appears with correct message |
| Online flow | Trigger `online` event after offline → banner shows online → toast appears |
| App shell | Header contains ConnectionPill, banner renders below header, ToastProvider is active |

---

## Common Pitfalls to Avoid

1. **DO NOT** use `localStorage` for network state — it is ephemeral and per-device
2. **DO NOT** show the online banner all the time — the header pill is enough for online state; the banner should be subtle or only show on transition
3. **DO NOT** fire toasts on initial mount — only on actual transitions
4. **DO NOT** forget to handle browsers without Network Information API
5. **DO NOT** block the UI thread with sync operations on `online` event — sync is async
6. **DO NOT** use inline styles — always use CSS Modules
7. **DO NOT** install animation libraries — CSS keyframes are sufficient
8. **DO NOT** forget to clean up event listeners in `useNetworkStatus` and `useConnectionTransition`

---

## Design Tokens Reference

From `src/index.css` (already exists):

```css
--color-bg: #0b1120;
--color-surface: #151e2e;
--color-surface-elevated: #1e293b;
--color-primary: #f97316;
--color-text: #f1f5f9;
--color-text-muted: #94a3b8;
--color-success: #22c55e;
--color-warning: #eab308;
--color-danger: #ef4444;
--radius-sm: 0.5rem;
--radius-md: 0.75rem;
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
```

Use these tokens. Do NOT hardcode colors or values.

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 1.1** (Officer Login) | `App.tsx` structure established; auth state determines if shell is shown. This story refines the shell. |
| **Story 1.3** (App Shell) | Bottom nav will sit below toast area; ensure z-index and safe-area-inset-bottom coordination |
| **Story 8.1** (Offline Queue) | `SyncContext` pendingCount and queue storage will be fully implemented later. Use mock `pendingCount=0` for now. |
| **Story 8.2** (Sync Engine) | "Syncing pending transactions" toast message will actually trigger sync. For now, it's a placeholder. |

---

## Completion Checklist

- [ ] `useNetworkStatus` enhanced with `since` timestamp and proper typing
- [ ] `useConnectionTransition` detects transitions and resets correctly
- [ ] `ConnectionBanner` renders with correct text/icon for online and offline
- [ ] `ConnectionPill` renders in header with correct color and text
- [ ] `ToastProvider` manages toast queue with auto-dismiss
- [ ] `Toast` component animates in/out and respects `type` color accent
- [ ] `SyncContext` created with reducer and mock pending count
- [ ] `App.tsx` wires all providers and replaces inline banner
- [ ] Transition toasts appear on online→offline and offline→online
- [ ] No toasts on initial mount
- [ ] CSS animations use keyframes (no animation library)
- [ ] All styles use CSS Modules + design tokens
- [ ] Unit tests for hooks, components, and reducer
- [ ] No lint errors
- [ ] Build succeeds (`npm run build`)

---

## Open Questions

1. **Banner persistence:** Should the online banner always be visible, or only on transition? Recommendation: Show a very subtle online indicator (small green dot + text) persistently, but the full banner text is most useful when offline.
2. **Toast stacking:** If connection flaps rapidly, should toasts stack or replace? Recommendation: Replace the previous connection toast with the new one to avoid spam.
3. **Sync on reconnect:** Should the app automatically attempt sync when coming online? Recommendation: Yes, trigger a sync attempt and show "Syncing..." toast. Full sync logic is Story 8.2.

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
