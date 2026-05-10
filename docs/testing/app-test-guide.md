# PrimePOS App Test Guide

Last checked: 2026-05-10

## Local Setup

1. Open a terminal in `primepos-web`.
2. Install dependencies with `npm install` if they are not already installed.
3. Start the app with `npm run dev`.
4. Open the local Vite URL shown in the terminal (default `http://localhost:5173`).

Useful validation commands:

- `npm test` — run unit tests with Vitest
- `npm run lint` — lint with ESLint
- `npm run build` — type-check + production build
- `npm run preview` — preview production build (useful for testing the PWA update banner)

### PWA / Offline Support

The app uses `vite-plugin-pwa` with `registerType: 'autoUpdate'`. Key behaviors:

- **First visit**: The service worker (`/sw.js`) registers automatically and caches the app shell.
- **Update banner**: When a new version is deployed, an "Update available" banner appears below the header with a **Reload** button and a dismiss ✕. The banner is rendered at the app-shell level and is visible on all screens.
- **Offline fallback**: If the app shell cannot load while offline, a standalone offline page appears ("You are offline").
- **API caching**: API responses are cached with NetworkFirst strategy (24-hour expiration). Fonts are cached with CacheFirst (1-year expiration).
- **Testing the update banner**: Build with `npm run build && npm run preview`, then in Chrome DevTools → Application → Service Workers → click **Update**. The banner should appear on reload.

## Login

Use the current mock login from `src/api/auth.ts`.

| Field | Value |
|------|-------|
| Staff ID / Username | `YB101375` |
| Password | `password` |

Expected result:

- You land on the dashboard.
- The dashboard welcome area shows `Yahaya Ahmed`.
- The branch label shows `Ogba Branch`.

Known invalid cases:

- Any other password should fail with `Invalid credentials. Please try again.`
- Leaving either field empty should show `Required`.

## Implemented Flows In Scope

These flows are wired in the app today and are covered below:

- Login
- Connection Status & Offline Awareness
- App Shell Navigation
- Dashboard KPI Cards
- Quick Actions
- Recent Transactions List
- Cash In
- Cash Out
- Transact Menu
- Loan Repayment
- Loan Inquiry
- Account Balance
- New Savings Account
- New Account Deposit
- Account Statement
- Reports Dashboard
- Unposted Transactions

Also implemented but outside this guide's main checklist:

- Group Loan Repayment (wired in App.tsx but not accessible from current UI menus)
- Batch BBLS Deposit (accessible via Transact Menu, basic UI implemented but limited mock data)
- Card Transactions (accessible via Transact Menu, placeholder requiring POS terminal)
- Detailed Reports (all 5 sub-report screens are placeholders awaiting implementation)

## Quick Flow Checklist

Use this section for a fast smoke pass.

