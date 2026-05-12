import { createContext } from 'react'
import type { SyncState } from './syncReducer'
import type { SyncResult } from '../services/syncEngine'

export interface SyncContextValue extends SyncState {
  startSync: () => void
  syncSuccess: (itemsSynced: number) => void
  setSyncError: (message: string) => void
  updatePendingCount: (count: number) => void
  processQueue: () => Promise<SyncResult>
}

export const SyncContext = createContext<SyncContextValue | null>(null)
