import { useMemo } from 'react'
import type { Officer } from '../../types/auth'
import styles from './OfficerCard.module.css'

export interface OfficerCardProps {
  officer: Officer
}

export default function OfficerCard({ officer }: OfficerCardProps) {
  const initials = useMemo(() => {
    const nameParts = officer.name.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    }
    return officer.name.substring(0, 2).toUpperCase()
  }, [officer.name])

  return (
    <div className={styles.card} data-testid="officer-card">
      <div className={styles.avatar}>{initials}</div>
      <div className={styles.info}>
        <h2 className={styles.name}>{officer.name}</h2>
        <div className={styles.details}>
          <span>Staff ID: {officer.staffId}</span>
          <span>Branch: {officer.branchName}</span>
          <span>Till: {officer.tillAccount}</span>
        </div>
      </div>
    </div>
  )
}