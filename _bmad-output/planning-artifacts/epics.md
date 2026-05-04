---
project: PrimePOS
document: Epics and User Stories
version: 1.0.0
date: 2026-05-02
author: Product Team
status: Draft
related:
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# PrimePOS — Epics and User Stories

## Epic Overview

| # | Epic | Stories | Priority |
|---|------|---------|----------|
| 1 | Authentication & App Shell | 3 | Critical |
| 2 | Dashboard & Navigation | 3 | Critical |
| 3 | Cash Transactions | 4 | Critical |
| 4 | Loan Management | 3 | Critical |
| 5 | Account Services | 3 | Critical |
| 6 | Batch & Card Operations | 2 | High |
| 7 | Reports & Analytics | 2 | Medium |
| 8 | Offline-First Infrastructure | 4 | Critical |
| 9 | Menu, Profile & Settings | 3 | Medium |

**Total: 27 stories**

---

## Epic 1: Authentication & App Shell

**Objective:** Enable secure officer authentication and establish the app shell with global navigation, connection status, and offline awareness.

**Business Value:** Without authentication, no banking operations can occur. The app shell sets the foundation for all user interactions.

---

### Story 1.1: Officer Login

**User Story:**
As a bank officer, I want to log in with my Staff ID and password so that I can access the teller platform securely.

**Acceptance Criteria:**

```gherkin
Scenario: Successful login
  Given I am on the Login screen
  When I enter a valid Staff ID
  And I enter the correct password
  And I tap the "Sign In" button
  Then I am navigated to the Dashboard
  And my officer profile is loaded
  And the connection status shows "Connected"

Scenario: Password visibility toggle
  Given I am on the Login screen
  When I enter text in the password field
  And I tap the eye icon
  Then the password is displayed in plain text
  And the icon changes to indicate visibility

Scenario: Invalid credentials
  Given I am on the Login screen
  When I enter an invalid Staff ID or password
  And I tap the "Sign In" button
  Then I see an error message "Invalid credentials. Please try again."
  And the login form shakes briefly
  And I remain on the Login screen

Scenario: Offline login (cached credentials)
  Given I am on the Login screen
  And the device has no internet connection
  When I enter valid cached credentials
  And I tap the "Sign In" button
  Then I am logged in using locally cached officer data
  And the connection status shows "Offline"
  And I can access offline-capable features

Scenario: Form validation
  Given I am on the Login screen
  When I tap "Sign In" without entering any fields
  Then the Staff ID field shows "Required" error
  And the password field shows "Required" error
  And the Sign In button remains disabled
```

**Technical Notes:**
- Use `AuthContext` with React Context + useReducer
- Store access token in memory only (never localStorage)
- POST `/api/auth/login` returns `{ accessToken, refreshToken, user }`
- Validate both fields before enabling submit button
- Source: PRD §4.1, UX §3.1

---

### Story 1.2: Connection Status & Offline Awareness

**User Story:**
As a bank officer, I want to see my network connection status at all times so that I know whether my transactions will post immediately or be queued.

**Acceptance Criteria:**

```gherkin
Scenario: Online status display
  Given the app is open
  When the device has an active internet connection
  Then a green banner shows "Connected - All features available"
  And the header shows an "Online" pill badge

Scenario: Offline status display
  Given the app is open
  When the device loses internet connection
  Then a yellow banner shows "Offline - Limited features available"
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

**Technical Notes:**
- Use `useNetworkStatus` hook with `navigator.onLine` and Network Information API
- Listen to `online`/`offline` window events
- `connectionType` tracks effective connection type (4g, 3g, etc.)
- Source: PRD §4.9, UX §2.2, Architecture §5.1

---

### Story 1.3: App Shell & Navigation

**User Story:**
As a bank officer, I want a consistent app shell with bottom navigation so that I can quickly access any feature from anywhere in the app.

**Acceptance Criteria:**

```gherkin
Scenario: Bottom navigation visibility
  Given I am logged in
  Then the bottom navigation is visible on all main tabs
  And it has 5 items: Home, Transact, Services, Reports, More

