---
story_id: 1.2
story_key: 1-2-connection-status-offline-awareness
epic: 1
epic_title: Authentication & App Shell
title: Connection Status & Offline Awareness
status: done
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

The project `primepos-web/` currently has a **partial** network status implementation following Story 1.1 completion:

| File | Current State |
|------|---------------|
| `src/hooks/useNetworkStatus.ts` | Returns `{ isOnline, connectionType }` via `navigator.onLine` and `navigator.connection`. Already has `typeof navigator !== 'undefined'` SSR guard and `NetworkInformation` interface typing from Story 1.1 review patch. **Missing:** `since` timestamp, transition events. |
| `src/components/OfflineIndicator.tsx` | SW update banner only (listens to `sw-update` window event). **Do NOT repurpose** — architecture §7.2 reserves this name for global offline banner, but current implementation is strictly for PWA update prompts. |
| `src/App.tsx` | Has `AuthProvider` → `AppContent` structure. `DashboardScreen` renders inline `offline-banner` when `!isOnline`, a `connection-status` div in header (green/red pill), `OfflineIndicator` for SW updates, and placeholder bottom nav. **Must preserve** all existing Dashboard content while replacing banner/pill with new components. |
| `src/App.css` | Contains `.offline-banner`, `.connection-status.online/offline`, `.update-banner`, header, bottom-nav, and all Dashboard placeholder styles. Story 1.2 will **migrate** connection styles to CSS Modules and remove old banner styles. |
| `src/index.css` | Design tokens exist. **Missing:** toast animation keyframes, fade/slide utility keyframes. |
| `src/features/auth/LoginScreen.tsx` | Already has inline offline banner (`{!isOnline && <div className={styles.offlineBanner}>...}`). Do NOT modify — LoginScreen's banner is story-specific. |

**What does NOT exist yet:**
- Toast/notification system for transition messages
- Connection status banner component (dedicated, animated)
- `SyncContext` for tracking pending sync count (needed for "Syncing pending transactions" toast)
- Transition detection hook (`useConnectionTransition`)
- Timestamp tracking for "since when" display
- IndexedDB queue integration for offline queue awareness

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
| `src/services/storage/queue.ts` | Placeholder queue service returning `pendingCount=0`. Architecture names this area `transactions.ts` in §5.1, but `queue.ts` is used here as a lightweight placeholder until Epic 8. |

### Files to Update

| File | Change |
|------|--------|
| `src/hooks/useNetworkStatus.ts` | Add `since` timestamp (Date when state last changed), expose `wasOffline` helper, improve Network Information typing |
| `src/App.tsx` | Wire `SyncContext.Provider`, `ToastProvider`, replace inline offline banner with `<ConnectionBanner>`, add `<ConnectionPill>` to header |
| `src/App.css` | Remove old `.offline-banner` and `.connection-status` styles (moved to modules). Keep all Dashboard, header, bottom-nav, and update-banner styles untouched. |
| `src/index.css` | Add `fade-in`, `fade-out`, `slide-up` utility keyframes for banner and toast transitions. Place global animation utilities here; component-specific animations (e.g., toast slide) go in their respective CSS Modules. |

---

## Previous Story Intelligence (Story 1.1)

Story 1.1 established these patterns **you MUST follow**:

| Pattern | Location | Notes |
|---------|----------|-------|
| Test co-location | `ComponentName.test.tsx` beside component | Used for Button, Input, AuthContext, useLogin |
| Fake timers | `vi.useFakeTimers()` in tests | Essential for async state and auto-dismiss testing |
| Hook unmount safety | AbortController / cleanup pattern | Story 1.1 review patched `setTimeout` leaks in `useLogin` — apply same rigor to `useConnectionTransition` |
| Component accessibility | `aria-label`, `aria-pressed`, `role` | Button password toggle and error banners set the standard |
| CSS Module naming | `PascalCase` folder + `ComponentName.module.css` | Follow exactly for ConnectionBanner, ConnectionPill, Toast |

**Story 1.1 Review Findings Relevant to This Story:**
- `[Patch] navigator SSR crash risk` — `useNetworkStatus.ts` already has `typeof navigator !== 'undefined'` guard. Do NOT remove it.
- `[Patch] LoginScreen missing offline connection banner` — LoginScreen now has its own inline offline banner. Leave it untouched; this story builds the **global** banner/pill system for the app shell.
- `[Patch] App.tsx missing isLoading routing guard` — Already fixed. Preserve `AppContent` structure exactly.
- `[Defer] Offline login (cached credentials)` — Deferred to Epic 8. Do NOT implement credential caching here.

