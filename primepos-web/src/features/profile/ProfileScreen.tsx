import { useAuth } from '../../contexts/useAuth'
import { useNavigation } from '../../contexts/NavigationContext'
import DetailList from '../../components/DetailList/DetailList'
import Button from '../../components/Button/Button'
import type { DetailItem } from '../../components/DetailList/DetailList'
import styles from './profile.module.css'

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export default function ProfileScreen() {
  const { user } = useAuth()
  const { navigateTo } = useNavigation()

  if (!user) {
    return null
  }

  const profileItems: DetailItem[] = [
    { label: 'Name', value: user.name },
    { label: 'Staff ID', value: user.staffId },
    { label: 'Mobile', value: user.mobile },
    { label: 'Email', value: user.email },
    { label: 'Branch', value: user.branchName },
    { label: 'Department', value: user.department },
    { label: 'Till Account', value: user.tillAccount },
    { label: 'System Date', value: formatDate(new Date()) },
  ]

  const handleChangePassword = () => {
    navigateTo('changePassword')
  }

  return (
    <div className={styles.container} data-testid="profile-screen">
      <div className={styles.content}>
        <DetailList items={profileItems} data-testid="profile-details" />
        <Button onClick={handleChangePassword} data-testid="change-password-button">
          Change Password
        </Button>
      </div>
    </div>
  )
}