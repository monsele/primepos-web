import { useAuth } from '../../contexts/useAuth'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useConnectionTransition } from '../../hooks/useConnectionTransition'
import { useToast } from '../../components/Toast/useToast'
import { useEffect } from 'react'
import OfflineIndicator from '../../components/OfflineIndicator'
import { ConnectionBanner } from '../../components/ConnectionBanner/ConnectionBanner'
import { KPICards } from './KPICards'
import { useDashboardKPIs, useInvalidateDailySummary } from './useDashboardKPIs'
import { PullToRefresh } from '../../components/PullToRefresh/PullToRefresh'
import styles from './dashboard.module.css'

export function DashboardScreen() {
  const { user } = useAuth()
  const { isOnline } = useNetworkStatus()
  const { wentOffline, cameOnline } = useConnectionTransition()
  const { showToast } = useToast()
  const { data, isLoading } = useDashboardKPIs()
  const invalidate = useInvalidateDailySummary()

  useEffect(() => {
    if (wentOffline) {
      showToast({
        message: 'You are offline. Transactions will be saved locally.',
        type: 'warning',
      })
    }
    if (cameOnline) {
      showToast({
        message: 'Back online. Syncing pending transactions...',
        type: 'success',
      })
    }
  }, [wentOffline, cameOnline, showToast])

  const handleRefresh = async () => {
    await invalidate()
  }

  const kpiData = data || {
    collections: 0,
    transactionCount: 0,
    pendingSyncCount: 0,
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className={styles.dashboard} data-testid="dashboard-screen">
        <OfflineIndicator />
        <ConnectionBanner isOnline={isOnline} />

        <section className={styles.hero}>
          <h2>Welcome, {user?.name || 'Officer'}</h2>
          <p>{user?.branchName || 'Branch'}</p>
        </section>

        <KPICards
          collections={kpiData.collections}
          transactionCount={kpiData.transactionCount}
          pendingSyncCount={kpiData.pendingSyncCount}
        />

        <section className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionsGrid}>
            <button className={styles.actionCard} type="button">
              <span className={styles.actionIcon}>↓</span>
              <span className={styles.actionLabel}>Cash In</span>
            </button>
            <button className={styles.actionCard} type="button">
              <span className={styles.actionIcon}>↑</span>
              <span className={styles.actionLabel}>Cash Out</span>
            </button>
            <button className={styles.actionCard} type="button">
              <span className={styles.actionIcon}>💰</span>
              <span className={styles.actionLabel}>Loan Repay</span>
            </button>
            <button className={styles.actionCard} type="button">
              <span className={styles.actionIcon}>✨</span>
              <span className={styles.actionLabel}>New Account</span>
            </button>
          </div>
        </section>

        <section className={styles.recentTransactions}>
          <h3>Recent Transactions</h3>
          <div className={styles.transactionList}>
            <div className={styles.transactionItem}>
              <div className={styles.txInfo}>
                <span className={styles.txName}>Adediran Blessing</span>
                <span className={styles.txType}>Cash In · 10:42 AM</span>
              </div>
              <div className={styles.txAmount}>
                <span className={styles.amount}>₦5,000</span>
                <span className={`${styles.badge} ${styles.badgePosted}`}>POSTED</span>
              </div>
            </div>
            <div className={styles.transactionItem}>
              <div className={styles.txInfo}>
                <span className={styles.txName}>Adejumo Olusegun</span>
                <span className={styles.txType}>Loan Repay · 10:18 AM</span>
              </div>
              <div className={styles.txAmount}>
                <span className={styles.amount}>₦12,500</span>
                <span className={`${styles.badge} ${styles.badgePosted}`}>POSTED</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PullToRefresh>
  )
}
