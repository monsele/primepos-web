---
story_id: 2.1
story_key: 2-1-dashboard-kpi-cards
epic: 2
epic_title: Dashboard & Navigation
title: Dashboard KPI Cards
status: story-created
source_files:
  - prd.md §4.2
  - architecture.md §3.1, §6.1
  - ux-design-specification.md §3.2
  - epics.md §Story 2.1
created: 2026-05-02
dependencies:
  - 1-1-officer-login
  - 1-3-app-shell-navigation
---

# Story 2.1: Dashboard KPI Cards

## User Story
As a bank officer, I want to see my daily collection totals, transaction count, and pending sync count so that I can track my performance in real time.

## Business Context
The Dashboard is the primary landing page after login. KPI cards give officers immediate visibility into their daily productivity. The Collections total is the most important metric — it directly reflects revenue collected. Pending Sync count warns officers when transactions are queued offline and need attention.

## Acceptance Criteria (BDD)

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

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/App.tsx` | Dashboard placeholder with static hero text and quick actions grid |
| `src/App.css` | `.hero`, `.quick-actions`, `.actions-grid` styles |
| `src/hooks/useNetworkStatus.ts` | Basic network status |
| `src/contexts/AuthContext.tsx` | Not yet created (Story 1.1) |
| `src/contexts/SyncContext.tsx` | Not yet created (Story 1.2) |

**What does NOT exist yet:**
- `DashboardScreen` component as a proper feature module
- KPI card component
- `useDashboardKPIs` hook with TanStack Query
- Currency formatting utility
- Pull-to-refresh implementation

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/dashboard/DashboardScreen.tsx` | Main dashboard screen composing KPIs, Quick Actions, Recent Transactions |
| `src/features/dashboard/dashboard.module.css` | Dashboard layout and section styles |
| `src/features/dashboard/KPICards.tsx` | 3-card KPI row component |
| `src/features/dashboard/kpi-cards.module.css` | KPI card styles |
| `src/features/dashboard/useDashboardKPIs.ts` | TanStack Query hook for `/api/reports/daily-summary` |
| `src/utils/currency.ts` | NGN formatting: `formatNaira(248500) → "₦248,500.00"` |
| `src/components/PullToRefresh/PullToRefresh.tsx` | Touch-based pull-to-refresh wrapper |
| `src/components/PullToRefresh/PullToRefresh.module.css` | Pull indicator animation styles |

### Files to Update

| File | Change |
|------|--------|
| `src/App.tsx` | Replace dashboard placeholder with `<DashboardScreen>` when `currentScreen === 'dashboard'` |

---

## Technical Requirements

### Architecture Compliance

1. **Server State:** Use TanStack Query v5 for KPI data fetching. Configure with `staleTime: 5 * 60 * 1000` (5 min).
2. **No Redux:** Use React Context for any client-side dashboard state.
3. **Currency:** Use `Intl.NumberFormat` with `currency: 'NGN'` or a custom formatter for consistent ₦ display.
4. **Pull to refresh:** Implement with touch events (`touchstart`, `touchmove`, `touchend`). No external libraries.

### KPI Data Spec

```typescript
interface DashboardKPIs {
  collections: number        // in kobo/cent (smallest unit), display as NGN
  transactionCount: number
  pendingSyncCount: number
}

// API: GET /api/reports/daily-summary
// Response:
{
  "collections": 24850000,      // ₦248,500.00
  "transactionCount": 34,
  "pendingSyncCount": 0
}
```

For MVP, mock the API response:
```typescript
export async function fetchDailySummary(): Promise<DashboardKPIs> {
  await new Promise(r => setTimeout(r, 600))
  return {
    collections: 24850000,
    transactionCount: 34,
    pendingSyncCount: 0,
  }
}
```

### KPI Card Visual Spec

**Layout:** Horizontal row of 3 equal-width cards, gap 12px.

**Each Card:**
- Background: `--color-surface`
- Border-radius: `--radius-lg` (1rem)
- Padding: 1rem
- Border: 1px solid rgba(255, 255, 255, 0.05)

