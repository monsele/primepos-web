import { useState } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { useNavigation } from '../../contexts/NavigationContext'
import { useSync } from '../../contexts/useSync'
import MenuItem from '../../components/MenuItem/MenuItem'
import OfficerCard from '../../components/OfficerCard/OfficerCard'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import type { Screen } from '../../types/navigation'
import styles from './menu.module.css'

interface MenuItemData {
  id: string
  label: string
  targetScreen: Screen
}

const offlineDataItems: MenuItemData[] = [
  { id: 'unposted', label: 'Unposted Transactions', targetScreen: 'unpostedTransactions' },
  { id: 'better-life', label: 'Better Life Records', targetScreen: 'betterLife' },
  { id: 'portfolio', label: 'Portfolio Data', targetScreen: 'portfolio' },
  { id: 'groups', label: 'Groups', targetScreen: 'groups' },
  { id: 'loan-records', label: 'Loan Records', targetScreen: 'loanRecords' },
]

const settingsItems: MenuItemData[] = [
  { id: 'my-profile', label: 'My Profile', targetScreen: 'profile' },
  { id: 'change-password', label: 'Change Password', targetScreen: 'changePassword' },
  { id: 'sync-data', label: 'Sync Data', targetScreen: 'syncData' },
  { id: 'app-settings', label: 'App Settings', targetScreen: 'appSettings' },
]

export default function MenuScreen() {
  const { user, logout } = useAuth()
  const { navigateTo } = useNavigation()
  const { pendingCount } = useSync()
  const [isSignOutDialogOpen, setSignOutDialogOpen] = useState(false)

  if (!user) {
    return null
  }

  const handleSignOut = () => {
    logout()
  }

  return (
    <div className={styles.container} data-testid="menu-screen">
      <div className={styles.content}>
        <OfficerCard officer={user} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Offline Data</h2>
          <div className={styles.menuItems}>
            {offlineDataItems.map((item) => (
              <MenuItem
                key={item.id}
                label={item.label}
                onClick={() => navigateTo(item.targetScreen)}
                badgeCount={item.id === 'unposted' ? pendingCount : undefined}
              />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Settings</h2>
          <div className={styles.menuItems}>
            {settingsItems.map((item) => (
              <MenuItem
                key={item.id}
                label={item.label}
                onClick={() => navigateTo(item.targetScreen)}
              />
            ))}
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