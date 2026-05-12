import type { Loan } from './loan'

export interface Group {
  id: string
  groupCode: string
  groupName: string
  branchId: string
  memberCount: number
}

export interface GroupLoan extends Loan {
  groupId: string
  groupName: string
}

export interface GroupMember {
  id: string
  customerName: string
  accountNumber: string
  amount: number | null   // kobo, entered by officer
}
