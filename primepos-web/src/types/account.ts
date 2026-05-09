export interface Account {
  accountNumber: string
  accountName: string
  bookBalance: number // in kobo
  usableBalance: number // in kobo
  nuban?: string
  branchId: string
}

export interface StatementEntry {
  date: string // ISO 8601
  description: string
  debit: number | null // in kobo
  credit: number | null // in kobo
  balance: number // in kobo
}
