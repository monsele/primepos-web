import { cacheAccount, cacheLoan, cacheGroup } from './cacheStrategy'
import type { Account } from '../types/account'
import type { Loan } from '../types/loan'
import type { Group } from '../types/group'
import { setSyncMetadata, getSyncMetadata } from './storage/syncMetadata'

export interface PortfolioData {
  accounts: Account[]
  loans: Loan[]
  groups: Group[]
}

async function fetchPortfolioAccounts(_officerId: string): Promise<Account[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [
    {
      accountNumber: '1234567890',
      accountName: 'Johnson Chukwuemeka',
      bookBalance: 1_500_000,
      usableBalance: 1_200_000,
      nuban: '1234567890',
      branchId: 'OGBA001',
    },
    {
      accountNumber: '0987654321',
      accountName: 'Maryam Abubakar',
      bookBalance: 75_000,
      usableBalance: 75_000,
      nuban: '0987654321',
      branchId: 'OGBA001',
    },
  ]
}

async function fetchPortfolioLoans(_officerId: string): Promise<Loan[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  // Mock implementation - in production this would use officerId to filter
  return [
    {
      loanNumber: 'LN-2024-001234',
      accountNumber: '1234567890',
      accountName: 'Johnson Chukwuemeka',
      product: 'Prime Loan',
      principal: 500_000_00,
      interest: 25_000_00,
      totalDue: 525_000_00,
      bookBalance: 525_000_00,
      status: 'Active',
      disbursementDate: '2024-01-15',
      maturityDate: '2025-01-15',
    },
  ]
}

async function fetchPortfolioGroups(officerId: string): Promise<Group[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [
    {
      groupId: 'GRP-001',
      groupName: 'Better Life Circle',
      memberCount: 25,
      totalSavings: 2_500_000,
      officerId,
      createdAt: '2023-06-01',
    },
  ]
}

export async function syncOfflineData(officerId: string): Promise<void> {
  const [accounts, loans, groups] = await Promise.all([
    fetchPortfolioAccounts(officerId),
    fetchPortfolioLoans(officerId),
    fetchPortfolioGroups(officerId),
  ])

  await Promise.all(accounts.map((a) => cacheAccount(a)))
  await Promise.all(loans.map((l) => cacheLoan(l)))
  await Promise.all(groups.map((g) => cacheGroup(g)))

  await setSyncMetadata({
    lastSyncAccounts: new Date().toISOString(),
    lastSyncLoans: new Date().toISOString(),
    lastSyncGroups: new Date().toISOString(),
  })
}

export async function getSyncStatus(): Promise<{
  lastSync: string | null
  accounts: number
  loans: number
  groups: number
}> {
  const metadata = await getSyncMetadata()
  const lastSync = metadata?.lastSyncAccounts ?? null

  const [accounts, loans, groups] = await Promise.all([
    import('./storage/accounts').then((m) => m.getAllAccounts()),
    import('./storage/loans').then((m) => m.getAllLoans()),
    import('./storage/groups').then((m) => m.getAllGroups()),
  ])

  return {
    lastSync,
    accounts: accounts.length,
    loans: loans.length,
    groups: groups.length,
  }
}