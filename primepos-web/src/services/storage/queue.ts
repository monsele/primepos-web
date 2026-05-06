const DB_NAME = 'primepos-db'
const DB_VERSION = 1
const STORE_NAME = 'transactionQueue'

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

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

export interface QueueItem {
  id: string
  type: string
  payload: unknown
  status: 'PENDING' | 'SYNCED' | 'FAILED'
  createdAt: string
}

export async function addToQueue(item: Omit<QueueItem, 'id'> & { id?: string }): Promise<void> {
  const dbItem: QueueItem = {
    ...item,
    id: item.id || `local-${generateUUID()}`,
  } as QueueItem

  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.add(dbItem)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
      tx.oncomplete = () => db.close()
    })
  } catch {
    // Fallback: silently fail if IndexedDB is unavailable (e.g. tests)
    // In a real app we might use localStorage or memory fallback
    console.warn('IndexedDB unavailable — transaction queue not persisted')
  }
}

export async function getPendingCount(): Promise<number> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.getAll()
      request.onsuccess = () => {
        const items = request.result as QueueItem[]
        resolve(items.filter((i) => i.status === 'PENDING').length)
      }
      request.onerror = () => reject(request.error)
      tx.oncomplete = () => db.close()
    })
  } catch {
    return 0
  }
}
