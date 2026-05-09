# PrimePOS App Test Guide

Last checked: 2026-05-09

## Local Setup

1. Open a terminal in `primepos-web`.
2. Install dependencies with `npm install` if they are not already installed.
3. Start the app with `npm run dev`.
4. Open the local Vite URL shown in the terminal.

Useful validation commands:

- `npm test`
- `npm run lint`
- `npm run build`

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
- Cash In
- Cash Out
- Loan Repayment
- Loan Inquiry
- Account Balance
- New Savings Account

Also implemented but outside this guide's main checklist:

- New Account Deposit
- Account Statement

## Quick Flow Checklist

Use this section for a fast smoke pass.

| Flow | Where to open it | Working value(s) | Expected result |
|------|------------------|------------------|-----------------|
| Login | Login screen | `YB101375` / `password` | Dashboard opens for Yahaya Ahmed |
| Cash In | Dashboard `Cash In` quick action or `Transact Menu` | Account `1234567890`, Payee `Blessing Test`, Amount `1000` | Account card shows Adediran Blessing, success toast says `Transaction posted` |
| Cash Out | Dashboard `Cash Out` quick action or `Transact Menu` | Account `1234567890`, Payee `Blessing Test`, Amount `1000` | Account card shows usable balance `NGN 45,000.00`, success toast says `Transaction posted` |
| Loan Repayment | Dashboard `Loan Repayment` quick action or `Services` | Loan `LN-10001`, Amount `1000` | Loan card loads, success toast says `Repayment posted successfully` |
| Loan Inquiry | `Services` -> `Loan Inquiry` | Loan `LN-10001` | Loan details card appears for Adediran Blessing |
| Account Balance | `Services` -> `Account Balance` | Account `1234567890` | Account card appears for Adediran Blessing |
| New Savings Account | `Services` -> `New Savings Account` | Use the 3-step sample below | Success toast shows `Account created successfully. Account Number: ...` |

## Detailed Flow Scenarios

### Cash In

Navigation:

- Dashboard quick action: `Cash In`
- Or `Transact Menu` -> `Cash In`

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

- Search with `0000000000` -> field shows `Account not found`.
- Leave payee name empty -> `Payee name is required`.
- Leave amount empty -> `Amount is required`.
- Enter `0` or a negative-like invalid amount -> `Amount must be greater than 0`.

### Cash Out

Navigation:

- Dashboard quick action: `Cash Out`
- Or `Transact Menu` -> `Cash Out`

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

- Search with `0000000000` -> `Account not found`.
- Enter amount `50000` after loading account `1234567890` -> `Amount exceeds usable balance`.
- Leave payee name empty -> `Payee name is required`.
- Enter a non-number amount -> `Enter a valid amount`.

### Loan Repayment

Navigation:

- Dashboard quick action: `Loan Repayment`
- Or `Services` -> `Loan Repayment`

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

- Search with `0000000000` -> `Loan not found`.
- Enter amount `34000` -> `Repayment exceeds outstanding balance`.
  The current mock maximum is `NGN 33,750.00` because `currentBalance` is `NGN 32,500.00` and `outstandingInterest` is `NGN 1,250.00`.
- Leave amount empty -> `Amount is required`.
- Enter text instead of a number -> `Enter a valid amount`.

### Loan Inquiry

Navigation:

- `Services` -> `Loan Inquiry`

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

- Search with `0000000000` -> `Loan not found`.

### Account Balance

Navigation:

- `Services` -> `Account Balance`

Successful test:

1. Search with account number `1234567890`.

Expected result:

- The account card appears.
- Account name is `Adediran Blessing`.
- Book Balance shows `NGN 50,000.00`.
- Usable Balance shows `NGN 45,000.00`.

Useful invalid checks:

- Search with `0000000000` -> `Account not found`.
- Reset should clear the current result and return the empty-state helper text.

### New Savings Account

Navigation:

- `Services` -> `New Savings Account`

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

- Leave Branch empty -> `Branch is required`.
- Leave First Name empty -> `First name is required`.
- Leave Surname empty -> `Surname is required`.
- Leave Gender empty -> `Gender is required`.
- Use an under-18 date of birth -> `Enter a valid date. Customer must be at least 18`.
- Use a BVN that is not exactly 11 digits -> `BVN must be exactly 11 digits`.
- Leave Next of Kin Name empty -> `Next of kin name is required`.
- Leave Product Type empty -> `Product type is required`.
- Enter `0` for Initial Deposit -> `Amount must be greater than 0`.

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

### Group Search Terms

These are not part of the main smoke checklist yet, but they are current searchable values in the repo:

- `Ago`
- `Oshodi`
- `Ikeja`
- `Yaba`
- `Surulere`
- `GR-001` through `GR-005`

Source: `src/api/groups.ts`

## Known Gaps And Not-Yet-Ready Areas

These screens or routes exist as placeholders or are not part of the current implemented test guide:

- Batch BBLS Deposit
- Card Transactions
- Reports
- More
- Settings
- My Profile
- Card Deposit
- Card Withdrawal
- Card Balance
- Card Statement
- Unposted Transactions
- Change Password

Additional notes:

- `Group Loan Repayment` is present in `App.tsx` but is not exposed from the current dashboard quick actions or services menu.
- This guide intentionally focuses on flows that are both implemented and practically testable from the current UI.
