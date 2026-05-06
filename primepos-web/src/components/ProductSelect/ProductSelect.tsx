import styles from './ProductSelect.module.css'

export interface SavingsProduct {
  id: string
  name: string
  minDeposit: number
  description: string
}

export interface ProductSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SavingsProduct[]
  placeholder?: string
  error?: string
  disabled?: boolean
}

export default function ProductSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select a product',
  error,
  disabled = false,
}: ProductSelectProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${styles.select} ${error ? styles.errorSelect : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'product-select-error' : undefined}
        data-testid="product-select"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      {error && (
        <span id="product-select-error" className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
