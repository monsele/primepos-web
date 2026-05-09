import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccountBalance } from './useAccountBalance'

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

describe('useAccountBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns account on successful search', async () => {
    const mockAccount = {
      accountNumber: '1234567890',
      accountName: 'Test User',
      bookBalance: 100000,
      usableBalance: 90000,
      nuban: '1234567890',
      branchId: 'BR001',
    }

    vi.mocked(searchAccount).mockResolvedValue(mockAccount)

    const { result } = renderHook(() => useAccountBalance(), {
      wrapper: Wrapper,
    })

    await act(async () => {
      await result.current.search('1234567890')
    })

    expect(result.current.account).toEqual(mockAccount)
    expect(result.current.error).toBeNull()
    expect(result.current.isCached).toBe(false)
  })

  it('keeps isCached false when searching same account twice online', async () => {
    const mockAccount = {
      accountNumber: '1234567890',
      accountName: 'Test User',
      bookBalance: 100000,
      usableBalance: 90000,
      nuban: '1234567890',
      branchId: 'BR001',
    }

    vi.mocked(searchAccount).mockResolvedValue(mockAccount)

    const client = createTestQueryClient()
    const SharedWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useAccountBalance(), {
      wrapper: SharedWrapper,
    })

    await act(async () => {
      await result.current.search('1234567890')
    })

    expect(result.current.isCached).toBe(false)

    await act(async () => {
      await result.current.search('1234567890')
    })

    expect(result.current.isCached).toBe(false)
  })

  it('clears the current result and cached state on reset', async () => {
    const mockAccount = {
      accountNumber: '1234567890',
      accountName: 'Test User',
      bookBalance: 100000,
      usableBalance: 90000,
      nuban: '1234567890',
      branchId: 'BR001',
    }

    vi.mocked(searchAccount).mockResolvedValue(mockAccount)

    const { result } = renderHook(() => useAccountBalance(), {
      wrapper: Wrapper,
    })

    await act(async () => {
      await result.current.search('1234567890')
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.account).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.isCached).toBe(false)
  })
})
