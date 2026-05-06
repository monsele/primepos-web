import { useReducer, useCallback, type ReactNode } from 'react'
import { syncReducer, initialSyncState } from './syncReducer'
import { SyncContext } from './syncContextValue'

export function SyncProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(syncReducer, initialSyncState)

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

  return (
    <SyncContext.Provider
      value={{
        ...state,
        startSync,
        syncSuccess,
        setSyncError,
        updatePendingCount,
      }}
    >
      {children}
    </SyncContext.Provider>
  )
}
