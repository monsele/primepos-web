import { formatDisplayDate } from '../../utils/date'
import styles from './DateRangeInput.module.css'

export interface DateRangeInputProps {
  fromDate: string
  toDate: string
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  error?: string
}

export function DateRangeInput({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  error,
}: DateRangeInputProps) {
  return (
    <div className={styles.container}>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="statement-from-date" className={styles.label}>
            From Date
          </label>
          <input
            id="statement-from-date"
            type="date"
            value={fromDate}
            onChange={(event) => onFromDateChange(event.target.value)}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'statement-date-range-error' : 'statement-from-date-hint'}
          />
          <span id="statement-from-date-hint" className={styles.hint}>
            {fromDate ? formatDisplayDate(fromDate) : 'DD/MM/YYYY'}
          </span>
        </div>

        <div className={styles.field}>
          <label htmlFor="statement-to-date" className={styles.label}>
            To Date
          </label>
          <input
            id="statement-to-date"
            type="date"
            value={toDate}
            onChange={(event) => onToDateChange(event.target.value)}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'statement-date-range-error' : 'statement-to-date-hint'}
          />
          <span id="statement-to-date-hint" className={styles.hint}>
            {toDate ? formatDisplayDate(toDate) : 'DD/MM/YYYY'}
          </span>
        </div>
      </div>

      {error && (
        <span
          id="statement-date-range-error"
          className={styles.errorText}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  )
}
