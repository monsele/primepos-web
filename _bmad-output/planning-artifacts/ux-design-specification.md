---
project: PrimePOS
document: UX Design Specification
version: 1.0.0
date: 2026-05-02
author: UX Team
status: Draft
related:
  - prd.md
  - architecture.md
---

# PrimePOS — UX Design Specification

## 1. Design System

### 1.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#0b1120` | App background, screen base |
| `--color-surface` | `#151e2e` | Cards, input backgrounds |
| `--color-surface-elevated` | `#1e293b` | Active/hover card states |
| `--color-primary` | `#f97316` | CTAs, active nav, accent icons |
| `--color-primary-hover` | `#ea580c` | Button hover state |
| `--color-text` | `#f1f5f9` | Primary text, headings |
| `--color-text-muted` | `#94a3b8` | Labels, placeholders, secondary text |
| `--color-success` | `#22c55e` | POSTED status, positive balances, online indicator |
| `--color-warning` | `#eab308` | Pending status, offline banner |
| `--color-danger` | `#ef4444` | Errors, insufficient funds, offline status |
| `--color-border` | `rgba(255,255,255,0.05)` | Card borders, dividers |

### 1.2 Typography Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-xs` | 0.625rem (10px) | 500 | 1.4 | Badges, nav labels, connection status |
| `text-sm` | 0.75rem (12px) | 600 | 1.4 | Section labels, timestamps, hints |
| `text-base` | 0.8125rem (13px) | 600 | 1.5 | Button labels, action card labels |
| `text-md` | 0.875rem (14px) | 600 | 1.5 | Body text, form labels, transaction names |
| `text-lg` | 1rem (16px) | 700 | 1.3 | Amounts, KPI numbers |
| `text-xl` | 1.125rem (18px) | 700 | 1.2 | Brand title, screen headings |
| `text-2xl` | 1.25rem (20px) | 700 | 1.2 | Dashboard greeting, hero text |

**Font Family:** System stack `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### 1.3 Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 0.25rem (4px) | Tight gaps |
| `space-2` | 0.5rem (8px) | Badge padding, icon gaps |
| `space-3` | 0.75rem (12px) | Card padding, grid gaps |
| `space-4` | 1rem (16px) | Standard section padding |
| `space-5` | 1.25rem (20px) | Large card padding |
| `space-6` | 1.5rem (24px) | Section margins |

### 1.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 0.5rem (8px) | Buttons, badges, small inputs |
| `radius-md` | 0.75rem (12px) | Cards, modals, logo box |
| `radius-lg` | 1rem (16px) | Large cards, action cards |
| `radius-xl` | 1.5rem (24px) | Bottom sheet corners |
| `radius-full` | 9999px | Avatar, status pills |

### 1.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.3)` | Subtle elevation |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.4)` | Cards on scroll |

---

## 2. Global Patterns

### 2.1 App Shell

```
┌─────────────────────────────┐  ← Safe area top (status bar)
│  Connected · All features   │  ← Connection status banner (24px)
├─────────────────────────────┤
│  ←  Screen Title      [Online] │  ← Header (56px + safe area)
├─────────────────────────────┤
│                             │
│      SCROLLABLE CONTENT     │  ← Main content (flex: 1)
│                             │
├─────────────────────────────┤
│  🏠  ⚡  ⊞  📊  ⋯          │  ← Bottom nav (56px + safe area)
└─────────────────────────────┘  ← Safe area bottom
```

**Container:** Max-width 480px, centered, full height, flex column.

### 2.2 Connection Status Banner

- **Height:** 24px
- **Position:** Fixed below system status bar
- **Online:** Green text `#22c55e` on dark bg, "Connected - All features available"
- **Offline:** Yellow text `#eab308`, "Offline - Limited features available"
- **Transition:** Fade in/out, 200ms ease

### 2.3 Header Pattern

**Dashboard Header:**
- Left: Brand logo (40px orange square with "P") + "PrimePOS" + "Mobile Teller Platform"
- Right: Connection status pill

**Inner Screen Header:**
- Left: Back arrow (←) button, 44px touch target
- Center: Screen title, 18px bold
- Right: Optional action (e.g., status indicator)

### 2.4 Bottom Navigation

- **Height:** 56px + `env(safe-area-inset-bottom)`
- **Background:** `--color-surface` with top border
- **Items:** 5 tabs — Home, Transact, Services, Reports, More
- **Active state:** `--color-primary` icon + text + 2px dot indicator below label
- **Inactive:** `--color-text-muted`
- **Touch target:** Full tab area, minimum 44px height
- **Transition:** Color transition 150ms ease

