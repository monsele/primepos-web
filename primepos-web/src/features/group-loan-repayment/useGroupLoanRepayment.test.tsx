import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGroupLoanRepayment } from './useGroupLoanRepayment'
import type { GroupLoan } from '../../types/group'
import type { Group } from '../../types/group'

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
  postGroupLoanRepayment: vi.fn(),
}))

vi.mock('../../services/storage/queue', () => ({
  addToQueue: vi.fn(),
  getPendingCount: vi.fn(),
}))

import { postGroupLoanRepayment } from '../../api/loans'
import { addToQueue, getPendingCount } from '../../services/storage/queue'
import { useToast } from '../../components/Toast/useToast'
import { useSync } from '../../contexts/useSync'
import { useAuth } from '../../contexts/useAuth'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'

const mockGroup: Group = {
  id: 'GRP001',
  groupCode: 'GR-001',
  groupName: 'Test Group',
  branchId: 'B1',
  memberCount: 10,
}

const mockLoan: GroupLoan = {
  loanNumber: 'GLN-GRP001',
  customerName: 'Group Loan Account',
  product: 'Group Lending Product',
  loanPurpose: 'Working Capital',
  loanAmount: 10_000_000,
  currentBalance: 6_500_000,
  outstandingInterest: 250_000,
  startDate: '2024-02-01',
  maturityDate: '2025-02-01',
  status: 'ACTIVE',
  groupId: 'GRP001',
  groupName: 'Test Group',
}

describe('useGroupLoanRepayment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNetworkStatus).mockReturnValue({ isOnline: true, connectionType: '4g', since: new Date() })
    vi.mocked(useAuth).mockReturnValue({ user: { staffId: 'OFF001' } } as unknown as ReturnType<typeof useAuth>)
    vi.mocked(useSync).mockReturnValue({ updatePendingCount: vi.fn() } as unknown as ReturnType<typeof useSync>)
    vi.mocked(useToast).mockReturnValue({ showToast: vi.fn(), dismissToast: vi.fn() })
  })

  it('validates when no group is selected', async () => {
    const { result } = renderHook(() => useGroupLoanRepayment())

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(result.current.errors.amount).toBe('Please select a group first')
  })

  it('validates when no loan is found', async () => {
    const { result } = renderHook(() => useGroupLoanRepayment())

    act(() => {
      result.current.setGroup(mockGroup)
    })

    await act(async () => {
      await result.current.handleSubmit(null)
    })

    expect(result.current.errors.amount).toBe('Please search for a valid group loan first')
  })

  it('validates closed loan', async () => {
    const { result } = renderHook(() => useGroupLoanRepayment())

    act(() => {
      result.current.setGroup(mockGroup)
    })

    const closedLoan: GroupLoan = { ...mockLoan, status: 'CLOSED' }

    await act(async () => {
      await result.current.handleSubmit(closedLoan)
    })

    expect(result.current.errors.amount).toBe('Cannot repay a closed loan')
  })

  it('validates empty amount', async () => {
    const { result } = renderHook(() => useGroupLoanRepayment())

    act(() => {
      result.current.setGroup(mockGroup)
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(result.current.errors.amount).toBe('Amount is required')
  })

  it('validates amount must be greater than 0', async () => {
    const { result } = renderHook(() => useGroupLoanRepayment())

    act(() => {
      result.current.setGroup(mockGroup)
      result.current.setAmount('0')
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(result.current.errors.amount).toBe('Amount must be greater than 0')
  })

  it('validates non-numeric amount', async () => {
    const { result } = renderHook(() => useGroupLoanRepayment())

    act(() => {
      result.current.setGroup(mockGroup)
      result.current.setAmount('abc')
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(result.current.errors.amount).toBe('Enter a valid amount')
  })

  it('validates amount exceeds outstanding balance', async () => {
    const { result } = renderHook(() => useGroupLoanRepayment())

    act(() => {
      result.current.setGroup(mockGroup)
      result.current.setAmount('70000')
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(result.current.errors.amount).toBe('Repayment exceeds outstanding balance')
  })

  it('posts group repayment successfully online', async () => {
    vi.mocked(postGroupLoanRepayment).mockResolvedValue({
      transactionId: 'TXN-1',
      status: 'POSTED',
      createdAt: '',
      newBalance: 6_400_000,
    })
    const showToast = vi.fn()
    vi.mocked(useToast).mockReturnValue({ showToast, dismissToast: vi.fn() })

    const { result } = renderHook(() => useGroupLoanRepayment())

    act(() => {
      result.current.setGroup(mockGroup)
      result.current.setAmount('1000')
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(postGroupLoanRepayment).toHaveBeenCalledWith({
      loanNumber: 'GLN-GRP001',
      amount: 100000,
      officerId: 'OFF001',
      groupId: 'GRP001',
      groupName: 'Test Group',
    })
    expect(showToast).toHaveBeenCalledWith({ message: 'Group repayment posted successfully', type: 'success' })
    expect(result.current.form.amount).toBe('')
    expect(result.current.selectedGroup).toBeNull()
  })

  it('queues repayment when offline', async () => {
    vi.mocked(useNetworkStatus).mockReturnValue({ isOnline: false, connectionType: 'unknown', since: new Date() })

    const showToast = vi.fn()
    vi.mocked(useToast).mockReturnValue({ showToast, dismissToast: vi.fn() })

    const updatePendingCount = vi.fn()
    vi.mocked(useSync).mockReturnValue({ updatePendingCount } as unknown as ReturnType<typeof useSync>)

    vi.mocked(addToQueue).mockResolvedValue(undefined)
    vi.mocked(getPendingCount).mockResolvedValue(1)

    const { result } = renderHook(() => useGroupLoanRepayment())

    act(() => {
      result.current.setGroup(mockGroup)
      result.current.setAmount('5000')
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(addToQueue).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'GroupLoanRepayment',
        status: 'PENDING',
      })
    )
    expect(showToast).toHaveBeenCalledWith({ message: 'Saved offline. Will sync when online.', type: 'warning' })
    expect(updatePendingCount).toHaveBeenCalledWith(1)
  })

  it('resets form after successful post', async () => {
    vi.mocked(postGroupLoanRepayment).mockResolvedValue({
      transactionId: 'TXN-1',
      status: 'POSTED',
      createdAt: '',
      newBalance: 6_400_000,
    })

    const { result } = renderHook(() => useGroupLoanRepayment())

    act(() => {
      result.current.setGroup(mockGroup)
      result.current.setAmount('2000')
    })

    await act(async () => {
      await result.current.handleSubmit(mockLoan)
    })

    expect(result.current.form.amount).toBe('')
    expect(result.current.selectedGroup).toBeNull()
  })

  it('sets group correctly', () => {
    const { result } = renderHook(() => useGroupLoanRepayment())

    act(() => {
      result.current.setGroup(mockGroup)
    })

    expect(result.current.selectedGroup).toEqual(mockGroup)
  })
})
