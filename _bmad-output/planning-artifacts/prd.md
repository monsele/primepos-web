---
project: PrimePOS
document: Product Requirements Document
version: 1.0.0
date: 2026-05-02
author: Product Team
status: Draft
inputDocuments:
  - docs/PrimePos_Screenshots.pdf
  - docs/PrimePos_Screenshots.docx
---

# PrimePOS — Product Requirements Document

## 1. Executive Summary

**PrimePOS** is a mobile-first Progressive Web Application (PWA) designed as a **Mobile Teller Platform** for bank staff and loan officers. It enables field-based and branch-based banking operations including cash transactions, loan repayments, account opening, customer inquiries, and batch group deposits — with full offline support for unreliable network environments.

**Key Value Propositions:**
- Enable tellers to serve customers anywhere with a smartphone
- Continue operations during network outages with offline-first architecture
- Streamline cash-in/cash-out, loan repayments, and new account creation
- Provide real-time customer and loan inquiries
- Support group-based microfinance deposits (BBLS)

---

## 2. Product Overview

### 2.1 Vision
To provide bank staff with a reliable, offline-capable mobile teller platform that brings core banking services directly to customers — whether in-branch, in the field, or in remote locations.

### 2.2 Target Users

| User Type | Role | Primary Needs |
|-----------|------|---------------|
| **Loan Officer (LO)** | Field agent managing customer relationships | Cash transactions, loan repayments, inquiries, offline data access |
| **Branch Teller** | In-branch staff processing deposits/withdrawals | Fast cash-in/cash-out, account opening, balance checks |
| **Credit & Outreach Staff** | Staff focused on group lending and savings | Batch deposits, group management, portfolio reports |

### 2.3 Platform
- **Form Factor:** Mobile-first (smartphone/tablet), portrait orientation
- **Technology:** React PWA with offline service worker
- **Minimum OS:** Modern iOS Safari / Android Chrome
- **Display:** Standalone PWA mode, responsive up to 480px max-width centered layout

---

## 3. User Flows & Navigation

### 3.1 App Navigation Structure

```
Login → Dashboard → Bottom Navigation

Bottom Navigation Tabs:
├── Home (Dashboard)
├── Transact (Cash Transactions)
├── Services (Customer Services)
├── Reports (Officer Reports)
└── More (Profile, Offline Data, Settings)
```

### 3.2 Primary User Flows

**Flow 1: Cash Deposit (Cash In)**
```
Dashboard → Tap "Cash In" → Enter Account Number → Search → 
Verify Customer Details → Enter Payee Name → Enter Amount → 
Toggle SMS Notification → Post Transaction
```

**Flow 2: Cash Withdrawal (Cash Out)**
```
Dashboard → Tap "Cash Out" → Enter Account Number → Search →
Verify Customer Details → Enter Payee Name → Enter Amount →
Toggle SMS Notification → Post Transaction
```

**Flow 3: Loan Repayment**
```
Dashboard → Tap "Loan Repayment" → Enter Loan Account Number → Search →
View Loan Details → Enter Repayment Amount →
Toggle SMS Notification → Post Repayment
```

**Flow 4: New Savings Account**
```
Dashboard/Services → "New Savings Account" → Step 1: Bio Info →
Step 2: Contact Details → Step 3: Product & Initial Deposit → Submit
```

**Flow 5: Batch BBLS Deposit**
```
Transact → "Batch BBLS Deposit" → Enter Payee Name → Select Branch →
Select Group → Enter Amounts per Customer → Submit Batch
```

**Flow 6: Customer Inquiry**
```
Services → Select Inquiry Type (Loan/Balance/Statement) →
Enter Account/Loan Number → Search → View Results
```

---

## 4. Functional Requirements

### 4.1 Authentication

**Screen: Login**
- Staff ID / Username input field
- Password input field with show/hide toggle
- Sign In button with brand color
- Connection status indicator at top
- Version and copyright footer

**Requirements:**
- FR-AUTH-001: System shall authenticate users via Staff ID and password
- FR-AUTH-002: Password field shall support show/hide toggle
- FR-AUTH-003: Successful login shall route to Dashboard
- FR-AUTH-004: Failed login shall display clear error message
- FR-AUTH-005: App shall display connectivity status (Online/Offline)

