import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLoanRepayment } from './useLoanRepayment'
import type { Loan } from '../../types/loan'

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

vi.mock('../../api/loans', () => ({
  postLoanRepayment: vi.fn(),
}))

vi.mock('../../services/storage/queue', () => ({
  addToQueue: vi.fn(),
  getPendingCount: vi.fn(),
}))

import { postLoanRepayment } from '../../api/loans'
import { addToQueue, getPendingCount } from '../../services/storage/queue'
import { useToast } from '../../components/Toast/useToast'
import { useSync } from '../../contexts/useSync'
import { useAuth } from '../../contexts/useAuth'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'

const mockLoan: Loan = {
  loanNumber: 'LN001',
  customerName: 'Test User',
  product: 'Micro Business Loan',
  loanPurpose: 'Working Capital',
  loanAmount: 5_000_000,
  currentBalance: 3_250_000,
  outstandingInterest: 125_000,
  startDate: '2024-01-15',
  maturityDate: '2025-01-15',
  status: 'ACTIVE',
}

describe('useLoanRepayment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNetworkStatus).mockReturnValue({ isOnline: true, connectionType: '4g', since: new Date() })
    vi.mocked(useAuth).mockReturnValue({ user: { staffId: 'OFF001' } } as unknown as ReturnType<typeof useAuth>)
    vi.mocked(useSync).mockReturnValue({ updatePendingCount: vi.fn() } as unknown as ReturnType<typeof useSync>)
    vi.mocked(useToast).mockReturnValue({ showToast: vi.fn(), dismissToast: vi.fn() })
  })

  it('validates empty fields', async () => {
    const { result } = renderHook(() => useLoanRepayment())

    await act(async () => {
      await result.current.handleSubmit(null)
    })

    expect(result.current.errors.amount).toBe('Please search for a valid loan first')
  })

  it('validates closed loan', async () => {
    const { result } = renderHook(() => useLoanRepayment())

    const closedLoan: Loan = { ...mockLoan, status: 'CLOSED' }

    await act(async () => {
      await result.current.handleSubmit(closedLoan)
    })

    expect(result.current.errors.amount).toBe('Cannot repay a closed loan')
  })

  it('validates amount must be greater than 0', async () => {
    const { result } = renderHook(() => useLoanRepayment())

    act(() => {
      result.current.setAmount('0')
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(result.current.errors.amount).toBe('Amount must be greater than 0')
  })

  it('validates non-numeric amount', async () => {
    const { result } = renderHook(() => useLoanRepayment())

    act(() => {
      result.current.setAmount('abc')
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(result.current.errors.amount).toBe('Enter a valid amount')
  })

  it('validates amount exceeds outstanding balance', async () => {
    const { result } = renderHook(() => useLoanRepayment())

    act(() => {
      result.current.setAmount('40000')
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(result.current.errors.amount).toBe('Repayment exceeds outstanding balance')
  })

  it('accepts valid amount within balance + interest', async () => {
    const { result } = renderHook(() => useLoanRepayment())

    act(() => {
      result.current.setAmount('1000')
    })

    vi.mocked(postLoanRepayment).mockResolvedValue({
      transactionId: 'TXN-1',
      status: 'POSTED',
      createdAt: '',
      newBalance: 3_150_000,
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(postLoanRepayment).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 100000 })
    )
  })

  it('posts repayment successfully online', async () => {
    vi.mocked(postLoanRepayment).mockResolvedValue({
      transactionId: 'TXN-1',
      status: 'POSTED',
      createdAt: '',
      newBalance: 3_150_000,
    })
    const showToast = vi.fn()
    vi.mocked(useToast).mockReturnValue({ showToast, dismissToast: vi.fn() })

    const { result } = renderHook(() => useLoanRepayment())

    act(() => {
      result.current.setAmount('1000')
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(postLoanRepayment).toHaveBeenCalledWith({
      loanNumber: 'LN001',
      amount: 100000,
      officerId: 'OFF001',
    })
    expect(showToast).toHaveBeenCalledWith({ message: 'Repayment posted successfully', type: 'success' })
    expect(result.current.form.amount).toBe('')
  })

  it('queues repayment when offline', async () => {
    vi.mocked(useNetworkStatus).mockReturnValue({ isOnline: false, connectionType: 'unknown', since: new Date() })

    const showToast = vi.fn()
    vi.mocked(useToast).mockReturnValue({ showToast, dismissToast: vi.fn() })

    const updatePendingCount = vi.fn()
    vi.mocked(useSync).mockReturnValue({ updatePendingCount } as unknown as ReturnType<typeof useSync>)

    vi.mocked(addToQueue).mockResolvedValue(undefined)
    vi.mocked(getPendingCount).mockResolvedValue(1)

    const { result } = renderHook(() => useLoanRepayment())

    act(() => {
      result.current.setAmount('5000')
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(addToQueue).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'LoanRepayment',
        status: 'PENDING',
      })
    )
    expect(showToast).toHaveBeenCalledWith({ message: 'Saved offline. Will sync when online.', type: 'warning' })
    expect(updatePendingCount).toHaveBeenCalledWith(1)
  })

  it('resets form after successful post', async () => {
    vi.mocked(postLoanRepayment).mockResolvedValue({
      transactionId: 'TXN-1',
      status: 'POSTED',
      createdAt: '',
      newBalance: 3_150_000,
    })

    const { result } = renderHook(() => useLoanRepayment())

    act(() => {
      result.current.setAmount('2000')
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(result.current.form.amount).toBe('')
  })
})
