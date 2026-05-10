# Stories Without Test Coverage

_Last updated: 2026-05-10_

This document lists all stories marked `done` in sprint-status.yaml that do **not** have explicit test procedures documented in `docs/testing/app-test-guide.md`.

---

## Legend

- ✅ Covered — story has a dedicated section in `app-test-guide.md`
- ❌ Not covered — story exists but no test documentation is present (this list)

---

## ❌ Not Covered Stories (14)

### Epic 1: Foundation

#### 1-2 — Connection Status & Offline Awareness
**File:** `_bmad-output/implementation-artifacts/1-2-connection-status-offline-awareness.md`  
**Status:** done  
**Gap notes:** Offline indicator behavior is mentioned in the PWA section of the test guide, but there is no dedicated test procedure for:

- Connection status banner appearance/ disappearance
- Offline → online transition handling
- Offline state persistence across page reloads

#### 1-3 — App Shell Navigation
**File:** `_bmad-output/implementation-artifacts/1-3-app-shell-navigation.md`  
**Status:** done  
**Gap notes:** Navigation drawer and bottom navigation bars are used throughout, but the guide does not include a focused test for:

- Menu item validation for every route
- Navigation state preservation across tabs
- Back-button behavior in nested screens
- Accessibility labels / screen-reader labels if any

---

### Epic 2: Dashboard

#### 2-1 — Dashboard KPI Cards
**File:** `_bmad-output/implementation-artifacts/2-1-dashboard-kpi-cards.md`  
**Status:** done  
**Gap notes:** The dashboard loads but individual KPI cards are not validated:

- Initial state (loading → populated)
- All 4 KPIs visible (Cash In, Cash Out, New Account, Loan Repayment)
- Value formatting (currency, zero vs non-zero)
- KPI icon presence

#### 2-2 — Quick Actions
**File:** `_bmad-output/implementation-artifacts/2-2-quick-actions.md`  
**Status:** done  
**Gap notes:** Quick actions are used as entry points in smoke tests, but not validated as a flow:

- All quick action buttons present and tappable
- Disabled state handling for offline/unauthorized scenarios
- Confirmation / drill-down correctness (e.g. Cash In opens the correct screen)

#### 2-3 — Recent Transactions List
**File:** `_bmad-output/implementation-artifacts/2-3-recent-transactions-list.md`  
**Status:** done  
**Gap notes:** The dashboard transaction list is not tested explicitly:

- Initial data fetch renders 1–3 items
- Transaction line item fields (type, amount, date, status)
- Empty-state message when no transactions exist
- Pull-to-refresh behavior if implemented

---

### Epic 3: Cash Transactions

#### 3-4 — Cash Transactions Menu
**File:** `_bmad-output/implementation-artifacts/3-4-cash-transactions-menu.md`  
**Status:** done  
**Gap notes:** The `Transact Menu` screen is used as an alternative path in tested flows, but the menu itself is not the subject of a test case:

- All menu options present (Cash In, Cash Out, New Account Deposit, …)
- Navigation to each child screen works
- Menu disabled/blocked while a transaction is in progress (if applicable)

---

### Epic 6: Batch & Card

#### 6-1 — Batch BBLS Deposit
**File:** `_bmad-output/implementation-artifacts/6-1-batch-bbls-deposit.md`  
**Status:** done  
**Gap notes:** Marked "coming soon" in Known Gaps. Route is present in `App.tsx` but needs a full test suite:

- File upload / batch entry workflow
- Preview table validation
- Submit confirmation and result summary
- Error handling for malformed rows

#### 6-2 — Card Transactions
**File:** `_bmad-output/implementation-artifacts/6-2-card-transactions.md`  
**Status:** done  
**Gap notes:** Marked "coming soon" in Known Gaps. No test coverage:

- Card search / deduction flow
- Settlement / reversal options
- Card balance display and refresh

---

### Epic 7: Reports

#### 7-1 — Reports Dashboard
**File:** `_bmad-output/implementation-artifacts/7-1-reports-dashboard.md`  
**Status:** done  
**Gap notes:** Marked "coming soon" in Known Gaps. Not exercised:

- Report type picker (Daily, MTD, Custom)
- Date range selection
- Export options (PDF / Excel)
- Empty-state vs populated reports

#### 7-2 — Detailed Reports Placeholder
**File:** `_bmad-output/implementation-artifacts/7-2-detailed-reports.md`  
**Status:** done  
**Gap notes:** Marked "coming soon" in Known Gaps. Placeholder screen awaiting implementation; no test.

---

### Epic 8: Offline & Storage

#### 8-1 — IndexedDB / Local Storage
**File:** `_bmad-output/implementation-artifacts/8-1-indexeddb-local-storage.md`  
**Status:** done  
**Gap notes:** PWA caching is documented, but IndexedDB data persistence is not explicitly validated:

- Read/write lifecycle for a local entity
- Quota-exceeded handling
- Data survival across browser restart
- Migration / upgrade logic

#### 8-2 — Transaction Queue Manager
**File:** `_bmad-output/implementation-artifacts/8-2-transaction-queue-manager.md`  
**Status:** done  
**Gap notes:** Offline queue behavior not covered:

- Queue enqueue when offline
- Dequeue / sync when back online
- Duplicate prevention
- Retry logic and max attempts

#### 8-3 — Offline Data Cache
**File:** `_bmad-output/implementation-artifacts/8-3-offline-data-cache.md`  
**Status:** done  
**Gap notes:** API caching is described, but no end-to-end test:

- Offline: cached data still renders
- TTL expiry handling (24-hour NetworkFirst strategy)
- Manual cache invalidation (if implemented)
- Stale-while-revalidate fallback

---

## Coverage Totals

| Epic | Done stories | Covered in guide | Not covered |
|------|--------------|-----------------|-------------|
| 1 | 3 | 1 | 2 |
| 2 | 3 | 0 | 3 |
| 3 | 4 | 3 | 1 |
| 4 | 3 | 2 | 0 |
| 5 | 4 | 3 | 0 |
| 6 | 2 | 0 | 2 |
| 7 | 2 | 0 | 2 |
| 8 | 4 | 1 | 3 |
| **Total** | **25** | **11** | **14** |

---

## Next Steps

1. Prioritise the not-covered stories that are actually implementable today (e.g. 1-2, 1-3, 2-1/2-2/2-3, 3-4) and add focused test procedures to `docs/testing/app-test-guide.md`.
2. For "coming soon" epics (6–7), keep the Known Gaps section up-to-date until implementation begins.
3. Re-run this cross-check after each sprint to keep the guide and sprint status aligned.
