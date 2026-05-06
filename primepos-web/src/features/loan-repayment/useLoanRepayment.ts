import { useState, useCallback } from 'react'
import { useToast } from '../../components/Toast/useToast'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useAuth } from '../../contexts/useAuth'
import { useSync } from '../../contexts/useSync'
import { postLoanRepayment } from '../../api/loans'
import { addToQueue, getPendingCount } from '../../services/storage/queue'
import type { Loan } from '../../types/loan'
import type { LoanRepaymentRequest } from '../../api/loans'

export interface LoanRepaymentForm {
  amount: string
}

export interface LoanRepaymentErrors {
  amount?: string
}

export interface UseLoanRepaymentReturn {
  form: LoanRepaymentForm
  errors: LoanRepaymentErrors
  isSubmitting: boolean
  setAmount: (value: string) => void
  handleSubmit: (loan: Loan | null) => Promise<void>
  resetForm: () => void
}

export function useLoanRepayment(): UseLoanRepaymentReturn {
  const { showToast } = useToast()
  const { isOnline } = useNetworkStatus()
  const { user } = useAuth()
  const { updatePendingCount } = useSync()

  const [form, setForm] = useState<LoanRepaymentForm>({
    amount: '',
  })
  const [errors, setErrors] = useState<LoanRepaymentErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setAmount = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, amount: value }))
    setErrors((prev) => ({ ...prev, amount: undefined }))
  }, [])

  const resetForm = useCallback(() => {
    setForm({ amount: '' })
    setErrors({})
  }, [])

  const validate = useCallback(
    (loan: Loan | null): boolean => {
      const newErrors: LoanRepaymentErrors = {}

      if (!loan) {
        newErrors.amount = 'Please search for a valid loan first'
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
    [form]
  )

  const handleSubmit = useCallback(
    async (loan: Loan | null) => {
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

        const payload: LoanRepaymentRequest = {
          loanNumber: loan!.loanNumber,
          amount: amountKobo,
          officerId: user?.staffId || '',
        }

        if (!isOnline) {
          await addToQueue({
            type: 'LoanRepayment',
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

        await postLoanRepayment(payload)

        showToast({
          message: 'Repayment posted successfully',
          type: 'success',
        })

        resetForm()
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to post repayment'
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
    ]
  )

  return {
    form,
    errors,
    isSubmitting,
    setAmount,
    handleSubmit,
    resetForm,
  }
}
