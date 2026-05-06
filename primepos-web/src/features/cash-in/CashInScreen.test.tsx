import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CashInScreen from './CashInScreen'

vi.mock('./useAccountSearch', () => ({
  useAccountSearch: vi.fn(),
}))

vi.mock('./useCashIn', () => ({
  useCashIn: vi.fn(),
}))

import { useAccountSearch } from './useAccountSearch'
import { useCashIn } from './useCashIn'

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

describe('CashInScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders cash in screen', () => {
    vi.mocked(useAccountSearch).mockReturnValue({
      account: null,
      isLoading: false,
      error: null,
      search: vi.fn(),
    })
    vi.mocked(useCashIn).mockReturnValue({
      form: { accountNumber: '', payeeName: '', amount: '', sendSms: false },
      errors: {},
      isSubmitting: false,
      setAccountNumber: vi.fn(),
      setPayeeName: vi.fn(),
      setAmount: vi.fn(),
      setSendSms: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
    })

    render(<CashInScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('cash-in-screen')).toBeInTheDocument()
    expect(screen.getByText('Account Number')).toBeInTheDocument()
    expect(screen.getByText('POST TRANSACTION')).toBeInTheDocument()
  })

  it('shows account card after search', () => {
    const mockAccount = {
      accountNumber: '123',
      accountName: 'Test User',
      bookBalance: 5000000,
      usableBalance: 4500000,
      branchId: 'B1',
    }

    vi.mocked(useAccountSearch).mockReturnValue({
      account: mockAccount,
      isLoading: false,
      error: null,
      search: vi.fn(),
    })
    vi.mocked(useCashIn).mockReturnValue({
      form: { accountNumber: '', payeeName: '', amount: '', sendSms: false },
      errors: {},
      isSubmitting: false,
      setAccountNumber: vi.fn(),
      setPayeeName: vi.fn(),
      setAmount: vi.fn(),
      setSendSms: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
    })

    render(<CashInScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('account-card')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('shows search error state', () => {
    vi.mocked(useAccountSearch).mockReturnValue({
      account: null,
      isLoading: false,
      error: new Error('Account not found'),
      search: vi.fn(),
    })
    vi.mocked(useCashIn).mockReturnValue({
      form: { accountNumber: '', payeeName: '', amount: '', sendSms: false },
      errors: {},
      isSubmitting: false,
      setAccountNumber: vi.fn(),
      setPayeeName: vi.fn(),
      setAmount: vi.fn(),
      setSendSms: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
    })

    render(<CashInScreen />, { wrapper: Wrapper })
    expect(screen.getByText('Account not found')).toBeInTheDocument()
  })

  it('triggers search when SEARCH button clicked', () => {
    const searchMock = vi.fn()
    vi.mocked(useAccountSearch).mockReturnValue({
      account: null,
      isLoading: false,
      error: null,
      search: searchMock,
    })
    vi.mocked(useCashIn).mockReturnValue({
      form: { accountNumber: '', payeeName: '', amount: '', sendSms: false },
      errors: {},
      isSubmitting: false,
      setAccountNumber: vi.fn(),
      setPayeeName: vi.fn(),
      setAmount: vi.fn(),
      setSendSms: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
    })

    render(<CashInScreen />, { wrapper: Wrapper })

    const input = screen.getByPlaceholderText('Enter account number')
    fireEvent.change(input, { target: { value: '12345' } })

    const button = screen.getByText('SEARCH')
    fireEvent.click(button)

    expect(searchMock).toHaveBeenCalledWith('12345')
  })

  it('triggers post transaction when form filled and button clicked', () => {
    const handleSubmitMock = vi.fn()
    const mockAccount = {
      accountNumber: '123',
      accountName: 'Test User',
      bookBalance: 5000000,
      usableBalance: 4500000,
      branchId: 'B1',
    }

    vi.mocked(useAccountSearch).mockReturnValue({
      account: mockAccount,
      isLoading: false,
      error: null,
      search: vi.fn(),
    })
    vi.mocked(useCashIn).mockReturnValue({
      form: { accountNumber: '', payeeName: 'John', amount: '5000', sendSms: true },
      errors: {},
      isSubmitting: false,
      setAccountNumber: vi.fn(),
      setPayeeName: vi.fn(),
      setAmount: vi.fn(),
      setSendSms: vi.fn(),
      handleSubmit: handleSubmitMock,
      resetForm: vi.fn(),
    })

    render(<CashInScreen />, { wrapper: Wrapper })

    const postButton = screen.getByText('POST TRANSACTION')
    fireEvent.click(postButton)

    expect(handleSubmitMock).toHaveBeenCalledWith(mockAccount)
  })
})
