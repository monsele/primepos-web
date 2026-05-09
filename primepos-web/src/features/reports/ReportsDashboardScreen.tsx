import { useNavigation } from '../../contexts/NavigationContext'
import { useReportsSummary } from './useReportsSummary'
import { reportTypes } from './types'
import MenuItem from '../../components/MenuItem/MenuItem'
import { formatNaira } from '../../utils/currency'
import styles from './reports-dashboard.module.css'

export function ReportsDashboardScreen() {
  const { navigateTo } = useNavigation()
  const { data } = useReportsSummary()

  const summaryData = data || {
    totalCollections: 0,
    transactionsToday: 0,
  }

  return (
    <div className={styles.reportsDashboard} data-testid="reports-dashboard-screen">
      <section className={styles.summaryCards}>
        <div className={styles.kpiCard}>
          <span className={styles.label}>Total Collections</span>
          <span className={styles.value}>{formatNaira(summaryData.totalCollections)}</span>
          <span className={styles.subtitle}>today</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.label}>Transactions Today</span>
          <span className={styles.value}>{summaryData.transactionsToday}</span>
          <span className={styles.subtitle}>today</span>
        </div>
      </section>

      <section className={styles.reportList}>
        {reportTypes.map((report) => (
          <MenuItem
            key={report.id}
            label={report.label}
            onClick={() => navigateTo(report.targetScreen)}
          />
        ))}
      </section>
    </div>
  )
}