import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { searchLoan } from '../../api/loans'
import { cacheLoan, getCachedLoan } from '../../services/cacheStrategy'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import type { Loan } from '../../types/loan'

const QUERY_KEY = 'loan-search'

export interface UseLoanInquiryReturn {
  loan: Loan | null
  isLoading: boolean
  error: Error | null
  isCached: boolean
  search: (loanNumber: string) => Promise<Loan>
}

export function useLoanInquiry(): UseLoanInquiryReturn {
  const queryClient = useQueryClient()
  const { isOnline } = useNetworkStatus()
  const [loan, setLoan] = useState<Loan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isCached, setIsCached] = useState(false)

  const search = useCallback(
    async (loanNumber: string) => {
      setIsLoading(true)
      setError(null)
      setIsCached(false)

      try {
        if (!isOnline) {
          const cached = await getCachedLoan(loanNumber)
          if (cached) {
            setLoan(cached)
            setIsCached(true)
            return cached
          }
          throw new Error('No cached data available')
        }

        const result = await queryClient.fetchQuery<Loan>({
          queryKey: [QUERY_KEY, loanNumber],
          queryFn: () => searchLoan(loanNumber),
          staleTime: 5 * 60 * 1000,
        })
        await cacheLoan(result)
        setLoan(result)
        return result
      } catch (err) {
        const errorInstance =
          err instanceof Error ? err : new Error('Loan not found')
        setError(errorInstance)
        setLoan(null)
        throw errorInstance
      } finally {
        setIsLoading(false)
      }
    },
    [queryClient, isOnline]
  )

  return { loan, isLoading, error, isCached, search }
}
