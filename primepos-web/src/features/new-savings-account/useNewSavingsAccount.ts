import { useCallback, useState } from 'react'
import { createSavingsAccount, type CreateSavingsAccountRequest } from '../../api/accounts'
import { useToast } from '../../components/Toast/useToast'
import { useAuth } from '../../contexts/useAuth'
import { useSync } from '../../contexts/useSync'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { addToQueue, getPendingCount } from '../../services/storage/queue'
import { isValidBvn, isValidDateOfBirth } from '../../utils/validation'

export interface SavingsAccountFormData {
  branch: string
  firstName: string
  otherName: string
  surname: string
  gender: 'Male' | 'Female' | ''
  dateOfBirth: string
  homeAddress: string
  businessAddress: string
  phoneNumber: string
  email: string
  bvn: string
  nextOfKinName: string
  nextOfKinPhone: string
  productId: string
  initialDeposit: string
}

export interface SavingsAccountSuccessData {
  accountNumber: string
}

export interface UseNewSavingsAccountReturn {
  currentStep: 1 | 2 | 3
  formData: SavingsAccountFormData
  errors: Record<string, string>
  isSubmitting: boolean
  successData: SavingsAccountSuccessData | null
  updateField: <K extends keyof SavingsAccountFormData>(
    field: K,
    value: SavingsAccountFormData[K]
  ) => void
  nextStep: () => boolean
  previousStep: () => void
  submit: () => Promise<void>
  dismissSuccess: () => void
}

const initialFormData: SavingsAccountFormData = {
  branch: '',
  firstName: '',
  otherName: '',
  surname: '',
  gender: '',
  dateOfBirth: '',
  homeAddress: '',
  businessAddress: '',
  phoneNumber: '',
  email: '',
  bvn: '',
  nextOfKinName: '',
  nextOfKinPhone: '',
  productId: '',
  initialDeposit: '',
}

export function useNewSavingsAccount(): UseNewSavingsAccountReturn {
  const { showToast } = useToast()
  const { isOnline } = useNetworkStatus()
  const { user } = useAuth()
  const { updatePendingCount } = useSync()

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData] = useState<SavingsAccountFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<SavingsAccountSuccessData | null>(null)

  const updateField = useCallback(
    <K extends keyof SavingsAccountFormData>(
      field: K,
      value: SavingsAccountFormData[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: '' }))
    },
    []
  )

  const validateStep = useCallback(
    (step: 1 | 2 | 3): boolean => {
      const nextErrors: Record<string, string> = {}

      if (step === 1) {
        if (!formData.branch.trim()) nextErrors.branch = 'Branch is required'
        if (!formData.firstName.trim()) {
          nextErrors.firstName = 'First name is required'
        }
        if (!formData.surname.trim()) {
          nextErrors.surname = 'Surname is required'
        }
        if (!formData.gender) nextErrors.gender = 'Gender is required'
        if (!formData.dateOfBirth.trim()) {
          nextErrors.dateOfBirth = 'Date of birth is required'
        } else if (!isValidDateOfBirth(formData.dateOfBirth)) {
          nextErrors.dateOfBirth = 'Enter a valid date. Customer must be at least 18'
        }
      }

      if (step === 2) {
        if (!formData.phoneNumber.trim()) {
          nextErrors.phoneNumber = 'Phone number is required'
        }
        if (!formData.bvn.trim()) {
          nextErrors.bvn = 'BVN is required'
        } else if (!isValidBvn(formData.bvn.trim())) {
          nextErrors.bvn = 'BVN must be exactly 11 digits'
        }
        if (!formData.nextOfKinName.trim()) {
          nextErrors.nextOfKinName = 'Next of kin name is required'
        }
      }

      if (step === 3) {
        if (!formData.productId) {
          nextErrors.productId = 'Product type is required'
        }
        if (!formData.initialDeposit.trim()) {
          nextErrors.initialDeposit = 'Initial deposit is required'
        } else {
          const amount = Number(formData.initialDeposit.replace(/,/g, ''))
          if (Number.isNaN(amount)) {
            nextErrors.initialDeposit = 'Enter a valid amount'
          } else if (amount <= 0) {
            nextErrors.initialDeposit = 'Amount must be greater than 0'
          }
        }
      }

      setErrors(nextErrors)
      return Object.keys(nextErrors).length === 0
    },
    [formData]
  )

  const nextStep = useCallback(() => {
    if (!validateStep(currentStep)) return false

    setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev))
    return true
  }, [currentStep, validateStep])

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev))
  }, [])

  const resetWizard = useCallback(() => {
    setCurrentStep(1)
    setFormData(initialFormData)
    setErrors({})
  }, [])

  const dismissSuccess = useCallback(() => {
    setSuccessData(null)
  }, [])

  const submit = useCallback(async () => {
    if (isSubmitting) return
    if (!validateStep(3)) return

    setIsSubmitting(true)

    const payload: CreateSavingsAccountRequest = {
      branch: formData.branch.trim(),
      firstName: formData.firstName.trim(),
      otherName: formData.otherName.trim(),
      surname: formData.surname.trim(),
      gender: formData.gender as 'Male' | 'Female',
      dateOfBirth: formData.dateOfBirth,
      homeAddress: formData.homeAddress.trim(),
      businessAddress: formData.businessAddress.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      bvn: formData.bvn.trim(),
      nextOfKinName: formData.nextOfKinName.trim(),
      nextOfKinPhone: formData.nextOfKinPhone.trim(),
      productId: formData.productId,
      initialDeposit: Math.round(
        Number(formData.initialDeposit.replace(/,/g, '')) * 100
      ),
      officerId: user?.staffId || '',
    }

    try {
      if (!isOnline) {
        await addToQueue({
          type: 'NewSavingsAccount',
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

        resetWizard()
        return
      }

      const response = await createSavingsAccount(payload)
      setSuccessData({ accountNumber: response.accountNumber })
      showToast({
        message: `Account created successfully. Account Number: ${response.accountNumber}`,
        type: 'success',
      })
      resetWizard()
    } catch (error) {
      showToast({
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create savings account',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [
    formData,
    isOnline,
    isSubmitting,
    resetWizard,
    showToast,
    updatePendingCount,
    user?.staffId,
    validateStep,
  ])

  return {
    currentStep,
    formData,
    errors,
    isSubmitting,
    successData,
    updateField,
    nextStep,
    previousStep,
    submit,
    dismissSuccess,
  }
}
