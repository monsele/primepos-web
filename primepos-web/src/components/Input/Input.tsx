import { useId } from 'react'
import styles from './Input.module.css'

export interface InputProps {
  label: string
  type?: 'text' | 'password' | 'email' | 'number'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  autoComplete?: string
  id?: string
  maxLength?: number
}

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  autoComplete,
  id,
  maxLength,
}: InputProps) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className={styles.container}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={`${styles.input} ${error ? styles.errorInput : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <span id={`${inputId}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
