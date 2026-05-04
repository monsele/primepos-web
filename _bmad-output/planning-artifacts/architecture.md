---
project: PrimePOS
document: Technical Architecture
version: 1.0.0
date: 2026-05-02
author: Architecture Team
status: Draft
related:
  - prd.md
---

# PrimePOS — Technical Architecture

## 1. Architecture Overview

### 1.1 Philosophy
PrimePOS follows an **offline-first, mobile-first** architecture. The app must remain fully functional during network outages common in field banking operations. All user actions are optimistic — they write to local storage immediately and sync to the server opportunistically.

### 1.2 Architectural Drivers

| Driver | Priority | Implication |
|--------|----------|-------------|
| **Offline-First** | Critical | All writes local-first; sync is background concern |
| **Mobile-Only** | Critical | Portrait UI, touch-optimized, no desktop breakpoint support |
| **Performance** | High | < 2s first paint on 3G; instant screen transitions |
| **Reliability** | High | No data loss on crash; atomic local transactions |
| **Maintainability** | Medium | Clear module boundaries; flat folder structure |
| **Extensibility** | Medium | Plugin-style feature modules; easy to add new transaction types |

### 1.3 High-Level Architecture

```
┌─────────────────────────────────────────────┐
│              Presentation Layer              │
│  (React Components + Hooks + Contexts)       │
├─────────────────────────────────────────────┤
│              Application Layer               │
│  (Services, State Management, Business Logic)│
├─────────────────────────────────────────────┤
│              Infrastructure Layer            │
│  (API Client, Offline Storage, Sync Engine)  │
├─────────────────────────────────────────────┤
│              Platform Layer                  │
│  (PWA, Service Worker, Device APIs)          │
└─────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Core Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Framework** | React | 19.x | Concurrent features, latest patterns, strong ecosystem |
| **Language** | TypeScript | ~6.0 | Type safety, IntelliSense, refactoring confidence |
| **Build Tool** | Vite | 8.x | Fast dev server, optimized builds, great PWA plugin |
| **Bundler Plugin** | vite-plugin-pwa | 1.2 | Auto SW generation, Workbox integration, manifest |
| **Styling** | CSS Modules + CSS Variables | Native | Zero runtime cost, scoped styles, theming |
| **Icons** | SVG + Emoji (placeholder) | Native | No icon library bundle; replace with Lucide later if needed |

### 2.2 State & Data

| Concern | Technology | Rationale |
|---------|-----------|-----------|
| **Server State** | TanStack Query (React Query) v5 | Caching, background sync, deduping, offline support |
| **Client State** | React Context + useReducer | Simple, no boilerplate, sufficient for app-level state |
| **Offline Storage** | IndexedDB (via idb-keyval) | Structured storage, large capacity, async API |
| **Form State** | Native React + controlled inputs | Simpler than form libraries for our wizard patterns |

### 2.3 Networking & Sync

| Concern | Technology | Rationale |
|---------|-----------|-----------|
| **HTTP Client** | Native fetch + wrapper | Modern, no extra bundle; simple wrapper for auth headers |
| **Background Sync** | Workbox (via vite-plugin-pwa) | Auto-generated SW with runtime caching strategies |
| **Retry Logic** | Exponential backoff (custom) | Simple, fits our sync engine needs |

### 2.4 Development & Quality

| Concern | Technology | Rationale |
|---------|-----------|-----------|
| **Linting** | ESLint + typescript-eslint | Standard, catches common issues |
| **Testing** | Vitest (unit) + Playwright (E2E) | Vite-native test runner, Playwright for PWA/mobile testing |
| **Type Checking** | tsc --noEmit | Strict mode enabled |

### 2.5 Rejected Alternatives

| Alternative | Why Rejected |
|-------------|-------------|
| Next.js | Overkill for a PWA; no SSR needed; adds complexity |
| Redux / Zustand | Unnecessary for this app's state complexity; Context + Query sufficient |
| Tailwind CSS | Would add bundle size and learning curve; CSS Modules give full control |
| React Hook Form | Our forms are simple wizards; native controlled inputs are clearer |
| Axios | fetch is sufficient; one less dependency |
| Ionic / Capacitor | We want a PWA, not a hybrid app; keeps deployment simple |

---

## 3. Project Structure

### 3.1 Directory Layout

```
primepos-web/
├── public/                    # Static assets, PWA icons, manifest
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── favicon.svg
├── src/
│   ├── main.tsx              # Entry point, SW registration
│   ├── App.tsx               # Root component, routing, providers
│   ├── index.css             # Global styles, CSS variables, reset
│   │
│   ├── api/                  # API layer
│   │   ├── client.ts         # Fetch wrapper, auth headers, base URL
│   │   ├── auth.ts           # Auth endpoints
│   │   ├── accounts.ts       # Account endpoints
│   │   ├── transactions.ts   # Transaction endpoints
│   │   ├── loans.ts          # Loan endpoints
│   │   ├── groups.ts         # Group endpoints
│   │   ├── reports.ts        # Report endpoints
│   │   └── sync.ts           # Sync endpoints
│   │
│   ├── components/           # Shared UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.css
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── BottomNav/
│   │   ├── Header/
│   │   ├── SearchField/
│   │   ├── AccountFoundCard/
│   │   ├── TransactionItem/
│   │   ├── OfflineIndicator/
│   │   └── LoadingSpinner/
│   │
│   ├── hooks/                # Shared custom hooks
│   │   ├── useNetworkStatus.ts
│   │   ├── useOfflineQueue.ts
│   │   ├── useSync.ts
│   │   └── useAuth.ts
│   │
│   ├── contexts/             # React Contexts
│   │   ├── AuthContext.tsx
│   │   └── SyncContext.tsx
│   │
│   ├── services/             # Business logic & offline engine
│   │   ├── storage/
│   │   │   ├── db.ts         # IndexedDB init + schema
│   │   │   ├── accounts.ts   # Account local CRUD
│   │   │   ├── transactions.ts # Transaction queue CRUD
│   │   │   ├── loans.ts      # Loan local CRUD
│   │   │   └── groups.ts     # Group local CRUD
│   │   ├── syncEngine.ts     # Core sync orchestrator
│   │   └── queueManager.ts   # Transaction queue logic
│   │
│   ├── features/             # Feature modules (co-located)
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── login.module.css
│   │   │   └── useLogin.ts
│   │   ├── dashboard/
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── RecentTransactions.tsx
│   │   │   └── dashboard.module.css
│   │   ├── cash-in/
│   │   ├── cash-out/
│   │   ├── loan-repayment/
│   │   ├── new-account/
│   │   ├── batch-bbls/
│   │   ├── inquiries/
│   │   │   ├── LoanInquiryScreen.tsx
│   │   │   ├── BalanceInquiryScreen.tsx
│   │   │   └── StatementScreen.tsx
│   │   ├── reports/
│   │   ├── menu/
│   │   └── offline/
│   │
│   ├── types/                # Global TypeScript types
│   │   ├── auth.ts
│   │   ├── account.ts
│   │   ├── transaction.ts
│   │   ├── loan.ts
│   │   ├── group.ts
│   │   └── api.ts
│   │
│   └── utils/                # Utilities
│       ├── currency.ts       # NGN formatting
│       ├── date.ts           # Date formatting/parsing
│       ├── validation.ts     # Form validators
│       └── constants.ts      # App constants
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── package.json
```

### 3.2 Co-Location Principle
Each feature module contains its screen component, styles, and hooks together. Shared components live in `components/`. This prevents deep folder nesting and makes features self-contained.

### 3.3 Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Components | PascalCase | `LoginScreen.tsx`, `BottomNav.tsx` |
| Hooks | camelCase, `use` prefix | `useNetworkStatus.ts` |
| Contexts | PascalCase, `Context` suffix | `AuthContext.tsx` |
| Services | camelCase | `syncEngine.ts`, `queueManager.ts` |
| Types/Interfaces | PascalCase | `Transaction`, `Account` |
| Enums | PascalCase | `TransactionStatus` |
| CSS Modules | kebab-case, `.module.css` | `dashboard.module.css` |
| API functions | camelCase, domain prefix | `fetchAccount`, `postCashIn` |

---

## 4. State Management Architecture

### 4.1 State Categories

| Category | Storage | Management | Examples |
|----------|---------|------------|----------|
| **Server State** | API + IndexedDB cache | TanStack Query | Account balances, loan details, reports |
| **UI State** | React State | useState/useReducer | Form inputs, modals, active tab |
| **App State** | React Context | Context + Reducer | Auth user, sync status, network status |
| **Persistent State** | IndexedDB | Custom service | Transaction queue, offline data |

### 4.2 TanStack Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      gcTime: 10 * 60 * 1000,          // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      networkMode: 'offlineFirst',      // Critical: serve cache when offline
    },
    mutations: {
      retry: 3,
      networkMode: 'offlineFirst',
    },
  },
})
```

