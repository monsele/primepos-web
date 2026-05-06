import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccountSearch } from './useAccountSearch'
import type { Account } from '../../types/account'

vi.mock('../../api/accounts', () => ({
  searchAccount: vi.fn(),
}))

import { searchAccount } from '../../api/accounts'

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

describe('useAccountSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns account on successful search', async () => {
    const mockAccount = {
      accountNumber: '12345',
      accountName: 'Test User',
      bookBalance: 100000,
      usableBalance: 90000,
      branchId: 'BR001',
    }
    vi.mocked(searchAccount).mockResolvedValue(mockAccount)

    const { result } = renderHook(() => useAccountSearch(), { wrapper: Wrapper })

    await act(async () => {
      await result.current.search('12345')
    })

    expect(result.current.account).toEqual(mockAccount)
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('returns null and error on not-found', async () => {
    vi.mocked(searchAccount).mockRejectedValue(new Error('Account not found'))

    const { result } = renderHook(() => useAccountSearch(), { wrapper: Wrapper })

    await act(async () => {
      await expect(result.current.search('00000')).rejects.toThrow('Account not found')
    })

    expect(result.current.account).toBeNull()
    expect(result.current.error).not.toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('shows loading state while searching', async () => {
    vi.mocked(searchAccount).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({} as Account), 100))
    )

    const { result } = renderHook(() => useAccountSearch(), { wrapper: Wrapper })

    act(() => {
      result.current.search('12345')
    })

    expect(result.current.isLoading).toBe(true)
  })
})
