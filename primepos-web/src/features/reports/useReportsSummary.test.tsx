import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useReportsSummary } from './useReportsSummary'
import { vi } from 'vitest'

// Mock the dashboard hook
vi.mock('../dashboard/useDashboardKPIs', () => ({
  useDashboardKPIs: vi.fn(),
}))

import { useDashboardKPIs } from '../dashboard/useDashboardKPIs'

const mockUseDashboardKPIs = vi.mocked(useDashboardKPIs)

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useReportsSummary', () => {
  it('returns transformed data from dashboard KPIs', () => {
    mockUseDashboardKPIs.mockReturnValue({
      data: {
        collections: 50000,
        transactionCount: 10,
        pendingSyncCount: 0,
      },
      isLoading: false,
      error: null,
    })

    const { result } = renderHook(() => useReportsSummary(), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toEqual({
      totalCollections: 50000,
      transactionsToday: 10,
    })
  })

  it('returns undefined when no data', () => {
    mockUseDashboardKPIs.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    const { result } = renderHook(() => useReportsSummary(), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toBeUndefined()
  })
})