### 4.2 Dashboard (Home)

**Screen: Dashboard**
- Greeting with officer name and branch
- KPI summary cards: Today's Collections, Transaction Count, Pending Sync
- Quick Action grid: Cash In, Cash Out, Loan Repayment, New Account
- Recent Transactions list with status badges
- Bottom navigation bar

**Requirements:**
- FR-DASH-001: Display officer name, branch, and department
- FR-DASH-002: Show today's collection total in local currency (₦)
- FR-DASH-003: Show count of transactions processed today
- FR-DASH-004: Show count of pending sync transactions
- FR-DASH-005: Provide Quick Action buttons for top 4 operations
- FR-DASH-006: Display recent transactions (last N) with customer name, type, amount, time, and status
- FR-DASH-007: Status badges: POSTED (green), PENDING (yellow)

### 4.3 Cash Transactions

#### 4.3.1 Cash In (Deposit)

**Screen: Cash In (Deposit)**
- Account Number input with Search button
- Account Found card (displayed after search):
  - Account Name
  - Book Balance
  - Usable Balance
- Payee Name input
- Transaction Amount (₦) input
- Send SMS notification checkbox
- Post Transaction button

**Requirements:**
- FR-CI-001: Accept account number entry with Search functionality
- FR-CI-002: Display customer details upon successful search
- FR-CI-003: Show Book Balance and Usable Balance from account record
- FR-CI-004: Accept payee name entry
- FR-CI-005: Accept transaction amount in local currency
- FR-CI-006: Optionally send SMS notification to customer
- FR-CI-007: Validate sufficient balance/limits before posting
- FR-CI-008: Store transaction locally when offline, sync when online

#### 4.3.2 Cash Out (Withdrawal)

**Screen: Cash Out (Withdrawal)**
- Same structure as Cash In
- Account search and balance verification
- Amount validation against usable balance

**Requirements:**
- FR-CO-001: Same as Cash In (FR-CI-001 through FR-CI-006)
- FR-CO-002: Validate withdrawal amount does not exceed Usable Balance
- FR-CO-003: Display clear error if insufficient funds

#### 4.3.3 New Account Deposit

**Screen: New Account Deposit**
- Create and fund a new customer account in one flow
- Fields: First Name, Surname, Gender, BVN, Product selection, Initial Deposit

**Requirements:**
- FR-NAD-001: Support creating new savings account with initial deposit
- FR-NAD-002: Collect customer bio data and KYC information
- FR-NAD-003: Support BVN verification
- FR-NAD-004: Allow product selection (savings products)
- FR-NAD-005: Accept initial deposit amount

#### 4.3.4 Batch BBLS Deposit

**Screen: Batch BBLS Deposit**
- Payee Name (collector name) input
- Branch selector dropdown
- Group selector with modal search
- Group details display: Group Code, Group Name, Total
- Customer-Amount table (editable amounts per group member)
- Send SMS checkbox
- Submit Batch button

**Requirements:**
- FR-BBLS-001: Accept payee/collector name
- FR-BBLS-002: Support branch selection
- FR-BBLS-003: Open group selector modal with search
- FR-BBLS-004: Display group members after selection
- FR-BBLS-005: Allow per-customer deposit amount entry
- FR-BBLS-006: Calculate and display running total
- FR-BBLS-007: Support SMS notification for batch
- FR-BBLS-008: Submit all deposits as a single batch transaction

#### 4.3.5 Card Transactions

**Screen: Card Transactions**
- Card Deposit, Card Withdrawal, Card Balance Check, Card Statement
- POS Terminal Required notice

**Requirements:**
- FR-CARD-001: Support POS card deposit via connected terminal
- FR-CARD-002: Support POS card withdrawal via connected terminal
- FR-CARD-003: Support card balance inquiry
- FR-CARD-004: Support card statement/transaction history
- FR-CARD-005: Display clear notice when POS terminal is not connected

### 4.4 Services

#### 4.4.1 Loan Inquiry

