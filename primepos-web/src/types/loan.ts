export interface Loan {
  loanNumber: string
  customerName: string
  product: string
  loanPurpose: string
  loanAmount: number // kobo
  currentBalance: number // kobo
  outstandingInterest: number // kobo
  startDate: string
  maturityDate: string
  status: 'POSTED' | 'ACTIVE' | 'CLOSED'
}
