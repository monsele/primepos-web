import { useState, useCallback } from 'react'
import { useToast } from '../../components/Toast/useToast'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useAuth } from '../../contexts/useAuth'
import { useSync } from '../../contexts/useSync'
import { postGroupLoanRepayment } from '../../api/loans'
import { addToQueue, getPendingCount } from '../../services/storage/queue'
import type { Group } from '../../types/group'
import type { GroupLoan } from '../../types/group'
import type { GroupLoanRepaymentRequest } from '../../api/loans'

export interface GroupLoanRepaymentForm {
  amount: string
}

export interface GroupLoanRepaymentErrors {
  amount?: string
}

export interface UseGroupLoanRepaymentReturn {
  form: GroupLoanRepaymentForm
  errors: GroupLoanRepaymentErrors
  isSubmitting: boolean
  selectedGroup: Group | null
  setAmount: (value: string) => void
  setGroup: (group: Group) => void
  handleSubmit: (loan: GroupLoan | null) => Promise<void>
  resetForm: () => void
}

export function useGroupLoanRepayment(): UseGroupLoanRepaymentReturn {
  const { showToast } = useToast()
  const { isOnline } = useNetworkStatus()
  const { user } = useAuth()
  const { updatePendingCount } = useSync()

  const [form, setForm] = useState<GroupLoanRepaymentForm>({
    amount: '',
  })
  const [errors, setErrors] = useState<GroupLoanRepaymentErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  const setAmount = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, amount: value }))
    setErrors((prev) => ({ ...prev, amount: undefined }))
  }, [])

  const setGroup = useCallback((group: Group) => {
    setSelectedGroup(group)
    setErrors((prev) => ({ ...prev, amount: undefined }))
  }, [])

  const resetForm = useCallback(() => {
    setForm({ amount: '' })
    setErrors({})
    setSelectedGroup(null)
  }, [])

  const validate = useCallback(
    (loan: GroupLoan | null): boolean => {
      const newErrors: GroupLoanRepaymentErrors = {}

      if (!selectedGroup) {
        newErrors.amount = 'Please select a group first'
      } else if (!loan) {
        newErrors.amount = 'Please search for a valid group loan first'
      } else if (loan.status === 'CLOSED') {
        newErrors.amount = 'Cannot repay a closed loan'
      }

      if (!newErrors.amount) {
        if (!form.amount.trim()) {
          newErrors.amount = 'Amount is required'
        } else {
          const cleaned = form.amount.replace(/,/g, '')
          const numValue = cleaned
          // Reject scientific notation for currency inputs
          if (/[eE]/.test(numValue)) {
            newErrors.amount = 'Enter a valid amount'
          } else {
            const num = Number(numValue)
            if (isNaN(num) || numValue === '' || num <= 0) {
              newErrors.amount = 'Enter a valid amount'
            } else if (loan && typeof loan.currentBalance === 'number' && typeof loan.outstandingInterest === 'number') {
              // Use precise kobo conversion to avoid floating-point precision loss
              // Multiply by 100 and round, but first check for edge cases
              const strNum = num.toFixed(2)
              const parts = strNum.split('.')
              const koboFromNaira = parseInt(parts[0], 10) * 100
              const koboFromKobo = parts[1] ? parseInt(parts[1].padEnd(2, '0').slice(0, 2), 10) : 0
              const amountKobo = koboFromNaira + koboFromKobo
              const maxRepayment = loan.currentBalance + loan.outstandingInterest
              if (amountKobo > maxRepayment) {
                newErrors.amount = 'Repayment exceeds outstanding balance'
              }
            }
          }
        }
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    },
    [form, selectedGroup]
  )

  const handleSubmit = useCallback(
    async (loan: GroupLoan | null) => {
      if (isSubmitting) return

      setErrors({})

      if (!validate(loan)) {
        return
      }

      // Validate required data exists
      if (!loan || !selectedGroup) {
        return
      }

      setIsSubmitting(true)

      try {
        // Re-check network status to avoid race condition
        const currentlyOnline = isOnline
        const officerId = user?.staffId || ''
        if (!officerId) {
          showToast({
            message: 'Officer ID not found. Please log in again.',
            type: 'error',
          })
          setIsSubmitting(false)
          return
        }

        const amountStr = form.amount.replace(/,/g, '')
        const amountNum = parseFloat(amountStr)
        // Precise kobo conversion
        const strNum = amountNum.toFixed(2)
        const parts = strNum.split('.')
        const koboFromNaira = parseInt(parts[0], 10) * 100
        const koboFromKobo = parts[1] ? parseInt(parts[1].padEnd(2, '0').slice(0, 2), 10) : 0
        const amountKobo = koboFromNaira + koboFromKobo

        const payload: GroupLoanRepaymentRequest = {
          loanNumber: loan.loanNumber,
          amount: amountKobo,
          officerId: officerId,
          groupId: selectedGroup.id,
          groupName: selectedGroup.groupName,
        }

        if (!currentlyOnline) {
          await addToQueue({
            type: 'GroupLoanRepayment',
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

        await postGroupLoanRepayment(payload)

        showToast({
          message: 'Group repayment posted successfully',
          type: 'success',
        })

        resetForm()
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to post group repayment'
        showToast({
          message,
          type: 'error',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      form,
      isSubmitting,
      validate,
      isOnline,
      user,
      showToast,
      updatePendingCount,
      resetForm,
      selectedGroup,
    ]
  )

  return {
    form,
    errors,
    isSubmitting,
    selectedGroup,
    setAmount,
    setGroup,
    handleSubmit,
    resetForm,
  }
}
