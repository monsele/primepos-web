import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { searchLoan } from '../../api/loans'
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
        // Check if data already exists in cache before fetching
        const existingData = queryClient.getQueryData<Loan>([
          QUERY_KEY,
          loanNumber,
        ])

        const result = await queryClient.fetchQuery<Loan>({
          queryKey: [QUERY_KEY, loanNumber],
          queryFn: () => searchLoan(loanNumber),
          staleTime: 5 * 60 * 1000,
        })

        // If data existed before fetch, it was served from cache
        setIsCached(!!existingData)
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
    [queryClient]
  )

  return { loan, isLoading, error, isCached, search }
}
