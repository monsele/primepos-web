import { get, set, del, keys } from 'idb-keyval'
import type { QueuedTransaction } from './types'

const KEY_PREFIX = 'tx:'

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function getTransaction(id: string): Promise<QueuedTransaction | undefined> {
  return get(KEY_PREFIX + id)
}

export async function setTransaction(id: string, tx: QueuedTransaction): Promise<void> {
  return set(KEY_PREFIX + id, tx)
}

export async function deleteTransaction(id: string): Promise<void> {
  return del(KEY_PREFIX + id)
}

export async function getAllTransactions(): Promise<QueuedTransaction[]> {
  const allKeys = await keys()
  const txKeys = allKeys.filter(k => String(k).startsWith(KEY_PREFIX))
  const values = await Promise.all(txKeys.map(k => get(k)))
  return values.filter((v): v is QueuedTransaction => v !== undefined)
}

export async function clearTransactions(): Promise<void> {
  const allKeys = await keys()
  const txKeys = allKeys.filter(k => String(k).startsWith(KEY_PREFIX))
  await Promise.all(txKeys.map(k => del(k)))
}

export async function addToQueue(item: Omit<QueuedTransaction, 'id'> & { id?: string }): Promise<void> {
  if (typeof indexedDB === 'undefined') {
    console.warn('IndexedDB unavailable — transaction queue not persisted')
    return
  }
  const tx: QueuedTransaction = {
    ...item,
    retryCount: item.retryCount ?? 0,
    id: item.id || `local-${generateUUID()}`,
  } as QueuedTransaction
  await setTransaction(tx.id, tx)
}

export async function getPendingCount(): Promise<number> {
  if (typeof indexedDB === 'undefined') {
    return 0
  }
  const all = await getAllTransactions()
  return all.filter(t => t.status === 'PENDING').length
}

export async function getPendingTransactions(): Promise<QueuedTransaction[]> {
  if (typeof indexedDB === 'undefined') {
    return []
  }
  const all = await getAllTransactions()
  return all.filter(t => t.status === 'PENDING' || t.status === 'FAILED')
}

export async function updateTransaction(id: string, updates: Partial<QueuedTransaction>): Promise<void> {
  const existing = await getTransaction(id)
  if (!existing) return
  await setTransaction(id, { ...existing, ...updates })
}