**Content:**
- Label: 11px, uppercase, `--color-text-muted`, letter-spacing 0.05em
- Value: 20px, bold, `--color-text`
- Subtitle: 11px, `--color-success` (green) normally; `--color-warning` (yellow) when `pendingSyncCount > 0`

**Tap Behavior:**
- Collections card: no action (display only)
- Transactions card: no action (display only)
- Pending Sync card: navigates to Unposted Transactions screen (when implemented)

### Pull-to-Refresh Spec

**Behavior:**
- Detect downward drag on dashboard scrollable area when scrolled to top (`scrollTop === 0`)
- Minimum drag distance: 80px to trigger refresh
- Visual: Circular spinner appears below header, rotates during fetch
- On release > threshold: call `queryClient.invalidateQueries(['daily-summary'])`
- On completion: spinner hides with fade-out

**Implementation:** Use `touchstart`, `touchmove`, `touchend` on the dashboard container. Track `startY`, calculate delta. Apply `transform: translateY(delta)` to a refresh indicator element.

---

## File Structure Requirements

```
src/
  features/
    dashboard/
      DashboardScreen.tsx       ← NEW: Composed dashboard
      dashboard.module.css
      KPICards.tsx              ← NEW: 3-card KPI row
      kpi-cards.module.css
      useDashboardKPIs.ts       ← NEW: TanStack Query hook
  components/
    PullToRefresh/
      PullToRefresh.tsx         ← NEW: Touch-based PTR wrapper
      PullToRefresh.module.css
  utils/
    currency.ts                 ← NEW: NGN formatter
  App.tsx                       ← UPDATE: Render DashboardScreen
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `formatNaira` | `0 → "₦0.00"`, `248500 → "₦248,500.00"`, handles fractional amounts |
| `KPICards` | Renders 3 cards with correct labels and values; pending sync shows yellow subtitle |
| `useDashboardKPIs` | Returns data from query, shows loading state, handles error |

### Integration Tests

| Test | Description |
|------|-------------|
| Dashboard render | DashboardScreen renders with KPIs, Quick Actions placeholder, Recent Transactions placeholder |
| Pull to refresh | Drag down triggers refetch, spinner visible, data updates |

---

## Common Pitfalls to Avoid

1. **DO NOT** hardcode currency symbols — use the formatter utility everywhere
2. **DO NOT** fetch KPIs on every render — TanStack Query caching is essential
3. **DO NOT** block the UI during refresh — show spinner but keep content visible
4. **DO NOT** forget to handle the case where `pendingSyncCount > 0` (yellow warning color)
5. **DO NOT** implement PTR with a library — native touch events are sufficient and more performant
6. **DO NOT** forget to convert API amounts (typically in kobo) to NGN for display

---

## Design Tokens Reference

Use tokens from `src/index.css`.

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 1.1** (Login) | Officer ID needed for API query parameter |
| **Story 1.3** (App Shell) | Dashboard is the first screen rendered by NavigationContext |
| **Story 2.2** (Quick Actions) | Quick Actions grid sits below KPI cards on the same screen |
| **Story 2.3** (Recent Transactions) | Recent transactions list sits below Quick Actions |
| **Story 8.2** (Queue Manager) | Pending sync count comes from SyncContext / queue storage |

---

## Completion Checklist

- [ ] `DashboardScreen` composes KPIs in correct layout
- [ ] `KPICards` renders 3 cards with label, value, subtitle
- [ ] Collections formatted as "₦xxx,xxx.xx"
- [ ] Pending sync shows yellow subtitle when > 0
- [ ] `useDashboardKPIs` uses TanStack Query with 5min staleTime
- [ ] Mock API returns realistic data
- [ ] `formatNaira` utility handles edge cases (0, large numbers, decimals)
- [ ] Pull-to-refresh triggers data refetch
- [ ] Unit tests for formatter, KPI cards, hook
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
