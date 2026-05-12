import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { clear } from 'idb-keyval'
import {
  getSyncMetadata,
  setSyncMetadata,
  deleteSyncMetadata,
  getAllSyncMetadata,
  clearSyncMetadata,
} from './syncMetadata'
import type { SyncMetadata } from './types'

const mockMetadata: SyncMetadata = {
  lastSyncAccounts: '2026-05-09T10:00:00Z',
  lastSyncLoans: '2026-05-09T10:00:00Z',
  lastSyncGroups: '2026-05-09T10:00:00Z',
}

describe('syncMetadata CRUD', () => {
  beforeEach(async () => {
    await clear()
  })

  it('setSyncMetadata stores metadata', async () => {
    await expect(setSyncMetadata(mockMetadata)).resolves.toBeUndefined()
  })

  it('getSyncMetadata retrieves stored metadata', async () => {
    await setSyncMetadata(mockMetadata)
    const result = await getSyncMetadata()
    expect(result).toEqual(mockMetadata)
  })

  it('getSyncMetadata returns undefined when no metadata stored', async () => {
    const result = await getSyncMetadata()
    expect(result).toBeUndefined()
  })

  it('setSyncMetadata updates existing metadata', async () => {
    await setSyncMetadata(mockMetadata)
    const updated = {
      ...mockMetadata,
      lastSyncAccounts: '2026-05-09T12:00:00Z',
    }
    await setSyncMetadata(updated)
    const result = await getSyncMetadata()
    expect(result).toEqual(updated)
  })

  it('deleteSyncMetadata removes metadata', async () => {
    await setSyncMetadata(mockMetadata)
    await deleteSyncMetadata()
    const result = await getSyncMetadata()
    expect(result).toBeUndefined()
  })

  it('getAllSyncMetadata returns all metadata entries', async () => {
    await setSyncMetadata(mockMetadata)
    const all = await getAllSyncMetadata()
    expect(all.length).toBe(1)
    expect(all[0]).toEqual(mockMetadata)
  })

  it('clearSyncMetadata removes all metadata', async () => {
    await setSyncMetadata(mockMetadata)
    await clearSyncMetadata()
    const all = await getAllSyncMetadata()
    expect(all.length).toBe(0)
  })

  it('getAllSyncMetadata returns empty array when no metadata', async () => {
    const all = await getAllSyncMetadata()
    expect(all).toEqual([])
  })
})
