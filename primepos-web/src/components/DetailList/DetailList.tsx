import styles from './DetailList.module.css'

export interface DetailItem {
  label: string
  value: string
}

export interface DetailListProps {
  items: DetailItem[]
  'data-testid'?: string
}

export default function DetailList({ items, 'data-testid': testId }: DetailListProps) {
  return (
    <div className={styles.list} data-testid={testId ?? 'detail-list'}>
      {items.map((item, index) => (
        <div className={styles.item} key={index}>
          <span className={styles.label}>{item.label}</span>
          <span className={styles.value}>{item.value}</span>
        </div>
      ))}
    </div>
  )
}