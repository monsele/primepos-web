import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { useAuth } from '../../contexts/useAuth'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useLogin } from './useLogin'
import styles from './login.module.css'

export default function LoginScreen() {
  const { error: authError } = useAuth()
  const { isOnline } = useNetworkStatus()
  const {
    staffId,
    password,
    showPassword,
    errors,
    isSubmitting,
    shake,
    setStaffId,
    setPassword,
    togglePassword,
    handleSubmit,
  } = useLogin()

  const isFormInvalid = !staffId.trim() || !password.trim()

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit()
  }

  return (
    <div className={styles.page}>
      {!isOnline && (
        <div className={styles.offlineBanner} role="status">
          <span className={styles.offlineIcon}>⚠️</span>
          <span>You are offline. Login requires cached credentials.</span>
        </div>
      )}

      <div className={styles.brand}>
        <div className={styles.logo}>P</div>
        <div className={styles.brandTitle}>PrimePOS</div>
        <div className={styles.brandSubtitle}>Mobile Teller Platform</div>
      </div>

      <div className={`${styles.card} ${shake ? styles.cardShake : ''}`}>
        <h2 className={styles.cardTitle}>Sign In to Your Account</h2>

        {authError && (
          <div className={styles.errorBanner} role="alert">
            {authError}
          </div>
        )}

        <form className={styles.form} onSubmit={onFormSubmit} noValidate>
          <Input
            label="Staff ID / Username"
            placeholder="Enter your Staff ID"
            value={staffId}
            onChange={setStaffId}
            error={errors.staffId}
            disabled={isSubmitting}
            autoComplete="username"
            id="staff-id"
          />

          <div className={styles.passwordWrapper}>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              disabled={isSubmitting}
              autoComplete="current-password"
              id="password"
            />
            <button
              type="button"
              className={styles.toggleButton}
              onClick={togglePassword}
              disabled={isSubmitting}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>

          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isFormInvalid || isSubmitting}
          >
            Sign In
          </Button>
        </form>
      </div>

      <div className={styles.footer}>
        v1.0.0 · © 2026 PrimePOS
      </div>
    </div>
  )
}
