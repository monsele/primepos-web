import styles from './ConnectionBanner.module.css'

interface ConnectionBannerProps {
  isOnline: boolean
}

export function ConnectionBanner({ isOnline }: ConnectionBannerProps) {
  return (
    <div
      className={`${styles.banner} ${isOnline ? styles.online : styles.offline}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.icon}>{isOnline ? '●' : '⚠'}</span>
      <span className={styles.text}>
        {isOnline ? 'Connected — All features available' : 'Offline — Limited features available'}
      </span>
    </div>
  )
}
