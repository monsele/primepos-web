import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AccountBalanceScreen from './AccountBalanceScreen'

vi.mock('./useAccountBalance', () => ({
  useAccountBalance: vi.fn(),
}))

import { useAccountBalance } from './useAccountBalance'

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

describe('AccountBalanceScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the balance inquiry screen', () => {
    vi.mocked(useAccountBalance).mockReturnValue({
      account: null,
      isLoading: false,
      error: null,
      isCached: false,
      search: vi.fn(),
      reset: vi.fn(),
    })

    render(<AccountBalanceScreen />, { wrapper: Wrapper })

    expect(screen.getByTestId('account-balance-screen')).toBeInTheDocument()
    expect(screen.getByText('CASA Account Number')).toBeInTheDocument()
    expect(screen.getByText('SEARCH')).toBeInTheDocument()
  })

  it('shows the balance details and cached indicator after search', () => {
    vi.mocked(useAccountBalance).mockReturnValue({
      account: {
        accountNumber: '1234567890',
        accountName: 'Test User',
        bookBalance: 100000,
        usableBalance: 90000,
        nuban: '1234567890',
        branchId: 'BR001',
      },
      isLoading: false,
      error: null,
      isCached: true,
      search: vi.fn(),
      reset: vi.fn(),
    })

    render(<AccountBalanceScreen />, { wrapper: Wrapper })

    expect(screen.getByTestId('account-card')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('1234567890')).toBeInTheDocument()
    expect(screen.getByTestId('cached-indicator')).toHaveTextContent(
      'Cached data'
    )
    expect(screen.getByText('RESET')).toBeInTheDocument()
  })

  it('triggers search with the trimmed account number', () => {
    const search = vi.fn()

    vi.mocked(useAccountBalance).mockReturnValue({
      account: null,
      isLoading: false,
      error: null,
      isCached: false,
      search,
      reset: vi.fn(),
    })

    render(<AccountBalanceScreen />, { wrapper: Wrapper })

    fireEvent.change(screen.getByPlaceholderText('Enter CASA account number'), {
      target: { value: ' 1234567890 ' },
    })
    fireEvent.click(screen.getByText('SEARCH'))

    expect(search).toHaveBeenCalledWith('1234567890')
  })

  it('resets the input and result state when RESET is clicked', () => {
    const reset = vi.fn()

    vi.mocked(useAccountBalance).mockReturnValue({
      account: {
        accountNumber: '1234567890',
        accountName: 'Test User',
        bookBalance: 100000,
        usableBalance: 90000,
        nuban: '1234567890',
        branchId: 'BR001',
      },
      isLoading: false,
      error: null,
      isCached: false,
      search: vi.fn(),
      reset,
    })

    render(<AccountBalanceScreen />, { wrapper: Wrapper })

    const input = screen.getByPlaceholderText('Enter CASA account number')
    fireEvent.change(input, { target: { value: '1234567890' } })
    fireEvent.click(screen.getByText('RESET'))

    expect(reset).toHaveBeenCalled()
    expect(input).toHaveValue('')
  })
})
