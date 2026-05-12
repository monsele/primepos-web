import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'

// Mock virtual pwa-register module
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    needRefresh: [false, vi.fn()],
    updateServiceWorker: vi.fn(),
  }),
}))