### 2.5 Form Input Pattern

```
LABEL (uppercase, 12px, muted, tracking-wide)
┌─────────────────────────────┐
│  👤  Placeholder text       │  ← 48px height, radius-md
└─────────────────────────────┘
```

**States:**
- **Default:** `--color-surface` bg, `--color-border` border
- **Focus:** `--color-primary` outline (2px, offset 2px)
- **Error:** `--color-danger` border, error text below
- **Disabled:** 50% opacity, no pointer events
- **Filled:** `--color-text` value, label stays above

### 2.6 Search Pattern

```
┌──────────────────────┬──────────┐
│ Enter account number │  SEARCH  │  ← Input + Button inline
└──────────────────────┴──────────┘
```

- **Input:** Flex 1, search icon optional
- **Button:** `--color-primary` bg, white text, `radius-sm`, 44px min height
- **Loading:** Button shows spinner, disabled during search
- **Success:** Account Found card slides in below (animation 200ms)
- **Not Found:** Red inline error, input gets error state

### 2.7 Account Found Card

```
┌─────────────────────────────┐
│  ACCOUNT FOUND              │  ← Label, 10px uppercase muted
│  Adediran Blessing Victoria │  ← Name, 16px bold white
│  ┌──────────┬──────────┐    │
│  │Book Bal  │Usable Bal│    │
│  │₦91.05    │₦91.05    │    │
│  └──────────┴──────────┘    │
└─────────────────────────────┘
```

- **Background:** `--color-surface-elevated`
- **Border:** 1px `--color-border`
- **Radius:** `radius-lg`
- **Padding:** `space-4`
- **Entrance:** Slide down + fade, 200ms ease-out

### 2.8 Primary Action Button

```
┌─────────────────────────────┐
│  ✓  POST TRANSACTION        │
└─────────────────────────────┘
```

- **Height:** 48px minimum
- **Background:** `--color-primary`
- **Text:** White, 14px, bold, uppercase
- **Radius:** `radius-md` (12px)
- **Full width** on mobile
- **States:**
  - Default: `--color-primary`
  - Hover/Active: `--color-primary-hover`, scale(0.98)
  - Loading: Spinner replaces icon, disabled
  - Disabled: 50% opacity

### 2.9 Transaction Item Card

```
┌─────────────────────────────┐
│  A  Adediran Blessing   ₦5K │
│     Cash In · 10:42 AM POSTED│
└─────────────────────────────┘
```

- **Left:** Avatar (initial letter, colored circle) or icon
- **Middle:** Customer name + transaction type + time
- **Right:** Amount + status badge
- **Background:** `--color-surface`
- **Badge:** Rounded pill, POSTED=green bg, PENDING=yellow bg

### 2.10 Status Badges

| Badge | Text Transform | Padding | Background | Text Color |
|-------|---------------|---------|------------|------------|
| POSTED | uppercase | 2px 8px | `rgba(34,197,94,0.15)` | `#22c55e` |
| PENDING | uppercase | 2px 8px | `rgba(234,179,8,0.15)` | `#eab308` |
| ACTIVE | uppercase | 2px 8px | `rgba(34,197,94,0.15)` | `#22c55e` |
| FAILED | uppercase | 2px 8px | `rgba(239,68,68,0.15)` | `#ef4444` |

---

## 3. Screen Specifications

### 3.1 Login Screen

**Layout:**
```
Connection banner (if offline)
Spacer (flex center)
Brand logo (64px) + "PrimePOS" + "Mobile Teller Platform"
Spacer
Sign In card:
  - "Sign In to Your Account" (20px bold)
  - Staff ID input
  - Password input + 👁 toggle
  - Sign In button (full width)
Spacer
Version footer (centered, muted)
```

**Interactions:**
- Password toggle: Tap 👁 to show/hide, icon changes to 🙈
- Sign In: Disabled until both fields filled
- Loading: Button shows spinner, inputs disabled
- Error: Shake animation on card, red error text below button
- Success: Fade out login, fade in dashboard (300ms)

**States:**
| State | Visual |
|-------|--------|
| Empty | Button disabled, placeholders visible |
| Filling | Button enabled when both fields non-empty |
| Submitting | Button loading spinner, inputs disabled |
| Error | Shake + red error message |
| Success | Fade transition to dashboard |

---

### 3.2 Dashboard (Home)

