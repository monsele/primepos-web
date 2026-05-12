import { useState, useCallback } from 'react'
import { useToast } from '../../components/Toast/useToast'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useAuth } from '../../contexts/useAuth'
import { useSync } from '../../contexts/useSync'
import { createAccountWithDeposit } from '../../api/accounts'
import { addToQueue, getPendingCount } from '../../services/storage/queue'
import { isValidBvn } from '../../utils/validation'
import type { NewAccountDepositRequest } from '../../api/accounts'

export interface NewAccountDepositForm {
  firstName: string
  surname: string
  otherName: string
  gender: 'Male' | 'Female' | ''
  bvn: string
  productId: string
  initialDeposit: string
}

export interface NewAccountDepositErrors {
  firstName?: string
  surname?: string
  bvn?: string
  gender?: string
  productId?: string
  initialDeposit?: string
}

export interface UseNewAccountDepositReturn {
  form: NewAccountDepositForm
  errors: NewAccountDepositErrors
  isSubmitting: boolean
  successData: { nuban: string; accountName: string } | null
  setFirstName: (value: string) => void
  setSurname: (value: string) => void
  setOtherName: (value: string) => void
  setGender: (value: 'Male' | 'Female' | '') => void
  setBvn: (value: string) => void
  setProductId: (value: string) => void
  setInitialDeposit: (value: string) => void
  handleSubmit: () => Promise<void>
  dismissSuccess: () => void
}

export function useNewAccountDeposit(): UseNewAccountDepositReturn {
  const { showToast } = useToast()
  const { isOnline } = useNetworkStatus()
  const { user } = useAuth()
  const { updatePendingCount } = useSync()

  const [form, setForm] = useState<NewAccountDepositForm>({
    firstName: '',
    surname: '',
    otherName: '',
    gender: '',
    bvn: '',
    productId: '',
    initialDeposit: '',
  })
  const [errors, setErrors] = useState<NewAccountDepositErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<{ nuban: string; accountName: string } | null>(null)

  const setFirstName = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, firstName: value }))
    setErrors((prev) => ({ ...prev, firstName: undefined }))
  }, [])

  const setSurname = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, surname: value }))
    setErrors((prev) => ({ ...prev, surname: undefined }))
  }, [])

  const setOtherName = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, otherName: value }))
  }, [])

  const setGender = useCallback((value: 'Male' | 'Female' | '') => {
    setForm((prev) => ({ ...prev, gender: value }))
    setErrors((prev) => ({ ...prev, gender: undefined }))
  }, [])

  const setBvn = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, bvn: value }))
    setErrors((prev) => ({ ...prev, bvn: undefined }))
  }, [])

  const setProductId = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, productId: value }))
    setErrors((prev) => ({ ...prev, productId: undefined }))
  }, [])

  const setInitialDeposit = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, initialDeposit: value }))
    setErrors((prev) => ({ ...prev, initialDeposit: undefined }))
  }, [])

  const validate = useCallback((): boolean => {
    const newErrors: NewAccountDepositErrors = {}

    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!form.surname.trim()) {
      newErrors.surname = 'Surname is required'
    }

    if (!form.bvn.trim()) {
      newErrors.bvn = 'BVN is required'
    } else if (!isValidBvn(form.bvn)) {
      newErrors.bvn = 'BVN must be 11 digits'
    }

    if (!form.gender) {
      newErrors.gender = 'Gender is required'
    }

    if (!form.productId) {
      newErrors.productId = 'Product is required'
    }

    if (!form.initialDeposit.trim()) {
      newErrors.initialDeposit = 'Initial deposit is required'
    } else {
      const cleaned = form.initialDeposit.replace(/,/g, '')
      const num = Number(cleaned)
      if (isNaN(num) || cleaned === '') {
        newErrors.initialDeposit = 'Enter a valid amount'
      } else if (num <= 0) {
        newErrors.initialDeposit = 'Amount must be greater than 0'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form])

  const resetForm = useCallback(() => {
    setForm({
      firstName: '',
      surname: '',
      otherName: '',
      gender: '',
      bvn: '',
      productId: '',
      initialDeposit: '',
    })
    setErrors({})
  }, [])

  const dismissSuccess = useCallback(() => {
    setSuccessData(null)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return

    setErrors({})

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const amountKobo = Math.round(
        Number(form.initialDeposit.replace(/,/g, '')) * 100
      )

      const payload: NewAccountDepositRequest = {
        firstName: form.firstName.trim(),
        surname: form.surname.trim(),
        otherName: form.otherName.trim(),
        gender: form.gender as 'Male' | 'Female',
        bvn: form.bvn.trim(),
        productId: form.productId,
        initialDeposit: amountKobo,
        officerId: user?.staffId || '',
      }

      if (!isOnline) {
        await addToQueue({
          type: 'NewAccountDeposit',
          payload,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        })

        const pendingCount = await getPendingCount()
        updatePendingCount(pendingCount)

        showToast({
          message: 'Saved offline. Will sync when online.',
          type: 'warning',
        })

        resetForm()
        return
      }

      const response = await createAccountWithDeposit(payload)

      setSuccessData({
        nuban: response.nuban,
        accountName: response.accountName,
      })

      showToast({
        message: `Account created successfully. Account Number: ${response.nuban}`,
        type: 'success',
      })

      resetForm()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create account'
      showToast({
        message,
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [
    form,
    isSubmitting,
    validate,
    isOnline,
    user,
    showToast,
    updatePendingCount,
    resetForm,
  ])

  return {
    form,
    errors,
    isSubmitting,
    successData,
    setFirstName,
    setSurname,
    setOtherName,
    setGender,
    setBvn,
    setProductId,
    setInitialDeposit,
    handleSubmit,
    dismissSuccess,
  }
}
