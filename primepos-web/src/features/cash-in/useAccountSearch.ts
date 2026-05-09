import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { searchAccount } from '../../api/accounts'
import { cacheAccount } from '../../services/cacheStrategy'
import type { Account } from '../../types/account'

const QUERY_KEY = 'account-search'

export interface UseAccountSearchReturn {
  account: Account | null
  isLoading: boolean
  error: Error | null
  search: (accountNumber: string) => Promise<Account>
}

export function useAccountSearch(): UseAccountSearchReturn {
  const queryClient = useQueryClient()
  const [account, setAccount] = useState<Account | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const search = useCallback(
    async (accountNumber: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await queryClient.fetchQuery<Account>({
          queryKey: [QUERY_KEY, accountNumber],
          queryFn: () => searchAccount(accountNumber),
          staleTime: 5 * 60 * 1000,
        })
        await cacheAccount(result)
        setAccount(result)
        return result
      } catch (err) {
        const errorInstance =
          err instanceof Error ? err : new Error('Account not found')
        setError(errorInstance)
        setAccount(null)
        throw errorInstance
      } finally {
        setIsLoading(false)
      }
    },
    [queryClient]
  )

  return { account, isLoading, error, search }
}