**Layout:**
```
Header: Brand + Connection pill
Greeting: "Good Morning" / "Good Afternoon" / "Good Evening"
Officer Name (20px bold) + Branch
KPI Row (3 cards):
  - Collections: ₦ amount, green "today"
  - Transactions: count, blue "today"
  - Pending Sync: count, yellow "today"
Quick Actions Label: "QUICK ACTIONS" (uppercase, muted)
Quick Actions Grid (2×2):
  - Cash In (↓ icon)
  - Cash Out (↑ icon)
  - Loan Repayment (💰 icon)
  - New Account (✨ icon)
Recent Transactions Label: "RECENT TRANSACTIONS"
Transaction list (2 items visible)
Bottom Nav: Home active
```

**KPI Card:**
- Background: `--color-surface`
- Radius: `radius-md`
- Padding: `space-3`
- Label: uppercase 10px muted
- Value: 16px bold white
- Subtitle: 10px colored (green/blue/yellow)

**Quick Action Card:**
- Background: `--color-surface`
- Radius: `radius-lg`
- Padding: `space-5` vertical
- Icon: 40px container, orange bg at 10% opacity, orange icon
- Label: 13px bold
- Subtitle: 11px muted
- Active: Scale 0.97, bg lightens

**Interactions:**
- Pull-to-refresh: Refresh KPIs and recent transactions
- KPI tap: Could navigate to relevant report
- Quick Action tap: Navigate to screen with push transition
- Transaction item tap: View transaction detail (future)

---

### 3.3 Cash In (Deposit)

**Layout:**
```
Header: ← Back + "Cash In (Deposit)" + Connection
Account Number row: Input + Search button
[Account Found card] (conditional)
Payee Name input
Transaction Amount (₦) input
Send SMS checkbox + label
Post Transaction button
```

**Account Number Input:**
- Label: "ACCOUNT NUMBER" uppercase
- Placeholder: "Enter account number"
- Search button inline, 44px height
- Numeric keyboard on mobile

**Amount Input:**
- Label: "TRANSACTION AMOUNT (₦)"
- Prefix: "₦" or "NGN" indicator
- Placeholder: "0.00"
- Numeric keyboard with decimal
- Format with comma separators on blur

**SMS Checkbox:**
- Unchecked by default
- 20px square checkbox, orange when checked
- Label: "Send SMS notification to customer"

**States:**
| State | Visual |
|-------|--------|
| Initial | Search button enabled, no card |
| Searching | Button spinner, input disabled |
| Found | Card slides in, Payee/Amount enabled |
| Not Found | Input error state, red message |
| Ready to Post | All required fields valid |
| Posting | Button loading, form disabled |
| Success | Toast "Transaction posted", navigate back or reset |

---

### 3.4 Cash Out (Withdrawal)

Identical to Cash In except:
- Title: "Cash Out (Withdrawal)"
- Button: "POST TRANSACTION"
- Additional validation: Amount ≤ Usable Balance
- Error if exceeded: "Amount exceeds usable balance" in red below amount field

---

### 3.5 Loan Repayment

**Layout:**
```
Header: ← Back + "Loan Repayment"
Loan Account Number: Input + Search
[Loan Details card] (conditional)
  - Customer Name (18px bold)
  - Grid: Product / Loan Amount
  - Current Balance / Outstanding Interest
  - Maturity Date / Status (ACTIVE badge)
Repayment Amount (₦) input
Send SMS checkbox
Post Repayment button
```

**Loan Details Card:**
- Background: `--color-surface-elevated`
- 2-column grid for details
- Labels: 10px uppercase muted
- Values: 14px bold white
- Status: Green badge

**Validation:**
- Repayment amount ≤ Current Balance + Outstanding Interest
- Error: "Repayment exceeds outstanding balance"

---

### 3.6 New Savings Account (3-Step Wizard)

**Header:**
```
← Back + "New Savings Account"
Stepper: [1 Bio Info] — [2 Contact] — [3 Account]
```

**Stepper Design:**
- 3 circles connected by lines
- Active step: Orange circle, orange label
- Completed step: Orange circle with ✓
- Future step: Gray circle, muted label
- Line: Orange if previous step complete, else gray

**Step 1 — Bio Info:**
```
Branch selector (dropdown)
First Name input
Other Name input
Surname input
Gender toggle: [Male] [Female] — single select, orange active
Date of Birth input (DD/MM/YYYY)
Continue → button
```

**Gender Toggle:**
- Two equal buttons side by side
- Selected: Orange bg, white text
- Unselected: `--color-surface` bg, muted text
- Transition: 150ms background-color

