// Mock for virtual:pwa-register/react
// This is a virtual module provided by vite-plugin-pwa

export const useRegisterSW = vi.fn(() => ({
  needRefresh: [false, vi.fn()],
  updateServiceWorker: vi.fn(),
}))