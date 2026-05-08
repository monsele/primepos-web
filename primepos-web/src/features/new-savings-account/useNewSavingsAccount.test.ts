import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNewSavingsAccount } from './useNewSavingsAccount'

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
  useToast: vi.fn(() => ({ showToast: vi.fn() })),
}))

vi.mock('../../api/accounts', () => ({
  createSavingsAccount: vi.fn(),
}))

vi.mock('../../services/storage/queue', () => ({
  addToQueue: vi.fn(),
  getPendingCount: vi.fn(),
}))

import { createSavingsAccount } from '../../api/accounts'
import { addToQueue, getPendingCount } from '../../services/storage/queue'
import { useAuth } from '../../contexts/useAuth'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useSync } from '../../contexts/useSync'
import { useToast } from '../../components/Toast/useToast'

describe('useNewSavingsAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNetworkStatus).mockReturnValue({
      isOnline: true,
      connectionType: '4g',
      since: new Date(),
    })
    vi.mocked(useAuth).mockReturnValue({
      user: { staffId: 'OFF001' },
    } as unknown as ReturnType<typeof useAuth>)
    vi.mocked(useSync).mockReturnValue({
      updatePendingCount: vi.fn(),
    } as unknown as ReturnType<typeof useSync>)
    vi.mocked(useToast).mockReturnValue({
      showToast: vi.fn(),
      dismissToast: vi.fn(),
    })
  })

  it('validates only the current step before continuing', () => {
    const { result } = renderHook(() => useNewSavingsAccount())

    act(() => {
      result.current.nextStep()
    })

    expect(result.current.errors.firstName).toBe('First name is required')
    expect(result.current.errors.dateOfBirth).toBe('Date of birth is required')
    expect(result.current.errors.bvn).toBeUndefined()
    expect(result.current.currentStep).toBe(1)
  })

  it('advances and preserves data when going back', () => {
    const { result } = renderHook(() => useNewSavingsAccount())

    act(() => {
      result.current.updateField('branch', 'OGBA001')
      result.current.updateField('firstName', 'Ada')
      result.current.updateField('surname', 'Okafor')
      result.current.updateField('gender', 'Female')
      result.current.updateField('dateOfBirth', '01/01/1990')
      result.current.nextStep()
      result.current.updateField('phoneNumber', '08012345678')
      result.current.updateField('bvn', '12345678901')
      result.current.updateField('nextOfKinName', 'John Okafor')
      result.current.previousStep()
    })

    expect(result.current.currentStep).toBe(1)
    expect(result.current.formData.firstName).toBe('Ada')
    expect(result.current.formData.phoneNumber).toBe('08012345678')
  })

  it('validates BVN must be exactly 11 digits on step 2', () => {
    const { result } = renderHook(() => useNewSavingsAccount())

    act(() => {
      result.current.updateField('branch', 'OGBA001')
      result.current.updateField('firstName', 'Ada')
      result.current.updateField('surname', 'Okafor')
      result.current.updateField('gender', 'Female')
      result.current.updateField('dateOfBirth', '01/01/1990')
    })

    act(() => {
      result.current.nextStep()
    })

    act(() => {
      result.current.updateField('phoneNumber', '08012345678')
      result.current.updateField('bvn', '12345')
      result.current.updateField('nextOfKinName', 'John Okafor')
    })

    act(() => {
      result.current.nextStep()
    })

    expect(result.current.errors.bvn).toBe('BVN must be exactly 11 digits')
    expect(result.current.currentStep).toBe(2)
  })

  it('creates the account successfully online', async () => {
    const showToast = vi.fn()
    vi.mocked(useToast).mockReturnValue({ showToast, dismissToast: vi.fn() })
    vi.mocked(createSavingsAccount).mockResolvedValue({
      accountNumber: '1234567890',
      accountName: 'Okafor Ada',
      status: 'POSTED',
    })

    const { result } = renderHook(() => useNewSavingsAccount())

    act(() => {
      result.current.updateField('branch', 'OGBA001')
      result.current.updateField('firstName', 'Ada')
      result.current.updateField('otherName', 'Ngozi')
      result.current.updateField('surname', 'Okafor')
      result.current.updateField('gender', 'Female')
      result.current.updateField('dateOfBirth', '01/01/1990')
      result.current.nextStep()
      result.current.updateField('homeAddress', '1 Main St')
      result.current.updateField('phoneNumber', '08012345678')
      result.current.updateField('bvn', '12345678901')
      result.current.updateField('nextOfKinName', 'John Okafor')
      result.current.nextStep()
      result.current.updateField('productId', '1')
      result.current.updateField('initialDeposit', '5000')
    })

    await act(async () => {
      await result.current.submit()
    })

    expect(createSavingsAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        branch: 'OGBA001',
        firstName: 'Ada',
        initialDeposit: 500000,
        officerId: 'OFF001',
      })
    )
    expect(showToast).toHaveBeenCalledWith({
      message: 'Account created successfully. Account Number: 1234567890',
      type: 'success',
    })
    expect(result.current.successData).toEqual({ accountNumber: '1234567890' })
  })

  it('queues the submission when offline', async () => {
    vi.mocked(useNetworkStatus).mockReturnValue({
      isOnline: false,
      connectionType: 'unknown',
      since: new Date(),
    })

    const showToast = vi.fn()
    vi.mocked(useToast).mockReturnValue({ showToast, dismissToast: vi.fn() })

    const updatePendingCount = vi.fn()
    vi.mocked(useSync).mockReturnValue({
      updatePendingCount,
    } as unknown as ReturnType<typeof useSync>)

    vi.mocked(addToQueue).mockResolvedValue(undefined)
    vi.mocked(getPendingCount).mockResolvedValue(3)

    const { result } = renderHook(() => useNewSavingsAccount())

    act(() => {
      result.current.updateField('branch', 'OGBA001')
      result.current.updateField('firstName', 'Ada')
      result.current.updateField('surname', 'Okafor')
      result.current.updateField('gender', 'Female')
      result.current.updateField('dateOfBirth', '01/01/1990')
      result.current.nextStep()
      result.current.updateField('phoneNumber', '08012345678')
      result.current.updateField('bvn', '12345678901')
      result.current.updateField('nextOfKinName', 'John Okafor')
      result.current.nextStep()
      result.current.updateField('productId', '1')
      result.current.updateField('initialDeposit', '5000')
    })

    await act(async () => {
      await result.current.submit()
    })

    expect(addToQueue).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'NewSavingsAccount',
        status: 'PENDING',
      })
    )
    expect(updatePendingCount).toHaveBeenCalledWith(3)
    expect(showToast).toHaveBeenCalledWith({
      message: 'Saved offline. Will sync when online.',
      type: 'warning',
    })
  })
})
