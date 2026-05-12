import { Avatar } from '../../components/Avatar/Avatar'
import { StatusBadge } from '../../components/StatusBadge/StatusBadge'
import { formatNaira } from '../../utils/currency'
import { formatTime } from '../../utils/date'
import type { Transaction } from '../../types/transaction'
import styles from './recent-transactions.module.css'

interface RecentTransactionsProps {
  transactions: Transaction[] | undefined
  isLoading?: boolean
  error?: Error | null
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <div className={styles.transactionItem} data-testid="transaction-item">
      <div className={styles.left}>
        <Avatar name={transaction.customerName} size={36} />
        <div className={styles.info}>
          <span className={styles.name}>{transaction.customerName}</span>
          <span className={styles.meta}>
            {transaction.type} · {formatTime(transaction.createdAt)}
          </span>
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.amount}>{formatNaira(transaction.amount)}</span>
        <StatusBadge status={transaction.status} />
      </div>
    </div>
  )
}

export function RecentTransactions({ transactions, isLoading, error }: RecentTransactionsProps) {
  if (isLoading) {
    return (
      <section className={styles.section} data-testid="recent-transactions" aria-busy="true">
        <h3 className={styles.sectionTitle}>Recent Transactions</h3>
        <div className={styles.loading} role="status" aria-live="polite">Loading...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.section} data-testid="recent-transactions">
        <h3 className={styles.sectionTitle}>Recent Transactions</h3>
        <div className={styles.error} role="alert">Unable to load transactions</div>
      </section>
    )
  }

  const list = transactions ?? []

  if (list.length === 0) {
    return (
      <section className={styles.section} data-testid="recent-transactions">
        <h3 className={styles.sectionTitle}>Recent Transactions</h3>
        <div className={styles.empty} role="status">No transactions yet</div>
      </section>
    )
  }

  return (
    <section className={styles.section} data-testid="recent-transactions">
      <h3 className={styles.sectionTitle}>Recent Transactions</h3>
      <ul className={styles.transactionList} role="list">
        {list.slice(0, 5).map((tx) => (
          <li key={tx.id} className={styles.listItem}>
            <TransactionItem transaction={tx} />
          </li>
        ))}
      </ul>
    </section>
  )
}
