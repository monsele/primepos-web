import { get, set, del, keys } from 'idb-keyval'
import type { Officer } from './types'

const KEY_PREFIX = 'officer:'

export async function getOfficer(id: string): Promise<Officer | undefined> {
  return get(KEY_PREFIX + id)
}

export async function setOfficer(id: string, officer: Officer): Promise<void> {
  return set(KEY_PREFIX + id, officer)
}

export async function deleteOfficer(id: string): Promise<void> {
  return del(KEY_PREFIX + id)
}

export async function getAllOfficers(): Promise<Officer[]> {
  const allKeys = await keys()
  const officerKeys = allKeys.filter(k => String(k).startsWith(KEY_PREFIX))
  const values = await Promise.all(officerKeys.map(k => get(k)))
  return values.filter((v): v is Officer => v !== undefined)
}

export async function clearOfficers(): Promise<void> {
  const allKeys = await keys()
  const officerKeys = allKeys.filter(k => String(k).startsWith(KEY_PREFIX))
  await Promise.all(officerKeys.map(k => del(k)))
}
