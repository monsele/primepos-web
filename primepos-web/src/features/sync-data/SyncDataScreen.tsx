import { useState } from 'react'
import { useSync } from '../../contexts/useSync'
import Button from '../../components/Button/Button'
import styles from './sync-data.module.css'

export default function SyncDataScreen() {
  const { startSync, isSyncing, syncError } = useSync()
  const [message, setMessage] = useState<string | null>(null)

  const handleSync = async () => {
    setMessage(null)
    startSync()
  }

  return (
    <div className={styles.container} data-testid="sync-data-screen">
      <div className={styles.content}>
        <h1 className={styles.title}>Sync Data</h1>
        <p className={styles.description}>
          Synchronize offline data with the server. This will upload pending transactions.
        </p>

        {syncError && <div className={styles.errorMessage}>{syncError}</div>}
        {message && <div className={styles.successMessage}>{message}</div>}

        <Button
          onClick={handleSync}
          disabled={isSyncing}
          data-testid="sync-button"
        >
          {isSyncing ? 'Syncing...' : 'Start Sync'}
        </Button>
      </div>
    </div>
  )
}