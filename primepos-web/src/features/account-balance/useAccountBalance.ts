import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { searchAccount } from '../../api/accounts'
import {
  cacheAccount,
  getCachedAccount,
} from '../../services/cacheStrategy'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import type { Account } from '../../types/account'

const QUERY_KEY = 'account-search'

export interface UseAccountBalanceReturn {
  account: Account | null
  isLoading: boolean
  error: Error | null
  isCached: boolean
  search: (accountNumber: string) => Promise<Account>
  reset: () => void
}

export function useAccountBalance(): UseAccountBalanceReturn {
  const queryClient = useQueryClient()
  const { isOnline } = useNetworkStatus()
  const [account, setAccount] = useState<Account | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isCached, setIsCached] = useState(false)

  const reset = useCallback(() => {
    setAccount(null)
    setError(null)
    setIsCached(false)
  }, [])

  const search = useCallback(
    async (accountNumber: string) => {
      setIsLoading(true)
      setError(null)
      setIsCached(false)

      try {
        if (!isOnline) {
          const cached = await getCachedAccount(accountNumber)
          if (cached) {
            setAccount(cached)
            setIsCached(true)
            return cached
          }
          throw new Error('No cached data available')
        }

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
    [queryClient, isOnline]
  )

  return { account, isLoading, error, isCached, search, reset }
}