| Flow | Where to open it | Working value(s) | Expected result |
|------|------------------|------------------|-----------------|
| Login | Login screen | `YB101375` / `password` | Dashboard opens for Yahaya Ahmed |
| Connection Status | Dashboard header / banner | Observe Online/Offline pill and banner | Pill shows "Online", banner shows "Connected — All features available" |
| Bottom Nav | Bottom of screen (main tabs only) | Tap each tab | Home → Dashboard, Transact → Transact Menu, Services → Services Menu, Reports → Reports Dashboard, More → Placeholder |
| Back Navigation | Any inner screen header | Tap ← button | Returns to previous screen with pop animation |
| Dashboard KPIs | Dashboard (visible after login) | KPIs auto-load | Collections ₦248,500.00, Transactions 34, Pending Sync 0 |
| Quick Actions | Dashboard | Tap each quick action | Cash In → Cash In screen, Cash Out → Cash Out screen, Loan Repayment → Loan Repayment, New Account → New Account Deposit |
| Recent Transactions | Dashboard (scroll down) | Appears below Quick Actions | Shows 2 transactions: Adediran Blessing (Cash In, ₦5,000.00 POSTED), Adejumo Olusegun (Loan Repay, ₦12,500.00 POSTED) |
| Cash In | Dashboard `Cash In` quick action or `Transact Menu` | Account `1234567890`, Payee `Blessing Test`, Amount `1000` | Account card shows Adediran Blessing, success toast says `Transaction posted` |
| Cash Out | Dashboard `Cash Out` quick action or `Transact Menu` | Account `1234567890`, Payee `Blessing Test`, Amount `1000` | Account card shows usable balance `NGN 45,000.00`, success toast says `Transaction posted` |
| Transact Menu | Bottom Nav → Transact | Open menu, tap each item | CASH group: Cash In, Cash Out, New Account Deposit, Batch BBLS Deposit. CARD group: Card Transactions |
| Loan Repayment | Dashboard `Loan Repayment` quick action or `Services` | Loan `LN-10001`, Amount `< 33,750` | Loan card loads, success toast says `Repayment posted successfully` |
| Loan Inquiry | `Services` → `Loan Inquiry` | Loan `LN-10001` | Loan details card appears for Adediran Blessing |
| Account Balance | `Services` → `Account Balance` | Account `1234567890` | Account card appears for Adediran Blessing |
| New Savings Account | `Services` → `New Savings Account` | Use the 3-step sample below | Success toast shows `Account created successfully. Account Number: ...` |
| New Account Deposit | Dashboard `New Account` quick action or `Transact Menu` → `New Account Deposit` | Use the sample below | Success card appears with generated NUBAN |
| Account Statement | `Services` → `Account Statement` | Account `1234567890`, From `2026-05-01`, To `2026-05-06` | Statement table loads with 4 entries |
| Reports Dashboard | Bottom Nav → Reports | Open Reports tab | 2 KPI cards (Total Collections, Transactions Today) + 5 report type menu items |
| Unposted Transactions | KPI Pending Sync card (when count > 0) or via route | View list | Shows queued/offline transactions with POST ALL button |

## Detailed Flow Scenarios

### Connection Status & Offline Awareness

The app shows connectivity state in two places:
- **Header**: A ConnectionPill labeled `Online` (colored pill) or `Offline`.
- **Dashboard only**: A ConnectionBanner showing `Connected — All features available` (green) or `Offline — Limited features available` (yellow warning).

To test offline transitions (requires Chrome DevTools):
1. Open Chrome DevTools → Network tab → check **Offline**.
2. Observe the ConnectionPill change to `Offline`.
3. Navigate to Dashboard and observe the ConnectionBanner change to `Offline — Limited features available`.
4. A warning toast appears: `You are offline. Transactions will be saved locally.`
5. Uncheck **Offline** in DevTools.
6. The pill returns to `Online`, the banner returns to `Connected — All features available`.
7. A success toast appears: `Back online. Syncing pending transactions...`

Source: `src/hooks/useNetworkStatus.ts`, `src/hooks/useConnectionTransition.ts`, `src/components/ConnectionBanner/ConnectionBanner.tsx`, `src/components/ConnectionPill/ConnectionPill.tsx`

### App Shell Navigation

Bottom Navigation Bar (visible on main tab screens: Home, Transact, Services, Reports, More):

| Tab | Icon | Target Screen |
|-----|------|---------------|
| Home | 🏠 | Dashboard |
| Transact | ⚡ | Transact Menu |
| Services | ⊞ | Services Menu |
| Reports | 📊 | Reports Dashboard |
| More | ⋯ | More (Placeholder) |

Navigation behaviors:

- **Main tab navigation**: Tapping a bottom nav tab navigates with no transition animation (instant switch). History is cleared.
- **Inner screen navigation**: Navigating from a menu to a child screen (e.g. Transact Menu → Cash In) triggers a push animation (slide from right) and preserves back history.
- **Back button**: The ← button appears in the header on all inner (non-tab) screens. Tapping it pops to the previous screen with a slide-from-left animation.
- **Active tab indicator**: The active bottom nav tab shows a dot indicator and highlighted label.

