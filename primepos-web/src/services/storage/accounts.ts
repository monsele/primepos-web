import { get, set, del, keys } from 'idb-keyval'
import type { Account } from './types'

const KEY_PREFIX = 'account:'

export async function getAccount(id: string): Promise<Account | undefined> {
  return get(KEY_PREFIX + id)
}

export async function setAccount(id: string, account: Account): Promise<void> {
  return set(KEY_PREFIX + id, account)
}

export async function deleteAccount(id: string): Promise<void> {
  return del(KEY_PREFIX + id)
}

export async function getAllAccounts(): Promise<Account[]> {
  const allKeys = await keys()
  const accountKeys = allKeys.filter(k => String(k).startsWith(KEY_PREFIX))
  const values = await Promise.all(accountKeys.map(k => get(k)))
  return values.filter((v): v is Account => v !== undefined)
}

export async function clearAccounts(): Promise<void> {
  const allKeys = await keys()
  const accountKeys = allKeys.filter(k => String(k).startsWith(KEY_PREFIX))
  await Promise.all(accountKeys.map(k => del(k)))
}
