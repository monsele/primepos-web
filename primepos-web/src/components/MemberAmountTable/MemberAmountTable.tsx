import { useMemo } from 'react'
import type { GroupMember } from '../../types/group'
import styles from './MemberAmountTable.module.css'

export interface MemberAmountTableProps {
  members: GroupMember[]
  onAmountChange: (memberId: string, amount: number | null) => void
}

export default function MemberAmountTable({
  members,
  onAmountChange
}: MemberAmountTableProps) {
  const total = useMemo(() => {
    return members.reduce((sum, m) => sum + (m.amount || 0), 0)
  }, [members])

  const customerCount = useMemo(() => {
    return members.filter(m => (m.amount || 0) > 0).length
  }, [members])

  const formatAmount = (amount: number | null) => {
    if (amount === null || amount === 0) return ''
    return (amount / 100).toFixed(2) // Convert kobo to naira for display
  }

  const parseAmount = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''))
    return isNaN(num) ? null : Math.round(num * 100) // Convert naira to kobo
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.numberColumn}>#</th>
            <th>Customer Name</th>
            <th>Account Number</th>
            <th className={styles.amountColumn}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.id}>
              <td className={styles.numberColumn}>{index + 1}</td>
              <td>{member.customerName}</td>
              <td>{member.accountNumber}</td>
              <td className={styles.amountColumn}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formatAmount(member.amount)}
                  onChange={(e) => {
                    const amount = parseAmount(e.target.value)
                    onAmountChange(member.id, amount)
                  }}
                  className={styles.amountInput}
                  placeholder="0.00"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.summary}>
        <div className={styles.customerCount}>
          Customers: {customerCount}
        </div>
        <div className={styles.total}>
          Total: ₦{(total / 100).toFixed(2)}
        </div>
      </div>
    </div>
  )
}