**Screen: Loan Inquiry**
- Account / Loan Number search
- Results display:
  - Customer Name
  - Product Name (e.g., Micro Business Loan)
  - Loan Purpose (e.g., Stock Purchase)
  - Loan Amount
  - Start Date, Maturity Date
  - Current Balance
  - Outstanding Interest
  - Loan Status (POSTED/ACTIVE)

**Requirements:**
- FR-LIQ-001: Search by account or loan number
- FR-LIQ-002: Display full loan details and repayment history summary
- FR-LIQ-003: Show current status and outstanding amounts

#### 4.4.2 Account Balance Inquiry

**Screen: Account Balance**
- CASA Account Number search
- Results display:
  - Account Name
  - Book Balance
  - Usable Balance
  - NUBAN (account number)
- Reset button

**Requirements:**
- FR-BAL-001: Search CASA account by number
- FR-BAL-002: Display Book Balance and Usable Balance
- FR-BAL-003: Display NUBAN
- FR-BAL-004: Clear/reset search capability

#### 4.4.3 Account Statement

**Screen: Account Statement**
- Account number search
- Date range selection (From Date / To Date)
- Fetch Statement button

**Requirements:**
- FR-STM-001: Search account by number
- FR-STM-002: Accept date range for filtering
- FR-STM-003: Fetch and display transaction history
- FR-STM-004: Support export/share of statement

#### 4.4.4 New Savings Account

**Screen: New Savings Account (3-Step Wizard)**

**Step 1 — Bio Info:**
- Branch selector
- First Name, Other Name, Surname
- Gender toggle (Male / Female)
- Date of Birth (DD/MM/YYYY)
- Continue button

**Step 2 — Contact:**
- Home Address
- Business Address
- Phone Number
- Email Address
- BVN (11 digits)
- Next of Kin: Full Name, Relationship, Address, Phone
- Back / Continue buttons

**Step 3 — Account:**
- Product Type selector
- Initial Deposit (₦)
- Back / Submit buttons

**Requirements:**
- FR-NSA-001: 3-step wizard with progress indicator
- FR-NSA-002: Collect all mandatory KYC fields
- FR-NSA-003: Validate BVN format (11 digits)
- FR-NSA-004: Support gender selection (Male/Female)
- FR-NSA-005: Validate date format (DD/MM/YYYY)
- FR-NSA-006: Support branch and product selection
- FR-NSA-007: Accept initial deposit
- FR-NSA-008: Allow navigation back to previous steps
- FR-NSA-009: Validate all required fields before submission

### 4.5 Loan Repayment

**Screen: Loan Repayment**
- Loan Account Number search
- Loan details card (after search):
  - Customer Name
  - Product, Loan Amount
  - Current Balance, Outstanding Interest
  - Maturity Date, Status
- Repayment Amount (₦)
- Send SMS notification checkbox
- Post Repayment button

**Requirements:**
- FR-LRP-001: Search by loan account number
- FR-LRP-002: Display loan summary before repayment
- FR-LRP-003: Accept repayment amount
- FR-LRP-004: Validate repayment amount (not exceeding balance)
- FR-LRP-005: Optional SMS notification
- FR-LRP-006: Update loan balance upon successful posting

### 4.6 Group Loan Repayment

**Screen: Group Loan Repayment**
- Group selector modal
- Similar flow to individual loan repayment but for group accounts

**Requirements:**
- FR-GLR-001: Support group selection via modal
- FR-GLR-002: Display group loan summary
- FR-GLR-003: Process group-level repayments

### 4.7 Reports

**Screen: Reports**
- Summary KPIs: Total Collections, Transactions Today
- Report categories:
  - Loans Booked (new disbursements)
  - E-Ledger (electronic ledger entries)
  - LO PAR Report (Portfolio at Risk)
  - Transaction Reports (all transactions)
  - LO Performance (officer metrics)

**Requirements:**
- FR-RPT-001: Display officer's daily collection total
- FR-RPT-002: Display transaction count for current day
- FR-RPT-003: Provide Loans Booked report
- FR-RPT-004: Provide E-Ledger access
- FR-RPT-005: Provide Portfolio at Risk (PAR) report
- FR-RPT-006: Provide detailed transaction history report
- FR-RPT-007: Provide Loan Officer performance metrics

