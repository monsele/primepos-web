import { formatNaira } from '../../utils/currency'
import type { Loan } from '../../types/loan'
import type { GroupLoan } from '../../types/group'
import styles from './LoanCard.module.css'

export interface LoanCardProps {
  loan: Loan | GroupLoan
}

function isGroupLoan(loan: Loan | GroupLoan): loan is GroupLoan {
  return 'groupName' in loan && typeof loan.groupName === 'string'
}

export function LoanCard({ loan }: LoanCardProps) {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div className={styles.card} data-testid="loan-card">
      <div className={styles.header}>Loan Details</div>
      {isGroupLoan(loan) && (
        <div className={styles.groupName}>{loan.groupName}</div>
      )}
      <div className={styles.name}>{loan.customerName}</div>
      <div className={styles.details}>
        <div className={styles.row}>
          <div className={styles.item}>
            <span className={styles.label}>Product</span>
            <span className={styles.value}>{loan.product}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>Status</span>
            <span className={`${styles.value} ${styles[loan.status.toLowerCase()]}`}>
              {loan.status}
            </span>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.item}>
            <span className={styles.label}>Loan Amount</span>
            <span className={styles.value}>{formatNaira(loan.loanAmount)}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>Current Balance</span>
            <span className={styles.value}>{formatNaira(loan.currentBalance)}</span>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.item}>
            <span className={styles.label}>Outstanding Interest</span>
            <span className={styles.value}>{formatNaira(loan.outstandingInterest)}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>Maturity Date</span>
            <span className={styles.value}>{formatDate(loan.maturityDate)}</span>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.item}>
            <span className={styles.label}>Loan Purpose</span>
            <span className={styles.value}>{loan.loanPurpose}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>Start Date</span>
            <span className={styles.value}>{formatDate(loan.startDate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
