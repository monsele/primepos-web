import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/useAuth'
import { SyncProvider } from './contexts/SyncContext'
import { NavigationProvider, useNavigation } from './contexts/NavigationContext'
import { ToastProvider } from './components/Toast/ToastProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useConnectionTransition } from './hooks/useConnectionTransition'
import { useSync } from './contexts/useSync'
import { usePWAUpdate } from './hooks/usePWAUpdate'
import LoginScreen from './features/auth/LoginScreen'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'
import { DashboardScreen } from './features/dashboard/DashboardScreen'
import MenuScreen from './features/menu/MenuScreen'
import SettingsScreen from './features/settings/SettingsScreen'
import ChangePasswordScreen from './features/settings/ChangePasswordScreen'
import ProfileScreen from './features/profile/ProfileScreen'
import CashInScreen from './features/cash-in/CashInScreen'
import CashOutScreen from './features/cash-out/CashOutScreen'
import NewAccountDepositScreen from './features/new-account/NewAccountDepositScreen'
import LoanRepaymentScreen from './features/loan-repayment/LoanRepaymentScreen'
import BatchDepositScreen from './features/batch-deposit/BatchDepositScreen'
import GroupLoanRepaymentScreen from './features/group-loan-repayment/GroupLoanRepaymentScreen'
import LoanInquiryScreen from './features/loan-inquiry/LoanInquiryScreen'
import NewSavingsAccountScreen from './features/new-savings-account/NewSavingsAccountScreen'
import AccountBalanceScreen from './features/account-balance/AccountBalanceScreen'
import AccountStatementScreen from './features/account-statement/AccountStatementScreen'
import TransactMenuScreen from './features/transact-menu/TransactMenuScreen'
import ServicesMenuScreen from './features/services-menu/ServicesMenuScreen'
import CardTransactionsScreen from './features/card-transactions/CardTransactionsScreen'
import { ReportsDashboardScreen } from './features/reports/ReportsDashboardScreen'
import LoansBookedReportScreen from './features/reports/LoansBookedReportScreen'
import ELedgerReportScreen from './features/reports/ELedgerReportScreen'
import LoParReportScreen from './features/reports/LoParReportScreen'
import TransactionReportsScreen from './features/reports/TransactionReportsScreen'
import LoPerformanceReportScreen from './features/reports/LoPerformanceReportScreen'
import { UnpostedTransactionsScreen } from './features/unposted/UnpostedTransactionsScreen'
import { Header } from './components/Header/Header'
import SyncDataScreen from './features/sync-data/SyncDataScreen'
import BetterLifeScreen from './features/better-life/BetterLifeScreen'
import PortfolioScreen from './features/portfolio/PortfolioScreen'
import GroupsScreen from './features/groups/GroupsScreen'
import LoanRecordsScreen from './features/loan-records/LoanRecordsScreen'
import AppSettingsScreen from './features/app-settings/AppSettingsScreen'
import { BottomNav } from './components/BottomNav/BottomNav'
import { ScreenTransition } from './components/ScreenTransition/ScreenTransition'
import UpdateBanner from './components/UpdateBanner/UpdateBanner'
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
  cashOut: 'Cash Out (Withdrawal)',
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
  syncData: 'Sync Data',
  betterLife: 'Better Life Records',
  portfolio: 'Portfolio Data',
  groups: 'Groups',
  loanRecords: 'Loan Records',
  appSettings: 'App Settings',
}

function AppShell() {
  const { currentScreen, isInnerScreen, transitionDirection } = useNavigation()
  const { needRefresh, setNeedRefresh, updateServiceWorker } = usePWAUpdate()

  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />
      case 'cashIn':
        return <CashInScreen />
      case 'cashOut':
        return <CashOutScreen />
      case 'newAccount':
        return <NewAccountDepositScreen />
      case 'batchDeposit':
        return <BatchDepositScreen />
      case 'loanRepayment':
        return <LoanRepaymentScreen />
      case 'groupLoanRepayment':
        return <GroupLoanRepaymentScreen />
      case 'loanInquiry':
        return <LoanInquiryScreen />
      case 'accountBalance':
        return <AccountBalanceScreen />
      case 'accountStatement':
        return <AccountStatementScreen />
      case 'transactMenu':
        return <TransactMenuScreen />
      case 'servicesMenu':
        return <ServicesMenuScreen />
      case 'cardTransactions':
        return <CardTransactionsScreen />
      case 'newSavingsAccount':
        return <NewSavingsAccountScreen />
      case 'reports':
        return <ReportsDashboardScreen />
      case 'loansBookedReport':
        return <LoansBookedReportScreen />
      case 'eLedgerReport':
        return <ELedgerReportScreen />
      case 'loParReport':
        return <LoParReportScreen />
      case 'transactionReports':
        return <TransactionReportsScreen />
      case 'loPerformanceReport':
        return <LoPerformanceReportScreen />
      case 'unpostedTransactions':
        return <UnpostedTransactionsScreen />
      case 'more':
        return <MenuScreen />
      case 'settings':
        return <SettingsScreen />
      case 'changePassword':
        return <ChangePasswordScreen />
      case 'profile':
        return <ProfileScreen />
      case 'syncData':
        return <SyncDataScreen />
      case 'betterLife':
        return <BetterLifeScreen />
      case 'portfolio':
        return <PortfolioScreen />
      case 'groups':
        return <GroupsScreen />
      case 'loanRecords':
        return <LoanRecordsScreen />
      case 'appSettings':
        return <AppSettingsScreen />
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
      <UpdateBanner
        needRefresh={needRefresh}
        setNeedRefresh={setNeedRefresh}
        updateServiceWorker={updateServiceWorker}
      />
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
  const { cameOnline } = useConnectionTransition()
  const sync = useSync()

  useEffect(() => {
    if (cameOnline && sync.pendingCount > 0) {
      sync.processQueue()
    }
  }, [cameOnline, sync])

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
