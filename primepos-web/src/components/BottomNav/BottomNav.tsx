import { useNavigation } from '../../contexts/NavigationContext'
import type { Screen } from '../../types/navigation'
import styles from './BottomNav.module.css'

interface TabConfig {
  label: string
  screen: Screen
  icon: string
}

const TABS: TabConfig[] = [
  { label: 'Home', screen: 'dashboard', icon: '🏠' },
  { label: 'Transact', screen: 'transactMenu', icon: '⚡' },
  { label: 'Services', screen: 'servicesMenu', icon: '⊞' },
  { label: 'Reports', screen: 'reports', icon: '📊' },
  { label: 'More', screen: 'more', icon: '⋯' },
]

export function BottomNav() {
  const { currentScreen, navigateTo } = useNavigation()

  return (
    <nav className={styles.bottomNav} role="tablist" aria-label="Main navigation">
      {TABS.map((tab) => {
        const isActive = currentScreen === tab.screen
        return (
          <button
            key={tab.screen}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            onClick={() => navigateTo(tab.screen)}
            type="button"
          >
            <span className={styles.navIcon} aria-hidden="true">
              {tab.icon}
            </span>
            <span className={styles.navLabel}>{tab.label}</span>
            {isActive && <span className={styles.activeDot} aria-hidden="true" />}
          </button>
        )
      })}
    </nav>
  )
}
