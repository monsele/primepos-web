# Deferred Work

## Deferred from: code review of 1-1-officer-login (2026-05-04)

- **Offline login (cached credentials) completely unimplemented** [src/features/auth/useLogin.ts, src/api/auth.ts] — deferred to Story 8.1; IndexedDB infrastructure not yet available. Story 8.1 will provide the caching layer needed for offline login fallback.
- **Hardcoded transaction data and dead navigation links in dashboard** [src/App.tsx:120-165] — pre-existing placeholder code not introduced by this story. Dashboard contains non-functional buttons and `<a href="#">` links that are accessibility anti-patterns.
- **apiClient lacks timeout/abort handling** [src/api/client.ts:13] — `fetch` call has no `AbortController` or timeout logic. Not required by MVP spec. If network is unresponsive, API calls hang indefinitely.

## Deferred from: code review of 1-2-connection-status-offline-awareness (2026-05-05)

- **Hardcoded mock credentials shipped in source** [src/api/auth.ts] — pre-existing mock from Story 1.1, will be replaced with real API in future epic
- **Button loses accessible name and purpose while loading** [src/components/Button/Button.tsx] — pre-existing from Story 1.1
- **Fetch requests have no timeout or abort signal** [src/api/client.ts] — pre-existing from Story 1.1
- **Duplicate and invalid DOM IDs generated from label text** [src/components/Input/Input.tsx] — pre-existing from Story 1.1
- **Custom `Headers` object silently discarded in apiClient** [src/api/client.ts] — pre-existing from Story 1.1
- **Unsafe type assertion on HTTP 204 No Content** [src/api/client.ts] — pre-existing from Story 1.1
- **Unhandled promise rejection in LoginScreen form handler** [src/features/auth/LoginScreen.tsx] — pre-existing from Story 1.1
- **No Error Boundary at application root** [src/App.tsx] — pre-existing from Story 1.1
- **LOGIN_START action exists in reducer but is never dispatched** [src/contexts/authReducer.ts] — pre-existing dead code; `LOGIN_START` was intentionally removed from `useLogin.ts` as a bug fix
- **Navigation anchors use `href="#"` causing scroll jump and history noise** [src/App.tsx] — pre-existing placeholder bottom nav from Story 1.1
- **Error response bodies parsed as raw text instead of structured JSON** [src/api/client.ts] — pre-existing from Story 1.1

## Deferred from: code review of 2-3-recent-transactions-list (2026-05-06)

- **React Query gcTime not configured** [useRecentTransactions.ts] — Pre-existing pattern across codebase (useDashboardKPIs also lacks it). Deferred until team decides on global caching strategy.
- **Mock API omits date=today parameter** [useRecentTransactions.ts] — Temporary stub for MVP. Real API integration will add the date filter and limit params.

## Deferred from: code review of 3-2-cash-out-withdrawal (2026-05-06)

- **Account validation error swallowed by UI** [CashOutScreen.tsx] — Button is disabled when no account (same as Cash In pattern). Pre-existing pattern from Story 3.1.
- **Hardcoded error message masks search failures** [CashOutScreen.tsx] — UI always renders "Account not found" regardless of actual error. Pre-existing Cash In pattern from Story 3.1.
- **Stale account card and form data persist across searches** [CashOutScreen.tsx] — No reset on search input change. Pre-existing Cash In pattern from Story 3.1.
- **Empty officerId silently accepted** [useCashOut.ts] — `user?.staffId || ''` falls back to empty string. Pre-existing Cash In pattern from Story 3.1.
- **No keyboard accessibility for search** [CashOutScreen.tsx] — No Enter key handler on account input. Pre-existing Cash In pattern from Story 3.1.
