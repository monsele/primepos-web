import { useState, useCallback } from 'react'
import type { GroupMember } from '../../types/group'

export interface BatchDepositForm {
  payeeName: string
  branchId: string
  groupId: string
  members: GroupMember[]
  sendSms: boolean
}

export interface UseBatchDepositReturn {
  form: BatchDepositForm
  totalAmount: number
  customerCount: number
  isValid: boolean
  updatePayeeName: (name: string) => void
  updateBranchId: (id: string) => void
  updateGroupId: (id: string) => void
  updateMemberAmount: (memberId: string, amount: number | null) => void
  updateSendSms: (send: boolean) => void
  resetForm: () => void
  validateForm: () => boolean
}

export function useBatchDeposit(): UseBatchDepositReturn {
  const [form, setForm] = useState<BatchDepositForm>({
    payeeName: '',
    branchId: '',
    groupId: '',
    members: [],
    sendSms: false
  })

  const totalAmount = form.members.reduce((sum, m) => sum + (m.amount || 0), 0)
  const customerCount = form.members.filter(m => (m.amount || 0) > 0).length

  const isValid = Boolean(
    form.payeeName.trim() &&
    form.branchId.trim() &&
    form.groupId &&
    totalAmount > 0
  )

  const updatePayeeName = useCallback((name: string) => {
    setForm(prev => ({ ...prev, payeeName: name }))
  }, [])

  const updateBranchId = useCallback((id: string) => {
    setForm(prev => ({ ...prev, branchId: id }))
  }, [])

  const updateGroupId = useCallback((id: string) => {
    setForm(prev => ({ ...prev, groupId: id }))
  }, [])

  const updateMemberAmount = useCallback((memberId: string, amount: number | null) => {
    setForm(prev => {
      const existingMember = prev.members.find(m => m.id === memberId)
      if (existingMember) {
        return {
          ...prev,
          members: prev.members.map(m =>
            m.id === memberId ? { ...m, amount } : m
          )
        }
      } else {
        // Add new member
        return {
          ...prev,
          members: [...prev.members, {
            id: memberId,
            customerName: '',
            accountNumber: '',
            amount
          }]
        }
      }
    })
  }, [])

  const updateSendSms = useCallback((send: boolean) => {
    setForm(prev => ({ ...prev, sendSms: send }))
  }, [])

  const resetForm = useCallback(() => {
    setForm({
      payeeName: '',
      branchId: '',
      groupId: '',
      members: [],
      sendSms: false
    })
  }, [])

  const validateForm = useCallback(() => {
    if (!form.payeeName.trim()) return false
    if (!form.branchId.trim()) return false
    if (!form.groupId) return false
    if (totalAmount <= 0) return false
    return true
  }, [form, totalAmount])

  return {
    form,
    totalAmount,
    customerCount,
    isValid,
    updatePayeeName,
    updateBranchId,
    updateGroupId,
    updateMemberAmount,
    updateSendSms,
    resetForm,
    validateForm
  }
}