import type { Account } from '../../types/account'
import type { Loan } from '../../types/loan'
import type { Group } from '../../types/group'
import type { Officer } from '../../types/auth'

export type { Account, Loan, Group, Officer }

export type TransactionType = 'CashIn' | 'CashOut' | 'LoanRepayment' | 'BatchDeposit' | 'NewAccountDeposit'

export interface QueuedTransaction {
  id: string
  type: TransactionType | string
  payload: unknown
  status: 'PENDING' | 'POSTED' | 'SYNCED' | 'FAILED'
  errorMessage?: string
  retryCount?: number
  createdAt: string
  postedAt?: string
}

export type QueueItem = QueuedTransaction

export interface SyncMetadata {
  lastSyncAccounts: string
  lastSyncLoans: string
  lastSyncGroups: string
}

export interface Storage<T> {
  get(id: string): Promise<T | undefined>
  set(id: string, value: T): Promise<void>
  del(id: string): Promise<void>
  getAll(): Promise<T[]>
  clear(): Promise<void>
}
