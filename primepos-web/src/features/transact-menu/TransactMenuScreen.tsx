import { useMemo, useState } from 'react'
import { useNavigation } from '../../contexts/NavigationContext'
import MenuItem from '../../components/MenuItem/MenuItem'
import SearchInput from '../../components/SearchInput/SearchInput'
import type { Screen } from '../../types/navigation'
import styles from './transact-menu.module.css'

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

const transactMenu: MenuGroup[] = [
  {
    title: 'CASH',
    items: [
      { id: 'cash-in', label: 'Cash In', subtitle: 'Receive payment', targetScreen: 'cashIn' },
      { id: 'cash-out', label: 'Cash Out', subtitle: 'Disburse cash', targetScreen: 'cashOut' },
      { id: 'new-account-deposit', label: 'New Account Deposit', subtitle: 'Open & fund account', targetScreen: 'newAccount' },
      { id: 'batch-bbls', label: 'Batch BBLS Deposit', subtitle: 'Group deposit', targetScreen: 'batchDeposit' },
    ],
  },
  {
    title: 'CARD',
    items: [
      { id: 'card-transactions', label: 'Card Transactions', subtitle: 'POS operations', targetScreen: 'cardTransactions' },
    ],
  },
]

export default function TransactMenuScreen() {
  const { navigateTo } = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return transactMenu
    const q = searchQuery.toLowerCase()
    return transactMenu
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
    <div className={styles.container} data-testid="transact-menu-screen">
      <div className={styles.searchBar}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search transactions..."
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
