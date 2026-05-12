import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { clear } from 'idb-keyval'
import { SyncEngine } from './syncEngine'
import * as transactions from './storage/transactions'

describe('SyncEngine', () => {
  let engine: SyncEngine

  beforeEach(async () => {
    await clear()
    engine = new SyncEngine()
    vi.spyOn(transactions, 'getPendingTransactions').mockResolvedValue([])
    vi.spyOn(transactions, 'updateTransaction').mockResolvedValue()
  })

  it('processes empty queue successfully', async () => {
    const result = await engine.processQueue()
    expect(result.processed).toBe(0)
    expect(result.succeeded).toBe(0)
    expect(result.failed).toBe(0)
  })

  it('calculates exponential backoff correctly', () => {
    expect(engine.calculateBackoff(0)).toBe(1000)
    expect(engine.calculateBackoff(1)).toBe(2000)
    expect(engine.calculateBackoff(2)).toBe(4000)
    expect(engine.calculateBackoff(3)).toBe(8000)
  })
})