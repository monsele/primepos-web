import { useAuth } from '../../contexts/useAuth'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useConnectionTransition } from '../../hooks/useConnectionTransition'
import { useToast } from '../../components/Toast/useToast'
import { useEffect } from 'react'
import OfflineIndicator from '../../components/OfflineIndicator'
import { ConnectionBanner } from '../../components/ConnectionBanner/ConnectionBanner'
import { KPICards } from './KPICards'
import { QuickActions } from './QuickActions'
import { useDashboardKPIs, useInvalidateDailySummary } from './useDashboardKPIs'
import { PullToRefresh } from '../../components/PullToRefresh/PullToRefresh'
import { RecentTransactions } from './RecentTransactions'
import { useRecentTransactions } from './useRecentTransactions'
import styles from './dashboard.module.css'

export function DashboardScreen() {
  const { user } = useAuth()
  const { isOnline } = useNetworkStatus()
  const { wentOffline, cameOnline } = useConnectionTransition()
  const { showToast } = useToast()
  const { data } = useDashboardKPIs()
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useRecentTransactions(user?.staffId)
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

        <QuickActions />

        <RecentTransactions
          transactions={transactions}
          isLoading={transactionsLoading}
          error={transactionsError}
        />
      </div>
    </PullToRefresh>
  )
}
