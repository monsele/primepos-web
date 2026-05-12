import { useQuery } from '@tanstack/react-query'
import { useNetworkStatus } from './useNetworkStatus'

export interface UseCachedQueryResult<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
  isCached: boolean
}

export function useCachedQuery<T>(
  queryKey: string[],
  fetchFn: () => Promise<T>,
  _cacheKey: string,
  cacheFn: (data: T) => Promise<void>,
  getCachedFn: () => Promise<T | undefined>
): UseCachedQueryResult<T> {
  const { isOnline } = useNetworkStatus()

  const result = useQuery<T>({
    queryKey,
    queryFn: async () => {
      if (isOnline) {
        const data = await fetchFn()
        await cacheFn(data)
        return data
      }
      const cached = await getCachedFn()
      if (cached) return cached
      throw new Error('No cached data available')
    },
    enabled: isOnline || true,
  })

  const isCached = !isOnline && !!result.data

  return {
    data: result.data,
    isLoading: result.isLoading,
    error: result.error instanceof Error ? result.error : null,
    isCached,
  }
}