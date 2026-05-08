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
          const num = Number(cleaned)
          if (isNaN(num) || cleaned === '') {
            newErrors.amount = 'Enter a valid amount'
          } else if (num <= 0) {
            newErrors.amount = 'Amount must be greater than 0'
          } else if (loan) {
            const maxRepayment = loan.currentBalance + loan.outstandingInterest
            const amountKobo = Math.round(num * 100)
            if (amountKobo > maxRepayment) {
              newErrors.amount = 'Repayment exceeds outstanding balance'
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

      setIsSubmitting(true)

      try {
        const amountKobo = Math.round(
          Number(form.amount.replace(/,/g, '')) * 100
        )

        const payload: GroupLoanRepaymentRequest = {
          loanNumber: loan!.loanNumber,
          amount: amountKobo,
          officerId: user?.staffId || '',
          groupId: selectedGroup!.id,
          groupName: selectedGroup!.groupName,
        }

        if (!isOnline) {
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
