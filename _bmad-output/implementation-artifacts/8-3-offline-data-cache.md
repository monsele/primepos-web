---
story_id: 8.3
story_key: 8-3-offline-data-cache
epic: 8
epic_title: Offline-First Infrastructure
title: Offline Data Cache
status: ready-for-dev
source_files:
  - prd.md §4.9
  - architecture.md §5.4
  - ux-design-specification.md §2.1
  - epics.md §Story 8.3
created: 2026-05-02
dependencies:
  - 8-1-indexeddb-local-storage
---

# Story 8.3: Offline Data Cache

## User Story
As a bank officer, I want customer accounts, loans, and group data cached locally so that I can perform lookups and inquiries while offline.

## Business Context
Inquiry screens (Account Balance, Loan Inquiry) must work offline. When an officer searches for data while online, the result should be cached. Later, when offline, the same search returns the cached result with a subtle "Cached data" indicator. A daily background sync refreshes the officer's portfolio data.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Cache on search
  Given I search for an account while online
  Then the account details are cached in IndexedDB
  And I can retrieve them while offline

Scenario: Daily sync
  Given the app is online
  When a daily background sync runs
  Then loan portfolio data is refreshed
  And group records are refreshed
  And Better Life records are refreshed

Scenario: Offline inquiry
  Given I am offline
  When I search for a previously cached account
  Then the cached details are displayed
  And a subtle indicator shows "Cached data"
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/services/storage/accounts.ts` | Account CRUD |
| `src/services/storage/loans.ts` | Loan CRUD |
| `src/services/storage/groups.ts` | Group CRUD |
| `src/services/storage/syncMetadata.ts` | Sync timestamps |

**What does NOT exist yet:**
- Cache-on-search logic in API hooks
- Background sync function
- "Cached data" indicator in inquiry screens
- Portfolio data fetch API

### Files to Create

| File | Purpose |
|------|---------|
| `src/services/cacheStrategy.ts` | Cache decision logic: when to cache, when to use cache |
| `src/services/backgroundSync.ts` | Daily sync orchestrator: fetch portfolio, update cache |
| `src/hooks/useCachedQuery.ts` | Wrapper around TanStack Query that reads from cache when offline |

### Files to Update

| File | Change |
|------|--------|
| `src/features/cash-in/useAccountSearch.ts` | Cache account result on success |
| `src/features/loan-repayment/useLoanSearch.ts` | Cache loan result on success |
| `src/features/account-balance/AccountBalanceScreen.tsx` | Show "Cached data" indicator |
| `src/features/loan-inquiry/LoanInquiryScreen.tsx` | Show "Cached data" indicator |

---

## Technical Requirements

### Cache Strategy

```typescript
// cacheStrategy.ts
export async function cacheAccount(account: Account): Promise<void> {
  await setAccount(account.accountNumber, account)
}

export async function getCachedAccount(number: string): Promise<Account | undefined> {
  return getAccount(number)
}

export async function cacheLoan(loan: Loan): Promise<void> {
  await setLoan(loan.loanNumber, loan)
}

export async function getCachedLoan(number: string): Promise<Loan | undefined> {
  return getLoan(number)
}
```

### useCachedQuery Hook

```typescript
function useCachedQuery<T>(
  queryKey: string[],
  fetchFn: () => Promise<T>,
  cacheKey: string,
  cacheFn: (data: T) => Promise<void>,
  getCachedFn: () => Promise<T | undefined>
) {
  const { isOnline } = useNetworkStatus()
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      if (isOnline) {
        const data = await fetchFn()
        await cacheFn(data)
        return data
      }
      const cached = await getCachedFn()
      if (cached) return cached
      throw new Error('No cached data available')
    },
    enabled: isOnline || true, // Always try; offline falls back to cache
  })
}
```

### Background Sync

```typescript
// backgroundSync.ts
export async function syncOfflineData(officerId: string): Promise<void> {
  // Fetch officer's portfolio
  const [accounts, loans, groups] = await Promise.all([
    fetchPortfolioAccounts(officerId),
    fetchPortfolioLoans(officerId),
    fetchPortfolioGroups(officerId),
  ])
  
  // Cache all
  await Promise.all(accounts.map(a => cacheAccount(a)))
  await Promise.all(loans.map(l => cacheLoan(l)))
  await Promise.all(groups.map(g => cacheGroup(g)))
  
  // Update metadata
  await setSyncMetadata({ lastSyncAccounts: new Date().toISOString(), ... })
}
```

### Cached Data Indicator

When data comes from cache (detected by offline status + successful return):
- Show small text: "Cached data" in `--color-text-muted`
- Position: below the result card

---

## File Structure Requirements

```
src/
  services/
    cacheStrategy.ts       ← NEW
    backgroundSync.ts      ← NEW
  hooks/
    useCachedQuery.ts      ← NEW
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `cacheStrategy` | Caches and retrieves account/loan data |
| `useCachedQuery` | Online: fetches and caches; Offline: returns cached |
| `backgroundSync` | Fetches portfolio and updates all stores |

---

## Common Pitfalls to Avoid

1. **DO NOT** cache sensitive data without encryption consideration (MVP: accept risk, document for future)
2. **DO NOT** forget to handle cache misses gracefully — show "No cached data" message
3. **DO NOT** cache everything — only cache data the officer has explicitly searched for + portfolio data
4. **DO NOT** forget to update sync metadata timestamps

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 8.1** (IndexedDB) | All caching uses storage layer |
| **Story 5.2** (Balance Inquiry) | Uses cached account data |
| **Story 4.3** (Loan Inquiry) | Uses cached loan data |
| **Story 9.1** (Menu) | "Sync Data" button triggers backgroundSync |


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

- [ ] `cacheStrategy` with cache/get functions for accounts, loans, groups
- [ ] `useCachedQuery` hook for offline fallback
- [ ] API hooks updated to cache on success
- [ ] `backgroundSync` fetches and caches portfolio data
- [ ] "Cached data" indicator on inquiry screens
- [ ] Sync metadata timestamps updated
- [ ] Unit tests
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