### 4.3 Auth Context

```typescript
interface AuthState {
  user: Officer | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Actions: LOGIN, LOGOUT, SET_USER, SET_LOADING
// Persist token securely (not localStorage for security)
// Use memory-only token + refresh on app load
```

### 4.4 Sync Context

```typescript
interface SyncState {
  isSyncing: boolean
  lastSyncAt: Date | null
  pendingCount: number
  syncError: string | null
}

// Actions: START_SYNC, SYNC_SUCCESS, SYNC_ERROR, UPDATE_PENDING_COUNT
```

---

## 5. Offline-First Data Layer

### 5.1 IndexedDB Schema

```typescript
// Database: PrimePOSDB
// Version: 1

interface DBSchema {
  accounts: {
    key: string          // accountNumber
    value: Account
    indexes: ['branchId', 'status']
  }
  loans: {
    key: string          // loanAccountNumber
    value: Loan
    indexes: ['customerAccountNumber', 'status']
  }
  groups: {
    key: string          // groupCode
    value: Group
    indexes: ['branchId']
  }
  transactionQueue: {
    key: string          // localId (UUID)
    value: QueuedTransaction
    indexes: ['status', 'createdAt', 'type']
  }
  officers: {
    key: string          // staffId
    value: Officer
  }
  syncMetadata: {
    key: string          // entity name
    value: { lastSyncAt: string; checksum?: string }
  }
}
```

