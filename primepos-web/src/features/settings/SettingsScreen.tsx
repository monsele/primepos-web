import { useState } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { useNavigation } from '../../contexts/NavigationContext'
import { useToast } from '../../components/Toast/useToast'
import { syncOfflineData } from '../../services/backgroundSync'
import MenuItem from '../../components/MenuItem/MenuItem'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import styles from './settings.module.css'

export default function SettingsScreen() {
  const { user, logout } = useAuth()
  const { navigateTo } = useNavigation()
  const { showToast } = useToast()
  const [isSignOutDialogOpen, setSignOutDialogOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSignOut = () => {
    logout()
  }

  const handleSyncData = async () => {
    if (!user) return

    setIsSyncing(true)
    try {
      await syncOfflineData(user.staffId)
      showToast({ message: 'Data synced successfully', type: 'success' })
    } catch {
      showToast({ message: 'Sync failed. Please try again.', type: 'error' })
    } finally {
      setIsSyncing(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className={styles.container} data-testid="settings-screen">
      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Account</h2>
          <div className={styles.menuItems}>
            <MenuItem
              label="Change Password"
              onClick={() => navigateTo('changePassword')}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data & Sync</h2>
          <div className={styles.menuItems}>
            <MenuItem
              label={isSyncing ? 'Syncing...' : 'Sync Data'}
              onClick={handleSyncData}
              disabled={isSyncing}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>App</h2>
          <div className={styles.menuItems}>
            <MenuItem
              label="App Settings"
              onClick={() => navigateTo('appSettings')}
            />
          </div>
        </section>

        <button
          type="button"
          className={styles.signOutButton}
          onClick={() => setSignOutDialogOpen(true)}
          data-testid="sign-out-button"
        >
          Sign Out
        </button>
      </div>

      <ConfirmDialog
        isOpen={isSignOutDialogOpen}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleSignOut}
        onCancel={() => setSignOutDialogOpen(false)}
      />
    </div>
  )
}