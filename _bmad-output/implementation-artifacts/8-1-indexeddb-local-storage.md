---
story_id: 8.1
story_key: 8-1-indexeddb-local-storage
epic: 8
epic_title: Offline-First Infrastructure
title: IndexedDB Local Storage
status: ready-for-dev
source_files:
  - prd.md §4.9
  - architecture.md §5.1
  - ux-design-specification.md §2.1
  - epics.md §Story 8.1
created: 2026-05-02
dependencies:
  - 1-1-officer-login
---

# Story 8.1: IndexedDB Local Storage

## User Story
As a developer, I want a robust local database so that all app data can be stored and retrieved offline.

## Business Context
IndexedDB is the foundation of all offline capabilities. Without a well-structured local database, no offline feature can work. This story establishes the schema, initialization, and CRUD wrappers that all other stories depend on.

## Acceptance Criteria (BDD)

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

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `primepos-web/package.json` | `idb-keyval` may be installed (Story 1.1 dependency) |

**What does NOT exist yet:**
- IndexedDB database initialization
- Object store schema definition
- CRUD wrappers per entity

### Files to Create

| File | Purpose |
|------|---------|
| `src/services/storage/db.ts` | Database initialization, store creation, schema |
| `src/services/storage/accounts.ts` | Account CRUD operations |
| `src/services/storage/loans.ts` | Loan CRUD operations |
| `src/services/storage/groups.ts` | Group CRUD operations |
| `src/services/storage/transactions.ts` | Transaction queue CRUD |
| `src/services/storage/officers.ts` | Officer cache CRUD |
| `src/services/storage/syncMetadata.ts` | Sync timestamp metadata |
| `src/services/storage/types.ts` | Storage layer types |

---

## Technical Requirements

### Architecture Decision

Use `idb-keyval` for simple key-value operations where possible. Use native `idb` (via the `idb` npm package) for advanced schema with indexes if needed.

For MVP, `idb-keyval` is sufficient:
```typescript
import { set, get, del, keys, clear } from 'idb-keyval'
```

Each store is a namespaced key pattern:
```typescript
const accountKey = (id: string) => `account:${id}`
const loanKey = (id: string) => `loan:${id}`
// etc.
```

### Database Schema

```typescript
interface DBSchema {
  accounts: Record<string, Account>
  loans: Record<string, Loan>
  groups: Record<string, Group>
  transactionQueue: Record<string, QueuedTransaction>
  officers: Record<string, Officer>
  syncMetadata: {
    lastSyncAccounts: string
    lastSyncLoans: string
    lastSyncGroups: string
  }
}
```

### CRUD Interface Pattern

```typescript
// Per-entity storage module
interface Storage<T> {
  get(id: string): Promise<T | undefined>
  set(id: string, value: T): Promise<void>
  del(id: string): Promise<void>
  getAll(): Promise<T[]>
  clear(): Promise<void>
}
```

### Initialization

```typescript
// db.ts
export async function initDB(): Promise<void> {
  // idb-keyval auto-creates the database on first use
  // No explicit initialization needed, but we can verify stores
}
```

### Storage Modules

Each module:
- Exports `get`, `set`, `del`, `getAll`, `clear` functions
- Uses typed keys
- Handles errors gracefully

Example:
```typescript
// accounts.ts
import { get, set, del, keys } from 'idb-keyval'

const KEY_PREFIX = 'account:'

export async function getAccount(id: string): Promise<Account | undefined> {
  return get(`${KEY_PREFIX}${id}`)
}

export async function setAccount(id: string, account: Account): Promise<void> {
  return set(`${KEY_PREFIX}${id}`, account)
}

export async function getAllAccounts(): Promise<Account[]> {
  const allKeys = await keys()
  const accountKeys = allKeys.filter(k => String(k).startsWith(KEY_PREFIX))
  const values = await Promise.all(accountKeys.map(k => get(k)))
  return values.filter(Boolean) as Account[]
}
```

---

## File Structure Requirements

```
src/
  services/
    storage/
      db.ts                  ← NEW: Database init
      types.ts               ← NEW: Storage types
      accounts.ts            ← NEW: Account CRUD
      loans.ts               ← NEW: Loan CRUD
      groups.ts              ← NEW: Group CRUD
      transactions.ts        ← NEW: Transaction queue CRUD
      officers.ts            ← NEW: Officer CRUD
      syncMetadata.ts        ← NEW: Sync metadata CRUD
```

---

## Testing Requirements

### Unit Tests

| Test | Description |
|------|-------------|
| `db.init` | Database initializes without error |
| `accounts` CRUD | Set → get → update → delete → getAll → clear |
| `loans` CRUD | Same pattern |
| `transactions` CRUD | Same pattern |
| Data persistence | Data survives page reload (integration) |

---

## Common Pitfalls to Avoid

1. **DO NOT** use localStorage — it has a 5MB limit and is synchronous
2. **DO NOT** forget error handling — IndexedDB can fail in private browsing mode
3. **DO NOT** store large binary data in IndexedDB — keep it to JSON objects
4. **DO NOT** forget to handle the case where IndexedDB is not available (fallback to memory)

---

## Cross-Story Dependencies

| Dependency | Impact |
|------------|--------|
| **All transaction stories** | Queue transactions to IndexedDB |
| **All inquiry stories** | Read cached data from IndexedDB |
| **Story 8.2** (Queue Manager) | Reads/writes transactionQueue store |
| **Story 8.3** (Offline Cache) | Reads/writes accounts, loans, groups stores |
| **Story 1.1** (Login) | Caches officer data in officers store |


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

- [ ] `db.ts` initializes database
- [ ] All 6 storage modules created (accounts, loans, groups, transactions, officers, syncMetadata)
- [ ] Each module has get, set, del, getAll, clear
- [ ] Types defined in `storage/types.ts`
- [ ] Error handling for IndexedDB unavailability
- [ ] Unit tests for all CRUD operations
- [ ] Integration test for data persistence across reloads
- [ ] No lint errors
- [ ] Build succeeds

---

*Story context compiled from PRD, Architecture, UX Design, and Epics documents.*
*Ready for development.*
