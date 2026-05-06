import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoanRepaymentScreen from './LoanRepaymentScreen'

vi.mock('./useLoanSearch', () => ({
  useLoanSearch: vi.fn(),
}))

vi.mock('./useLoanRepayment', () => ({
  useLoanRepayment: vi.fn(),
}))

import { useLoanSearch } from './useLoanSearch'
import { useLoanRepayment } from './useLoanRepayment'

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

describe('LoanRepaymentScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loan repayment screen', () => {
    vi.mocked(useLoanSearch).mockReturnValue({
      loan: null,
      isLoading: false,
      error: null,
      search: vi.fn(),
    })
    vi.mocked(useLoanRepayment).mockReturnValue({
      form: { amount: '' },
      errors: {},
      isSubmitting: false,
      setAmount: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
    })

    render(<LoanRepaymentScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('loan-repayment-screen')).toBeInTheDocument()
    expect(screen.getByText('Loan Account Number')).toBeInTheDocument()
    expect(screen.getByText('POST REPAYMENT')).toBeInTheDocument()
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

    vi.mocked(useLoanSearch).mockReturnValue({
      loan: mockLoan,
      isLoading: false,
      error: null,
      search: vi.fn(),
    })
    vi.mocked(useLoanRepayment).mockReturnValue({
      form: { amount: '' },
      errors: {},
      isSubmitting: false,
      setAmount: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
    })

    render(<LoanRepaymentScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('loan-card')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('shows search error state', () => {
    vi.mocked(useLoanSearch).mockReturnValue({
      loan: null,
      isLoading: false,
      error: new Error('Loan not found'),
      search: vi.fn(),
    })
    vi.mocked(useLoanRepayment).mockReturnValue({
      form: { amount: '' },
      errors: {},
      isSubmitting: false,
      setAmount: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
    })

    render(<LoanRepaymentScreen />, { wrapper: Wrapper })
    expect(screen.getByText('Loan not found')).toBeInTheDocument()
  })

  it('triggers search when SEARCH button clicked', () => {
    const searchMock = vi.fn()
    vi.mocked(useLoanSearch).mockReturnValue({
      loan: null,
      isLoading: false,
      error: null,
      search: searchMock,
    })
    vi.mocked(useLoanRepayment).mockReturnValue({
      form: { amount: '' },
      errors: {},
      isSubmitting: false,
      setAmount: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
    })

    render(<LoanRepaymentScreen />, { wrapper: Wrapper })

    const input = screen.getByPlaceholderText('Enter loan number')
    fireEvent.change(input, { target: { value: 'LN001' } })

    const button = screen.getByText('SEARCH')
    fireEvent.click(button)

    expect(searchMock).toHaveBeenCalledWith('LN001')
  })

  it('triggers post repayment when form filled and button clicked', () => {
    const handleSubmitMock = vi.fn()
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

    vi.mocked(useLoanSearch).mockReturnValue({
      loan: mockLoan,
      isLoading: false,
      error: null,
      search: vi.fn(),
    })
    vi.mocked(useLoanRepayment).mockReturnValue({
      form: { amount: '1000' },
      errors: {},
      isSubmitting: false,
      setAmount: vi.fn(),
      handleSubmit: handleSubmitMock,
      resetForm: vi.fn(),
    })

    render(<LoanRepaymentScreen />, { wrapper: Wrapper })

    const postButton = screen.getByText('POST REPAYMENT')
    fireEvent.click(postButton)

    expect(handleSubmitMock).toHaveBeenCalledWith(mockLoan)
  })
})
