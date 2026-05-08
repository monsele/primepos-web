import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { searchGroups } from '../../api/groups'
import type { Group } from '../../types/group'

const QUERY_KEY = 'group-search'

export interface UseGroupSearchReturn {
  groups: Group[]
  isLoading: boolean
  error: Error | null
  search: (branchId: string) => Promise<Group[]>
}

export function useGroupSearch(): UseGroupSearchReturn {
  const queryClient = useQueryClient()
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const search = useCallback(
    async (branchId: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await queryClient.fetchQuery<Group[]>({
          queryKey: [QUERY_KEY, branchId],
          queryFn: () => searchGroups('', branchId),
          staleTime: 5 * 60 * 1000,
        })
        setGroups(result)
        return result
      } catch (err) {
        const errorInstance =
          err instanceof Error ? err : new Error('Failed to load groups')
        setError(errorInstance)
        setGroups([])
        throw errorInstance
      } finally {
        setIsLoading(false)
      }
    },
    [queryClient]
  )

  return { groups, isLoading, error, search }
}
