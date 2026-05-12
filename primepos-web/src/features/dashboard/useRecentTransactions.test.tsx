import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRecentTransactions, fetchRecentTransactions } from './useRecentTransactions'
import type { ReactNode } from 'react'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

describe('fetchRecentTransactions', () => {
  it('returns mock transactions sorted by createdAt descending', async () => {
    const result = await fetchRecentTransactions('STF001')
    expect(result).toHaveLength(2)
    expect(result[0].createdAt).toBe('2026-05-02T10:42:00Z')
    expect(result[1].createdAt).toBe('2026-05-02T10:18:00Z')
  })
})

describe('useRecentTransactions', () => {
  it('fetches transactions for a given officer', async () => {
    const { result } = renderHook(() => useRecentTransactions('STF001'), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].type).toBe('Cash In')
  })

  it('does not fetch when officerId is undefined', () => {
    const { result } = renderHook(() => useRecentTransactions(undefined), {
      wrapper: Wrapper,
    })

    expect(result.current.isPending).toBe(true)
    expect(result.current.fetchStatus).toBe('idle')
  })
})