Source: `src/types/navigation.ts`, `src/components/BottomNav/BottomNav.tsx`, `src/components/Header/Header.tsx`

### Dashboard KPI Cards

Visible on the Dashboard screen between the welcome hero and Quick Actions.

Three KPI cards:

| Card | Expected Value | Notes |
|------|---------------|-------|
| Collections | ₦248,500.00 | Formatted as naira, "today" subtitle |
| Transactions | 34 | Raw number, "today" subtitle |
| Pending Sync | 0 | When 0, shows "today" subtitle in success color. When > 0, card becomes clickable and subtitle shows in warning color. Clicking navigates to Unposted Transactions. |

The KPI cards reload when pull-to-refresh is triggered on the dashboard.

Source: `src/features/dashboard/KPICards.tsx`, `src/features/dashboard/useDashboardKPIs.ts`

### Quick Actions

Visible on the Dashboard screen below KPI cards.

Four quick action buttons:

| Action | Icon | Target Screen |
|--------|------|---------------|
| Cash In | ↓ | `cashIn` |
| Cash Out | ↑ | `cashOut` |
| Loan Repayment | 💰 | `loanRepayment` |
| New Account | ✨ | `newAccount` |

Each button shows a label, icon, and subtitle. Tapping navigates to the corresponding screen.

Source: `src/features/dashboard/QuickActions.tsx`

### Recent Transactions List

Visible on the Dashboard screen below Quick Actions.

The list renders in 4 possible states:

1. **Loading**: Shows "Loading..." with `aria-busy="true"` during data fetch.
2. **Populated**: Shows up to 5 transaction items sorted by date (newest first). Each item displays:
   - Avatar with customer initials
   - Customer name
   - Transaction type and time (e.g. "Cash In · 10:42")
   - Amount formatted as naira
   - Status badge (POSTED)
3. **Empty**: Shows "No transactions yet" when list is empty.
4. **Error**: Shows "Unable to load transactions" on query failure.

Current mock returns 2 transactions:

| Customer | Type | Amount | Status |
|----------|------|--------|--------|
| Adediran Blessing | Cash In | ₦5,000.00 | POSTED |
| Adejumo Olusegun | Loan Repay | ₦12,500.00 | POSTED |

The section header always reads "Recent Transactions".

Source: `src/features/dashboard/RecentTransactions.tsx`, `src/features/dashboard/useRecentTransactions.ts`

### Cash In

Navigation:

- Dashboard quick action: `Cash In`
- Or `Transact Menu` → `Cash In`

Successful test:

1. Search with account number `1234567890`.
2. Confirm the account card shows `Adediran Blessing`.
3. Enter payee name `Blessing Test`.
4. Enter amount `1000`.
5. Leave SMS off or turn it on.
6. Click `POST TRANSACTION`.

Expected result:

- Search succeeds because the current mock accepts any non-empty account number except `0000000000`.
- A success toast appears with `Transaction posted`.
- The form clears after success.

Useful invalid checks:

- Search with `0000000000` → field shows `Account not found`.
- Leave payee name empty → `Payee name is required`.
- Leave amount empty → `Amount is required`.
- Enter `0` or a negative-like invalid amount → `Amount must be greater than 0`.

### Cash Out

Navigation:

- Dashboard quick action: `Cash Out`
- Or `Transact Menu` → `Cash Out`

Successful test:

1. Search with account number `1234567890`.
2. Confirm the account card shows usable balance `NGN 45,000.00`.
3. Enter payee name `Blessing Test`.
4. Enter amount `1000`.
5. Click `POST TRANSACTION`.

Expected result:

- A success toast appears with `Transaction posted`.
- The form clears after success.

Useful invalid checks:

- Search with `0000000000` → `Account not found`.
- Enter amount `50000` after loading account `1234567890` → `Amount exceeds usable balance`.
- Leave payee name empty → `Payee name is required`.
- Enter a non-number amount → `Enter a valid amount`.

### Transact Menu

Navigation:

- Bottom Nav → `Transact`

Menu structure:

