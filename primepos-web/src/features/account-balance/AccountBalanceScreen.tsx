import { useState } from 'react'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { AccountCard } from '../../components/AccountCard/AccountCard'
import { useAccountBalance } from './useAccountBalance'
import styles from './account-balance.module.css'

export default function AccountBalanceScreen() {
  const { account, isLoading, error, isCached, search, reset } =
    useAccountBalance()
  const [searchInput, setSearchInput] = useState('')

  const onSearch = () => {
    const trimmed = searchInput.trim()
    if (trimmed) {
      search(trimmed)
    }
  }

  const onReset = () => {
    setSearchInput('')
    reset()
  }

  return (
    <div className={styles.container} data-testid="account-balance-screen">
      <div className={styles.searchRow}>
        <div className={styles.searchInput}>
          <Input
            label="CASA Account Number"
            placeholder="Enter CASA account number"
            value={searchInput}
            onChange={setSearchInput}
            error={error ? 'Account not found' : undefined}
          />
        </div>
        <div className={styles.searchButton}>
          <Button onClick={onSearch} loading={isLoading} size="small">
            SEARCH
          </Button>
        </div>
      </div>

      {account ? (
        <div className={styles.resultSection}>
          <AccountCard account={account} />
          {isCached && (
            <div className={styles.cachedIndicator} data-testid="cached-indicator">
              Cached data
            </div>
          )}
          <div className={styles.actions}>
            <Button variant="secondary" onClick={onReset}>
              RESET
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.emptyState} data-testid="empty-state">
          Enter a CASA account number to check the customer&apos;s balance.
        </div>
      )}
    </div>
  )
}
