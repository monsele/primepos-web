import { useState, useCallback, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { login as loginApi } from '../../api/auth'
import type { LoginRequest } from '../../types/auth'

interface UseLoginReturn {
  staffId: string
  password: string
  showPassword: boolean
  errors: {
    staffId?: string
    password?: string
  }
  isSubmitting: boolean
  shake: boolean
  setStaffId: (value: string) => void
  setPassword: (value: string) => void
  togglePassword: () => void
  handleSubmit: () => Promise<void>
}

export function useLogin(): UseLoginReturn {
  const { login, setError } = useAuth()
  const [staffId, setStaffId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ staffId?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shake, setShake] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const validate = useCallback((): boolean => {
    const newErrors: { staffId?: string; password?: string } = {}
    if (!staffId.trim()) {
      newErrors.staffId = 'Required'
    }
    if (!password.trim()) {
      newErrors.password = 'Required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [staffId, password])

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) {
      return
    }

    setShake(false)
    setErrors({})

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const credentials: LoginRequest = { staffId: staffId.trim(), password }
      const response = await loginApi(credentials)
      login(response.user, response.accessToken)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid credentials. Please try again.'
      setError(message)
      setShake(true)
      timeoutRef.current = setTimeout(() => {
        setShake(false)
      }, 500)
    } finally {
      setIsSubmitting(false)
    }
  }, [staffId, password, validate, login, setError, isSubmitting])

  return {
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
  }
}
