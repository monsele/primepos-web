import { useState } from 'react'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { LoanCard } from '../../components/LoanCard/LoanCard'
import { useLoanSearch } from './useLoanSearch'
import { useLoanRepayment } from './useLoanRepayment'
import styles from './loan-repayment.module.css'

export default function LoanRepaymentScreen() {
  const { loan, isLoading: isSearching, error: searchError, search } =
    useLoanSearch()
  const {
    form,
    errors,
    isSubmitting,
    setAmount,
    handleSubmit,
  } = useLoanRepayment()

  const [searchInput, setSearchInput] = useState('')

  const onSearch = () => {
    if (searchInput.trim()) {
      search(searchInput.trim())
    }
  }

  const onSubmit = () => {
    handleSubmit(loan)
  }

  return (
    <div className={styles.container} data-testid="loan-repayment-screen">
      <div className={styles.searchRow}>
        <div className={styles.searchInput}>
          <Input
            label="Loan Account Number"
            placeholder="Enter loan number"
            value={searchInput}
            onChange={setSearchInput}
            error={searchError ? 'Loan not found' : undefined}
          />
        </div>
        <div className={styles.searchButton}>
          <Button onClick={onSearch} loading={isSearching} size="small">
            SEARCH
          </Button>
        </div>
      </div>

      {loan && (
        <div className={styles.loanCard}>
          <LoanCard loan={loan} />
        </div>
      )}

      <div className={styles.form}>
        <Input
          label="Repayment Amount"
          placeholder="Enter amount"
          value={form.amount}
          onChange={setAmount}
          error={errors.amount}
        />

        <Button
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={!loan}
        >
          POST REPAYMENT
        </Button>
      </div>
    </div>
  )
}
