import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  fullScreen?: boolean
}

export default function LoadingSpinner({ fullScreen = false }: LoadingSpinnerProps) {
  return (
    <div className={`${styles.container} ${fullScreen ? styles.fullScreen : ''}`} role="status" aria-live="polite">
      <div className={styles.spinner} aria-label="Loading" />
      <span className={styles.label}>Loading…</span>
    </div>
  )
}
