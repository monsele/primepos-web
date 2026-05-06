import type { Account } from '../types/account'

export async function searchAccount(accountNumber: string): Promise<Account> {
  // Mock implementation for MVP
  await new Promise((resolve) => setTimeout(resolve, 600))

  if (!accountNumber.trim() || accountNumber === '0000000000') {
    throw new Error('Account not found')
  }

  return {
    accountNumber,
    accountName: 'Adediran Blessing',
    bookBalance: 5_000_000,
    usableBalance: 4_500_000,
    nuban: '1234567890',
    branchId: 'OGBA001',
  }
}
