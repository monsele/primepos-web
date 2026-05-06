import { useState, useCallback } from 'react'
import { useToast } from '../../components/Toast/useToast'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useAuth } from '../../contexts/useAuth'
import { useSync } from '../../contexts/useSync'
import { postCashIn } from '../../api/transactions'
import { addToQueue, getPendingCount } from '../../services/storage/queue'
import type { Account } from '../../types/account'
import type { CashInRequest } from '../../api/transactions'

export interface CashInForm {
  accountNumber: string
  payeeName: string
  amount: string
  sendSms: boolean
}

export interface CashInErrors {
  accountNumber?: string
  payeeName?: string
  amount?: string
}

export interface UseCashInReturn {
  form: CashInForm
  errors: CashInErrors
  isSubmitting: boolean
  setAccountNumber: (value: string) => void
  setPayeeName: (value: string) => void
  setAmount: (value: string) => void
  setSendSms: (value: boolean) => void
  handleSubmit: (account: Account | null) => Promise<void>
  resetForm: () => void
}

export function useCashIn(): UseCashInReturn {
  const { showToast } = useToast()
  const { isOnline } = useNetworkStatus()
  const { user } = useAuth()
  const { updatePendingCount } = useSync()

  const [form, setForm] = useState<CashInForm>({
    accountNumber: '',
    payeeName: '',
    amount: '',
    sendSms: false,
  })
  const [errors, setErrors] = useState<CashInErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setAccountNumber = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, accountNumber: value }))
    setErrors((prev) => ({ ...prev, accountNumber: undefined }))
  }, [])

  const setPayeeName = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, payeeName: value }))
    setErrors((prev) => ({ ...prev, payeeName: undefined }))
  }, [])

  const setAmount = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, amount: value }))
    setErrors((prev) => ({ ...prev, amount: undefined }))
  }, [])

  const setSendSms = useCallback((value: boolean) => {
    setForm((prev) => ({ ...prev, sendSms: value }))
  }, [])

  const validate = useCallback(
    (account: Account | null): boolean => {
      const newErrors: CashInErrors = {}

      if (!account) {
        newErrors.accountNumber = 'Please search for a valid account first'
      }

      if (!form.payeeName.trim()) {
        newErrors.payeeName = 'Payee name is required'
      }

      if (!form.amount.trim()) {
        newErrors.amount = 'Amount is required'
      } else {
        const cleaned = form.amount.replace(/,/g, '')
        const num = Number(cleaned)
        if (isNaN(num) || cleaned === '') {
          newErrors.amount = 'Enter a valid amount'
        } else if (num <= 0) {
          newErrors.amount = 'Amount must be greater than 0'
        }
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    },
    [form]
  )

  const resetForm = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      payeeName: '',
      amount: '',
      sendSms: false,
    }))
    setErrors({})
  }, [])

  const handleSubmit = useCallback(
    async (account: Account | null) => {
      if (isSubmitting) return

      setErrors({})

      if (!validate(account)) {
        return
      }

      setIsSubmitting(true)

      try {
        const amountKobo = Math.round(
          Number(form.amount.replace(/,/g, '')) * 100
        )

        const payload: CashInRequest = {
          accountNumber: account!.accountNumber,
          payeeName: form.payeeName.trim(),
          amount: amountKobo,
          sendSms: form.sendSms,
          officerId: user?.staffId || '',
        }

        if (!isOnline) {
          await addToQueue({
            type: 'CashIn',
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

        await postCashIn(payload)

        showToast({
          message: 'Transaction posted',
          type: 'success',
        })

        resetForm()
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to post transaction'
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
    setAccountNumber,
    setPayeeName,
    setAmount,
    setSendSms,
    handleSubmit,
    resetForm,
  }
}
