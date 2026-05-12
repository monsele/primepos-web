import { useId } from 'react'
import styles from './DateInput.module.css'

interface DateInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const parts = []

  if (digits.length > 0) parts.push(digits.slice(0, 2))
  if (digits.length > 2) parts.push(digits.slice(2, 4))
  if (digits.length > 4) parts.push(digits.slice(4, 8))

  return parts.join('/')
}

export function DateInput({
  label,
  value,
  onChange,
  error,
}: DateInputProps) {
  const inputId = useId()

  return (
    <div className={styles.container}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        inputMode="numeric"
        placeholder="DD/MM/YYYY"
        value={value}
        onChange={(event) => onChange(formatDateInput(event.target.value))}
        maxLength={10}
        className={`${styles.input} ${error ? styles.errorInput : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
      />
      {error ? (
        <span id={`${inputId}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      ) : (
        <span id={`${inputId}-hint`} className={styles.hint}>
          Use DD/MM/YYYY format
        </span>
      )}
    </div>
  )
}