### 5.2 Transaction Queue Lifecycle

```
User Action
    ↓
[1] Validate locally (balance checks, required fields)
    ↓
[2] Write to IndexedDB transactionQueue (status: PENDING)
    ↓
[3] Optimistic UI update (show success, update dashboard)
    ↓
[4] If ONLINE → immediately attempt API post
        ↓
    [4a] API Success → mark POSTED, remove from queue
    [4b] API Failure → keep PENDING, schedule retry
    ↓
[5] If OFFLINE → remain PENDING, queue for later sync
    ↓
[6] On connectivity restored → SyncEngine processes queue
```

### 5.3 Sync Engine

```typescript
class SyncEngine {
  // Processes pending transactions in order
  async syncPendingTransactions(): Promise<SyncResult>

  // Downloads offline data package
  async syncOfflineData(): Promise<void>

  // Background sync triggered by SW
  async backgroundSync(): Promise<void>

  // Conflict resolution: server wins for posted txns
  resolveConflict(local: QueuedTransaction, server: Transaction): Transaction
}
```

### 5.4 Caching Strategy by Entity

| Entity | Local Storage | Sync Strategy | TTL |
|--------|---------------|---------------|-----|
| Officer Profile | IndexedDB | On login | Session |
| Account (searched) | IndexedDB | On search + background | 24h |
| Loan (searched) | IndexedDB | On search + background | 24h |
| Group List | IndexedDB | Daily sync | 24h |
| Transaction Queue | IndexedDB | Immediate attempt + retry | Until posted |
| Reports | Memory + Query cache | On request | 5min |

---

## 6. API Integration Layer

### 6.1 API Client Design

```typescript
// src/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

interface ApiClientOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  body?: unknown
  requiresAuth?: boolean
}

async function apiClient<T>(options: ApiClientOptions): Promise<ApiResponse<T>>
```

### 6.2 Request Flow

```
Component calls API function
    ↓
API function calls apiClient
    ↓
Add Authorization header (Bearer token)
    ↓
Add Content-Type: application/json
    ↓
Make fetch request with timeout (10s default)
    ↓
Parse JSON response
    ↓
Handle HTTP errors (4xx, 5xx) → throw ApiError
    ↓
Return typed response
```

### 6.3 Error Handling

| Error Type | HTTP | User Feedback | Action |
|------------|------|---------------|--------|
| Network Error | 0 | "Connection failed. Saved offline." | Queue for retry |
| Unauthorized | 401 | "Session expired. Please log in." | Redirect to login |
| Forbidden | 403 | "You don't have permission." | Show error, log |
| Not Found | 404 | "Record not found." | Show error |
| Validation | 422 | Show field-specific errors | Keep form open |
| Server Error | 500+ | "Server error. Please try again." | Retry with backoff |

