import { render, screen } from '@testing-library/react'
import { ReportsDashboardScreen } from './ReportsDashboardScreen'
import { vi } from 'vitest'

// Mock the hooks
vi.mock('./useReportsSummary', () => ({
  useReportsSummary: vi.fn(),
}))

vi.mock('../../contexts/NavigationContext', () => ({
  ...vi.importActual('../../contexts/NavigationContext'),
  useNavigation: vi.fn(),
}))

import { useReportsSummary } from './useReportsSummary'
import { useNavigation } from '../../contexts/NavigationContext'

const mockUseReportsSummary = vi.mocked(useReportsSummary)
const mockUseNavigation = vi.mocked(useNavigation)

describe('ReportsDashboardScreen', () => {
  beforeEach(() => {
    mockUseReportsSummary.mockReturnValue({
      data: {
        totalCollections: 100000,
        transactionsToday: 25,
      },
    })
    mockUseNavigation.mockReturnValue({
      navigateTo: vi.fn(),
      currentScreen: 'reports',
      screenHistory: [],
      transitionDirection: 'none',
    })
  })

  it('renders summary cards and report list', () => {
    render(<ReportsDashboardScreen />)

    expect(screen.getByTestId('reports-dashboard-screen')).toBeInTheDocument()
    expect(screen.getByText('Total Collections')).toBeInTheDocument()
    expect(screen.getByText('₦1,000.00')).toBeInTheDocument()
    expect(screen.getByText('Transactions Today')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()

    expect(screen.getByText('Loans Booked')).toBeInTheDocument()
    expect(screen.getByText('E-Ledger')).toBeInTheDocument()
    // etc.
  })
})