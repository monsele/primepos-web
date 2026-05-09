import { useReducer, useCallback, type ReactNode, useEffect, useMemo } from 'react'
import { syncReducer, initialSyncState } from './syncReducer'
import { SyncContext } from './syncContextValue'
import { getPendingCount } from '../services/storage/transactions'
import { SyncEngine } from '../services/syncEngine'

export function SyncProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(syncReducer, initialSyncState)
  const engine = useMemo(() => new SyncEngine(), [])

  const startSync = useCallback(() => {
    dispatch({ type: 'START_SYNC' })
  }, [])

  const syncSuccess = useCallback((itemsSynced: number) => {
    dispatch({ type: 'SYNC_SUCCESS', payload: itemsSynced })
  }, [])

  const setSyncError = useCallback((message: string) => {
    dispatch({ type: 'SYNC_ERROR', payload: message })
  }, [])

  const updatePendingCount = useCallback((count: number) => {
    dispatch({ type: 'UPDATE_PENDING_COUNT', payload: count })
  }, [])

  useEffect(() => {
    getPendingCount().then((count) => {
      updatePendingCount(count)
    })
  }, [updatePendingCount])

  const processQueue = useCallback(async () => {
    const result = await engine.processQueue()
    syncSuccess(result.succeeded)
    return result
  }, [engine, syncSuccess])

  return (
    <SyncContext.Provider
      value={{
        ...state,
        startSync,
        syncSuccess,
        setSyncError,
        updatePendingCount,
        processQueue,
      }}
    >
      {children}
    </SyncContext.Provider>
  )
}
