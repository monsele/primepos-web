import { useNavigation } from '../../contexts/NavigationContext'
import type { Screen } from '../../types/navigation'
import styles from './quick-actions.module.css'

export interface QuickAction {
  id: string
  label: string
  subtitle: string
  icon: string
  targetScreen: Screen
}

// eslint-disable-next-line react-refresh/only-export-components
export const quickActions: QuickAction[] = [
  { id: 'cash-in', label: 'Cash In', subtitle: 'Receive payment', icon: '↓', targetScreen: 'cashIn' },
  { id: 'cash-out', label: 'Cash Out', subtitle: 'Disburse cash', icon: '↑', targetScreen: 'cashOut' },
  { id: 'loan-repay', label: 'Loan Repayment', subtitle: 'Post repayment', icon: '💰', targetScreen: 'loanRepayment' },
  { id: 'group-loan-repay', label: 'Group Loan', subtitle: 'Group repayment', icon: '👥', targetScreen: 'groupLoanRepayment' },
  { id: 'new-account', label: 'New Account', subtitle: 'Open savings', icon: '✨', targetScreen: 'newAccount' },
]

export function QuickActions() {
  const { navigateTo } = useNavigation()

  return (
    <section className={styles.quickActions} data-testid="quick-actions">
      <h3 className={styles.sectionTitle}>Quick Actions</h3>
      <div className={styles.actionsGrid}>
        {quickActions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={styles.actionCard}
            onClick={() => navigateTo(action.targetScreen)}
            data-testid={`quick-action-${action.id}`}
            aria-label={`${action.label}: ${action.subtitle}`}
          >
            <span className={styles.iconContainer} aria-hidden="true">
              {action.icon}
            </span>
            <span className={styles.actionLabel}>{action.label}</span>
            <span className={styles.actionSubtitle}>{action.subtitle}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