**CASH** group:
- Cash In (Receive payment) → `cashIn`
- Cash Out (Disburse cash) → `cashOut`
- New Account Deposit (Open & fund account) → `newAccount`
- Batch BBLS Deposit (Group deposit) → `batchDeposit`

**CARD** group:
- Card Transactions (POS operations) → `cardTransactions`

Search behavior:
- The search bar filters menu items by label or subtitle.
- If no items match, an empty state reads "No results found".
- Clearing the search restores the full menu.

Source: `src/features/transact-menu/TransactMenuScreen.tsx`

### Loan Repayment

Navigation:

- Dashboard quick action: `Loan Repayment`
- Or `Services` → `Loan Repayment`

Successful test:

1. Search with loan number `LN-10001`.
2. Confirm the loan card shows customer `Adediran Blessing`.
3. Enter repayment amount `1000`.
4. Click `POST REPAYMENT`.

Expected result:

- Search succeeds because the current mock accepts any non-empty loan number except `0000000000`.
- A success toast appears with `Repayment posted successfully`.
- The form clears after success.

Useful invalid checks:

- Search with `0000000000` → `Loan not found`.
- Enter amount `34000` → `Repayment exceeds outstanding balance`.
  The current mock maximum is `NGN 33,750.00` because `currentBalance` is `NGN 32,500.00` and `outstandingInterest` is `NGN 1,250.00`.
- Leave amount empty → `Amount is required`.
- Enter text instead of a number → `Enter a valid amount`.

### Loan Inquiry

Navigation:

- `Services` → `Loan Inquiry`

Successful test:

1. Search with loan number `LN-10001`.

Expected result:

- The loan details card appears.
- Customer name is `Adediran Blessing`.
- Product is `Micro Business Loan`.
- Status is `ACTIVE`.
- Current Balance shows `NGN 32,500.00`.
- Outstanding Interest shows `NGN 1,250.00`.

Useful invalid checks:

- Search with `0000000000` → `Loan not found`.

### Account Balance

Navigation:

- `Services` → `Account Balance`

Successful test:

1. Search with account number `1234567890`.

Expected result:

- The account card appears.
- Account name is `Adediran Blessing`.
- Book Balance shows `NGN 50,000.00`.
- Usable Balance shows `NGN 45,000.00`.

Useful invalid checks:

- Search with `0000000000` → `Account not found`.
- Reset should clear the current result and return the empty-state helper text.

### New Savings Account

Navigation:

- `Services` → `New Savings Account`

Use this working sample:

#### Step 1: Bio Info

| Field | Value |
|------|-------|
| Branch | `OGBA001` |
| First Name | `Blessing` |
| Other Name | `A.` |
| Surname | `Adediran` |
| Gender | `Female` |
| Date of Birth | `1995-05-10` |

#### Step 2: Contact

| Field | Value |
|------|-------|
| Home Address | `12 Market Road, Ogba` |
| Business Address | `45 Unity Plaza, Ikeja` |
| Phone Number | `08012345678` |
| Email | `blessing@example.com` |
| BVN | `12345678901` |
| Next of Kin Name | `Tunde Adediran` |
| Next of Kin Phone | `08087654321` |

#### Step 3: Account

| Field | Value |
|------|-------|
| Product Type | `Prime Savings` |
| Initial Deposit | `1000` |

Expected result:

- The wizard moves through three steps: `Bio Info`, `Contact`, and `Account`.
- Submitting shows a success toast with `Account created successfully. Account Number: ...`
- A success modal opens with the generated account number.

Useful invalid checks:

- Leave Branch empty → `Branch is required`.
- Leave First Name empty → `First name is required`.
- Leave Surname empty → `Surname is required`.
- Leave Gender empty → `Gender is required`.
- Use an under-18 date of birth → `Enter a valid date. Customer must be at least 18`.
- Use a BVN that is not exactly 11 digits → `BVN must be exactly 11 digits`.
- Leave Next of Kin Name empty → `Next of kin name is required`.
- Leave Product Type empty → `Product type is required`.
- Enter `0` for Initial Deposit → `Amount must be greater than 0`.

