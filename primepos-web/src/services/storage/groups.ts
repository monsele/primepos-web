import { get, set, del, keys } from 'idb-keyval'
import type { Group } from './types'

const KEY_PREFIX = 'group:'

export async function getGroup(id: string): Promise<Group | undefined> {
  return get(KEY_PREFIX + id)
}

export async function setGroup(id: string, group: Group): Promise<void> {
  return set(KEY_PREFIX + id, group)
}

export async function deleteGroup(id: string): Promise<void> {
  return del(KEY_PREFIX + id)
}

export async function getAllGroups(): Promise<Group[]> {
  const allKeys = await keys()
  const groupKeys = allKeys.filter(k => String(k).startsWith(KEY_PREFIX))
  const values = await Promise.all(groupKeys.map(k => get(k)))
  return values.filter((v): v is Group => v !== undefined)
}

export async function clearGroups(): Promise<void> {
  const allKeys = await keys()
  const groupKeys = allKeys.filter(k => String(k).startsWith(KEY_PREFIX))
  await Promise.all(groupKeys.map(k => del(k)))
}
