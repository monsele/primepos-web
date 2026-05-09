import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccountStatement } from './useAccountStatement'

vi.mock('../../api/accounts', () => ({
  fetchStatement: vi.fn(),
}))

import { fetchStatement } from '../../api/accounts'

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

describe('useAccountStatement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches statement entries for a given account and date range', async () => {
    const mockEntries = [
      {
        date: '2026-05-01T09:15:00Z',
        description: 'Opening Balance',
        debit: null,
        credit: 250_000,
        balance: 250_000,
      },
    ]

    vi.mocked(fetchStatement).mockResolvedValue(mockEntries)

    const { result } = renderHook(() => useAccountStatement(), {
      wrapper: Wrapper,
    })

    await act(async () => {
      await result.current.search('1234567890', '2026-05-01', '2026-05-31')
    })

    expect(fetchStatement).toHaveBeenCalledWith(
      '1234567890',
      '2026-05-01',
      '2026-05-31'
    )
    expect(result.current.entries).toEqual(mockEntries)
    expect(result.current.error).toBeNull()
  })
})
