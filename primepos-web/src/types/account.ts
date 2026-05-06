export interface Account {
  accountNumber: string
  accountName: string
  bookBalance: number // in kobo
  usableBalance: number // in kobo
  nuban?: string
  branchId: string
}
