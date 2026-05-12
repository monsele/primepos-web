import styles from './GenderToggle.module.css'

interface GenderToggleProps {
  value: 'Male' | 'Female' | ''
  onChange: (value: 'Male' | 'Female') => void
  error?: string
}

export function GenderToggle({ value, onChange, error }: GenderToggleProps) {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Gender</span>
      <div className={styles.group} role="radiogroup" aria-label="Gender">
        {(['Male', 'Female'] as const).map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.option} ${value === option ? styles.selected : ''} ${error ? styles.errorOption : ''}`}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {error && (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