Scenario: Tab switching
  Given I am on the Home tab
  When I tap "Transact"
  Then the Transact screen appears with a fade transition
  And the "Transact" tab is highlighted in orange
  And the other tabs are muted

Scenario: Active tab indicator
  Given I am on any tab
  Then the active tab shows an orange icon and label
  And a small orange dot appears below the label

Scenario: Safe area handling
  Given I am using a phone with a notch or home indicator
  Then the header respects safe-area-inset-top
  And the bottom nav respects safe-area-inset-bottom
  And no content is obscured

Scenario: Inner screen navigation
  Given I am on the Dashboard
  When I tap "Cash In"
  Then the Cash In screen pushes in from the right
  And a back arrow (←) appears in the header
  And the bottom nav is hidden
  When I tap the back arrow
  Then I return to the Dashboard with a pop transition
```

**Technical Notes:**
- Use conditional rendering or lightweight routing (no heavy router needed for 14 screens)
- App state tracks `currentScreen` and `screenHistory`
- Bottom nav hidden on inner screens
- CSS `env(safe-area-inset-*)` for notch support
- Source: UX §2.3, §2.4, §3.2

---

## Epic 2: Dashboard & Navigation

**Objective:** Provide officers with an at-a-glance view of their daily performance and one-tap access to critical operations.

**Business Value:** Dashboard is the primary landing page; it drives daily productivity by surfacing KPIs and quick actions.

---

### Story 2.1: Dashboard KPI Cards

**User Story:**
As a bank officer, I want to see my daily collection totals, transaction count, and pending sync count so that I can track my performance in real time.

**Acceptance Criteria:**

```gherkin
Scenario: KPI display
  Given I am on the Dashboard
  Then I see 3 KPI cards:
    | Label        | Example Value | Subtitle |
    | Collections  | ₦248,500      | today    |
    | Transactions | 34            | today    |
    | Pending Sync | 0             | today    |

Scenario: Collections formatting
  Given the collections amount is 248500
  Then it displays as "₦248,500" with comma separators
  And the subtitle "today" appears in green

Scenario: Pending sync warning
  Given there are 3 pending transactions
  Then the Pending Sync card shows "3"
  And the subtitle "today" appears in yellow
  And tapping the card navigates to Unposted Transactions

Scenario: Pull to refresh
  Given I am on the Dashboard
  When I pull down from the top
  Then the KPIs refresh with latest data
  And a spinner appears during refresh
```

**Technical Notes:**
- Use TanStack Query with `staleTime: 5min` for KPIs
- Format currency with `Intl.NumberFormat` or custom NGN formatter
- KPI data from `/api/reports/daily-summary`
- Source: PRD §4.2, UX §3.2

---

### Story 2.2: Quick Actions

**User Story:**
As a bank officer, I want one-tap access to the four most common operations so that I can process transactions faster.

**Acceptance Criteria:**

```gherkin
Scenario: Quick action grid
  Given I am on the Dashboard
  Then I see a 2×2 grid of quick action cards:
    | Icon | Label         | Subtitle        |
    | ↓    | Cash In       | Receive payment |
    | ↑    | Cash Out      | Disburse cash   |
    | 💰   | Loan Repayment| Post repayment  |
    | ✨   | New Account   | Open savings    |

Scenario: Quick action tap
  Given I am on the Dashboard
  When I tap "Cash In"
  Then the Cash In screen pushes in from the right
  And the transition takes 300ms

Scenario: Quick action active state
  Given I am tapping a quick action card
  Then the card scales to 0.97
  And the background lightens slightly
  And on release, the navigation occurs
```

**Technical Notes:**
- CSS grid 2×2, gap 12px
- Cards: 16px radius, `--color-surface` bg
- Icon container: 40px, orange at 10% opacity
- Source: UX §3.2

---

### Story 2.3: Recent Transactions List

**User Story:**
As a bank officer, I want to see my most recent transactions on the Dashboard so that I can verify recent activity at a glance.

**Acceptance Criteria:**

```gherkin
Scenario: Transaction list display
  Given I am on the Dashboard
  Then I see a "RECENT TRANSACTIONS" section
  And it shows the last 5 transactions