### 4.8 Menu / More

**Screen: Menu**
- Officer Profile Card (name, ID, branch, till account)
- Offline Data section:
  - Unposted Transactions
  - Better Life Records
  - Loan Portfolio
  - Transaction Groups
  - Loan Records
- Settings section:
  - Change Password
  - Sync Data
  - App Settings
- Sign Out button

**Screen: My Profile**
- Name, Staff ID
- Mobile, Email
- Branch, Department
- Till Account
- System Date
- Change Password button

**Requirements:**
- FR-MNU-001: Display officer profile summary
- FR-MNU-002: Access unposted/offline transactions
- FR-MNU-003: View offline cached records
- FR-MNU-004: Change password
- FR-MNU-005: Manual sync trigger
- FR-MNU-006: Access app settings
- FR-MNU-007: Secure sign out returning to Login

### 4.9 Offline Data & Sync

**Screen: Unposted Transactions**
- List of pending transactions with customer name, amount, type, time
- Batch "Post All Transactions" button
- Auto-sync indicator

**Requirements:**
- FR-OFF-001: Queue transactions when offline
- FR-OFF-002: Display pending transaction count on Dashboard
- FR-OFF-003: List all unposted transactions with details
- FR-OFF-004: Support manual batch posting when online
- FR-OFF-005: Auto-sync when internet is restored
- FR-OFF-006: Cache customer data, loan data, and group data for offline access
- FR-OFF-007: Better Life Records offline cache
- FR-OFF-008: Loan Portfolio offline cache
- FR-OFF-009: Offline Groups cache

---

## 5. Data Models

### 5.1 User (Officer)
```
User:
  - staffId: string (PK)
  - name: string
  - email: string
  - mobile: string
  - branchId: string (FK)
  - branchName: string
  - department: string
  - tillAccount: string
  - role: string
```

### 5.2 Customer / Account
```
Account:
  - accountNumber: string (PK)
  - accountName: string
  - firstName: string
  - surname: string
  - otherName: string
  - gender: enum [Male, Female]
  - dateOfBirth: date
  - phone: string
  - email: string
  - homeAddress: string
  - businessAddress: string
  - bvn: string (11 digits)
  - nuban: string
  - bookBalance: decimal
  - usableBalance: decimal
  - branchId: string
  - productId: string
  - status: enum [Active, Dormant, Closed]
```

### 5.3 Transaction
```
Transaction:
  - transactionId: string (PK)
  - type: enum [CashIn, CashOut, LoanRepayment, NewAccountDeposit, BatchDeposit]
  - accountNumber: string
  - customerName: string
  - payeeName: string
  - amount: decimal
  - currency: string (default: NGN)
  - smsNotification: boolean
  - officerId: string (FK)
  - branchId: string
  - status: enum [Pending, Posted, Failed]
  - createdAt: datetime
  - syncedAt: datetime (nullable)
  - localId: string (for offline reference)
```

### 5.4 Loan
```
Loan:
  - loanAccountNumber: string (PK)
  - customerName: string
  - customerAccountNumber: string
  - productName: string
  - loanPurpose: string
  - loanAmount: decimal
  - currentBalance: decimal
  - outstandingInterest: decimal
  - startDate: date
  - maturityDate: date
  - status: enum [Active, Closed, Defaulted]
```

### 5.5 Group
```
Group:
  - groupCode: string (PK)
  - groupName: string
  - branchId: string
  - members: Customer[]
```

### 5.6 Batch Deposit
```
BatchDeposit:
  - batchId: string (PK)
  - payeeName: string
  - groupCode: string
  - branchId: string
  - entries: BatchEntry[]
  - totalAmount: decimal
  - status: enum [Pending, Posted]
  - smsNotification: boolean

BatchEntry:
  - entryId: string
  - customerName: string
  - accountNumber: string
  - amount: decimal
```

---

## 6. API Requirements

### 6.1 Authentication APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Staff ID + Password → JWT token |
| `/api/auth/logout` | POST | Invalidate token |
| `/api/auth/change-password` | POST | Update password |