---

## Technical Requirements

### Architecture Compliance

1. **State Management:** Use React Context for sync state. Do NOT install Redux, Zustand, or Jotai.
2. **Storage:** `idb-keyval` is specified in Architecture §2.2 for IndexedDB access, but it is **NOT yet installed** (`package.json` lacks it). For this story, `queue.ts` is a mock placeholder returning `pendingCount=0` — no actual IndexedDB operations needed. **Do NOT install `idb-keyval` in this story**; defer to Epic 8 when real queue storage is implemented. Do NOT use localStorage.
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
- Compare previous `isOnline` value with current using `useRef` or `usePrevious` pattern
- `wentOffline` = previous true, current false
- `cameOnline` = previous false, current true
- Reset flags after toast is triggered (one-shot)
- **Critical:** Must clean up any timers/refs on unmount to prevent memory leaks (pattern established in Story 1.1 `useLogin` review patch)

### Sync Context Spec

**MUST align with Architecture §4.4** (source of truth for cross-story interfaces):

```typescript
interface SyncState {
  isSyncing: boolean
  lastSyncAt: Date | null
  pendingCount: number
  syncError: string | null
}

type SyncAction =
  | { type: 'START_SYNC' }
  | { type: 'SYNC_SUCCESS'; payload: number }  // items synced
  | { type: 'SYNC_ERROR'; payload: string }
  | { type: 'UPDATE_PENDING_COUNT'; payload: number }
```

**For this story:** `SyncContext` is a placeholder. `pendingCount` returns `0`, `isSyncing` is `false`, `lastSyncAt` is `null`, `syncError` is `null`. Full queue implementation and reducer logic come in Epic 8 (Offline Engine). The interface must match architecture exactly to prevent breaking changes in Stories 8.1–8.4.

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
- Text: `var(--color-success)`, "Connected — All features available"
- Font: 11px, 500 weight, centered
- Icon: small green dot (●) or Wi-Fi icon

**Visual (Offline):**
- Height: 24px
- Background: transparent
- Text: `var(--color-warning)`, "Offline — Limited features available"
- Font: 11px, 500 weight, centered
- Icon: warning triangle or crossed Wi-Fi

**Transition:**
- Fade in/out, 200ms ease
- Conditionally rendered based on `isOnline`
- Positioned directly below the header

**Accessibility (UX §6.3):**
- Add `role="status"` and `aria-live="polite"` so screen readers announce connection changes
- Do NOT use `aria-live="assertive"` — connection changes are informational, not urgent errors

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
- **z-index:** Must render above `.bottom-nav` but below any future modals. Use `z-index: 50` (nav should be `z-index: 40` or lower).

**Accessibility (UX §6.3):**
- Wrap toast container in `role="status"` with `aria-live="polite"`
- Each toast item should have `aria-atomic="true"` so screen readers read the full message

**Toast Messages:**
| Trigger | Message | Type |
|---------|---------|------|
| Online → Offline | "You are offline. Transactions will be saved locally." | `warning` |
| Offline → Online | "Back online. Syncing pending transactions..." | `success` |

**Reusability Note:** This Toast system is the app's **global notification pattern**. Future stories (Cash In, Loan Repayment, etc.) will use it for "Transaction posted", "Validation failed", etc. Design it as a generic reusable system, not connection-specific.

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
│  🏠 ⚡ ⊞ 📊 ⋯                  │  ← BottomNav (placeholder from Story 1.1)
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

**Provider Wiring in `App.tsx`:**
```typescript
function App() {
  return (
    <AuthProvider>
      <SyncProvider>        {/* NEW — wraps both auth states */}
        <ToastProvider>     {/* NEW — available everywhere */}
          <AppContent />
        </ToastProvider>
      </SyncProvider>
    </AuthProvider>
  )
}
```
- `SyncProvider` and `ToastProvider` must wrap `AppContent` so both LoginScreen and DashboardScreen can access them.
- Do NOT put providers inside `DashboardScreen` — they must be at the `App()` level.

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
| Accessibility | Banner has `role="status"`, toast container has `aria-live="polite"` |

**Test Patterns (from Story 1.1):**
- Co-locate tests: `ComponentName.test.tsx` next to `ComponentName.tsx`
- Use `vi.useFakeTimers()` for auto-dismiss and animation timing tests
- Use `@testing-library/react` `render`, `screen`, `fireEvent`
- Mock `window.addEventListener('online'/'offline')` for hook tests

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

## Open Questions — Resolved