**Date of Birth:**
- Placeholder: "DD/MM/YYYY"
- Date picker on mobile (`<input type="date">` fallback)

**Step 2 — Contact:**
```
Home Address input
Business Address input
Phone Number input (placeholder: 080X XXX XXXX)
Email Address input
BVN input (11 digits, placeholder: "Enter BVN (11 digits)")
Next of Kin: Full Name
Next of Kin Relationship (placeholder: "e.g. Spouse, Parent")
Next of Kin Address
Next of Kin Phone
← Back    Continue →
```

**Step 3 — Account:**
```
Product Type selector (dropdown)
Initial Deposit (₦) input
← Back    Submit
```

**Step Validation:**
- Each step validates required fields before allowing Continue
- Invalid fields show red border + error text
- Back button preserves entered data

**Submit States:**
- Submitting: Full-screen overlay spinner + "Creating account..."
- Success: Modal "Account created successfully" with account number, then navigate to Dashboard
- Error: Modal with error details, stay on step 3

---

### 3.7 Cash Transactions Menu (Transact Tab)

**Layout:**
```
Header: "Cash Transactions"
Search bar: "Search name or account..."
Section: CASH
  - Cash In →
  - Cash Out →
  - New Account Deposit →
  - Batch BBLS Deposit →
Section: CARD
  - Card Transactions →
Bottom Nav: Transact active
```

**Menu Item:**
- Height: 64px
- Icon: 40px rounded square, colored background
- Title: 14px bold
- Subtitle: 12px muted
- Chevron (→) right aligned
- Active: scale 0.98

---

### 3.8 Batch BBLS Deposit

**Layout:**
```
Header: ← Back + "Batch BBLS Deposit"
Payee Name input (label: "Enter collector name")
Branch selector dropdown
Group selector row: Input + SELECT button
[Group Details] (conditional)
  - Group Code / Group Name / Total
  - Customer table header
  - Customer rows with amount inputs
[Send SMS checkbox]
Submit Batch button
```

**Group Selector:**
- Tap SELECT opens modal bottom sheet
- Modal: Search + scrollable group list
- Select group → modal closes, details populate

**Customer Table:**
- Headers: CUSTOMER | AMOUNT (₦)
- Rows: Customer name | Amount input
- Input is editable per row
- Total updates live as amounts change
- Total row at bottom: bold, orange

---

### 3.9 Card Transactions

**Layout:**
```
Header: ← Back + "Card Transactions"
Card Deposit →
Card Withdrawal →
Card Balance Check →
Card Statement →
Info card: "POS Terminal Required" with description
```

**Info Card:**
- Blue-tinted background (`rgba(59,130,246,0.1)`)
- Blue left border or icon
- Text: "Card transactions require a connected POS terminal device."

---

### 3.10 Customer Services (Services Tab)

**Layout:**
```
Header: "Customer Services"
Search bar: "Search service..."
Section: INQUIRIES
  - Loan Inquiry →
  - Account Balance →
  - Account Statement →
Section: ACCOUNT OPENING
  - New Savings Account →
Section: LOAN REPAYMENTS
  - Loan Repayment →
Bottom Nav: Services active
```

---

### 3.11 Loan Inquiry

**Layout:**
```
Header: ← Back + "Loan Inquiry"
Account / Loan Number: Input + Search
[Results card] (conditional)
  - Customer Name (18px bold)
  - Detail rows: Product Name, Loan Purpose, Loan Amount, Start Date, Maturity Date, Current Balance, Outstanding Interest
  - Loan Status badge (POSTED)
```

---

### 3.12 Account Balance

**Layout:**
```
Header: ← Back + "Account Balance"
CASA Account Number: Input + Search
[Results card] (conditional)
  - Account Name
  - Book Balance: ₦ amount (green)
  - Usable Balance: ₦ amount (green)
  - NUBAN: number
Reset button
```

**Reset:**
- Clears search and results
- Returns to empty search state

---

### 3.13 Account Statement

**Layout:**
```
Header: ← Back + "Account Statement"
Account number search bar
From Date: DD/MM/YYYY
To Date: DD/MM/YYYY
Fetch Statement button
[Results table] (conditional)
```

**Date Inputs:**
- Side by side (50% each)
- Native date picker on mobile
- Validation: From ≤ To

---

### 3.14 Reports (Reports Tab)

