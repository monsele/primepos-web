import type { Loan } from '../types/loan'

export async function searchLoan(loanNumber: string): Promise<Loan> {
  // Mock implementation for MVP
  await new Promise((resolve) => setTimeout(resolve, 600))

  if (!loanNumber.trim() || loanNumber === '0000000000') {
    throw new Error('Loan not found')
  }

  return {
    loanNumber,
    customerName: 'Adediran Blessing',
    product: 'Micro Business Loan',
    loanPurpose: 'Working Capital',
    loanAmount: 5_000_000,
    currentBalance: 3_250_000,
    outstandingInterest: 125_000,
    startDate: '2024-01-15',
    maturityDate: '2025-01-15',
    status: 'ACTIVE',
  }
}

export interface LoanRepaymentRequest {
  loanNumber: string
  amount: number // kobo
  officerId: string
}

export interface LoanRepaymentResponse {
  transactionId: string
  status: 'POSTED'
  createdAt: string
  newBalance: number // kobo
}

export async function postLoanRepayment(
  payload: LoanRepaymentRequest
): Promise<LoanRepaymentResponse> {
  // Mock implementation for MVP
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    transactionId: `TXN-${Date.now()}`,
    status: 'POSTED',
    createdAt: new Date().toISOString(),
    newBalance: 3_250_000 - payload.amount,
  }
}