### 6.2 Account APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/accounts/search` | GET | Search account by number |
| `/api/accounts/balance` | GET | Get account balance |
| `/api/accounts/statement` | GET | Get account statement by date range |
| `/api/accounts` | POST | Create new savings account |

### 6.3 Transaction APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/transactions/cash-in` | POST | Process cash deposit |
| `/api/transactions/cash-out` | POST | Process cash withdrawal |
| `/api/transactions/loan-repayment` | POST | Process loan repayment |
| `/api/transactions/batch-deposit` | POST | Process batch BBLS deposit |
| `/api/transactions/sync` | POST | Sync offline transactions |
| `/api/transactions/pending` | GET | Get officer's pending transactions |

### 6.4 Loan APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/loans/search` | GET | Search loan by account/loan number |
| `/api/loans/{id}` | GET | Get loan details |

### 6.5 Group APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/groups` | GET | List groups by branch |
| `/api/groups/{code}` | GET | Get group details with members |

### 6.6 Report APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reports/daily-summary` | GET | Officer's daily collection & count |
| `/api/reports/loans-booked` | GET | New disbursements report |
| `/api/reports/e-ledger` | GET | Electronic ledger entries |
| `/api/reports/par` | GET | Portfolio at risk |
| `/api/reports/transactions` | GET | Transaction history report |
| `/api/reports/lo-performance` | GET | Officer performance metrics |

### 6.7 Offline Sync APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sync/data` | GET | Download offline data package |
| `/api/sync/status` | GET | Check sync status |

---

## 7. Offline Requirements

### 7.1 Offline-First Architecture
- The app must function fully or in degraded mode without internet
- All transaction screens shall be usable offline
- Data shall be queued locally and synced when connectivity returns

### 7.2 Data Caching Strategy
| Data Type | Caching Strategy | Update Frequency |
|-----------|------------------|------------------|
| Officer Profile | Cache on login | Per session |
| Customer Accounts | IndexedDB / localStorage | On search + background sync |
| Loan Records | IndexedDB | Daily sync |
| Group Records | IndexedDB | Daily sync |
| Transaction Queue | IndexedDB | Immediate local write |
| Better Life Records | IndexedDB | Manual/scheduled sync |
| Loan Portfolio | IndexedDB | Daily sync |

### 7.3 Sync Behavior
- **Automatic:** When online, queue auto-syncs every N minutes
- **Manual:** User can trigger sync from Menu → Sync Data
- **Background:** Sync runs when app regains connectivity
- **Conflict Resolution:** Server-wins for posted transactions; retry for failed posts

### 7.4 Offline UX
- Clear online/offline indicator in header (green = online, red = offline)
- Pending sync count visible on Dashboard
- Unposted transactions screen lists all queued items
- "Post All Transactions" button for manual batch sync

---

## 8. UI/UX Requirements

### 8.1 Design System
- **Theme:** Dark mode primary (`#0b1120` background)
- **Primary Color:** Orange (`#f97316`) for CTAs and active states
- **Success:** Green (`#22c55e`) for positive balances, posted status
- **Warning:** Yellow (`#eab308`) for pending, offline indicators
- **Danger:** Red (`#ef4444`) for errors, insufficient funds
- **Surface:** Elevated dark cards (`#151e2e`, `#1e293b`)
- **Typography:** System font stack, mobile-optimized sizes

### 8.2 Component Patterns
- **Input Fields:** Label above, dark rounded input, placeholder text
- **Buttons:** Full-width primary button for main action; secondary for back
- **Search Pattern:** Input + Search button → result card appears below
- **Cards:** Rounded corners (`12px–16px`), subtle border
- **Badges:** Rounded pill badges for status indicators
- **Bottom Nav:** 5-item tab bar with icon + label

### 8.3 Mobile-First Constraints
- Touch targets minimum 44×44px
- Prevent zoom on inputs (`maximum-scale=1.0`)
- Safe area insets for notch devices
- No horizontal scroll
- Single-column layout
- Active states on all interactive elements

