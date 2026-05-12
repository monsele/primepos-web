export interface Transaction {
  id: string
  customerName: string
  type: 'Cash In' | 'Cash Out' | 'Loan Repay' | 'New Account' | 'Batch Deposit'
  amount: number // in kobo
  status: 'POSTED' | 'PENDING'
  createdAt: string // ISO 8601
}
