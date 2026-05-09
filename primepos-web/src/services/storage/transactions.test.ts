import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { clear } from 'idb-keyval'
import {
  getTransaction,
  setTransaction,
  deleteTransaction,
  getAllTransactions,
  clearTransactions,
  addToQueue,
  getPendingCount,
} from './transactions'
import type { QueuedTransaction } from './types'

const mockTx: QueuedTransaction = {
  id: 'TX001',
  type: 'CASH_IN',
  payload: { amount: 1000 },
  status: 'PENDING',
  createdAt: '2026-05-09T12:00:00Z',
}

describe('transactions CRUD', () => {
  beforeEach(async () => {
    await clear()
  })

  it('setTransaction stores a transaction', async () => {
    await expect(setTransaction('TX001', mockTx)).resolves.toBeUndefined()
  })

  it('getTransaction retrieves a stored transaction', async () => {
    await setTransaction('TX001', mockTx)
    const result = await getTransaction('TX001')
    expect(result).toEqual(mockTx)
  })

  it('getTransaction returns undefined for non-existent transaction', async () => {
    const result = await getTransaction('NONEXISTENT')
    expect(result).toBeUndefined()
  })

  it('deleteTransaction removes a transaction', async () => {
    await setTransaction('TX001', mockTx)
    await deleteTransaction('TX001')
    const result = await getTransaction('TX001')
    expect(result).toBeUndefined()
  })

  it('getAllTransactions returns all transactions', async () => {
    await setTransaction('TX001', mockTx)
    await setTransaction('TX002', { ...mockTx, id: 'TX002' })
    const all = await getAllTransactions()
    expect(all.length).toBe(2)
  })

  it('clearTransactions removes all transactions', async () => {
    await setTransaction('TX001', mockTx)
    await clearTransactions()
    const all = await getAllTransactions()
    expect(all.length).toBe(0)
  })

  it('addToQueue adds a transaction with generated id', async () => {
    await addToQueue({ type: 'CASH_IN', payload: {}, status: 'PENDING', createdAt: '2026-05-09T12:00:00Z' })
    const all = await getAllTransactions()
    expect(all.length).toBe(1)
    expect(all[0].id).toBeDefined()
    expect(all[0].type).toBe('CASH_IN')
    expect(all[0].status).toBe('PENDING')
  })

  it('addToQueue uses provided id when given', async () => {
    await addToQueue({ id: 'custom-id', type: 'LOAN_REPAY', payload: {}, status: 'PENDING', createdAt: '2026-05-09T12:00:00Z' })
    const result = await getTransaction('custom-id')
    expect(result).toBeDefined()
    expect(result!.id).toBe('custom-id')
  })

  it('getPendingCount returns count of pending transactions', async () => {
    await setTransaction('TX001', { ...mockTx, status: 'PENDING' })
    await setTransaction('TX002', { ...mockTx, id: 'TX002', status: 'SYNCED' })
    await setTransaction('TX003', { ...mockTx, id: 'TX003', status: 'PENDING' })
    const count = await getPendingCount()
    expect(count).toBe(2)
  })

  it('getPendingCount returns 0 when no pending transactions', async () => {
    await setTransaction('TX001', { ...mockTx, status: 'SYNCED' })
    const count = await getPendingCount()
    expect(count).toBe(0)
  })

  it('addToQueue warns when IndexedDB unavailable', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubGlobal('indexedDB', undefined)
    await addToQueue({ type: 'TEST', payload: {}, status: 'PENDING', createdAt: '2026-05-09T12:00:00Z' })
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
    vi.unstubAllGlobals()
  })

  it('getPendingCount returns 0 when IndexedDB unavailable', async () => {
    vi.stubGlobal('indexedDB', undefined)
    const count = await getPendingCount()
    expect(count).toBe(0)
    vi.unstubAllGlobals()
  })
})
