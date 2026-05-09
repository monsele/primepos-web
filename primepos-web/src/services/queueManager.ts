import type { QueuedTransaction } from './storage/types'
import {
  addToQueue as rawAddToQueue,
  getAllTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from './storage/transactions'

export async function add(item: Omit<QueuedTransaction, 'id'> & { id?: string }): Promise<void> {
  await rawAddToQueue(item)
}

export async function getAll(): Promise<QueuedTransaction[]> {
  return getAllTransactions()
}

export async function getPending(): Promise<QueuedTransaction[]> {
  const all = await getAllTransactions()
  return all.filter((t) => t.status === 'PENDING' || t.status === 'FAILED')
}

export async function remove(id: string): Promise<void> {
  await deleteTransaction(id)
}

export async function getById(id: string): Promise<QueuedTransaction | undefined> {
  return getTransaction(id)
}

export async function update(
  id: string,
  updates: Partial<QueuedTransaction>
): Promise<void> {
  await updateTransaction(id, updates)
}