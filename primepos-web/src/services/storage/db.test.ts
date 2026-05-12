import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { clear } from 'idb-keyval'
import { initDB, isIndexedDBAvailable } from './db'

describe('db initialization', () => {
  beforeEach(async () => {
    await clear()
  })

  it('initializes without error', async () => {
    await expect(initDB()).resolves.toBeUndefined()
  })

  it('sets initialization marker', async () => {
    await initDB()
    const { get } = await import('idb-keyval')
    const marker = await get('__primepos_init__')
    expect(marker).toBe(true)
  })

  it('isIndexedDBAvailable returns true in test environment', () => {
    expect(isIndexedDBAvailable()).toBe(true)
  })

  it('initDB is idempotent', async () => {
    await initDB()
    await initDB()
    const { get } = await import('idb-keyval')
    const marker = await get('__primepos_init__')
    expect(marker).toBe(true)
  })
})
