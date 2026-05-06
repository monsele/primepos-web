export interface SyncState {
  isSyncing: boolean
  lastSyncAt: Date | null
  pendingCount: number
  syncError: string | null
}

export type SyncAction =
  | { type: 'START_SYNC' }
  | { type: 'SYNC_SUCCESS'; payload: number }
  | { type: 'SYNC_ERROR'; payload: string }
  | { type: 'UPDATE_PENDING_COUNT'; payload: number }

export const initialSyncState: SyncState = {
  isSyncing: false,
  lastSyncAt: null,
  pendingCount: 0,
  syncError: null,
}

export function syncReducer(state: SyncState, action: SyncAction): SyncState {
  switch (action.type) {
    case 'START_SYNC':
      return { ...state, isSyncing: true, syncError: null }
    case 'SYNC_SUCCESS':
      return {
        ...state,
        isSyncing: false,
        lastSyncAt: new Date(),
        pendingCount: Math.max(0, state.pendingCount - action.payload),
        syncError: null,
      }
    case 'SYNC_ERROR':
      return { ...state, isSyncing: false, syncError: action.payload }
    case 'UPDATE_PENDING_COUNT':
      return { ...state, pendingCount: action.payload }
    default:
      return state
  }
}
