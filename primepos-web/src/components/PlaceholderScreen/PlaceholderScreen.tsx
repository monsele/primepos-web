import styles from './PlaceholderScreen.module.css'

export interface PlaceholderScreenProps {
  icon: string
  title: string
  subtitle: string
}

export default function PlaceholderScreen({ icon, title, subtitle }: PlaceholderScreenProps) {
  return (
    <div className={styles.container} data-testid="placeholder-screen">
      <span className={styles.icon}>{icon}</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  )
}