Scenario: Transaction item structure
  Given a transaction exists
  Then each item shows:
    - Avatar or initial letter in a colored circle
    - Customer name (bold)
    - Transaction type and time (e.g., "Cash In · 10:42 AM")
    - Amount (bold, right-aligned)
    - Status badge (POSTED = green, PENDING = yellow)

Scenario: Empty state
  Given no transactions exist today
  Then the section shows "No transactions yet"
  And optionally hides the section

Scenario: Scroll behavior
  Given there are many transactions
  Then the Dashboard scrolls vertically
  And the bottom nav stays fixed
```

**Technical Notes:**
- Query: `/api/transactions?officerId={id}&date=today&limit=5`
- Transaction type mapping: Cash In, Cash Out, Loan Repay, etc.
- Time formatting: relative ("10:42 AM") or absolute based on UX preference
- Source: PRD §4.2, UX §3.2

---

## Epic 3: Cash Transactions

**Objective:** Enable officers to process the core cash operations that constitute the majority of daily teller work.

**Business Value:** Cash In and Cash Out are the highest-frequency operations. Reliability and speed here directly impact customer satisfaction.

---

### Story 3.1: Cash In (Deposit)

**User Story:**
As a bank officer, I want to receive a cash deposit from a customer by searching their account and posting the transaction so that the deposit is recorded accurately.

**Acceptance Criteria:**

```gherkin
Scenario: Account search and display
  Given I am on the Cash In screen
  When I enter a valid account number
  And I tap "SEARCH"
  Then an "Account Found" card slides in showing:
    - Account Name
    - Book Balance
    - Usable Balance

Scenario: Account not found
  Given I am on the Cash In screen
  When I enter an invalid account number
  And I tap "SEARCH"
  Then the input shows an error state
  And a message appears: "Account not found"

Scenario: Successful cash in posting
  Given I have found a valid account
  When I enter a payee name
  And I enter a transaction amount
  And I check "Send SMS notification to customer"
  And I tap "POST TRANSACTION"
  Then the transaction is posted successfully
  And a success toast appears: "Transaction posted"
  And the form resets for the next transaction

Scenario: Offline cash in
  Given I am offline
  When I complete the Cash In form
  And I tap "POST TRANSACTION"
  Then the transaction is saved to the local queue
  And a toast appears: "Saved offline. Will sync when online."
  And the Dashboard pending sync count increases

Scenario: Amount validation
  Given I enter an amount of 0
  When I tap "POST TRANSACTION"
  Then the amount field shows "Amount must be greater than 0"
  And the transaction is not posted
```

**Technical Notes:**
- API: `POST /api/transactions/cash-in`
- Offline: Write to `transactionQueue` in IndexedDB with `type: 'CashIn'`
- Account search: `GET /api/accounts/search?number={n}`
- SMS flag included in payload
- Source: PRD §4.3.1, UX §3.3

---

### Story 3.2: Cash Out (Withdrawal)

**User Story:**
As a bank officer, I want to process a cash withdrawal by verifying the customer's balance and posting the transaction so that the withdrawal is recorded and funds are disbursed.

**Acceptance Criteria:**

```gherkin
Scenario: Balance validation
  Given an account has a usable balance of ₦91.05
  When I enter a withdrawal amount of ₦100
  And I tap "POST TRANSACTION"
  Then the amount field shows "Amount exceeds usable balance"
  And the transaction is blocked

Scenario: Successful withdrawal
  Given an account has sufficient balance
  When I enter a valid withdrawal amount
  And I tap "POST TRANSACTION"
  Then the transaction posts successfully
  And the account balance is reduced accordingly

Scenario: Same flow as Cash In
  Given the Cash In flow is implemented
  Then Cash Out reuses the same screen pattern
  With title "Cash Out (Withdrawal)"
  And additional balance validation