### 6.4 Environment Configuration

```typescript
// .env.development
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=PrimePOS
VITE_APP_VERSION=1.0.0

// .env.production
VITE_API_URL=https://api.primepos.example.com/api
VITE_APP_NAME=PrimePOS
VITE_APP_VERSION=1.0.0
```

---

## 7. Component Architecture

### 7.1 Screen Component Pattern

Every screen follows this structure:

```typescript
// Feature Screen Pattern
function FeatureScreen() {
  // 1. Hooks: state, network status, navigation
  const { isOnline } = useNetworkStatus()
  const [step, setStep] = useState(1)

  // 2. Query hooks (TanStack Query)
  const { data, isLoading } = useQuery({...})

  // 3. Mutation hooks
  const mutation = useMutation({...})

  // 4. Handlers
  const handleSubmit = async () => { ... }

  // 5. Render
  return (
    <div className={styles.screen}>
      <ScreenHeader title="Feature" />
      {isLoading ? <LoadingSpinner /> : (
        <form onSubmit={handleSubmit}>...</form>
      )}
    </div>
  )
}
```

### 7.2 Shared Components

| Component | Props | Usage |
|-----------|-------|-------|
| `Button` | variant, size, disabled, loading, onClick | All CTAs |
| `Input` | label, type, value, onChange, error, placeholder | All forms |
| `SearchField` | onSearch, placeholder, loading | Account/loan lookup |
| `AccountFoundCard` | account: Account | Cash In/Out screens |
| `Card` | children, className | Content containers |
| `BottomNav` | activeTab | Global navigation |
| `Header` | title, showBack, rightAction | Screen headers |
| `LoadingSpinner` | size | Loading states |
| `OfflineIndicator` | — | Global offline banner |

### 7.3 CSS Architecture

**Global (`index.css`):**
- CSS custom properties (design tokens)
- CSS reset (mobile-optimized)
- Utility classes (sr-only, etc.)

**Module (`*.module.css`):**
- One module per component/screen
- BEM-like naming without the BEM syntax (using CSS Modules scoping)
- Mobile-first media queries (only `min-width`)

**Example:**
```css
/* dashboard.module.css */
.actionsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .actionsGrid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 8. PWA & Service Worker Strategy

### 8.1 vite-plugin-pwa Configuration

Already configured in `vite.config.ts`:
- **Manifest:** Auto-generated from config
- **Precache:** All static assets (JS, CSS, HTML, icons)
- **Runtime Caching:**
  - Google Fonts → CacheFirst (1 year)
  - API calls → NetworkFirst (24h, 10s timeout)
- **Update Strategy:** Auto-update with reload prompt

### 8.2 Service Worker Behavior

| Event | Behavior |
|-------|----------|
| **Install** | Precache static assets; cache app shell |
| **Activate** | Clean old caches; claim clients |
| **Fetch (static)** | Serve from cache; fallback to network |
| **Fetch (API)** | Network first; fallback to cache if offline |
| **Background Sync** | Trigger sync engine when online |
| **Push** | (Future) Notification for sync completion |

### 8.3 Update Flow

```
New version deployed
    ↓
SW detects update in background
    ↓
Store "update available" flag
    ↓
App shows update banner: "Update available - Reload"
    ↓
User taps Reload
    ↓
Skip waiting, activate new SW, reload page
```

---

## 9. Security Architecture

### 9.1 Authentication Flow

```
User enters Staff ID + Password
    ↓
POST /api/auth/login
    ↓
Server returns: { accessToken, refreshToken, user }
    ↓
Store accessToken in memory (never localStorage)
Store refreshToken in httpOnly cookie (server handles)
    ↓
All API calls include: Authorization: Bearer {token}
    ↓
On 401: Attempt silent refresh; if fails → redirect to login
```

### 9.2 Data Protection

| Layer | Measure |
|-------|---------|
| **Transport** | HTTPS only |
| **Token Storage** | Memory-only access token |
| **Refresh Token** | httpOnly secure cookie |
| **Local Data** | IndexedDB (device-level encryption where OS supports) |
| **Sensitive Fields** | BVN masked in UI; never logged |
| **Session Timeout** | Auto-logout after 15 min inactivity |

### 9.3 Input Validation

- All form inputs validated client-side AND server-side
- Account numbers: numeric format validation
- Amounts: positive decimal, max limits
- BVN: exactly 11 digits
- Dates: DD/MM/YYYY format

---

## 10. Testing Strategy

### 10.1 Testing Pyramid

```
        /\
       /  \     E2E (Playwright) — Critical flows
      /____\    ~10 tests
     /      \
    /________\  Integration (Vitest + React Testing Library)
   /          \  ~50 tests
  /____________\ Unit (Vitest) — Utilities, hooks, services
                ~100 tests
