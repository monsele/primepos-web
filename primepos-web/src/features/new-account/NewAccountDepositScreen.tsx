import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import ProductSelect from '../../components/ProductSelect/ProductSelect'
import { useNewAccountDeposit } from './useNewAccountDeposit'
import styles from './new-account-deposit.module.css'

const mockProducts = [
  { id: '1', name: 'Prime Savings', minDeposit: 100000, description: 'Standard savings account' },
  { id: '2', name: 'Better Life Savings', minDeposit: 50000, description: 'Group microfinance savings' },
]

export default function NewAccountDepositScreen() {
  const {
    form,
    errors,
    isSubmitting,
    successData,
    setFirstName,
    setSurname,
    setOtherName,
    setGender,
    setBvn,
    setProductId,
    setInitialDeposit,
    handleSubmit,
    dismissSuccess,
  } = useNewAccountDeposit()

  return (
    <div className={styles.container} data-testid="new-account-deposit-screen">
      {successData && (
        <div className={styles.successCard} data-testid="success-message">
          <span className={styles.successIcon}>✅</span>
          <div className={styles.successTitle}>Account Created Successfully</div>
          <div className={styles.successDetail}>
            {successData.accountName}
          </div>
          <div className={styles.accountNumber} data-testid="account-number">
            {successData.nuban}
          </div>
          <Button onClick={dismissSuccess} size="small">
            DISMISS
          </Button>
        </div>
      )}

      <div className={styles.form}>
        <Input
          label="First Name"
          placeholder="Enter first name"
          value={form.firstName}
          onChange={setFirstName}
          error={errors.firstName}
        />

        <Input
          label="Surname"
          placeholder="Enter surname"
          value={form.surname}
          onChange={setSurname}
          error={errors.surname}
        />

        <Input
          label="Other Name"
          placeholder="Enter other name (optional)"
          value={form.otherName}
          onChange={setOtherName}
        />

        <div>
          <label className={styles.label} style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            Gender
          </label>
          <select
            value={form.gender}
            onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | '')}
            className={`${styles.select} ${errors.gender ? styles.errorSelect : ''}`}
            aria-invalid={errors.gender ? 'true' : 'false'}
            data-testid="gender-select"
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && (
            <span className={styles.errorText} role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-danger)', minHeight: '1rem' }}>
              {errors.gender}
            </span>
          )}
        </div>

        <Input
          label="BVN"
          placeholder="Enter 11-digit BVN"
          value={form.bvn}
          onChange={setBvn}
          error={errors.bvn}
          maxLength={11}
        />

        <ProductSelect
          label="Savings Product"
          value={form.productId}
          onChange={setProductId}
          options={mockProducts}
          placeholder="Select a product"
          error={errors.productId}
        />

        <Input
          label="Initial Deposit"
          placeholder="Enter initial deposit amount"
          value={form.initialDeposit}
          onChange={setInitialDeposit}
          error={errors.initialDeposit}
        />

        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          SUBMIT
        </Button>
      </div>
    </div>
  )
}