```

**Technical Notes:**
- Reuse Cash In component with `mode: 'in' | 'out'` prop
- Additional validation: `amount <= usableBalance`
- API: `POST /api/transactions/cash-out`
- Source: PRD §4.3.2, UX §3.4

---

### Story 3.3: New Account Deposit

**User Story:**
As a bank officer, I want to open a new savings account and make an initial deposit in a single flow so that new customers can be onboarded quickly.

**Acceptance Criteria:**

```gherkin
Scenario: Create and fund new account
  Given I am on the New Account Deposit screen
  When I enter customer details (name, gender, BVN)
  And I select a savings product
  And I enter an initial deposit amount
  And I tap "Submit"
  Then a new account is created
  And the initial deposit is posted
  And a success message shows the new account number

Scenario: BVN validation
  Given I enter a BVN of "123"
  When I attempt to submit
  Then the BVN field shows "BVN must be 11 digits"
  And submission is blocked
```

**Technical Notes:**
- API: `POST /api/accounts` (creates account + initial deposit)
- BVN validation: regex `/^\d{11}$/`
- Source: PRD §4.3.3

---

### Story 3.4: Cash Transactions Menu

**User Story:**
As a bank officer, I want a centralized menu of all cash transaction types so that I can navigate to the correct operation quickly.

**Acceptance Criteria:**

```gherkin
Scenario: Menu items
  Given I am on the Transact tab
  Then I see a grouped list:
    CASH:
      - Cash In →
      - Cash Out →
      - New Account Deposit →
      - Batch BBLS Deposit →
    CARD:
      - Card Transactions →

Scenario: Search filtering
  Given I type "cash" in the search bar
  Then only "Cash In" and "Cash Out" are visible
  And "Card Transactions" is hidden
```

**Technical Notes:**
- Simple filtering with `Array.filter()` on menu items
- Each item is a navigation link
- Source: UX §3.7

---

## Epic 4: Loan Management

**Objective:** Enable officers to process loan repayments and look up loan details for customer service.

**Business Value:** Loan repayment is a critical revenue-collection function. Inquiry capability improves customer service quality.

---

### Story 4.1: Loan Repayment

**User Story:**
As a bank officer, I want to search for a customer's loan and post a repayment so that their loan balance is updated and the payment is recorded.

**Acceptance Criteria:**

```gherkin
Scenario: Loan search and details
  Given I am on the Loan Repayment screen
  When I enter a loan account number
  And I tap "SEARCH"
  Then a loan details card appears showing:
    - Customer Name
    - Product (e.g., Micro Business Loan)
    - Loan Amount, Current Balance, Outstanding Interest
    - Maturity Date, Status

Scenario: Repayment posting
  Given loan details are displayed
  When I enter a repayment amount
  And I tap "POST REPAYMENT"
  Then the repayment is processed
  And the loan balance is reduced
  And a success message appears

Scenario: Repayment amount validation
  Given the current balance is ₦32,500
  When I enter a repayment of ₦40,000
  Then an error shows: "Repayment exceeds outstanding balance"

Scenario: Offline repayment
  Given I am offline
  When I post a repayment
  Then it is queued for sync
  And the loan details are cached locally
```

**Technical Notes:**
- API: `POST /api/transactions/loan-repayment`
- Search: `GET /api/loans/search?number={n}`
- Validation: `repaymentAmount <= currentBalance + outstandingInterest`
- Source: PRD §4.5, UX §3.5

---

### Story 4.2: Group Loan Repayment

**User Story:**
As a bank officer, I want to process repayments for group loans by selecting the group and posting the payment so that group lending operations are supported.

**Acceptance Criteria:**

```gherkin
Scenario: Group selection
  Given I am on the Group Loan Repayment screen
  When I tap "Select Group"
  Then a modal opens with a searchable group list
  When I select a group
  Then the group loan details appear

Scenario: Group repayment flow
  Given a group is selected
  Then the repayment flow mirrors individual loan repayment
  With group name displayed in the details card
