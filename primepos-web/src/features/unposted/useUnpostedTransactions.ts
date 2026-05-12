import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SyncEngine } from '../../services/syncEngine'
import * as queueManager from '../../services/queueManager'
import type { QueuedTransaction } from '../../services/storage/types'
import { useSync } from '../../contexts/useSync'

export function useUnpostedTransactions() {
  const queryClient = useQueryClient()
  const sync = useSync()
  const engine = new SyncEngine()

  const { data: transactions = [], isLoading, error } = useQuery<QueuedTransaction[]>({
    queryKey: ['unposted-transactions'],
    queryFn: () => queueManager.getPending(),
    refetchInterval: 30000,
  })

  const postAllMutation = useMutation({
    mutationFn: async () => {
      sync.startSync()
      const result = await engine.processQueue()
      return result
    },
    onSuccess: (result) => {
      sync.syncSuccess(result.succeeded)
      queryClient.invalidateQueries({ queryKey: ['unposted-transactions'] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary'] })
    },
    onError: (error) => {
      sync.setSyncError(error instanceof Error ? error.message : 'Sync failed')
    },
  })

  return {
    transactions,
    isLoading,
    error,
    postAll: postAllMutation.mutate,
    isPosting: postAllMutation.isPending,
    postResult: postAllMutation.data,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['unposted-transactions'] }),
  }
}