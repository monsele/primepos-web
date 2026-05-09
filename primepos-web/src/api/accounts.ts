import type { Account, StatementEntry } from '../types/account'

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

const MOCK_STATEMENTS: Record<string, StatementEntry[]> = {
  '1234567890': [
    {
      date: '2026-05-01T09:15:00Z',
      description: 'Opening Balance',
      debit: null,
      credit: 250_000,
      balance: 250_000,
    },
    {
      date: '2026-05-02T13:42:00Z',
      description: 'Cash Withdrawal',
      debit: 50_000,
      credit: null,
      balance: 200_000,
    },
    {
      date: '2026-05-04T08:20:00Z',
      description: 'Transfer From Savings',
      debit: null,
      credit: 75_000,
      balance: 275_000,
    },
    {
      date: '2026-05-05T15:10:00Z',
      description: 'ATM Withdrawal',
      debit: 25_000,
      credit: null,
      balance: 250_000,
    },
  ],
}

export async function fetchStatement(
  accountNumber: string,
  from: string,
  to: string
): Promise<StatementEntry[]> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  if (!accountNumber.trim() || accountNumber === '0000000000') {
    throw new Error('Account not found')
  }

  if (to < from) {
    throw new Error('To date must be after From date')
  }

  const statement = MOCK_STATEMENTS[accountNumber] ?? MOCK_STATEMENTS['1234567890']

  return statement.filter((entry) => {
    const entryDate = entry.date.slice(0, 10)
    return entryDate >= from && entryDate <= to
  })
}

export interface NewAccountDepositRequest {
  firstName: string
  surname: string
  otherName: string
  gender: 'Male' | 'Female'
  bvn: string
  productId: string
  initialDeposit: number // in kobo
  officerId: string
}

export interface NewAccountDepositResponse {
  accountNumber: string
  accountName: string
  nuban: string
  depositStatus: 'POSTED' | 'PENDING'
}

export async function createAccountWithDeposit(
  payload: NewAccountDepositRequest
): Promise<NewAccountDepositResponse> {
  // Mock implementation for MVP
  await new Promise((resolve) => setTimeout(resolve, 800))

  const nuban = `${Math.floor(1000000000 + Math.random() * 9000000000)}`

  return {
    accountNumber: `ACC-${Date.now()}`,
    accountName: `${payload.surname} ${payload.firstName}`.trim(),
    nuban,
    depositStatus: 'POSTED',
  }
}

export interface CreateSavingsAccountRequest {
  branch: string
  firstName: string
  otherName: string
  surname: string
  gender: 'Male' | 'Female'
  dateOfBirth: string
  homeAddress: string
  businessAddress: string
  phoneNumber: string
  email: string
  bvn: string
  nextOfKinName: string
  nextOfKinPhone: string
  productId: string
  initialDeposit: number
  officerId: string
}

export interface CreateSavingsAccountResponse {
  accountNumber: string
  accountName: string
  status: 'POSTED'
}

export async function getSavingsProducts() {
  await new Promise((resolve) => setTimeout(resolve, 250))

  return [
    {
      id: '1',
      name: 'Prime Savings',
      minDeposit: 100000,
      description: 'Standard savings account',
    },
    {
      id: '2',
      name: 'Better Life Savings',
      minDeposit: 50000,
      description: 'Group microfinance savings',
    },
    {
      id: '3',
      name: 'Target Saver',
      minDeposit: 250000,
      description: 'Goal-based savings account',
    },
  ]
}

export async function createSavingsAccount(
  payload: CreateSavingsAccountRequest
): Promise<CreateSavingsAccountResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    accountNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    accountName: `${payload.surname} ${payload.firstName}`.trim(),
    status: 'POSTED',
  }
}