```

**Technical Notes:**
- Reuse Loan Repayment screen with `groupMode` flag
- API: `POST /api/transactions/group-loan-repayment`
- Group list: `GET /api/groups`
- Source: PRD §4.6

---

### Story 4.3: Loan Inquiry

**User Story:**
As a bank officer, I want to look up a customer's loan details by account or loan number so that I can answer their questions about balances, maturity dates, and payment history.

**Acceptance Criteria:**

```gherkin
Scenario: Loan lookup
  Given I am on the Loan Inquiry screen
  When I enter an account or loan number
  And I tap "SEARCH"
  Then loan details display:
    | Field               | Example          |
    | Product Name        | Micro Business Loan |
    | Loan Purpose        | Stock Purchase   |
    | Loan Amount         | ₦50,000          |
    | Start Date          | 01/10/2025       |
    | Maturity Date       | 01/04/2026       |
    | Current Balance     | ₦32,500          |
    | Outstanding Interest| ₦2,800           |
    | Status              | POSTED           |

Scenario: Loan not found
  Given I enter an invalid number
  When I search
  Then a "Loan not found" message appears
```

**Technical Notes:**
- API: `GET /api/loans/search?number={n}`
- Display-only screen, no mutations
- Cache results in IndexedDB for offline reference
- Source: PRD §4.4.1, UX §3.11

---

## Epic 5: Account Services

**Objective:** Enable officers to open new savings accounts and perform customer inquiries (balance, statement).

**Business Value:** New account opening drives customer acquisition. Inquiry services improve customer satisfaction and reduce branch visits.

---

### Story 5.1: New Savings Account (3-Step Wizard)

**User Story:**
As a bank officer, I want to open a new savings account for a customer through a guided multi-step form so that all required KYC data is collected accurately.

**Acceptance Criteria:**

```gherkin
Scenario: Step 1 — Bio Info
  Given I start the New Savings Account flow
  Then I see a 3-step stepper (Bio Info → Contact → Account)
  And Step 1 is active
  When I fill in:
    - Branch
    - First Name, Other Name, Surname
    - Gender (Male/Female toggle)
    - Date of Birth (DD/MM/YYYY)
  And I tap "Continue"
  Then I advance to Step 2

Scenario: Step 2 — Contact
  Given I am on Step 2
  Then the stepper shows Step 1 complete, Step 2 active
  When I fill in:
    - Home Address, Business Address
    - Phone Number, Email
    - BVN (11 digits)
    - Next of Kin details
  And I tap "Continue"
  Then I advance to Step 3
  When I tap "Back"
  Then I return to Step 1 with data preserved

Scenario: Step 3 — Account
  Given I am on Step 3
  Then the stepper shows Steps 1–2 complete
  When I select a Product Type
  And I enter an Initial Deposit amount
  And I tap "Submit"
  Then the account is created
  And a success modal shows the new account number
  And I am returned to the Dashboard

Scenario: Validation per step
  Given I am on Step 1
  When I tap "Continue" without filling required fields
  Then empty required fields show red borders
  And error messages appear below each field
  And I cannot proceed

Scenario: BVN validation
  Given I enter "12345" in the BVN field
  When I attempt to continue
  Then the field shows "BVN must be exactly 11 digits"
```

**Technical Notes:**
- Use React state to track current step and form data
- Validate each step before allowing navigation forward
- Back button preserves all entered data
- API: `POST /api/accounts`
- Date format: DD/MM/YYYY
- Source: PRD §4.4.4, UX §3.6

---

### Story 5.2: Account Balance Inquiry

**User Story:**
As a bank officer, I want to check a customer's account balance by entering their CASA account number so that I can provide accurate balance information.

**Acceptance Criteria:**

```gherkin
Scenario: Balance lookup
  Given I am on the Account Balance screen
  When I enter a CASA account number
  And I tap "SEARCH"
  Then the results show:
    - Account Name
    - Book Balance (green)
    - Usable Balance (green)
    - NUBAN

Scenario: Reset search
  Given results are displayed
  When I tap "RESET"
  Then the results clear
  And the search input is cleared
  And the screen returns to empty state
