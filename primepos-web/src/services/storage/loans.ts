import { get, set, del, keys } from 'idb-keyval'
import type { Loan } from './types'

const KEY_PREFIX = 'loan:'

export async function getLoan(id: string): Promise<Loan | undefined> {
  return get(KEY_PREFIX + id)
}

export async function setLoan(id: string, loan: Loan): Promise<void> {
  return set(KEY_PREFIX + id, loan)
}

export async function deleteLoan(id: string): Promise<void> {
  return del(KEY_PREFIX + id)
}

export async function getAllLoans(): Promise<Loan[]> {
  const allKeys = await keys()
  const loanKeys = allKeys.filter(k => String(k).startsWith(KEY_PREFIX))
  const values = await Promise.all(loanKeys.map(k => get(k)))
  return values.filter((v): v is Loan => v !== undefined)
}

export async function clearLoans(): Promise<void> {
  const allKeys = await keys()
  const loanKeys = allKeys.filter(k => String(k).startsWith(KEY_PREFIX))
  await Promise.all(loanKeys.map(k => del(k)))
}
