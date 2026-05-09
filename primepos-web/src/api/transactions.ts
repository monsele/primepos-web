export interface CashInRequest {
  accountNumber: string
  payeeName: string
  amount: number // in kobo
  sendSms: boolean
  officerId: string
}

export interface CashInResponse {
  transactionId: string
  status: 'POSTED'
  createdAt: string
}

export async function postCashIn(payload: CashInRequest): Promise<CashInResponse> {
  void payload
  // Mock implementation for MVP
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    transactionId: `TXN-${Date.now()}`,
    status: 'POSTED',
    createdAt: new Date().toISOString(),
  }
}

export interface CashOutRequest {
  accountNumber: string
  payeeName: string
  amount: number // in kobo
  sendSms: boolean
  officerId: string
}

export interface CashOutResponse {
  transactionId: string
  status: 'POSTED'
  createdAt: string
}

export async function postCashOut(payload: CashOutRequest): Promise<CashOutResponse> {
  void payload
  // Mock implementation for MVP
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    transactionId: `TXN-${Date.now()}`,
    status: 'POSTED',
    createdAt: new Date().toISOString(),
  }
}

export interface BatchDepositRequest {
  payeeName: string
  branchId: string
  groupId: string
  deposits: {
    accountNumber: string
    amount: number     // kobo
  }[]
  sendSms: boolean
  officerId: string
}

export interface BatchDepositResponse {
  batchReference: string
  totalAmount: number
  postedCount: number
  failedCount: number
}

export async function postBatchDeposit(payload: BatchDepositRequest): Promise<BatchDepositResponse> {
  void payload
  // Mock implementation for MVP
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const postedCount = payload.deposits.length
  const totalAmount = payload.deposits.reduce((sum, d) => sum + d.amount, 0)

  return {
    batchReference: `BATCH-${Date.now()}`,
    totalAmount,
    postedCount,
    failedCount: 0,
  }
}
