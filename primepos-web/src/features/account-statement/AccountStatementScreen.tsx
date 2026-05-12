import { useState } from 'react'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import {
  DateRangeInput,
} from '../../components/DateRangeInput/DateRangeInput'
import { validateDateRange } from '../../components/DateRangeInput/dateRange'
import { StatementTable } from '../../components/StatementTable/StatementTable'
import { useAccountStatement } from './useAccountStatement'
import styles from './account-statement.module.css'

export default function AccountStatementScreen() {
  const { entries, isLoading, error, isCached, search, reset } =
    useAccountStatement()
  const [accountNumber, setAccountNumber] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const onFetchStatement = async () => {
    const trimmedAccountNumber = accountNumber.trim()
    const rangeError = validateDateRange(fromDate, toDate)

    if (!trimmedAccountNumber || !fromDate || !toDate) {
      setValidationError('Enter an account number and select both dates')
      return
    }

    if (rangeError) {
      setValidationError(rangeError)
      return
    }

    setValidationError(null)

    try {
      await search(trimmedAccountNumber, fromDate, toDate)
    } catch {
      // Hook state carries the user-facing error.
    }
  }

  const onReset = () => {
    setAccountNumber('')
    setFromDate('')
    setToDate('')
    setValidationError(null)
    reset()
  }

  const helperMessage = validationError ?? error?.message

  return (
    <div className={styles.container} data-testid="account-statement-screen">
      <div className={styles.searchCard}>
        <Input
          label="CASA Account Number"
          placeholder="Enter CASA account number"
          value={accountNumber}
          onChange={setAccountNumber}
          error={error?.message === 'Account not found' ? 'Account not found' : undefined}
        />

        <DateRangeInput
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          error={validationError === 'To date must be after From date' ? validationError : undefined}
        />

        {helperMessage && helperMessage !== 'To date must be after From date' && (
          <div className={styles.errorMessage} role="alert">
            {helperMessage}
          </div>
        )}

        <div className={styles.actions}>
          <div className={styles.button}>
            <Button variant="secondary" onClick={onReset}>
              RESET
            </Button>
          </div>
          <div className={styles.button}>
            <Button onClick={onFetchStatement} loading={isLoading}>
              FETCH STATEMENT
            </Button>
          </div>
        </div>
      </div>

      {entries.length > 0 ? (
        <section className={styles.resultSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Transaction History</h2>
            {isCached && (
              <div className={styles.cachedIndicator} data-testid="cached-indicator">
                Cached data
              </div>
            )}
          </div>
          <StatementTable entries={entries} />
        </section>
      ) : (
        <div className={styles.emptyState} data-testid="empty-state">
          Enter an account number and date range to fetch the customer&apos;s
          statement.
        </div>
      )}
    </div>
  )
}
