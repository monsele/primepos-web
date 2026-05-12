import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value: number
  max: number
  label?: string
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  )
}