**Layout:**
```
Header: "Reports"
Summary row (2 cards):
  - Total Collections: ₦ amount
  - Transactions Today: count
Report list:
  - Loans Booked →
  - E-Ledger →
  - LO PAR Report →
  - Transaction Reports →
  - LO Performance →
Bottom Nav: Reports active
```

**Summary Cards:**
- Same style as Dashboard KPIs
- Larger padding
- Values are 20px bold

---

### 3.15 Menu / More (More Tab)

**Layout:**
```
Header: "Menu"
Officer Card (orange gradient):
  - Initials avatar
  - Name, Staff ID, Branch, Till Account
Section: OFFLINE DATA
  - Unposted Transactions (3 pending)
  - Better Life Records
  - Loan Portfolio
  - Transaction Groups
  - Loan Records
Section: SETTINGS
  - Change Password
  - Sync Data
  - App Settings
Sign Out button (red text, full width)
Bottom Nav: More active
```

**Officer Card:**
- Background: Orange gradient (`#f97316` to `#ea580c`)
- Full width within padding
- Radius: `radius-lg`
- White text
- Avatar: 48px circle, white bg, orange text

**Menu Item:**
- Icon (colored bg) + Title + Subtitle + Chevron
- Same pattern as Transact menu

**Sign Out:**
- Red text (`#ef4444`)
- Border: 1px `rgba(239,68,68,0.3)`
- Active: bg `rgba(239,68,68,0.1)`
- Confirm dialog: "Are you sure you want to sign out?"

---

### 3.16 My Profile

**Layout:**
```
Header: ← Back + "My Profile"
Officer Card (large, centered)
  - Avatar (64px)
  - Name, Staff ID
  - Change Password button
Detail rows:
  - Name | Value
  - Mobile | Value
  - Email | Value or —
  - Branch | Value
  - Department | Value
  - Till Account | Value
  - System Date | Value
```

**Detail Row:**
- Label: 13px muted
- Value: 14px white bold
- Divider: 1px border-bottom
- Padding: 12px 0

---

### 3.17 Unposted Transactions

**Layout:**
```
Header: ← Back + "Unposted Transactions"
Banner: "3 transactions pending" + "Will auto-sync when internet is restored"
Transaction list (pending items)
  - Name, type, time, amount, PENDING badge
Post All Transactions button
```

**Pending Banner:**
- Background: `rgba(234,179,8,0.1)`
- Border: 1px `rgba(234,179,8,0.2)`
- Icon: ⏳
- Text: Yellow

**Post All Button:**
- Full width, primary style
- Icon: 🔄 or ↻
- Loading: "Syncing..." with spinner
- Success: "All transactions posted", list clears

---

## 4. Component State Matrix

### 4.1 Universal States

Every screen with data loading should handle:

| State | Visual Treatment |
|-------|-----------------|
| **Loading (initial)** | Centered spinner, `--color-primary` |
| **Loading (refresh)** | Pull-to-refresh spinner or inline skeleton |
| **Empty** | Icon + "No [items] yet" + optional CTA |
| **Error** | Red icon + error message + "Retry" button |
| **Offline** | Yellow banner + cached data if available |
| **Success** | Green toast/inline confirmation, auto-dismiss 3s |

### 4.2 Button States

| State | Visual |
|-------|--------|
| Default | `--color-primary` bg, white text |
| Hover/Active | `--color-primary-hover`, scale(0.98) |
| Loading | Spinner center, text hidden, disabled |
| Disabled | 50% opacity, no hover effect |

### 4.3 Input States

| State | Visual |
|-------|--------|
| Default | `--color-surface` bg, `--color-border` |
| Focus | `--color-primary` outline 2px |
| Filled | `--color-text` value |
| Error | `--color-danger` border, red text below |
| Disabled | 50% opacity |

---

## 5. Interaction Patterns

### 5.1 Navigation Transitions

| Transition | Trigger | Duration | Easing |
|------------|---------|----------|--------|
| **Push** | Tap action to inner screen | 300ms | ease-in-out |
| **Pop** | Tap back or gesture | 300ms | ease-in-out |
| **Modal (bottom sheet)** | Tap selector | 250ms | cubic-bezier(0.4, 0, 0.2, 1) |
| **Tab switch** | Bottom nav tap | 150ms | ease |
| **Fade** | Login → Dashboard | 300ms | ease |

**Push animation:** New screen slides in from right, old screen slides out left.
**Modal:** Slides up from bottom with backdrop fade.

### 5.2 Touch & Gesture

