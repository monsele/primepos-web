import { set } from 'idb-keyval'

export const DB_NAME = 'PrimePOSDB'

export function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== 'undefined'
}

export async function initDB(): Promise<void> {
  if (!isIndexedDBAvailable()) {
    throw new Error('IndexedDB is not available in this environment')
  }
  await set('__primepos_init__', true)
}
