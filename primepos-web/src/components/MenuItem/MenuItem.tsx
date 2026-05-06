import styles from './MenuItem.module.css'

export interface MenuItemProps {
  label: string
  subtitle?: string
  onClick?: () => void
  disabled?: boolean
}

export default function MenuItem({
  label,
  subtitle,
  onClick,
  disabled = false,
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
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </button>
  )
}
