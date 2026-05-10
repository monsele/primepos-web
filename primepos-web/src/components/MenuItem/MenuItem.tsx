import styles from './MenuItem.module.css'

export interface MenuItemProps {
  label: string
  subtitle?: string
  onClick?: () => void
  disabled?: boolean
  badgeCount?: number
}

export default function MenuItem({
  label,
  subtitle,
  onClick,
  disabled = false,
  badgeCount,
}: MenuItemProps) {
  return (
    <button
      type="button"
      className={styles.menuItem}
      onClick={onClick}
      disabled={disabled}
      data-testid="menu-item"
    >
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      <div className={styles.rightSection}>
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className={styles.badge} data-testid="badge">
            {badgeCount}
          </span>
        )}
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </div>
    </button>
  )
}
