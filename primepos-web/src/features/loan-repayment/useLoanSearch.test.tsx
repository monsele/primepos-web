import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLoanSearch } from './useLoanSearch'
import type { Loan } from '../../types/loan'

vi.mock('../../api/loans', () => ({
  searchLoan: vi.fn(),
}))

import { searchLoan } from '../../api/loans'

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

describe('useLoanSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns loan on successful search', async () => {
    const mockLoan: Loan = {
      loanNumber: 'LN001',
      customerName: 'Test User',
      product: 'Micro Business Loan',
      loanPurpose: 'Working Capital',
      loanAmount: 5_000_000,
      currentBalance: 3_250_000,
      outstandingInterest: 125_000,
      startDate: '2024-01-15',
      maturityDate: '2025-01-15',
      status: 'ACTIVE',
    }
    vi.mocked(searchLoan).mockResolvedValue(mockLoan)

    const { result } = renderHook(() => useLoanSearch(), { wrapper: Wrapper })

    await act(async () => {
      await result.current.search('LN001')
    })

    expect(result.current.loan).toEqual(mockLoan)
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('returns null and error on not-found', async () => {
    vi.mocked(searchLoan).mockRejectedValue(new Error('Loan not found'))

    const { result } = renderHook(() => useLoanSearch(), { wrapper: Wrapper })

    await act(async () => {
      await expect(result.current.search('00000')).rejects.toThrow('Loan not found')
    })

    expect(result.current.loan).toBeNull()
    expect(result.current.error).not.toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('shows loading state while searching', async () => {
    vi.mocked(searchLoan).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({} as Loan), 100))
    )

    const { result } = renderHook(() => useLoanSearch(), { wrapper: Wrapper })

    act(() => {
      result.current.search('LN001')
    })

    expect(result.current.isLoading).toBe(true)
  })
})
