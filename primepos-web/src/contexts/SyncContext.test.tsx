import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { SyncProvider } from './SyncContext'
import { useSync } from './useSync'
import { syncReducer, initialSyncState } from './syncReducer'
import type { SyncAction } from './syncReducer'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SyncProvider>{children}</SyncProvider>
)

describe('syncReducer', () => {
  it('handles START_SYNC', () => {
    const action: SyncAction = { type: 'START_SYNC' }
    const state = syncReducer(initialSyncState, action)
    expect(state.isSyncing).toBe(true)
    expect(state.syncError).toBeNull()
  })

  it('handles SYNC_SUCCESS', () => {
    const queuedState = { ...initialSyncState, pendingCount: 5 }
    const action: SyncAction = { type: 'SYNC_SUCCESS', payload: 3 }
    const state = syncReducer(queuedState, action)
    expect(state.isSyncing).toBe(false)
    expect(state.pendingCount).toBe(2)
    expect(state.lastSyncAt).toBeInstanceOf(Date)
    expect(state.syncError).toBeNull()
  })

  it('handles SYNC_SUCCESS with payload greater than pendingCount', () => {
    const queuedState = { ...initialSyncState, pendingCount: 2 }
    const action: SyncAction = { type: 'SYNC_SUCCESS', payload: 5 }
    const state = syncReducer(queuedState, action)
    expect(state.pendingCount).toBe(0)
  })

  it('handles SYNC_ERROR', () => {
    const syncingState = { ...initialSyncState, isSyncing: true }
    const action: SyncAction = { type: 'SYNC_ERROR', payload: 'Network failed' }
    const state = syncReducer(syncingState, action)
    expect(state.isSyncing).toBe(false)
    expect(state.syncError).toBe('Network failed')
  })

  it('handles UPDATE_PENDING_COUNT', () => {
    const action: SyncAction = { type: 'UPDATE_PENDING_COUNT', payload: 7 }
    const state = syncReducer(initialSyncState, action)
    expect(state.pendingCount).toBe(7)
  })
})

describe('useSync', () => {
  it('throws when used outside SyncProvider', () => {
    expect(() => {
      renderHook(() => useSync())
    }).toThrow('useSync must be used within a SyncProvider')
  })

  it('returns sync state and actions inside SyncProvider', () => {
    const { result } = renderHook(() => useSync(), { wrapper })

    expect(result.current.isSyncing).toBe(false)
    expect(result.current.pendingCount).toBe(0)
    expect(result.current.lastSyncAt).toBeNull()
    expect(result.current.syncError).toBeNull()

    act(() => {
      result.current.updatePendingCount(3)
    })
    expect(result.current.pendingCount).toBe(3)

    act(() => {
      result.current.startSync()
    })
    expect(result.current.isSyncing).toBe(true)

    act(() => {
      result.current.syncSuccess(2)
    })
    expect(result.current.isSyncing).toBe(false)
    expect(result.current.pendingCount).toBe(1)
    expect(result.current.lastSyncAt).toBeInstanceOf(Date)

    act(() => {
      result.current.setSyncError('Connection timeout')
    })
    expect(result.current.syncError).toBe('Connection timeout')
    expect(result.current.isSyncing).toBe(false)
  })
})
