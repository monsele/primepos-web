import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/useAuth'
import { SyncProvider } from './contexts/SyncContext'
import { NavigationProvider, useNavigation } from './contexts/NavigationContext'
import { ToastProvider } from './components/Toast/ToastProvider'
import { useToast } from './components/Toast/useToast'
import LoginScreen from './features/auth/LoginScreen'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'
import OfflineIndicator from './components/OfflineIndicator'
import { ConnectionBanner } from './components/ConnectionBanner/ConnectionBanner'
import { Header } from './components/Header/Header'
import { BottomNav } from './components/BottomNav/BottomNav'
import { ScreenTransition } from './components/ScreenTransition/ScreenTransition'
import { useNetworkStatus } from './hooks/useNetworkStatus'
import { useConnectionTransition } from './hooks/useConnectionTransition'
import './App.css'

function DashboardContent() {
  const { user } = useAuth()
  const { isOnline } = useNetworkStatus()
  const { wentOffline, cameOnline } = useConnectionTransition()
  const { showToast } = useToast()

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

  return (
    <>
      <OfflineIndicator />
      <ConnectionBanner isOnline={isOnline} />

      <section className="hero">
        <h2>Welcome, {user?.name || 'Officer'}</h2>
        <p>{user?.branchName || 'Branch'}</p>
      </section>

      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card" type="button">
            <span className="action-icon">↓</span>
            <span className="action-label">Cash In</span>
          </button>
          <button className="action-card" type="button">
            <span className="action-icon">↑</span>
            <span className="action-label">Cash Out</span>
          </button>
          <button className="action-card" type="button">
            <span className="action-icon">💰</span>
            <span className="action-label">Loan Repay</span>
          </button>
          <button className="action-card" type="button">
            <span className="action-icon">✨</span>
            <span className="action-label">New Account</span>
          </button>
        </div>
      </section>

      <section className="recent-transactions">
        <h3>Recent Transactions</h3>
        <div className="transaction-list">
          <div className="transaction-item">
            <div className="tx-info">
              <span className="tx-name">Adediran Blessing</span>
              <span className="tx-type">Cash In · 10:42 AM</span>
            </div>
            <div className="tx-amount">
              <span className="amount">₦5,000</span>
              <span className="badge posted">POSTED</span>
            </div>
          </div>
          <div className="transaction-item">
            <div className="tx-info">
              <span className="tx-name">Adejumo Olusegun</span>
              <span className="tx-type">Loan Repay · 10:18 AM</span>
            </div>
            <div className="tx-amount">
              <span className="amount">₦12,500</span>
              <span className="badge posted">POSTED</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function PlaceholderContent({ title }: { title: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '1rem',
        padding: '2rem',
      }}
    >
      <span style={{ fontSize: '3rem' }}>🚧</span>
      <h2>{title}</h2>
      <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>
        This screen is coming soon
      </p>
    </div>
  )
}

const SCREEN_TITLES: Record<string, string> = {
  transactMenu: 'Transact Menu',
  servicesMenu: 'Services Menu',
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
  loansBookedReport: 'Loans Booked Report',
  eLedgerReport: 'E-Ledger Report',
  loParReport: 'LO PAR Report',
  transactionReports: 'Transaction Reports',
  loPerformanceReport: 'LO Performance Report',
}

function AppShell() {
  const { currentScreen, isInnerScreen, transitionDirection } = useNavigation()

  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardContent />
      default:
        return (
          <PlaceholderContent
            title={SCREEN_TITLES[currentScreen] || currentScreen}
          />
        )
    }
  }

  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <ScreenTransition direction={transitionDirection}>
          {renderScreenContent()}
        </ScreenTransition>
      </main>
      {!isInnerScreen && <BottomNav />}
    </div>
  )
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  return isAuthenticated ? <AppShell /> : <LoginScreen />
}

function App() {
  return (
    <AuthProvider>
      <SyncProvider>
        <NavigationProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </NavigationProvider>
      </SyncProvider>
    </AuthProvider>
  )
}

export default App