### New Account Deposit

Navigation:

- Dashboard quick action: `New Account`
- Or `Transact Menu` → `New Account Deposit`

Successful test:

1. Enter First Name `Blessing`.
2. Enter Surname `Adediran`.
3. Enter Other Name `A.` (optional).
4. Select Gender `Female`.
5. Enter BVN `12345678901`.
6. Select Savings Product `Prime Savings`.
7. Enter Initial Deposit `1000`.
8. Click `SUBMIT`.

Expected result:

- A success card appears showing `Account Created Successfully` with the account name `Adediran Blessing` and a generated NUBAN.
- A success toast appears with `Account created successfully. Account Number: ...`
- The form clears after success.

Useful invalid checks:

- Leave First Name empty → `First name is required`.
- Leave Surname empty → `Surname is required`.
- Leave Gender empty → `Gender is required`.
- Leave BVN empty → `BVN is required`.
- Enter a BVN that is not 11 digits → `BVN must be 11 digits`.
- Leave Product Type empty → `Product is required`.
- Leave Initial Deposit empty → `Initial deposit is required`.
- Enter `0` for Initial Deposit → `Amount must be greater than 0`.
- Enter non-numeric Initial Deposit → `Enter a valid amount`.

### Account Statement

Navigation:

- `Services` → `Account Statement`

Successful test:

1. Enter CASA Account Number `1234567890`.
2. Set From date to `2026-05-01`.
3. Set To date to `2026-05-06`.
4. Click `FETCH STATEMENT`.

Expected result:

- A statement table loads with 4 entries:
  - `2026-05-01`: Opening Balance, credit NGN 2,500.00, balance NGN 2,500.00
  - `2026-05-02`: Cash Withdrawal, debit NGN 500.00, balance NGN 2,000.00
  - `2026-05-04`: Transfer From Savings, credit NGN 750.00, balance NGN 2,750.00
  - `2026-05-05`: ATM Withdrawal, debit NGN 250.00, balance NGN 2,500.00

Useful invalid checks:

- Leave all fields empty and click Fetch → `Enter an account number and select both dates`.
- Search with account `0000000000` → `Account not found`.
- Set To date before From date → `To date must be after From date`.
- RESET should clear all inputs and return the empty-state helper text.

### Reports Dashboard

Navigation:

- Bottom Nav → `Reports`

Expected result:

- Two KPI summary cards appear:
  - **Total Collections**: Formatted naira value (same as dashboard Collections, e.g. ₦248,500.00), "today" subtitle.
  - **Transactions Today**: Raw count (same as dashboard Transactions, e.g. 34), "today" subtitle.
- Below the cards, 5 report type menu items:

| Report Type | Icon |
|-------------|------|
| Loans Booked | 📋 |
| E-Ledger | 📒 |
| LO PAR Report | 📊 |
| Transaction Reports | 🧾 |
| LO Performance | 🏆 |

Tapping any report type navigates to a placeholder screen showing the report name and "This report will be available in a future update."

Source: `src/features/reports/ReportsDashboardScreen.tsx`, `src/features/reports/useReportsSummary.ts`, `src/features/reports/types.ts`

### Unposted Transactions

Navigation:

- Dashboard → tap the `Pending Sync` KPI card (only when count > 0).
- Or direct route (accessible via `unpostedTransactions` screen in App.tsx).

Three possible states:

1. **Loading**: Shows "Loading..." during data fetch.
2. **Empty**: Shows "No unposted transactions" when queue is empty.
3. **Populated**: Shows a list of queued transactions. Each item shows:
   - Transaction type (e.g. "Cash In", "Loan Repayment")
   - Status badge: PENDING or FAILED
   - Customer name (extracted from payload)
   - Amount formatted as ₦
   - Time ago (e.g. "5m ago", "2h ago")
   - Error message if FAILED

The summary header shows the count of pending and failed items.

A **POST ALL TRANSACTIONS** button triggers processing. During processing, a progress bar appears. After completion, a result summary shows `X succeeded, Y failed`.

