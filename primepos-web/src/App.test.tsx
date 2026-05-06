import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { useAuth } from './contexts/useAuth'
import { useNetworkStatus } from './hooks/useNetworkStatus'

vi.mock('./contexts/useAuth')
vi.mock('./hooks/useNetworkStatus')

describe('App Shell Integration', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        staffId: 'TEST001',
        name: 'Test Officer',
        email: 'test@example.com',
        mobile: '08000000000',
        branchId: 'TEST001',
        branchName: 'Test Branch',
        department: 'Test Dept',
        tillAccount: '00000000000000',
        role: 'Test Role',
      },
      token: 'token',
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      startLogin: vi.fn(),
      setError: vi.fn(),
      clearError: vi.fn(),
    } as ReturnType<typeof useAuth>)

    vi.mocked(useNetworkStatus).mockReturnValue({
      isOnline: true,
      connectionType: '4g',
      since: new Date(),
    })
  })

  it('renders header with ConnectionPill', () => {
    render(<App />)
    expect(screen.getByText('PrimePOS')).toBeInTheDocument()
    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  it('renders ConnectionBanner below header', () => {
    render(<App />)
    expect(screen.getByText('Connected — All features available')).toBeInTheDocument()
  })

  it('shows offline banner and pill when isOnline is false', () => {
    vi.mocked(useNetworkStatus).mockReturnValue({
      isOnline: false,
      connectionType: 'unknown',
      since: new Date(),
    })

    render(<App />)
    expect(screen.getByText('Offline')).toBeInTheDocument()
    expect(screen.getByText('Offline — Limited features available')).toBeInTheDocument()
  })

  it('has toast provider active (aria-live region)', () => {
    render(<App />)
    const statuses = screen.getAllByRole('status')
    expect(statuses.length).toBeGreaterThanOrEqual(1)
    // Toast container is the empty status div at the bottom
    expect(statuses.some(el => el.className.includes('container'))).toBe(true)
  })
})
