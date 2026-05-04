# Deferred Work

## Deferred from: code review of 1-1-officer-login (2026-05-04)

- **Offline login (cached credentials) completely unimplemented** [src/features/auth/useLogin.ts, src/api/auth.ts] — deferred to Story 8.1; IndexedDB infrastructure not yet available. Story 8.1 will provide the caching layer needed for offline login fallback.
- **Hardcoded transaction data and dead navigation links in dashboard** [src/App.tsx:120-165] — pre-existing placeholder code not introduced by this story. Dashboard contains non-functional buttons and `<a href="#">` links that are accessibility anti-patterns.
- **apiClient lacks timeout/abort handling** [src/api/client.ts:13] — `fetch` call has no `AbortController` or timeout logic. Not required by MVP spec. If network is unresponsive, API calls hang indefinitely.
