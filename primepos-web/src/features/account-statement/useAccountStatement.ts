import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { fetchStatement } from '../../api/accounts'
import type { StatementEntry } from '../../types/account'

const QUERY_KEY = 'account-statement'

export interface UseAccountStatementReturn {
  entries: StatementEntry[]
  isLoading: boolean
  error: Error | null
  isCached: boolean
  search: (accountNumber: string, fromDate: string, toDate: string) => Promise<StatementEntry[]>
  reset: () => void
}

export function useAccountStatement(): UseAccountStatementReturn {
  const queryClient = useQueryClient()
  const [entries, setEntries] = useState<StatementEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isCached, setIsCached] = useState(false)

  const reset = useCallback(() => {
    setEntries([])
    setError(null)
    setIsCached(false)
  }, [])

  const search = useCallback(
    async (accountNumber: string, fromDate: string, toDate: string) => {
      setIsLoading(true)
      setError(null)
      setIsCached(false)

      try {
        const queryKey = [QUERY_KEY, accountNumber, fromDate, toDate]
        const existingData = queryClient.getQueryData<StatementEntry[]>(queryKey)

        const result = await queryClient.fetchQuery<StatementEntry[]>({
          queryKey,
          queryFn: () => fetchStatement(accountNumber, fromDate, toDate),
          staleTime: 5 * 60 * 1000,
        })

        setEntries(result)
        setIsCached(!!existingData)
        return result
      } catch (err) {
        const errorInstance =
          err instanceof Error ? err : new Error('Unable to fetch statement')
        setError(errorInstance)
        setEntries([])
        throw errorInstance
      } finally {
        setIsLoading(false)
      }
    },
    [queryClient]
  )

  return { entries, isLoading, error, isCached, search, reset }
}
