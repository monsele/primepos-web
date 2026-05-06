import { createContext } from 'react'
import type { SyncState } from './syncReducer'

export interface SyncContextValue extends SyncState {
  startSync: () => void
  syncSuccess: (itemsSynced: number) => void
  setSyncError: (message: string) => void
  updatePendingCount: (count: number) => void
}

export const SyncContext = createContext<SyncContextValue | null>(null)