```

**Technical Notes:**
- API: `GET /api/accounts/balance?number={n}`
- NGN formatting with comma separators
- Cache results locally
- Source: PRD §4.4.2, UX §3.12

---

### Story 5.3: Account Statement

**User Story:**
As a bank officer, I want to fetch a customer's account statement for a specific date range so that I can review their transaction history with them.

**Acceptance Criteria:**

```gherkin
Scenario: Statement fetch
  Given I am on the Account Statement screen
  When I enter an account number
  And I select a From Date
  And I select a To Date
  And I tap "FETCH STATEMENT"
  Then a transaction history table appears
  With columns: Date, Description, Debit, Credit, Balance

Scenario: Date validation
  Given I select a To Date earlier than the From Date
  When I tap "FETCH STATEMENT"
  Then an error shows: "To date must be after From date"
```

**Technical Notes:**
- API: `GET /api/accounts/statement?number={n}&from={date}&to={date}`
- Date inputs: native date picker with DD/MM/YYYY display format
- Source: PRD §4.4.3, UX §3.13

---

## Epic 6: Batch & Card Operations

**Objective:** Support group-based microfinance deposits and POS card transactions.

**Business Value:** BBLS (Better Life Savings) group deposits are essential for microfinance operations. Card transactions extend service channels.

---

### Story 6.1: Batch BBLS Deposit

**User Story:**
As a bank officer, I want to process deposits for multiple customers in a group simultaneously so that group savings collections are efficient.

**Acceptance Criteria:**

```gherkin
Scenario: Group selection
  Given I am on the Batch BBLS Deposit screen
  When I enter a payee/collector name
  And I select a branch
  And I tap "SELECT" for group
  Then a modal opens with a searchable group list
  When I select a group
  Then the modal closes
  And group details appear:
    - Group Code
    - Group Name
    - Total (initially ₦0.00)

Scenario: Enter customer amounts
  Given a group is selected
  Then a table appears with group members
  When I enter amounts for each customer
  Then the Total updates live
  And the customer count is shown

Scenario: Submit batch
  Given all amounts are entered
  When I check "Send SMS notification"
  And I tap "SUBMIT BATCH"
  Then all deposits are posted as a batch
  And a success message shows the batch reference

Scenario: Offline batch
  Given I am offline
  When I submit a batch
  Then the entire batch is queued locally
  And each entry is marked pending
```

**Technical Notes:**
- API: `POST /api/transactions/batch-deposit`
- Group list: `GET /api/groups?branchId={id}`
- Modal: Bottom sheet pattern
- Real-time total calculation with `useMemo` or derived state
- Source: PRD §4.3.4, UX §3.8

---

### Story 6.2: Card Transactions

**User Story:**
As a bank officer, I want to access card deposit, withdrawal, balance check, and statement features when a POS terminal is connected so that card-based operations are supported.

**Acceptance Criteria:**

```gherkin
Scenario: Card menu
  Given I am on the Card Transactions screen
  Then I see 4 options:
    - Card Deposit
    - Card Withdrawal
    - Card Balance Check
    - Card Statement
  And an info banner: "POS Terminal Required"

Scenario: POS not connected
  Given no POS terminal is connected
  When I tap any card option
  Then a message appears: "Please connect a POS terminal device"

Scenario: POS connected
  Given a POS terminal is connected
  When I tap "Card Deposit"
  Then the card deposit flow begins
  (Full flow TBD based on POS integration specs)
```

**Technical Notes:**
- POS integration is a future consideration (see PRD Open Questions)
- Screen is a placeholder/menu for now
- Info card uses blue accent style
- Source: PRD §4.3.5, UX §3.9

---

## Epic 7: Reports & Analytics

**Objective:** Provide officers with visibility into their performance and portfolio metrics.

**Business Value:** Self-service reporting reduces back-office dependency and motivates performance.

---

### Story 7.1: Reports Dashboard

**User Story:**
As a bank officer, I want to see a summary of my daily performance and access detailed reports so that I can track my metrics.

**Acceptance Criteria:**

```gherkin
Scenario: Reports overview
  Given I am on the Reports tab
  Then I see 2 summary cards:
    - Total Collections: ₦ amount
    - Transactions Today: count
  And a list of report types:
    - Loans Booked
    - E-Ledger
    - LO PAR Report
    - Transaction Reports
    - LO Performance

