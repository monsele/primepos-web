import { useState } from 'react'
import Button from '../Button/Button'
import styles from './SuccessModal.module.css'

interface SuccessModalProps {
  accountNumber: string
  onDone: () => void
}

export function SuccessModal({ accountNumber, onDone }: SuccessModalProps) {
  const [copyLabel, setCopyLabel] = useState('COPY')

  const handleCopy = async () => {
    if (!navigator.clipboard?.writeText) {
      setCopyLabel('UNAVAILABLE')
      return
    }

    await navigator.clipboard.writeText(accountNumber)
    setCopyLabel('COPIED')
  }

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.icon} aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8.5L6.2 11.5L13 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={styles.title}>Account Created Successfully</div>
        <p className={styles.description}>
          The new account number is ready to share.
        </p>
        <div className={styles.accountNumber} data-testid="success-account-number">
          {accountNumber}
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => void handleCopy()}>
            {copyLabel}
          </Button>
          <Button onClick={onDone}>DONE</Button>
        </div>
      </div>
    </div>
  )
}
