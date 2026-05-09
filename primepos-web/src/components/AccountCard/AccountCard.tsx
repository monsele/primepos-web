import { formatNaira } from '../../utils/currency'
import type { Account } from '../../types/account'
import styles from './AccountCard.module.css'

export interface AccountCardProps {
  account: Account
}

export function AccountCard({ account }: AccountCardProps) {
  return (
    <div className={styles.card} data-testid="account-card">
      <div className={styles.header}>Account Found</div>
      <div className={styles.name}>{account.accountName}</div>
      {account.nuban && <div className={styles.nuban}>{account.nuban}</div>}
      <div className={styles.balances}>
        <div className={styles.balanceItem}>
          <span className={styles.label}>Book Balance</span>
          <span className={`${styles.value} ${styles.positive}`}>
            {formatNaira(account.bookBalance)}
          </span>
        </div>
        <div className={styles.balanceItem}>
          <span className={styles.label}>Usable Balance</span>
          <span className={`${styles.value} ${styles.positive}`}>
            {formatNaira(account.usableBalance)}
          </span>
        </div>
      </div>
    </div>
  )
}
