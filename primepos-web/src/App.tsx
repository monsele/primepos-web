import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/useAuth'
import LoginScreen from './features/auth/LoginScreen'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'
import OfflineIndicator from './components/OfflineIndicator'
import { useNetworkStatus } from './hooks/useNetworkStatus'
import './App.css'

function DashboardScreen() {
  const { user } = useAuth()
  const { isOnline } = useNetworkStatus()

  return (
    <div className="app-container">
      <OfflineIndicator />

      {!isOnline && (
        <div className="offline-banner">
          <span className="offline-icon">⚠️</span>
          <span>You are offline. Some features may be limited.</span>
        </div>
      )}

      <header className="app-header">
        <div className="brand">
          <div className="logo">P</div>
          <div>
            <h1>PrimePOS</h1>
            <p>Mobile Teller Platform</p>
          </div>
        </div>
        <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? 'Connected' : 'Offline'}
        </div>
      </header>

      <main className="app-main">
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
      </main>

      <nav className="bottom-nav">
        <a href="#" className="nav-item active">
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </a>
        <a href="#" className="nav-item">
          <span className="nav-icon">⚡</span>
          <span>Transact</span>
        </a>
        <a href="#" className="nav-item">
          <span className="nav-icon">⊞</span>
          <span>Services</span>
        </a>
        <a href="#" className="nav-item">
          <span className="nav-icon">📊</span>
          <span>Reports</span>
        </a>
        <a href="#" className="nav-item">
          <span className="nav-icon">⋯</span>
          <span>More</span>
        </a>
      </nav>
    </div>
  )
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  return isAuthenticated ? <DashboardScreen /> : <LoginScreen />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