1. **Banner persistence:** ✅ **RESOLVED** — UX §2.2 specifies the connection banner is **always visible** (24px height, fixed below status bar). Online state shows green "Connected — All features available"; offline shows yellow warning. Both persist.
2. **Toast stacking:** ✅ **RESOLVED** — Replace the previous connection toast with the new one. If a connection toast is already visible and the state flaps, dismiss the old toast and show the new one. Prevents spam.
3. **Sync on reconnect:** ✅ **RESOLVED** — Show "Back online. Syncing pending transactions..." toast as a placeholder message. Do NOT implement actual sync logic — that is Story 8.2. The toast message sets user expectation; the actual sync trigger comes later.

---

## Tasks/Subtasks

- [x] Task 1: Enhance `useNetworkStatus` hook with `since` timestamp and proper typing + tests
- [x] Task 2: Create `useConnectionTransition` hook for transition detection + tests
- [x] Task 3: Create `SyncContext` with reducer matching architecture interface + tests
- [x] Task 4: Create Toast system (`Toast.tsx`, `ToastProvider.tsx`, styles) + tests
- [x] Task 5: Create `ConnectionBanner` component with fade transitions + tests
- [x] Task 6: Create `ConnectionPill` component for header badge + tests
- [x] Task 7: Create `services/storage/queue.ts` placeholder
- [x] Task 8: Update `App.tsx` to wire providers and replace inline banner/pill
- [x] Task 9: Update `App.css` (remove migrated styles) and `index.css` (add keyframes)
- [x] Task 10: Run full test suite, lint, and build — verify zero regressions

---

## Dev Agent Record

### Implementation Plan
- Followed red-green-refactor cycle: wrote tests first, then implementation
- Used React Context + useReducer for SyncContext (per architecture requirements)
- Used CSS Modules with design tokens from `index.css` (no Tailwind/Styled Components)
- Toast system built as generic reusable notification pattern for all future stories
- Connection transition toasts implemented via `useEffect` in DashboardScreen

### Debug Log
- Fixed ESLint `react-hooks/refs` error in `useConnectionTransition` by refactoring from ref-based render-phase detection to state + effect pattern
- Fixed ESLint `react-refresh/only-export-components` by separating `useToast` hook and `ToastContext` into dedicated files
- Fixed ESLint `react-hooks/exhaustive-deps` in ToastProvider by capturing ref value in local variable inside effect
- Fixed ESLint `react-hooks/set-state-in-effect` by deferring reset state updates with `setTimeout(..., 0)`
- Fixed TypeScript build error in `App.test.tsx` by providing complete `Officer` mock object
- Added `dev-dist` to ESLint `globalIgnores` to suppress pre-existing generated file errors
- **BUG FIX (runtime):** Removed `startLogin()` call from `useLogin.ts` — `LOGIN_START` set global `isLoading=true`, which caused `AppContent` to unmount `LoginScreen` and show `LoadingSpinner`. When the mock API resolved, `isMountedRef.current` was `false` (due to unmount), so `login()` was never called, leaving the app stuck on the spinner forever.

### Completion Notes
- All acceptance criteria satisfied:
  ✅ Online status display (green banner + Online pill)
  ✅ Offline status display (yellow banner + red Offline pill)
  ✅ Status transitions within seconds with toast notifications
  ✅ Network type detection preserved via existing `useNetworkStatus`
- 56 tests passing (12 test files), zero regressions in existing Story 1.1 tests
- Build successful, zero lint errors in src/
- No new dependencies installed (per architecture requirements)

---

## File List

### Created
- `src/hooks/useNetworkStatus.test.ts`
- `src/hooks/useConnectionTransition.ts`
- `src/hooks/useConnectionTransition.test.tsx`
- `src/contexts/syncReducer.ts`
- `src/contexts/syncContextValue.ts`
- `src/contexts/SyncContext.tsx`
- `src/contexts/useSync.ts`
- `src/contexts/SyncContext.test.tsx`
- `src/components/ConnectionBanner/ConnectionBanner.tsx`
- `src/components/ConnectionBanner/ConnectionBanner.module.css`
- `src/components/ConnectionBanner/ConnectionBanner.test.tsx`
- `src/components/ConnectionPill/ConnectionPill.tsx`
- `src/components/ConnectionPill/ConnectionPill.module.css`
- `src/components/ConnectionPill/ConnectionPill.test.tsx`
- `src/components/Toast/ToastProvider.tsx`
- `src/components/Toast/Toast.module.css`
- `src/components/Toast/useToast.ts`
- `src/components/Toast/toastContext.ts`
- `src/components/Toast/toastTypes.ts`
- `src/components/Toast/Toast.test.tsx`
- `src/services/storage/queue.ts`
- `src/App.test.tsx`