Supports pull-to-refresh to reload the queue.

Source: `src/features/unposted/UnpostedTransactionsScreen.tsx`, `src/services/syncEngine.ts`, `src/services/storage/transactions.ts`

### Batch BBLS Deposit

Navigation:

- `Transact Menu` → `Batch BBLS Deposit`

Successful test:

1. Enter Payee/Collector Name (e.g. `Blessing Test`).
2. Enter Branch ID (e.g. `OGBA001`).
3. Tap SELECT GROUP → choose `Women Empowerment Group` or `Youth Savings Circle`.
4. A table of 5 members appears with empty amount fields.
5. Enter amounts in naira for at least one member (e.g. `500.00` for Ada Okafor).
6. The summary row at the bottom updates: Customer count and Total in ₦.
7. Optionally check "Send SMS notification to customers".
8. Tap SUBMIT BATCH.

Expected result:

- An alert appears: `Batch submitted successfully! Reference: BATCH<timestamp>`
- The SUBMIT BATCH button is disabled until payee name, branch ID, group, and at least one non-zero amount are entered.
- The CHANGE GROUP button allows reselecting a different group (resets amounts).

Source: `src/features/batch-deposit/BatchDepositScreen.tsx`, `src/features/batch-deposit/useBatchDeposit.ts`

## Test Values Reference

### Login

| Item | Value | Source |
|------|-------|--------|
| Staff ID | `YB101375` | `src/api/auth.ts` |
| Password | `password` | `src/api/auth.ts` |
| Officer name | `Yahaya Ahmed` | `src/api/auth.ts` |
| Branch | `OGBA001` / `Ogba Branch` | `src/api/auth.ts` |

### Accounts

| Item | Value | Source |
|------|-------|--------|
| Safe working account number | `1234567890` | `src/api/accounts.ts` statement mock and current search behavior |
| Invalid account number | `0000000000` | `src/api/accounts.ts` |
| Returned account name | `Adediran Blessing` | `src/api/accounts.ts` |
| Returned NUBAN | `1234567890` | `src/api/accounts.ts` |
| Book Balance | `NGN 50,000.00` | `src/api/accounts.ts` |
| Usable Balance | `NGN 45,000.00` | `src/api/accounts.ts` |

### Loans

| Item | Value | Source |
|------|-------|--------|
| Safe working loan number | Any non-empty value except `0000000000` | `src/api/loans.ts` current mock behavior |
| Example loan number for manual test | `LN-10001` | Current mock behavior in `src/api/loans.ts` |
| Invalid loan number | `0000000000` | `src/api/loans.ts` |
| Returned customer name | `Adediran Blessing` | `src/api/loans.ts` |
| Product | `Micro Business Loan` | `src/api/loans.ts` |
| Current Balance | `NGN 32,500.00` | `src/api/loans.ts` |
| Outstanding Interest | `NGN 1,250.00` | `src/api/loans.ts` |
| Max repayment before validation fails | `NGN 33,750.00` | `src/api/loans.ts` plus `features/loan-repayment/useLoanRepayment.ts` |

### Savings Products

| Item | Value | Source |
|------|-------|--------|
| Product `1` | `Prime Savings` | `src/api/accounts.ts` |
| Product `2` | `Better Life Savings` | `src/api/accounts.ts` |
| Product `3` | `Target Saver` | `src/api/accounts.ts` |

### Dashboard KPIs

| Item | Value | Source |
|------|-------|--------|
| Collections | ₦248,500.00 | `src/features/dashboard/useDashboardKPIs.ts` |
| Transaction Count | 34 | `src/features/dashboard/useDashboardKPIs.ts` |
| Pending Sync Count | 0 (default) | `src/features/dashboard/useDashboardKPIs.ts` |

### Recent Transactions

