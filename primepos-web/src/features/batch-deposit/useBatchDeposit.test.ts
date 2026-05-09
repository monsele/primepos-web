import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useBatchDeposit } from './useBatchDeposit'

describe('useBatchDeposit', () => {

  it('initializes with empty form', () => {
    const { result } = renderHook(() => useBatchDeposit())

    expect(result.current.form.payeeName).toBe('')
    expect(result.current.form.branchId).toBe('')
    expect(result.current.form.groupId).toBe('')
    expect(result.current.form.members).toEqual([])
    expect(result.current.form.sendSms).toBe(false)
    expect(result.current.totalAmount).toBe(0)
    expect(result.current.customerCount).toBe(0)
    expect(result.current.isValid).toBe(false)
  })

  it('updates payee name', () => {
    const { result } = renderHook(() => useBatchDeposit())

    act(() => {
      result.current.updatePayeeName('Test Officer')
    })

    expect(result.current.form.payeeName).toBe('Test Officer')
  })

  it('updates member amounts and calculates totals', () => {
    const { result } = renderHook(() => useBatchDeposit())

    act(() => {
      result.current.updateGroupId('group-1')
      result.current.updatePayeeName('Officer')
      result.current.updateBranchId('branch-1')
      result.current.updateMemberAmount('1', 5000)
      result.current.updateMemberAmount('2', 7500)
    })

    expect(result.current.form.members).toEqual([
      { id: '1', customerName: '', accountNumber: '', amount: 5000 },
      { id: '2', customerName: '', accountNumber: '', amount: 7500 },
    ])
    expect(result.current.totalAmount).toBe(12500)
    expect(result.current.customerCount).toBe(2)
  })

  it('validates form correctly', () => {
    const { result } = renderHook(() => useBatchDeposit())

    // Initially invalid
    expect(result.current.isValid).toBe(false)
    expect(result.current.validateForm()).toBe(false)

    // Add required fields
    act(() => {
      result.current.updatePayeeName('Officer')
      result.current.updateBranchId('Branch 1')
      result.current.updateGroupId('group-1')
      result.current.updateMemberAmount('1', 10000)
    })

    expect(result.current.isValid).toBe(true)
    expect(result.current.validateForm()).toBe(true)
  })

  it('resets form', () => {
    const { result } = renderHook(() => useBatchDeposit())

    act(() => {
      result.current.updatePayeeName('Officer')
      result.current.updateBranchId('Branch 1')
      result.current.updateGroupId('group-1')
      result.current.updateMemberAmount('1', 10000)
      result.current.updateSendSms(true)
    })

    expect(result.current.form.payeeName).toBe('Officer')
    expect(result.current.totalAmount).toBe(10000)

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.form.payeeName).toBe('')
    expect(result.current.form.members).toEqual([])
    expect(result.current.totalAmount).toBe(0)
  })
})