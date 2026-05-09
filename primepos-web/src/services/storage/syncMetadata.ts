import { get, set, del, keys } from 'idb-keyval'
import type { SyncMetadata } from './types'

const KEY = 'syncMetadata'

export async function getSyncMetadata(): Promise<SyncMetadata | undefined> {
  return get(KEY)
}

export async function setSyncMetadata(metadata: SyncMetadata): Promise<void> {
  return set(KEY, metadata)
}

export async function deleteSyncMetadata(): Promise<void> {
  return del(KEY)
}

export async function getAllSyncMetadata(): Promise<SyncMetadata[]> {
  const allKeys = await keys()
  const values = await Promise.all(allKeys.filter(k => k === KEY || String(k).startsWith('syncMetadata:')).map(k => get(k)))
  return values.filter((v): v is SyncMetadata => v !== undefined)
}

export async function clearSyncMetadata(): Promise<void> {
  const allKeys = await keys()
  const mdKeys = allKeys.filter(k => k === KEY || String(k).startsWith('syncMetadata:'))
  await Promise.all(mdKeys.map(k => del(k)))
}
