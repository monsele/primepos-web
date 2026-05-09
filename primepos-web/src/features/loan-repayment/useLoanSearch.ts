import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { searchLoan } from '../../api/loans'
import { cacheLoan } from '../../services/cacheStrategy'
import type { Loan } from '../../types/loan'

const QUERY_KEY = 'loan-search'

export interface UseLoanSearchReturn {
  loan: Loan | null
  isLoading: boolean
  error: Error | null
  search: (loanNumber: string) => Promise<Loan>
}

export function useLoanSearch(): UseLoanSearchReturn {
  const queryClient = useQueryClient()
  const [loan, setLoan] = useState<Loan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const search = useCallback(
    async (loanNumber: string) => {
      setIsLoading(true)
      setError(null)
      try {
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
    [queryClient]
  )

  return { loan, isLoading, error, search }
}