| Gesture | Action |
|---------|--------|
| **Tap** | Primary interaction |
| **Long press** | Not used (avoid hidden actions) |
| **Swipe right** | Go back (inner screens) |
| **Pull down** | Refresh Dashboard/Lists |
| **Pull up** | Load more (future pagination) |

### 5.3 Feedback Patterns

| Action | Feedback |
|--------|----------|
| **Button tap** | Scale 0.97, 100ms |
| **Card tap** | Scale 0.98, 100ms |
| **Form submit success** | Toast "Success" + haptic (if available) |
| **Form submit error** | Shake form + focus first error |
| **Search no results** | Inline message + suggest action |
| **Sync complete** | Brief green flash on sync icon |

### 5.4 Loading Patterns

| Context | Pattern |
|---------|---------|
| **Screen load** | Full-screen centered spinner |
| **Search** | Inline button spinner |
| **Form submit** | Button spinner + disabled form |
| **List load** | Skeleton cards (3 items) |
| **Background sync** | Subtle spinner in header, non-blocking |

---

## 6. Accessibility

### 6.1 Touch Targets
- All interactive elements: minimum 44×44px
- Bottom nav items: full tab area clickable
- Buttons: full width or minimum 120px wide

### 6.2 Color & Contrast
- Text on `--color-bg`: minimum 4.5:1 ratio
- `--color-text` (#f1f5f9) on `--color-bg` (#0b1120): ~15:1 ✅
- `--color-text-muted` (#94a3b8) on `--color-bg`: ~7:1 ✅
- `--color-primary` (#f97316) on `--color-bg`: ~7:1 ✅

### 6.3 Screen Reader
- All icons paired with text labels (no icon-only buttons without aria-label)
- Form inputs: explicit `<label>` elements
- Status changes: `aria-live` regions for sync/offline notifications
- Modal dialogs: `role="dialog"`, `aria-modal="true"`, focus trap

### 6.4 Keyboard
- Logical tab order through forms
- Enter key submits forms
- Escape key closes modals
- Focus visible outline: `--color-primary` 2px

### 6.5 Motion
- Respect `prefers-reduced-motion`: disable transitions/animations
- No auto-playing animations
- Loading spinners are acceptable (essential feedback)

---

## 7. Responsive Behavior

PrimePOS is **mobile-only**. There is no tablet or desktop breakpoint support.

However, the app should gracefully handle:

| Scenario | Behavior |
|----------|----------|
| **Landscape** | Lock to portrait via manifest/orientation; or show "Rotate device" message |
| **Large phones** (>430px) | Centered layout with max-width 480px, dark bg bleeds to edges |
| **Small phones** (<360px) | Reduce padding from 16px to 12px; smaller KPI card text |
| **Notch/Dynamic Island** | `env(safe-area-inset-top)` pushes header down |
| **Home indicator** | `env(safe-area-inset-bottom)` adds padding above bottom nav |

---

## 8. Assets Checklist

| Asset | Format | Sizes | Status |
|-------|--------|-------|--------|
| App Icon | PNG | 192×192, 512×512 | ✅ Generated |
| Favicon | SVG | Vector | ✅ Created |
| Splash Screen | PNG | Various | ⬜ To be designed |
| Brand Logo | SVG/PNG | Various | ⬜ To be designed |
| Empty State Illustrations | SVG | 1× | ⬜ Optional |
| Icons | SVG/Emoji | 24px | ⬜ Replace emoji with icon library |

**Recommended Icon Library:** Lucide React (`lucide-react`) — lightweight, tree-shakeable, matches the clean line style of the app.

---

## 9. Edge Cases & Error Handling

| Scenario | UX Response |
|----------|-------------|
| **App crash during transaction** | Data saved in IndexedDB; resume on relaunch |
| **Token expiry mid-flow** | Silent refresh; if fails, save draft + redirect to login |
| **Server timeout on sync** | Retry with backoff; show "Will retry in Xs" |
| **Duplicate transaction detected** | Server returns conflict; show "Already posted" |
| **Device storage full** | Warn user; prevent new transactions until synced |
| **Invalid account number format** | Inline validation, red border, "Enter a valid account number" |
| **Negative amount entered** | Block submission, "Amount must be positive" |
| **Future date in statement** | Block, "To date cannot be in the future" |
| **Search returns 500** | "Unable to search. Please try again." + Retry button |

---

*Document generated: 2026-05-02*
*Based on: PrimePos_Screenshots.pdf (28 pages analyzed)*
*Next step: Epics & Stories breakdown*