```

### 10.2 Test Categories

| Category | Tool | Scope |
|----------|------|-------|
| **Unit** | Vitest | Pure functions, validators, formatters, hook logic |
| **Integration** | Vitest + RTL | Component rendering, form submission, API mocking |
| **E2E** | Playwright | Full user flows: login → cash in → logout |
| **Visual** | Playwright + screenshots | Screen-level regression testing |

### 10.3 Critical Test Paths

1. Login → Dashboard → Cash In → Search Account → Post Transaction
2. Login → Loan Repayment → Search Loan → Post Repayment
3. Login → New Account → Complete 3-step wizard → Submit
4. Offline: Create transaction → Go offline → Verify queue → Go online → Verify sync
5. Login → Reports → Verify data loads

---

## 11. Build & Deployment

### 11.1 Build Output

```
dist/
├── index.html
├── manifest.webmanifest
├── sw.js                 # Service worker
├── workbox-*.js          # Workbox runtime
├── registerSW.js         # SW registration helper
├── favicon.svg
├── icon-192x192.png
├── icon-512x512.png
└── assets/
    ├── index-*.js        # App bundle
    ├── react-*.js        # React vendor chunk
    └── index-*.css       # Styles
```

### 11.2 Deployment Targets

| Environment | Hosting | Notes |
|-------------|---------|-------|
| **Development** | Vite dev server (`npm run dev`) | Local, HMR enabled |
| **Staging** | Static hosting (Netlify/Vercel/Cloudflare) | Branch previews |
| **Production** | Static hosting + CDN | HTTPS required for PWA |

### 11.3 Environment Variables

All API configuration via environment variables at build time. No runtime config needed.

---

## 12. Performance Budget

| Metric | Target | Max |
|--------|--------|-----|
| First Contentful Paint | < 1.5s | 2.0s |
| Time to Interactive | < 2.5s | 3.5s |
| Lighthouse PWA Score | 100 | 90 |
| Lighthouse Performance | 90+ | 80 |
| Total JS Bundle (gzipped) | < 250KB | 350KB |
| CSS Bundle (gzipped) | < 15KB | 25KB |
| Image Assets | < 100KB total | 200KB |

---

## 13. Risk & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| IndexedDB data loss on device change | High | Medium | Regular sync; server is source of truth |
| Service worker cache stale | Medium | Medium | Auto-update strategy; versioned caches |
| API unavailable for extended period | High | Low | Robust queue; large offline storage |
| Token expiry during transaction | Medium | Medium | Silent refresh; queue if refresh fails |
| Large transaction queue slow sync | Medium | Medium | Batch sync; progress indicator |

---

## 14. Decision Log

| Date | Decision | Context | Alternatives Rejected |
|------|----------|---------|----------------------|
| 2026-05-02 | Vite + React TS | Fast builds, modern PWA support | Next.js, CRA |
| 2026-05-02 | CSS Modules + Variables | Zero runtime, full control | Tailwind, Styled Components |
| 2026-05-02 | TanStack Query | Server state caching, offline support | Redux + RTK Query, SWR |
| 2026-05-02 | IndexedDB (idb-keyval) | Structured offline storage | localStorage, SQLite |
| 2026-05-02 | Native fetch | No extra dependency | Axios |
| 2026-05-02 | Context + useReducer | App state is simple | Redux, Zustand, Jotai |

---

## 15. Open Architectural Questions

1. **Backend API Contract:** What format do error responses follow? (RFC 7807 Problem Details?)
2. **Pagination:** How are large lists paginated? (Cursor-based vs offset?)
3. **Real-time Updates:** Do we need WebSocket/SSE for live sync notifications?
4. **Multi-tenancy:** Is the app single-tenant or does it support multiple institutions?
5. **POS Integration:** What protocol for card terminal communication? (Bluetooth? USB? Network?)
6. **Push Notifications:** Should we add web push for sync completion alerts?

---

*Document generated: 2026-05-02*
*Next step: UX Design or Epics & Stories breakdown*