Scenario: Report navigation
  Given I am on the Reports screen
  When I tap "Loans Booked"
  Then the Loans Booked report screen appears
```

**Technical Notes:**
- Summary from `/api/reports/daily-summary`
- Each report type is a separate screen (future stories)
- Source: PRD §4.7, UX §3.14

---

### Story 7.2: Detailed Reports (Placeholder)

**User Story:**
As a bank officer, I want to view detailed reports for each report type so that I can analyze specific aspects of my work.

**Acceptance Criteria:**

```gherkin
Scenario: Report types
  Given the Reports Dashboard is implemented
  Then each report type opens a detail view:
    - Loans Booked: List of new disbursements with customer, amount, date
    - E-Ledger: Electronic ledger entries with debit/credit
    - LO PAR Report: Portfolio at risk metrics
    - Transaction Reports: Filterable transaction history
    - LO Performance: Officer metrics and rankings
```

**Technical Notes:**
- Out of scope for MVP; placeholder screens acceptable
- Full implementation requires backend report APIs
- Source: PRD §4.7

---

## Epic 8: Offline-First Infrastructure

**Objective:** Build the foundational offline capabilities that allow the app to function without internet and sync reliably when connectivity returns.

**Business Value:** Field officers often work in areas with poor connectivity. Offline capability is a core differentiator and operational necessity.

---

### Story 8.1: IndexedDB Local Storage

**User Story:**
As a developer, I want a robust local database so that all app data can be stored and retrieved offline.

**Acceptance Criteria:**

```gherkin
Scenario: Database initialization
  Given the app loads
  Then an IndexedDB database "PrimePOSDB" is created
  With object stores:
    - accounts
    - loans
    - groups
    - transactionQueue
    - officers
    - syncMetadata

Scenario: CRUD operations
  Given the database is initialized
  Then I can create, read, update, and delete records
  In each object store

Scenario: Data persistence
  Given data is written to IndexedDB
  When the app is closed and reopened
  Then the data is still available
```

**Technical Notes:**
- Use `idb-keyval` for simple KV operations or `idb` for advanced schema
- Schema defined in Architecture §5.1
- All object stores use appropriate indexes
- Source: Architecture §5.1

---

### Story 8.2: Transaction Queue Manager

**User Story:**
As a bank officer, I want my transactions to be queued locally when offline and posted automatically when online so that no transaction is lost.

**Acceptance Criteria:**

```gherkin
Scenario: Queue transaction
  Given I am offline
  When I complete any transaction form
  And I submit
  Then the transaction is added to the queue
  With status PENDING
  And a local UUID is generated

Scenario: View queue
  Given there are queued transactions
  When I navigate to Unposted Transactions
  Then I see a list of all pending items
  With customer name, amount, type, time, and PENDING badge

Scenario: Auto-sync on reconnect
  Given there are pending transactions
  When the device comes back online
  Then the sync engine automatically processes the queue
  And successful transactions are marked POSTED
  And failed transactions remain PENDING with error info

Scenario: Manual batch post
  Given there are pending transactions
  When I tap "POST ALL TRANSACTIONS"
  Then all pending transactions are submitted
  And a progress indicator is shown
  And the result summary is displayed
