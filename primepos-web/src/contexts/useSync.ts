import { useContext } from 'react'
import { SyncContext } from './syncContextValue'
import type { SyncContextValue } from './syncContextValue'

export function useSync(): SyncContextValue {
  const context = useContext(SyncContext)
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider')
  }
  return context
}