### 8.4 Accessibility
- Color contrast WCAG AA minimum
- Semantic HTML elements
- ARIA labels where icon-only buttons exist
- Focus indicators visible

---

## 9. Security Requirements

- **SR-001:** All API communication over HTTPS
- **SR-002:** JWT-based authentication with refresh tokens
- **SR-003:** Password fields with show/hide toggle
- **SR-004:** Session timeout after period of inactivity
- **SR-005:** Sensitive data encrypted at rest on device
- **SR-006:** Officer can only transact within assigned branch (where applicable)
- **SR-007:** Transaction posting requires server-side validation (not client-side only)
- **SR-008:** BVN validation against national database

---

## 10. Non-Functional Requirements

### 10.1 Performance
- **NFR-001:** App shell loads in < 2s on 3G
- **NFR-002:** Screen transitions feel instant (< 300ms)
- **NFR-003:** Search results appear in < 1s
- **NFR-004:** Support 1000+ offline transactions queued

### 10.2 Reliability
- **NFR-005:** Graceful degradation when APIs fail
- **NFR-006:** No data loss on app crash during transaction
- **NFR-007:** Automatic retry with exponential backoff for sync

### 10.3 Compatibility
- **NFR-008:** iOS Safari 14+
- **NFR-009:** Android Chrome 90+
- **NFR-010:** Works as installed PWA on both platforms

---

## 11. Acceptance Criteria Summary

### 11.1 Critical Path (Must Have for MVP)
- [ ] AC-01: Officer can log in with Staff ID and Password
- [ ] AC-02: Dashboard displays officer info, KPIs, and quick actions
- [ ] AC-03: Cash In transaction with account search and balance display
- [ ] AC-04: Cash Out transaction with balance validation
- [ ] AC-05: Loan Repayment with loan detail lookup
- [ ] AC-06: New Savings Account creation (3-step wizard)
- [ ] AC-07: Loan Inquiry by account/loan number
- [ ] AC-08: Account Balance inquiry
- [ ] AC-09: Account Statement by date range
- [ ] AC-10: Batch BBLS Deposit with group selection
- [ ] AC-11: Offline transaction queuing and sync
- [ ] AC-12: Unposted transactions list with batch post
- [ ] AC-13: Reports dashboard with daily summary
- [ ] AC-14: Profile and Settings access
- [ ] AC-15: Secure sign out

### 11.2 Important (Should Have)
- [ ] AC-16: Card Transactions (POS integration)
- [ ] AC-17: Group Loan Repayment
- [ ] AC-18: SMS notification toggle on all transactions
- [ ] AC-19: E-Ledger report
- [ ] AC-20: LO PAR Report

### 11.3 Nice to Have (Could Have)
- [ ] AC-21: LO Performance detailed metrics
- [ ] AC-22: Transaction export/share
- [ ] AC-23: Biometric login
- [ ] AC-24: Push notifications for sync completion

---

## 12. Open Questions & Future Considerations

1. **Backend API:** What existing core banking system will PrimePOS integrate with? (REST API spec needed)
2. **SMS Provider:** Which SMS gateway for customer notifications?
3. **POS Integration:** Specific POS terminal hardware/protocol for card transactions?
4. **Multi-Currency:** Is ₦ (NGN) the only currency, or should the app support multiple?
5. **Approval Workflows:** Are there supervisor approval requirements for large transactions?
6. **Photo Capture:** Should KYC include customer photo capture?
7. **Fingerprint/Biometric:** Future support for biometric authentication?
8. **Group Lending:** Full group loan disbursement feature (beyond just repayment)?

---

## 13. Glossary

| Term | Definition |
|------|------------|
| **BBLS** | Better Life Savings — group-based savings program |
| **BVN** | Bank Verification Number (Nigeria) |
| **CASA** | Current Account Savings Account |
| **LO** | Loan Officer |
| **NUBAN** | Nigeria Uniform Bank Account Number |
| **PAR** | Portfolio at Risk |
| **PWA** | Progressive Web Application |

---

*Document generated: 2026-05-02*
*Based on: PrimePos_Screenshots.pdf analysis*
*Next step: Architecture design or Epics & Stories breakdown*
