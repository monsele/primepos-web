import { useNavigation } from '../../contexts/NavigationContext'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { ConnectionPill } from '../ConnectionPill/ConnectionPill'
import styles from './Header.module.css'

const SCREEN_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  transactMenu: 'Transact',
  servicesMenu: 'Services',
  reports: 'Reports',
  more: 'More',
  cashIn: 'Cash In',
  cashOut: 'Cash Out',
  loanRepayment: 'Loan Repayment',
  newAccount: 'New Account Deposit',
  batchDeposit: 'Batch BBLS Deposit',
  accountBalance: 'Account Balance',
  accountStatement: 'Account Statement',
  loanInquiry: 'Loan Inquiry',
  settings: 'Settings',
  profile: 'My Profile',
  groupLoanRepayment: 'Group Loan Repayment',
  cardTransactions: 'Card Transactions',
  cardDeposit: 'Card Deposit',
  cardWithdrawal: 'Card Withdrawal',
  cardBalance: 'Card Balance',
  cardStatement: 'Card Statement',
  unpostedTransactions: 'Unposted Transactions',
  changePassword: 'Change Password',
  newSavingsAccount: 'New Savings Account',
}

export function Header() {
  const { currentScreen, isInnerScreen, goBack } = useNavigation()
  const { isOnline } = useNetworkStatus()

  if (!isInnerScreen) {
    return (
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>P</div>
          <div>
            <h1 className={styles.brandTitle}>PrimePOS</h1>
            <p className={styles.brandSubtitle}>Mobile Teller Platform</p>
          </div>
        </div>
        <ConnectionPill isOnline={isOnline} />
      </header>
    )
  }

  const title = SCREEN_TITLES[currentScreen] || currentScreen

  return (
    <header className={styles.header}>
      <button
        className={styles.backButton}
        onClick={goBack}
        aria-label="Go back"
        type="button"
      >
        ←
      </button>
      <h1 className={styles.screenTitle}>{title}</h1>
      <div className={styles.actionSlot} />
    </header>
  )
}
