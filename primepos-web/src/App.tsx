import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/useAuth'
import { SyncProvider } from './contexts/SyncContext'
import { NavigationProvider, useNavigation } from './contexts/NavigationContext'
import { ToastProvider } from './components/Toast/ToastProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import LoginScreen from './features/auth/LoginScreen'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'
import { DashboardScreen } from './features/dashboard/DashboardScreen'
import CashInScreen from './features/cash-in/CashInScreen'
import { Header } from './components/Header/Header'
import { BottomNav } from './components/BottomNav/BottomNav'
import { ScreenTransition } from './components/ScreenTransition/ScreenTransition'
import './App.css'

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
        return <DashboardScreen />
      case 'cashIn':
        return <CashInScreen />
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
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 1,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SyncProvider>
          <NavigationProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </NavigationProvider>
        </SyncProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
