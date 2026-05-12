import { setAccount, getAccount, deleteAccount } from './storage/accounts'
import { setLoan, getLoan, deleteLoan } from './storage/loans'
import { setGroup, getGroup, deleteGroup } from './storage/groups'
import type { Account } from '../types/account'
import type { Loan } from '../types/loan'
import type { Group } from '../types/group'

export async function cacheAccount(account: Account): Promise<void> {
  await setAccount(account.accountNumber, account)
}

export async function getCachedAccount(number: string): Promise<Account | undefined> {
  return getAccount(number)
}

export function deleteCachedAccount(number: string): Promise<void> {
  return deleteAccount(number)
}

export async function cacheLoan(loan: Loan): Promise<void> {
  await setLoan(loan.loanNumber, loan)
}

export async function getCachedLoan(number: string): Promise<Loan | undefined> {
  return getLoan(number)
}

export function deleteCachedLoan(number: string): Promise<void> {
  return deleteLoan(number)
}

export async function cacheGroup(group: Group): Promise<void> {
  await setGroup(group.id, group)
}

export async function getCachedGroup(id: string): Promise<Group | undefined> {
  return getGroup(id)
}

export function deleteCachedGroup(id: string): Promise<void> {
  return deleteGroup(id)
}

export async function shouldUseCache(isOnline: boolean): Promise<boolean> {
  return !isOnline
}

export async function cacheDataIfExists<T>(
  fetchResult: T,
  cacheFn: (data: T) => Promise<void>
): Promise<T> {
  await cacheFn(fetchResult)
  return fetchResult
}