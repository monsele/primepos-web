import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardScreen } from './DashboardScreen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mocks
vi.mock('../../contexts/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Test Officer', branchName: 'Test Branch' },
  }),
}))

vi.mock('../../hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => ({ isOnline: true }),
}))

vi.mock('../../hooks/useConnectionTransition', () => ({
  useConnectionTransition: () => ({ wentOffline: false, cameOnline: false }),
}))

vi.mock('../../components/Toast/useToast', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}))

vi.mock('../../contexts/NavigationContext', () => ({
  useNavigation: () => ({
    navigateTo: vi.fn(),
    goBack: vi.fn(),
    replace: vi.fn(),
    currentScreen: 'dashboard',
    screenHistory: [],
    transitionDirection: 'none',
    isInnerScreen: false,
  }),
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

describe('DashboardScreen', () => {
  it('renders the dashboard screen', () => {
    render(<DashboardScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('dashboard-screen')).toBeInTheDocument()
  })

  it('renders welcome message with officer name', () => {
    render(<DashboardScreen />, { wrapper: Wrapper })
    expect(screen.getByText(/Welcome, Test Officer/i)).toBeInTheDocument()
  })

  it('renders KPI cards', () => {
    render(<DashboardScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('kpi-cards')).toBeInTheDocument()
  })

  it('renders QuickActions component', () => {
    render(<DashboardScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
  })

  it('renders all 4 quick action cards', () => {
    render(<DashboardScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('quick-action-cash-in')).toBeInTheDocument()
    expect(screen.getByTestId('quick-action-cash-out')).toBeInTheDocument()
    expect(screen.getByTestId('quick-action-loan-repay')).toBeInTheDocument()
    expect(screen.getByTestId('quick-action-new-account')).toBeInTheDocument()
  })
})
