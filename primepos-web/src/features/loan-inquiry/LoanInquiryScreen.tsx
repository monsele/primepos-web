import { useState } from 'react'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { LoanCard } from '../../components/LoanCard/LoanCard'
import { useLoanInquiry } from './useLoanInquiry'
import styles from './loan-inquiry.module.css'

export default function LoanInquiryScreen() {
  const { loan, isLoading, error, isCached, search } = useLoanInquiry()
  const [searchInput, setSearchInput] = useState('')

  const onSearch = () => {
    const trimmed = searchInput.trim()
    if (trimmed) {
      search(trimmed)
    }
  }

  return (
    <div className={styles.container} data-testid="loan-inquiry-screen">
      <div className={styles.searchRow}>
        <div className={styles.searchInput}>
          <Input
            label="Account / Loan Number"
            placeholder="Enter account or loan number"
            value={searchInput}
            onChange={setSearchInput}
            error={error ? 'Loan not found' : undefined}
          />
        </div>
        <div className={styles.searchButton}>
          <Button onClick={onSearch} loading={isLoading} size="small">
            SEARCH
          </Button>
        </div>
      </div>

      {loan && (
        <div className={styles.loanCard}>
          <LoanCard loan={loan} />
          {isCached && (
            <div className={styles.cachedIndicator} data-testid="cached-indicator">
              Cached data
            </div>
          )}
        </div>
      )}

      {error && !loan && (
        <div className={styles.notFound} data-testid="loan-not-found">
          Loan not found
        </div>
      )}
    </div>
  )
}