### Modified
- `src/hooks/useNetworkStatus.ts` — added `since` timestamp
- `src/App.tsx` — wired SyncProvider, ToastProvider, ConnectionBanner, ConnectionPill; added transition toast effects
- `src/App.css` — removed `.offline-banner` and `.connection-status` styles
- `src/index.css` — added `fadeIn`, `fadeOut`, `slideUp` keyframes
- `eslint.config.js` — added `dev-dist` to ignore patterns
- `src/features/auth/useLogin.ts` — removed `startLogin()` call to fix infinite loading bug

### Deleted
- (none)

---

## Change Log

- Implemented Story 1.2: Connection Status & Offline Awareness (2026-05-05)
- Enhanced `useNetworkStatus` with `since` timestamp
- Created `useConnectionTransition` for online/offline transition detection
- Created `SyncContext` placeholder aligned with Architecture §4.4
- Created reusable Toast notification system
- Created `ConnectionBanner` and `ConnectionPill` components
- Updated app shell with provider wiring and transition toasts
- 56 tests passing, zero lint errors, build successful

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*

### Review Findings

**Patch findings (actionable now):**

- [x] [Review][Patch] Concurrent login submissions not guarded against rapid-fire calls [src/features/auth/useLogin.ts] — `handleSubmit` should check `if (isSubmitting) return` before starting the async login call
- [x] [Review][Patch] ToastProvider uses mountedRef anti-pattern vulnerable to StrictMode [src/components/Toast/ToastProvider.tsx] — Same StrictMode bug pattern that broke `useLogin.ts`: cleanup sets `mountedRef.current = false`, but remount doesn't reset it. In React 19, simply remove the `mountedRef` guard.
- [x] [Review][Patch] ConnectionBanner tests contain duplicate assertions [src/components/ConnectionBanner/ConnectionBanner.test.tsx] — Both `renders online state` and `renders offline state` tests repeat the same `expect(...).toBeInTheDocument()` assertion twice

**Deferred findings (pre-existing or out of scope):**

- [x] [Review][Defer] Hardcoded mock credentials shipped in source [src/api/auth.ts] — pre-existing from Story 1.1, deferred to future epic
- [x] [Review][Defer] Button loses accessible name and purpose while loading [src/components/Button/Button.tsx] — pre-existing from Story 1.1
- [x] [Review][Defer] Fetch requests have no timeout or abort signal [src/api/client.ts] — pre-existing from Story 1.1
- [x] [Review][Defer] Duplicate and invalid DOM IDs generated from label text [src/components/Input/Input.tsx] — pre-existing from Story 1.1
- [x] [Review][Defer] Custom `Headers` object silently discarded in apiClient [src/api/client.ts] — pre-existing from Story 1.1
- [x] [Review][Defer] Unsafe type assertion on HTTP 204 No Content [src/api/client.ts] — pre-existing from Story 1.1
- [x] [Review][Defer] Unhandled promise rejection in LoginScreen form handler [src/features/auth/LoginScreen.tsx] — pre-existing from Story 1.1
- [x] [Review][Defer] No Error Boundary at application root [src/App.tsx] — pre-existing from Story 1.1
- [x] [Review][Defer] LOGIN_START action exists in reducer but is never dispatched [src/contexts/authReducer.ts] — pre-existing dead code; intentionally removed from `useLogin.ts` as bug fix
- [x] [Review][Defer] Navigation anchors use `href="#"` causing scroll jump and history noise [src/App.tsx] — pre-existing placeholder bottom nav from Story 1.1
- [x] [Review][Defer] Error response bodies parsed as raw text instead of structured JSON [src/api/client.ts] — pre-existing from Story 1.1

**Dismissed findings (noise / false positive):**

- setTimeout leak and state update on unmounted LoginScreen — false positive; `timeoutRef` and cleanup effect exist
- SSR / Node crash from `navigator.onLine` accessed during render — false positive; `typeof navigator !== 'undefined'` guard exists
- Toast ID generation uses `Math.random()` — acceptable collision risk for toast system
- Redundant `fadeIn` keyframe in `ConnectionBanner.module.css` — harmless; CSS Modules scope keyframes locally
- `useConnectionTransition` causes extra re-renders per transition — negligible performance impact
- `useNetworkStatus` uses both `useRef` and `useState` for `since` — valid pattern to prevent duplicate updates
