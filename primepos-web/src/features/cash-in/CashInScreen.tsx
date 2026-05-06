import { useState } from 'react'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { AccountCard } from '../../components/AccountCard/AccountCard'
import { useAccountSearch } from './useAccountSearch'
import { useCashIn } from './useCashIn'
import styles from './cash-in.module.css'

export default function CashInScreen() {
  const { account, isLoading: isSearching, error: searchError, search } =
    useAccountSearch()
  const {
    form,
    errors,
    isSubmitting,
    setPayeeName,
    setAmount,
    setSendSms,
    handleSubmit,
  } = useCashIn()

  const [searchInput, setSearchInput] = useState('')

  const onSearch = () => {
    if (searchInput.trim()) {
      search(searchInput.trim())
    }
  }

  const onSubmit = () => {
    handleSubmit(account)
  }

  return (
    <div className={styles.container} data-testid="cash-in-screen">
      <div className={styles.searchRow}>
        <div className={styles.searchInput}>
          <Input
            label="Account Number"
            placeholder="Enter account number"
            value={searchInput}
            onChange={setSearchInput}
            error={searchError ? 'Account not found' : undefined}
          />
        </div>
        <div className={styles.searchButton}>
          <Button onClick={onSearch} loading={isSearching} size="small">
            SEARCH
          </Button>
        </div>
      </div>

      {account && (
        <div className={styles.accountCard}>
          <AccountCard account={account} />
        </div>
      )}

      <div className={styles.form}>
        <Input
          label="Payee Name"
          placeholder="Enter payee name"
          value={form.payeeName}
          onChange={setPayeeName}
          error={errors.payeeName}
        />

        <Input
          label="Amount"
          placeholder="Enter amount"
          value={form.amount}
          onChange={setAmount}
          error={errors.amount}
        />

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={form.sendSms}
            onChange={(e) => setSendSms(e.target.checked)}
            data-testid="send-sms-checkbox"
          />
          <span>Send SMS notification to customer</span>
        </label>

        <Button
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={!account}
        >
          POST TRANSACTION
        </Button>
      </div>
    </div>
  )
}
