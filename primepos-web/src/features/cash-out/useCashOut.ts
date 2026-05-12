import { useState, useCallback, useRef, useEffect } from 'react'
import { useToast } from '../../components/Toast/useToast'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useAuth } from '../../contexts/useAuth'
import { useSync } from '../../contexts/useSync'
import { postCashOut } from '../../api/transactions'
import { addToQueue, getPendingCount } from '../../services/storage/queue'
import type { Account } from '../../types/account'
import type { CashOutRequest } from '../../api/transactions'

export interface CashOutForm {
  payeeName: string
  amount: string
  sendSms: boolean
}

export interface CashOutErrors {
  payeeName?: string
  amount?: string
}

export interface UseCashOutReturn {
  form: CashOutForm
  errors: CashOutErrors
  isSubmitting: boolean
  setPayeeName: (value: string) => void
  setAmount: (value: string) => void
  setSendSms: (value: boolean) => void
  handleSubmit: () => Promise<void>
  resetForm: () => void
}

function parseAmountToKobo(amount: string): number | null {
  const cleaned = amount.replace(/,/g, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null
  const parts = cleaned.split('.')
  const whole = parseInt(parts[0], 10)
  const fraction = parts[1]
    ? parseInt(parts[1].padEnd(2, '0').slice(0, 2), 10)
    : 0
  return whole * 100 + fraction
}

export function useCashOut(account: Account | null): UseCashOutReturn {
  const { showToast } = useToast()
  const { isOnline } = useNetworkStatus()
  const { user } = useAuth()
  const { updatePendingCount } = useSync()
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const [form, setForm] = useState<CashOutForm>({
    payeeName: '',
    amount: '',
    sendSms: false,
  })
  const [errors, setErrors] = useState<CashOutErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setPayeeName = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, payeeName: value }))
    setErrors((prev) => ({ ...prev, payeeName: undefined }))
  }, [])

  const setAmount = useCallback(
    (value: string) => {
      setForm((prev) => ({ ...prev, amount: value }))
      const kobo = parseAmountToKobo(value)
      if (kobo !== null && account && kobo > account.usableBalance) {
        setErrors((prev) => ({
          ...prev,
          amount: 'Amount exceeds usable balance',
        }))
      } else {
        setErrors((prev) => ({ ...prev, amount: undefined }))
      }
    },
    [account]
  )

  const setSendSms = useCallback((value: boolean) => {
    setForm((prev) => ({ ...prev, sendSms: value }))
  }, [])

  const validate = useCallback((): boolean => {
    const newErrors: CashOutErrors = {}

    if (!form.payeeName.trim()) {
      newErrors.payeeName = 'Payee name is required'
    }

    if (!form.amount.trim()) {
      newErrors.amount = 'Amount is required'
    } else {
      const kobo = parseAmountToKobo(form.amount)
      if (kobo === null) {
        newErrors.amount = 'Enter a valid amount'
      } else if (kobo <= 0) {
        newErrors.amount = 'Amount must be greater than 0'
      } else if (account && kobo > account.usableBalance) {
        newErrors.amount = 'Amount exceeds usable balance'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form, account])

  const resetForm = useCallback(() => {
    setForm({
      payeeName: '',
      amount: '',
      sendSms: false,
    })
    setErrors({})
  }, [])

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return

    setErrors({})

    if (!validate()) {
      return
    }

    if (!account) {
      showToast({
        message: 'Please search for a valid account first',
        type: 'error',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const amountKobo = parseAmountToKobo(form.amount)
      if (amountKobo === null) {
        showToast({
          message: 'Enter a valid amount',
          type: 'error',
        })
        return
      }

      const payload: CashOutRequest = {
        accountNumber: account.accountNumber,
        payeeName: form.payeeName.trim(),
        amount: amountKobo,
        sendSms: form.sendSms,
        officerId: user?.staffId || '',
      }

      if (!isOnline) {
        await addToQueue({
          type: 'CashOut',
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

      await postCashOut(payload)

      showToast({
        message: 'Transaction posted',
        type: 'success',
      })

      resetForm()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to post transaction'
      showToast({
        message,
        type: 'error',
      })
    } finally {
      if (mountedRef.current) {
        setIsSubmitting(false)
      }
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
    account,
  ])

  return {
    form,
    errors,
    isSubmitting,
    setPayeeName,
    setAmount,
    setSendSms,
    handleSubmit,
    resetForm,
  }
}
