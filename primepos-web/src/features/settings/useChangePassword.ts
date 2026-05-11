import { useState } from 'react'
import { changePassword } from '../../api/auth'

export interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordErrors {
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
  general?: string
}

export function useChangePassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ChangePasswordErrors>({})

  const validate = (data: ChangePasswordFormData): boolean => {
    const newErrors: ChangePasswordErrors = {}

    if (!data.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!data.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (data.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (data.newPassword !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChangePassword = async (
    data: ChangePasswordFormData,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!validate(data)) {
      return { success: false }
    }

    setIsLoading(true)
    setErrors({})

    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      return { success: true }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to change password'
      setErrors({ general: message })
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const clearErrors = () => setErrors({})

  return {
    handleChangePassword,
    isLoading,
    errors,
    clearErrors,
  }
}