import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AccountStatementScreen from './AccountStatementScreen'

vi.mock('./useAccountStatement', () => ({
  useAccountStatement: vi.fn(),
}))

import { useAccountStatement } from './useAccountStatement'

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

describe('AccountStatementScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows a validation error when to date is earlier than from date', async () => {
    vi.mocked(useAccountStatement).mockReturnValue({
      entries: [],
      isLoading: false,
      error: null,
      isCached: false,
      search: vi.fn(),
      reset: vi.fn(),
    })

    render(<AccountStatementScreen />, { wrapper: Wrapper })

    fireEvent.change(screen.getByPlaceholderText('Enter CASA account number'), {
      target: { value: '1234567890' },
    })
    fireEvent.change(screen.getByLabelText('From Date'), {
      target: { value: '2026-05-10' },
    })
    fireEvent.change(screen.getByLabelText('To Date'), {
      target: { value: '2026-05-09' },
    })
    fireEvent.click(screen.getByText('FETCH STATEMENT'))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'To date must be after From date'
    )
  })

  it('fetches statement data and renders the transaction table', async () => {
    const search = vi.fn().mockResolvedValue([
      {
        date: '2026-05-01T09:15:00Z',
        description: 'Opening Balance',
        debit: null,
        credit: 250_000,
        balance: 250_000,
      },
    ])

    vi.mocked(useAccountStatement)
      .mockReturnValueOnce({
        entries: [],
        isLoading: false,
        error: null,
        isCached: false,
        search,
        reset: vi.fn(),
      })
      .mockReturnValue({
        entries: [
          {
            date: '2026-05-01T09:15:00Z',
            description: 'Opening Balance',
            debit: null,
            credit: 250_000,
            balance: 250_000,
          },
        ],
        isLoading: false,
        error: null,
        isCached: false,
        search,
        reset: vi.fn(),
      })

    const { rerender } = render(<AccountStatementScreen />, { wrapper: Wrapper })

    fireEvent.change(screen.getByPlaceholderText('Enter CASA account number'), {
      target: { value: '1234567890' },
    })
    fireEvent.change(screen.getByLabelText('From Date'), {
      target: { value: '2026-05-01' },
    })
    fireEvent.change(screen.getByLabelText('To Date'), {
      target: { value: '2026-05-31' },
    })
    fireEvent.click(screen.getByText('FETCH STATEMENT'))

    await waitFor(() => {
      expect(search).toHaveBeenCalledWith(
        '1234567890',
        '2026-05-01',
        '2026-05-31'
      )
    })

    rerender(<AccountStatementScreen />)

    expect(await screen.findByTestId('statement-table')).toBeInTheDocument()
    expect(screen.getByText('Opening Balance')).toBeInTheDocument()
  })
})
