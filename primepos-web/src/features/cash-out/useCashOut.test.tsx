import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCashOut } from './useCashOut'

vi.mock('../../hooks/useNetworkStatus', () => ({
  useNetworkStatus: vi.fn(() => ({ isOnline: true })),
}))

vi.mock('../../contexts/useAuth', () => ({
  useAuth: vi.fn(() => ({ user: { staffId: 'OFF001' } })),
}))

vi.mock('../../contexts/useSync', () => ({
  useSync: vi.fn(() => ({ updatePendingCount: vi.fn() })),
}))

vi.mock('../../components/Toast/useToast', () => ({
  useToast: vi.fn(() => ({ showToast: vi.fn(), dismissToast: vi.fn() })),
}))

vi.mock('../../api/transactions', () => ({
  postCashOut: vi.fn(),
}))

vi.mock('../../services/storage/queue', () => ({
  addToQueue: vi.fn(),
  getPendingCount: vi.fn(),
}))

import { postCashOut } from '../../api/transactions'
import { addToQueue, getPendingCount } from '../../services/storage/queue'
import { useToast } from '../../components/Toast/useToast'
import { useSync } from '../../contexts/useSync'
import { useAuth } from '../../contexts/useAuth'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import type { Account } from '../../types/account'

const mockAccount: Account = {
  accountNumber: '123',
  accountName: 'Test User',
  bookBalance: 5000000,
  usableBalance: 4500000,
  branchId: 'B1',
}

describe('useCashOut', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNetworkStatus).mockReturnValue({ isOnline: true, connectionType: '4g', since: new Date() })
    vi.mocked(useAuth).mockReturnValue({ user: { staffId: 'OFF001' } } as unknown as ReturnType<typeof useAuth>)
    vi.mocked(useSync).mockReturnValue({ updatePendingCount: vi.fn() } as unknown as ReturnType<typeof useSync>)
    vi.mocked(useToast).mockReturnValue({ showToast: vi.fn(), dismissToast: vi.fn() })
  })

  it('validates empty fields', async () => {
    const { result } = renderHook(() => useCashOut(mockAccount))

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.errors.payeeName).toBe('Payee name is required')
    expect(result.current.errors.amount).toBe('Amount is required')
  })

  it('validates amount must be greater than 0', async () => {
    const { result } = renderHook(() => useCashOut(mockAccount))

    act(() => {
      result.current.setAmount('0')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.errors.amount).toBe('Amount must be greater than 0')
  })

  it('validates non-numeric amount', async () => {
    const { result } = renderHook(() => useCashOut(mockAccount))

    act(() => {
      result.current.setAmount('abc')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.errors.amount).toBe('Enter a valid amount')
  })

  it('blocks withdrawal if amount exceeds usable balance', async () => {
    const { result } = renderHook(() => useCashOut(mockAccount))

    act(() => {
      result.current.setAmount('50000')
      result.current.setPayeeName('John')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.errors.amount).toBe('Amount exceeds usable balance')
    expect(postCashOut).not.toHaveBeenCalled()
  })

  it('shows real-time balance validation error', () => {
    const { result } = renderHook(() => useCashOut(mockAccount))

    act(() => {
      result.current.setAmount('50000')
    })

    expect(result.current.errors.amount).toBe('Amount exceeds usable balance')
  })

  it('clears real-time balance error when amount becomes valid', () => {
    const { result } = renderHook(() => useCashOut(mockAccount))

    act(() => {
      result.current.setAmount('50000')
    })
    expect(result.current.errors.amount).toBe('Amount exceeds usable balance')

    act(() => {
      result.current.setAmount('1000')
    })
    expect(result.current.errors.amount).toBeUndefined()
  })

  it('allows withdrawal equal to usable balance', async () => {
    vi.mocked(postCashOut).mockResolvedValue({ transactionId: 'TXN-1', status: 'POSTED', createdAt: '' })

    const { result } = renderHook(() => useCashOut(mockAccount))

    act(() => {
      result.current.setAmount('45000')
      result.current.setPayeeName('John')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.errors.amount).toBeUndefined()
    expect(postCashOut).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 4500000 })
    )
  })

  it('accepts valid comma-separated amount', async () => {
    const { result } = renderHook(() => useCashOut(mockAccount))

    act(() => {
      result.current.setAmount('1,000')
      result.current.setPayeeName('John')
    })

    vi.mocked(postCashOut).mockResolvedValue({ transactionId: 'TXN-1', status: 'POSTED', createdAt: '' })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(postCashOut).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 100000 })
    )
  })

  it('posts transaction successfully online', async () => {
    vi.mocked(postCashOut).mockResolvedValue({ transactionId: 'TXN-1', status: 'POSTED', createdAt: '' })
    const showToast = vi.fn()
    vi.mocked(useToast).mockReturnValue({ showToast, dismissToast: vi.fn() })

    const { result } = renderHook(() => useCashOut(mockAccount))

    act(() => {
      result.current.setPayeeName('John Doe')
      result.current.setAmount('5000')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(postCashOut).toHaveBeenCalledWith({
      accountNumber: '123',
      payeeName: 'John Doe',
      amount: 500000,
      sendSms: false,
      officerId: 'OFF001',
    })
    expect(showToast).toHaveBeenCalledWith({ message: 'Transaction posted', type: 'success' })
    expect(result.current.form.payeeName).toBe('')
    expect(result.current.form.amount).toBe('')
  })

  it('queues transaction when offline', async () => {
    vi.mocked(useNetworkStatus).mockReturnValue({ isOnline: false, connectionType: 'unknown', since: new Date() })

    const showToast = vi.fn()
    vi.mocked(useToast).mockReturnValue({ showToast, dismissToast: vi.fn() })

    const updatePendingCount = vi.fn()
    vi.mocked(useSync).mockReturnValue({ updatePendingCount } as unknown as ReturnType<typeof useSync>)

    vi.mocked(addToQueue).mockResolvedValue(undefined)
    vi.mocked(getPendingCount).mockResolvedValue(1)

    const { result } = renderHook(() => useCashOut(mockAccount))

    act(() => {
      result.current.setPayeeName('Jane Doe')
      result.current.setAmount('10000')
      result.current.setSendSms(true)
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(addToQueue).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'CashOut',
        status: 'PENDING',
      })
    )
    expect(showToast).toHaveBeenCalledWith({ message: 'Saved offline. Will sync when online.', type: 'warning' })
    expect(updatePendingCount).toHaveBeenCalledWith(1)
  })

  it('shows error toast when API fails', async () => {
    vi.mocked(postCashOut).mockRejectedValue(new Error('Network error'))
    const showToast = vi.fn()
    vi.mocked(useToast).mockReturnValue({ showToast, dismissToast: vi.fn() })

    const { result } = renderHook(() => useCashOut(mockAccount))

    act(() => {
      result.current.setPayeeName('John')
      result.current.setAmount('1000')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(showToast).toHaveBeenCalledWith({ message: 'Network error', type: 'error' })
    expect(result.current.isSubmitting).toBe(false)
  })

  it('resets form after successful post', async () => {
    vi.mocked(postCashOut).mockResolvedValue({ transactionId: 'TXN-1', status: 'POSTED', createdAt: '' })

    const { result } = renderHook(() => useCashOut(mockAccount))

    act(() => {
      result.current.setPayeeName('John')
      result.current.setAmount('1000')
      result.current.setSendSms(true)
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.form.payeeName).toBe('')
    expect(result.current.form.amount).toBe('')
    expect(result.current.form.sendSms).toBe(false)
  })
})
