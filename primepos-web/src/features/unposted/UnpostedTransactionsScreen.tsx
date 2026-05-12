import { useUnpostedTransactions } from './useUnpostedTransactions'
import { ProgressBar } from '../../components/ProgressBar/ProgressBar'
import { PullToRefresh } from '../../components/PullToRefresh/PullToRefresh'
import styles from './unposted-transactions.module.css'

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

function getStatusBadge(status: string) {
  const className = `${styles.badge} ${status === 'PENDING' ? styles.pending : styles.failed}`
  return <span className={className}>{status}</span>
}

function formatAmount(payload: unknown): string {
  if (typeof payload === 'object' && payload !== null) {
    const p = payload as Record<string, unknown>
    if (typeof p.amount === 'number') {
      return `₦${p.amount.toLocaleString()}`
    }
  }
  return '-'
}

function formatCustomer(payload: unknown): string {
  if (typeof payload === 'object' && payload !== null) {
    const p = payload as Record<string, unknown>
    if (typeof p.customerName === 'string') return p.customerName
    if (typeof p.accountName === 'string') return p.accountName
  }
  return 'Unknown'
}

export function UnpostedTransactionsScreen() {
  const { transactions, isLoading, isPosting, postResult, postAll, refetch } = useUnpostedTransactions()

  const pendingCount = transactions.filter((t) => t.status === 'PENDING').length
  const failedCount = transactions.filter((t) => t.status === 'FAILED').length

  if (isLoading) {
    return (
      <div className={styles.loading} data-testid="unposted-loading">
        Loading...
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className={styles.empty} data-testid="unposted-empty">
        <p>No unposted transactions</p>
      </div>
    )
  }

  return (
    <PullToRefresh onRefresh={refetch}>
      <div className={styles.container} data-testid="unposted-screen">
        <div className={styles.summary}>
          <h2>Unposted Transactions</h2>
          <p>
            {pendingCount} pending, {failedCount} failed
          </p>
        </div>

        <ul className={styles.list} data-testid="unposted-list">
          {transactions.map((tx) => (
            <li key={tx.id} className={styles.item} data-testid={`transaction-${tx.id}`}>
              <div className={styles.itemHeader}>
                <span className={styles.type}>{tx.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                {getStatusBadge(tx.status)}
              </div>
              <div className={styles.itemDetails}>
                <span className={styles.customer}>{formatCustomer(tx.payload)}</span>
                <span className={styles.amount}>{formatAmount(tx.payload)}</span>
              </div>
              <div className={styles.itemMeta}>
                <span>{formatTimeAgo(tx.createdAt)}</span>
                {tx.errorMessage && <span className={styles.error}>{tx.errorMessage}</span>}
              </div>
            </li>
          ))}
        </ul>

        {isPosting && (
          <div className={styles.progress} data-testid="post-progress">
            <ProgressBar value={0} max={100} label="Processing..." />
          </div>
        )}

        {!isPosting && postResult && (
          <div className={styles.result} data-testid="post-result">
            <p>
              {postResult.succeeded} succeeded, {postResult.failed} failed
            </p>
          </div>
        )}

        <button
          className={styles.postButton}
          onClick={() => postAll()}
          disabled={isPosting || transactions.length === 0}
          data-testid="post-all-button"
        >
          POST ALL TRANSACTIONS
        </button>
      </div>
    </PullToRefresh>
  )
}