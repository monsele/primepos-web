import { useNavigation } from '../../contexts/NavigationContext'
import { formatNaira } from '../../utils/currency'
import styles from './kpi-cards.module.css'

interface KPICardsProps {
  collections: number
  transactionCount: number
  pendingSyncCount: number
}

export function KPICards({
  collections,
  transactionCount,
  pendingSyncCount,
}: KPICardsProps) {
  const { navigateTo } = useNavigation()

  const handlePendingSyncClick = () => {
    if (pendingSyncCount > 0) {
      navigateTo('unpostedTransactions')
    }
  }

  return (
    <div className={styles.kpiRow} data-testid="kpi-cards">
      <div className={styles.kpiCard}>
        <span className={styles.label}>Collections</span>
        <span className={styles.value}>{formatNaira(collections)}</span>
        <span className={`${styles.subtitle} ${styles.subtitleSuccess}`}>
          today
        </span>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.label}>Transactions</span>
        <span className={styles.value}>{transactionCount}</span>
        <span className={`${styles.subtitle} ${styles.subtitleSuccess}`}>
          today
        </span>
      </div>

      <div
        className={`${styles.kpiCard} ${pendingSyncCount > 0 ? styles.kpiCardClickable : ''}`}
        onClick={handlePendingSyncClick}
        role={pendingSyncCount > 0 ? 'button' : undefined}
        tabIndex={pendingSyncCount > 0 ? 0 : undefined}
        aria-label={
          pendingSyncCount > 0
            ? `${pendingSyncCount} pending sync transactions. Tap to view unposted transactions.`
            : 'Pending sync'
        }
      >
        <span className={styles.label}>Pending Sync</span>
        <span className={styles.value}>{pendingSyncCount}</span>
        <span
          className={`${styles.subtitle} ${pendingSyncCount > 0 ? styles.subtitleWarning : styles.subtitleSuccess}`}
        >
          today
        </span>
      </div>
    </div>
  )
}
