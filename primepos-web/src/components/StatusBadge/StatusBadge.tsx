import styles from './StatusBadge.module.css'

interface StatusBadgeProps {
  status: 'POSTED' | 'PENDING'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null

  const variant = status === 'POSTED' ? 'posted' : status === 'PENDING' ? 'pending' : null
  if (!variant) {
    console.warn(`[StatusBadge] Unexpected status: ${status}`)
    return null
  }

  return (
    <span
      className={`${styles.badge} ${styles[variant]}`}
      data-testid={`status-badge-${status.toLowerCase()}`}
    >
      {status}
    </span>
  )
}
