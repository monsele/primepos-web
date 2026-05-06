import styles from './ConnectionPill.module.css'

interface ConnectionPillProps {
  isOnline: boolean
}

export function ConnectionPill({ isOnline }: ConnectionPillProps) {
  return (
    <span className={`${styles.pill} ${isOnline ? styles.online : styles.offline}`}>
      {isOnline ? 'Online' : 'Offline'}
    </span>
  )
}
