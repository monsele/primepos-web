import { useCallback } from 'react'
import styles from './SearchInput.module.css'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  disabled = false,
}: SearchInputProps) {
  const handleClear = useCallback(() => {
    onChange('')
  }, [onChange])

  return (
    <div className={styles.container}>
      <span className={styles.icon} aria-hidden="true">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.input}
        data-testid="search-input"
      />
      {value && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Clear search"
          data-testid="search-clear"
        >
          ✕
        </button>
      )}
    </div>
  )
}
