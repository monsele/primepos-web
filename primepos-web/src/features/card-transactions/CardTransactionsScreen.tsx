import MenuItem from '../../components/MenuItem/MenuItem'
import styles from './card-transactions.module.css'

export default function CardTransactionsScreen() {
  const handleOptionClick = () => {
    // For MVP, POS is always not connected
    alert('Please connect a POS terminal device')
  }

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        POS Terminal Required. Please connect a POS terminal device to use card transactions.
      </div>
      <div className={styles.menu}>
        <MenuItem label="Card Deposit" onClick={handleOptionClick} />
        <MenuItem label="Card Withdrawal" onClick={handleOptionClick} />
        <MenuItem label="Card Balance Check" onClick={handleOptionClick} />
        <MenuItem label="Card Statement" onClick={handleOptionClick} />
      </div>
    </div>
  )
}