```

**Technical Notes:**
- Queue stored in IndexedDB `transactionQueue`
- `SyncEngine` class orchestrates batch processing
- Retry with exponential backoff
- Process queue in order (FIFO)
- Source: PRD §4.9, Architecture §5.2, §5.3

---

### Story 8.3: Offline Data Cache

**User Story:**
As a bank officer, I want customer accounts, loans, and group data cached locally so that I can perform lookups and inquiries while offline.

**Acceptance Criteria:**

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

**Technical Notes:**
- Cache strategy per entity (Architecture §5.4)
- `syncOfflineData()` downloads full officer dataset
- Metadata tracks last sync time per entity
- Source: PRD §4.9, Architecture §5.4

---

### Story 8.4: Service Worker & PWA Update Flow

**User Story:**
As a user, I want the app to work offline and update automatically when a new version is available so that I always have the latest features.

**Acceptance Criteria:**

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

**Technical Notes:**
- `vite-plugin-pwa` configured with `registerType: 'autoUpdate'`
- Workbox precaches static assets
- Runtime caching for fonts and API calls
- Update banner component listens to SW events
- Source: Architecture §8, PRD §7

---

## Epic 9: Menu, Profile & Settings

**Objective:** Provide officer self-service for profile viewing, settings management, and secure sign-out.

**Business Value:** Officers need access to their own information and the ability to manage app settings independently.

---

### Story 9.1: Menu & Offline Data

**User Story:**
As a bank officer, I want a menu screen where I can access my profile, offline data, settings, and sign out so that I can manage my app experience.

**Acceptance Criteria:**

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

**Technical Notes:**
- Profile card uses orange gradient bg
- Menu items reuse the transaction menu item pattern
- Source: PRD §4.8, UX §3.15

---

### Story 9.2: My Profile

**User Story:**
As a bank officer, I want to view my profile details so that I can verify my account information.

**Acceptance Criteria:**

```gherkin
Scenario: Profile display
  Given I tap my officer card or "My Profile"
  Then I see a detail view:
    - Name, Staff ID
    - Mobile, Email
    - Branch, Department
    - Till Account, System Date
    - Change Password button
```

**Technical Notes:**
- Read-only screen (except Change Password)
- Data from `AuthContext` user object
- Source: UX §3.16

---

### Story 9.3: Settings & Sign Out

**User Story:**
As a bank officer, I want to change my password, manually sync data, and sign out securely so that I can manage my account and app state.

**Acceptance Criteria:**

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

**Technical Notes:**
- Sign out clears in-memory token and sensitive state
- Optionally clear non-essential IndexedDB data
- API: `POST /api/auth/change-password`, `POST /api/auth/logout`
- Source: PRD §4.8, UX §3.15

---

## Cross-Cutting Concerns

### Error Handling (All Stories)

Every story must handle:
- Network timeout (queue for retry)
- 401 Unauthorized (redirect to login)
- 422 Validation (show field errors)
- 500 Server Error (show retry button)
- Device offline (queue locally)

### Accessibility (All Stories)

Every screen must:
- Support 44px minimum touch targets
- Maintain WCAG AA contrast ratios
- Include proper labels for screen readers
- Respect `prefers-reduced-motion`

### Security (All Stories)

Every transaction story must:
- Include officer ID in API payload (server validates)
- Validate on server side (not client-side only)
- Mask sensitive fields in logs

---

## Story Priority Summary

### Critical (Must Have for MVP)
| Story | Description |
|-------|-------------|
| 1.1 | Officer Login |
| 1.2 | Connection Status |
| 1.3 | App Shell & Navigation |
| 2.1 | Dashboard KPI Cards |
| 2.2 | Quick Actions |
| 2.3 | Recent Transactions |
| 3.1 | Cash In (Deposit) |
| 3.2 | Cash Out (Withdrawal) |
| 3.4 | Cash Transactions Menu |
| 4.1 | Loan Repayment |
| 4.3 | Loan Inquiry |
| 5.1 | New Savings Account |
| 5.2 | Account Balance Inquiry |
| 5.3 | Account Statement |
| 6.1 | Batch BBLS Deposit |
| 8.1 | IndexedDB Local Storage |
| 8.2 | Transaction Queue Manager |
| 8.3 | Offline Data Cache |
| 8.4 | Service Worker & PWA Updates |
| 9.1 | Menu & Offline Data |
| 9.3 | Settings & Sign Out |

### High (Should Have)
| Story | Description |
|-------|-------------|
| 3.3 | New Account Deposit |
| 4.2 | Group Loan Repayment |
| 6.2 | Card Transactions |
| 7.1 | Reports Dashboard |

### Medium (Could Have)
| Story | Description |
|-------|-------------|
| 7.2 | Detailed Reports |
| 9.2 | My Profile |

---

*Document generated: 2026-05-02*
*Next step: Sprint Planning → Generate sprint-status.yaml*
