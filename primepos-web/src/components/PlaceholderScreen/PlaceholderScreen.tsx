import styles from './placeholder-screen.module.css'

interface PlaceholderScreenProps {
  icon?: string
  title: string
  subtitle?: string
}

export default function PlaceholderScreen({ icon = '🚧', title, subtitle }: PlaceholderScreenProps) {
  return (
    <div className={styles.container} data-testid="placeholder-screen">
      <div className={styles.content}>
        <span className={styles.icon}>{icon}</span>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
        {!subtitle && <p>This screen is coming soon</p>}
      </div>
    </div>
  )
}