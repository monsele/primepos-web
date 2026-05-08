import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoanInquiryScreen from './LoanInquiryScreen'

vi.mock('./useLoanInquiry', () => ({
  useLoanInquiry: vi.fn(),
}))

import { useLoanInquiry } from './useLoanInquiry'

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

describe('LoanInquiryScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loan inquiry screen', () => {
    vi.mocked(useLoanInquiry).mockReturnValue({
      loan: null,
      isLoading: false,
      error: null,
      isCached: false,
      search: vi.fn(),
    })

    render(<LoanInquiryScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('loan-inquiry-screen')).toBeInTheDocument()
    expect(screen.getByText('Account / Loan Number')).toBeInTheDocument()
    expect(screen.getByText('SEARCH')).toBeInTheDocument()
  })

  it('shows loan card after search', () => {
    const mockLoan = {
      loanNumber: 'LN001',
      customerName: 'Test User',
      product: 'Micro Business Loan',
      loanPurpose: 'Working Capital',
      loanAmount: 5_000_000,
      currentBalance: 3_250_000,
      outstandingInterest: 125_000,
      startDate: '2024-01-15',
      maturityDate: '2025-01-15',
      status: 'ACTIVE' as const,
    }

    vi.mocked(useLoanInquiry).mockReturnValue({
      loan: mockLoan,
      isLoading: false,
      error: null,
      isCached: false,
      search: vi.fn(),
    })

    render(<LoanInquiryScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('loan-card')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('shows cached indicator when data is from cache', () => {
    const mockLoan = {
      loanNumber: 'LN001',
      customerName: 'Test User',
      product: 'Micro Business Loan',
      loanPurpose: 'Working Capital',
      loanAmount: 5_000_000,
      currentBalance: 3_250_000,
      outstandingInterest: 125_000,
      startDate: '2024-01-15',
      maturityDate: '2025-01-15',
      status: 'ACTIVE' as const,
    }

    vi.mocked(useLoanInquiry).mockReturnValue({
      loan: mockLoan,
      isLoading: false,
      error: null,
      isCached: true,
      search: vi.fn(),
    })

    render(<LoanInquiryScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('cached-indicator')).toBeInTheDocument()
    expect(screen.getByText('Cached data')).toBeInTheDocument()
  })

  it('does not show cached indicator when data is fresh', () => {
    const mockLoan = {
      loanNumber: 'LN001',
      customerName: 'Test User',
      product: 'Micro Business Loan',
      loanPurpose: 'Working Capital',
      loanAmount: 5_000_000,
      currentBalance: 3_250_000,
      outstandingInterest: 125_000,
      startDate: '2024-01-15',
      maturityDate: '2025-01-15',
      status: 'ACTIVE' as const,
    }

    vi.mocked(useLoanInquiry).mockReturnValue({
      loan: mockLoan,
      isLoading: false,
      error: null,
      isCached: false,
      search: vi.fn(),
    })

    render(<LoanInquiryScreen />, { wrapper: Wrapper })
    expect(screen.queryByTestId('cached-indicator')).not.toBeInTheDocument()
  })

  it('shows not found message when search returns error', () => {
    vi.mocked(useLoanInquiry).mockReturnValue({
      loan: null,
      isLoading: false,
      error: new Error('Loan not found'),
      isCached: false,
      search: vi.fn(),
    })

    render(<LoanInquiryScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('loan-not-found')).toBeInTheDocument()
    expect(screen.getByTestId('loan-not-found')).toHaveTextContent('Loan not found')
  })

  it('triggers search when SEARCH button clicked', () => {
    const searchMock = vi.fn()
    vi.mocked(useLoanInquiry).mockReturnValue({
      loan: null,
      isLoading: false,
      error: null,
      isCached: false,
      search: searchMock,
    })

    render(<LoanInquiryScreen />, { wrapper: Wrapper })

    const input = screen.getByPlaceholderText('Enter account or loan number')
    fireEvent.change(input, { target: { value: 'LN001' } })

    const button = screen.getByText('SEARCH')
    fireEvent.click(button)

    expect(searchMock).toHaveBeenCalledWith('LN001')
  })

  it('does not search with empty input', () => {
    const searchMock = vi.fn()
    vi.mocked(useLoanInquiry).mockReturnValue({
      loan: null,
      isLoading: false,
      error: null,
      isCached: false,
      search: searchMock,
    })

    render(<LoanInquiryScreen />, { wrapper: Wrapper })

    const button = screen.getByText('SEARCH')
    fireEvent.click(button)

    expect(searchMock).not.toHaveBeenCalled()
  })
})
