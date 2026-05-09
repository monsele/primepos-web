import { formatNaira } from '../../utils/currency'
import { formatDisplayDate } from '../../utils/date'
import type { StatementEntry } from '../../types/account'
import styles from './StatementTable.module.css'

export interface StatementTableProps {
  entries: StatementEntry[]
}

export function StatementTable({ entries }: StatementTableProps) {
  return (
    <div className={styles.wrapper} data-testid="statement-table">
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={`${entry.date}-${entry.description}`}>
              <td>{formatDisplayDate(entry.date)}</td>
              <td>{entry.description}</td>
              <td className={styles.debit}>
                {entry.debit === null ? '' : formatNaira(entry.debit)}
              </td>
              <td className={styles.credit}>
                {entry.credit === null ? '' : formatNaira(entry.credit)}
              </td>
              <td>{formatNaira(entry.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
