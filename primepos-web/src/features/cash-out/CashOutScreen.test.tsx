import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CashOutScreen from './CashOutScreen'

vi.mock('../cash-in/useAccountSearch', () => ({
  useAccountSearch: vi.fn(),
}))

vi.mock('./useCashOut', () => ({
  useCashOut: vi.fn(),
}))

import { useAccountSearch } from '../cash-in/useAccountSearch'
import { useCashOut } from './useCashOut'

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

describe('CashOutScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders cash out screen', () => {
    vi.mocked(useAccountSearch).mockReturnValue({
      account: null,
      isLoading: false,
      error: null,
      search: vi.fn(),
    })
    vi.mocked(useCashOut).mockReturnValue({
      form: { payeeName: '', amount: '', sendSms: false },
      errors: {},
      isSubmitting: false,
      setPayeeName: vi.fn(),
      setAmount: vi.fn(),
      setSendSms: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
    })

    render(<CashOutScreen />, { wrapper: Wrapper })
    expect(screen.getByTestId('cash-out-screen')).toBeInTheDocument()
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
    vi.mocked(useCashOut).mockReturnValue({
      form: { payeeName: '', amount: '', sendSms: false },
      errors: {},
      isSubmitting: false,
      setPayeeName: vi.fn(),
      setAmount: vi.fn(),
      setSendSms: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
    })

    render(<CashOutScreen />, { wrapper: Wrapper })
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
    vi.mocked(useCashOut).mockReturnValue({
      form: { payeeName: '', amount: '', sendSms: false },
      errors: {},
      isSubmitting: false,
      setPayeeName: vi.fn(),
      setAmount: vi.fn(),
      setSendSms: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
    })

    render(<CashOutScreen />, { wrapper: Wrapper })
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
    vi.mocked(useCashOut).mockReturnValue({
      form: { payeeName: '', amount: '', sendSms: false },
      errors: {},
      isSubmitting: false,
      setPayeeName: vi.fn(),
      setAmount: vi.fn(),
      setSendSms: vi.fn(),
      handleSubmit: vi.fn(),
      resetForm: vi.fn(),
    })

    render(<CashOutScreen />, { wrapper: Wrapper })

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
    vi.mocked(useCashOut).mockReturnValue({
      form: { payeeName: 'John', amount: '5000', sendSms: true },
      errors: {},
      isSubmitting: false,
      setPayeeName: vi.fn(),
      setAmount: vi.fn(),
      setSendSms: vi.fn(),
      handleSubmit: handleSubmitMock,
      resetForm: vi.fn(),
    })

    render(<CashOutScreen />, { wrapper: Wrapper })

    const postButton = screen.getByText('POST TRANSACTION')
    fireEvent.click(postButton)

    expect(handleSubmitMock).toHaveBeenCalled()
  })
})