| Item | Value | Source |
|------|-------|--------|
| Max items shown | 5 | `src/features/dashboard/RecentTransactions.tsx` |
| Mock item 1 | Adediran Blessing / Cash In / ₦5,000.00 / POSTED | `src/features/dashboard/useRecentTransactions.ts` |
| Mock item 2 | Adejumo Olusegun / Loan Repay / ₦12,500.00 / POSTED | `src/features/dashboard/useRecentTransactions.ts` |
| Loading text | "Loading..." | `src/features/dashboard/RecentTransactions.tsx` |
| Empty text | "No transactions yet" | `src/features/dashboard/RecentTransactions.tsx` |
| Error text | "Unable to load transactions" | `src/features/dashboard/RecentTransactions.tsx` |

### Batch Deposit Groups

| Item | Value | Source |
|------|-------|--------|
| Group 1 | Women Empowerment Group (GRP001, 15 members) | `src/features/batch-deposit/BatchDepositScreen.tsx` |
| Group 2 | Youth Savings Circle (GRP002, 12 members) | `src/features/batch-deposit/BatchDepositScreen.tsx` |
| Mock member 1 | Ada Okafor / 1000000001 | `src/features/batch-deposit/BatchDepositScreen.tsx` |
| Amount format | Input in naira, stored as kobo internally | `src/components/MemberAmountTable/MemberAmountTable.tsx` |

### Group Search Terms

These are not part of the main smoke checklist yet, but they are current searchable values in the repo:

- `Ago`
- `Oshodi`
- `Ikeja`
- `Yaba`
- `Surulere`
- `GR-001` through `GR-005`

Source: `src/api/groups.ts`

### Offline / Sync Architecture

| Item | Value | Source |
|------|-------|--------|
| IndexedDB library | `idb-keyval` v6.2.2 | `package.json` |
| DB name | `PrimePOSDB` | `src/services/storage/db.ts` |
| Transaction key prefix | `tx:` | `src/services/storage/transactions.ts` |
| Max retries (sync) | 3 | `src/services/syncEngine.ts` |
| Backoff base (ms) | 1000 | `src/services/syncEngine.ts` |
| Retry backoff formula | `2^retryCount * 1000ms` | `src/services/syncEngine.ts` |
| Query stale time | 5 minutes | `src/App.tsx` (QueryClient defaultOptions) |
| NetworkFirst cache TTL | 24 hours | `vite.config.ts` PWA workbox config |

## Known Gaps And Not-Yet-Ready Areas

These screens or routes exist as placeholders or are not part of the current implemented test guide:

- More (placeholder 🚧 screen)
- Settings
- My Profile
- Card Deposit
- Card Withdrawal
- Card Balance
- Card Statement
- Change Password
- Loans Booked Report (placeholder)
- E-Ledger Report (placeholder)
- LO PAR Report (placeholder)
- Transaction Reports (placeholder)
- LO Performance Report (placeholder)

Additional notes:

- **Card Transactions** is reachable via Transact Menu but shows a banner requiring POS terminal connection; all sub-options (Card Deposit, Card Withdrawal, Card Balance Check, Card Statement) trigger an alert for MVP.
- **Group Loan Repayment** is present in `App.tsx` but is not exposed from the current dashboard quick actions or services menu.
- **Offline queue (IndexedDB)**: Transactions can be queued to IndexedDB via `src/services/storage/transactions.ts` (addToQueue). The SyncEngine processes pending items with up to 3 retries using exponential backoff. Queue state is reflected in the Pending Sync KPI and Unposted Transactions screen. Manual testing requires Chrome DevTools offline simulation.
- **Offline data cache**: `useCachedQuery` hook in `src/hooks/useCachedQuery.ts` provides stale-while-revalidate offline fallback using IndexedDB-backed cache via `cacheStrategy.ts` and `backgroundSync.ts`. PWA-level caching uses Workbox NetworkFirst for API routes (24h TTL). Full end-to-end offline cache testing requires a production build and browser offline mode.
- PWA update banner testing requires a production build (`npm run preview`) — the SW lifecycle does not fully activate in dev mode with HMR.
- This guide intentionally focuses on flows that are both implemented and practically testable from the current UI.
