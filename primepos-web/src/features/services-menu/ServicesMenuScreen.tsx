import { useMemo, useState } from 'react'
import { useNavigation } from '../../contexts/NavigationContext'
import MenuItem from '../../components/MenuItem/MenuItem'
import SearchInput from '../../components/SearchInput/SearchInput'
import type { Screen } from '../../types/navigation'
import styles from './services-menu.module.css'

interface MenuGroup {
  title: string
  items: MenuItemData[]
}

interface MenuItemData {
  id: string
  label: string
  subtitle?: string
  targetScreen: Screen
}

const servicesMenu: MenuGroup[] = [
  {
    title: 'INQUIRIES',
    items: [
      { id: 'loan-inquiry', label: 'Loan Inquiry', subtitle: 'Look up loan details', targetScreen: 'loanInquiry' },
      { id: 'account-balance', label: 'Account Balance', subtitle: 'Check account balance', targetScreen: 'accountBalance' },
      { id: 'account-statement', label: 'Account Statement', subtitle: 'View account statement', targetScreen: 'accountStatement' },
    ],
  },
  {
    title: 'ACCOUNT OPENING',
    items: [
      { id: 'new-savings-account', label: 'New Savings Account', subtitle: 'Open a new savings account', targetScreen: 'newSavingsAccount' },
    ],
  },
  {
    title: 'LOAN REPAYMENTS',
    items: [
      { id: 'loan-repayment', label: 'Loan Repayment', subtitle: 'Post a loan repayment', targetScreen: 'loanRepayment' },
    ],
  },
]

export default function ServicesMenuScreen() {
  const { navigateTo } = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return servicesMenu
    const q = searchQuery.toLowerCase()
    return servicesMenu
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            (item.subtitle?.toLowerCase().includes(q) ?? false)
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [searchQuery])

  return (
    <div className={styles.container} data-testid="services-menu-screen">
      <div className={styles.searchBar}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search service..."
        />
      </div>

      <div className={styles.menuList}>
        {filteredMenu.map((group) => (
          <section key={group.title} className={styles.group}>
            <h2 className={styles.groupTitle}>{group.title}</h2>
            <div className={styles.groupItems}>
              {group.items.map((item) => (
                <MenuItem
                  key={item.id}
                  label={item.label}
                  subtitle={item.subtitle}
                  onClick={() => navigateTo(item.targetScreen)}
                />
              ))}
            </div>
          </section>
        ))}

        {filteredMenu.length === 0 && (
          <div className={styles.emptyState} data-testid="empty-state">
            <p>No results found</p>
          </div>
        )}
      </div>
    </div>
  )
}
