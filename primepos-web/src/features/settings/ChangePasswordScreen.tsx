import { useState } from 'react'
import { useNavigation } from '../../contexts/NavigationContext'
import { useChangePassword } from './useChangePassword'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { useToast } from '../../components/Toast/useToast'
import styles from './change-password.module.css'

export default function ChangePasswordScreen() {
  const { goBack } = useNavigation()
  const { showToast } = useToast()
  const { handleChangePassword, isLoading, errors } = useChangePassword()

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await handleChangePassword(formData)

    if (result.success) {
      showToast({ message: 'Password changed successfully', type: 'success' })
      goBack()
    } else if (result.error) {
      showToast({ message: result.error, type: 'error' })
    }
  }

  return (
    <div className={styles.container} data-testid="change-password-screen">
      <div className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={goBack}
          data-testid="back-button"
        >
          ←
        </button>
        <h1 className={styles.title}>Change Password</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          value={formData.currentPassword}
          onChange={handleChange('currentPassword')}
          error={errors.currentPassword}
          autoComplete="current-password"
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={formData.newPassword}
          onChange={handleChange('newPassword')}
          error={errors.newPassword}
          autoComplete="new-password"
          maxLength={50}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          autoComplete="new-password"
          maxLength={50}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Changing...' : 'Change Password'}
        </Button>
      </form>
    </div>
  )
}