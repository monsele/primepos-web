---
story_id: 8.2
story_key: 8-2-transaction-queue-manager
epic: 8
epic_title: Offline-First Infrastructure
title: Transaction Queue Manager
status: ready-for-dev
source_files:
  - prd.md §4.9
  - architecture.md §5.2, §5.3
  - ux-design-specification.md §3.10
  - epics.md §Story 8.2
created: 2026-05-02
dependencies:
  - 8-1-indexeddb-local-storage
  - 1-2-connection-status-offline-awareness
---

# Story 8.2: Transaction Queue Manager

## User Story
As a bank officer, I want my transactions to be queued locally when offline and posted automatically when online so that no transaction is lost.

## Business Context
The transaction queue is the heart of offline-first banking. Every transaction that cannot be posted immediately must be saved locally with full context. When connectivity returns, the queue must be processed automatically, in order, with retry logic for transient failures. Officers must also be able to view the queue and manually trigger posting.

## Acceptance Criteria (BDD)

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

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `src/services/storage/transactions.ts` | Transaction queue CRUD (Story 8.1) |
| `src/contexts/SyncContext.tsx` | Placeholder sync state (Story 1.2) |
| `src/hooks/useNetworkStatus.ts` | Network status (Story 1.2) |

**What does NOT exist yet:**
- `SyncEngine` class
- Queue processing logic
- Unposted Transactions screen
- Retry with exponential backoff
- Progress indicator for batch post

### Files to Create

| File | Purpose |
|------|---------|
| `src/services/syncEngine.ts` | Core sync orchestrator: process queue, retry logic, error handling |
| `src/services/queueManager.ts` | High-level queue operations: add, remove, getPending, getAll |
| `src/features/unposted/UnpostedTransactionsScreen.tsx` | List of pending transactions |
| `src/features/unposted/unposted-transactions.module.css` | Styles |
| `src/features/unposted/useUnpostedTransactions.ts` | Hook to read and manage queue |
| `src/components/ProgressBar/ProgressBar.tsx` | Batch post progress indicator |
| `src/components/ProgressBar/ProgressBar.module.css` | Progress bar styles |

### Files to Update

| File | Change |
|------|--------|
| `src/contexts/SyncContext.tsx` | Wire sync engine, update pendingCount from queue |
| `src/App.tsx` | Listen for online event to trigger auto-sync |

---

## Technical Requirements

### Queued Transaction Type

```typescript
interface QueuedTransaction {
  id: string                    // local UUID
  type: 'CashIn' | 'CashOut' | 'LoanRepayment' | 'BatchDeposit' | 'NewAccountDeposit'
  payload: unknown              // type-specific payload
  status: 'PENDING' | 'POSTED' | 'FAILED'
  errorMessage?: string
  retryCount: number
  createdAt: string             // ISO 8601
  postedAt?: string
}
```

### SyncEngine

```typescript
class SyncEngine {
  async processQueue(): Promise<SyncResult>
  async processItem(item: QueuedTransaction): Promise<void>
  private shouldRetry(item: QueuedTransaction): boolean
  private calculateBackoff(retryCount: number): number
}

interface SyncResult {
  processed: number
  succeeded: number
  failed: number
  errors: { id: string; message: string }[]
}
```

**Processing Rules:**
1. Process queue in FIFO order (oldest first)
2. Max retries: 3
3. Backoff: `2^retryCount * 1000ms` (1s, 2s, 4s)
4. On 4xx error: mark FAILED (don't retry)
5. On 5xx or network error: retry if under max retries
6. Update SyncContext after each batch

### Auto-Sync on Reconnect

```typescript
// In App.tsx or a dedicated hook
useEffect(() => {
  if (cameOnline && pendingCount > 0) {
    syncEngine.processQueue()
  }
}, [cameOnline, pendingCount])
```

### Unposted Transactions Screen

- List of all PENDING and FAILED items
- Each item: customer name, amount, type, time, status badge
- "POST ALL TRANSACTIONS" button at bottom
- Pull to refresh (re-check status)
- Tap item to see details (read-only)

### Progress Bar

- Width: 100% of container
- Height: 4px
- Background: `--color-surface-elevated`
- Fill: `--color-primary`
- Animated width transition
- Shows "Processing X of Y..." text

---

## File Structure Requirements

```
src/
  services/
    syncEngine.ts                    ← NEW
    queueManager.ts                  ← NEW
  features/
    unposted/
      UnpostedTransactionsScreen.tsx ← NEW
      unposted-transactions.module.css ← NEW
      useUnpostedTransactions.ts     ← NEW
  components/
    ProgressBar/
      ProgressBar.tsx                ← NEW
      ProgressBar.module.css         ← NEW
  contexts/
    SyncContext.tsx                  ← UPDATE
  App.tsx                            ← UPDATE
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `queueManager.add` | Adds transaction to queue with UUID |
| `queueManager.getPending` | Returns only PENDING items |
| `syncEngine.processQueue` | Processes items in order, updates status |
| `syncEngine` retry | Retries failed items up to 3 times |
| `syncEngine` 4xx handling | Marks 4xx errors as FAILED, no retry |

### Integration Tests

| Test | Description |
|------|-------------|
| Offline → Online | Queue item added offline → go online → auto-sync → status POSTED |
| Batch post | Tap "POST ALL" → progress bar → all items processed |

---

## Common Pitfalls to Avoid

1. **DO NOT** process queue items in parallel — FIFO order matters for dependent transactions
2. **DO NOT** retry 4xx errors indefinitely — they are client errors
3. **DO NOT** forget to update SyncContext pendingCount after processing
4. **DO NOT** block the UI during sync — run in background
5. **DO NOT** forget to handle the case where the app comes online while in background

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **Story 8.1** (IndexedDB) | Queue stored in IndexedDB transactionQueue store |
| **Story 1.2** (Connection Status) | Auto-sync triggered by online event |
| **All transaction stories** | Queue transactions when offline |
| **Story 2.1** (KPI Cards) | Pending sync count from SyncContext |


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

- [ ] `SyncEngine` class with FIFO processing
- [ ] Retry logic with exponential backoff (max 3 retries)
- [ ] 4xx errors marked FAILED without retry
- [ ] `queueManager` with add, getPending, getAll, remove
- [ ] `UnpostedTransactionsScreen` lists all pending/failed items
- [ ] "POST ALL TRANSACTIONS" button with progress bar
- [ ] Auto-sync on reconnect
- [ ] SyncContext pendingCount stays accurate
- [ ] Unit tests for sync engine and queue manager
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
