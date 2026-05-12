import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNewAccountDeposit } from './useNewAccountDeposit'

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

vi.mock('../../api/accounts', () => ({
  createAccountWithDeposit: vi.fn(),
}))

vi.mock('../../services/storage/queue', () => ({
  addToQueue: vi.fn(),
  getPendingCount: vi.fn(),
}))

import { createAccountWithDeposit } from '../../api/accounts'
import { addToQueue, getPendingCount } from '../../services/storage/queue'
import { useToast } from '../../components/Toast/useToast'
import { useSync } from '../../contexts/useSync'
import { useAuth } from '../../contexts/useAuth'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'

describe('useNewAccountDeposit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNetworkStatus).mockReturnValue({ isOnline: true, connectionType: '4g', since: new Date() })
    vi.mocked(useAuth).mockReturnValue({ user: { staffId: 'OFF001' } } as unknown as ReturnType<typeof useAuth>)
    vi.mocked(useSync).mockReturnValue({ updatePendingCount: vi.fn() } as unknown as ReturnType<typeof useSync>)
    vi.mocked(useToast).mockReturnValue({ showToast: vi.fn(), dismissToast: vi.fn() })
  })

  it('validates empty fields', async () => {
    const { result } = renderHook(() => useNewAccountDeposit())

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.errors.firstName).toBe('First name is required')
    expect(result.current.errors.surname).toBe('Surname is required')
    expect(result.current.errors.bvn).toBe('BVN is required')
    expect(result.current.errors.gender).toBe('Gender is required')
    expect(result.current.errors.productId).toBe('Product is required')
    expect(result.current.errors.initialDeposit).toBe('Initial deposit is required')
  })

  it('validates BVN must be 11 digits', async () => {
    const { result } = renderHook(() => useNewAccountDeposit())

    act(() => {
      result.current.setBvn('123')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.errors.bvn).toBe('BVN must be 11 digits')
  })

  it('validates amount must be greater than 0', async () => {
    const { result } = renderHook(() => useNewAccountDeposit())

    act(() => {
      result.current.setInitialDeposit('0')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.errors.initialDeposit).toBe('Amount must be greater than 0')
  })

  it('validates non-numeric amount', async () => {
    const { result } = renderHook(() => useNewAccountDeposit())

    act(() => {
      result.current.setInitialDeposit('abc')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.errors.initialDeposit).toBe('Enter a valid amount')
  })

  it('accepts valid comma-separated amount', async () => {
    const { result } = renderHook(() => useNewAccountDeposit())

    act(() => {
      result.current.setFirstName('John')
      result.current.setSurname('Doe')
      result.current.setBvn('12345678901')
      result.current.setGender('Male')
      result.current.setProductId('1')
      result.current.setInitialDeposit('1,000')
    })

    vi.mocked(createAccountWithDeposit).mockResolvedValue({
      accountNumber: 'ACC-1',
      accountName: 'Doe John',
      nuban: '1234567890',
      depositStatus: 'POSTED',
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(createAccountWithDeposit).toHaveBeenCalledWith(
      expect.objectContaining({ initialDeposit: 100000 })
    )
  })

  it('creates account successfully online', async () => {
    vi.mocked(createAccountWithDeposit).mockResolvedValue({
      accountNumber: 'ACC-1',
      accountName: 'Doe John',
      nuban: '9876543210',
      depositStatus: 'POSTED',
    })

    const showToast = vi.fn()
    vi.mocked(useToast).mockReturnValue({ showToast, dismissToast: vi.fn() })

    const { result } = renderHook(() => useNewAccountDeposit())

    act(() => {
      result.current.setFirstName('John')
      result.current.setSurname('Doe')
      result.current.setBvn('12345678901')
      result.current.setGender('Male')
      result.current.setProductId('1')
      result.current.setInitialDeposit('5000')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(createAccountWithDeposit).toHaveBeenCalledWith({
      firstName: 'John',
      surname: 'Doe',
      otherName: '',
      gender: 'Male',
      bvn: '12345678901',
      productId: '1',
      initialDeposit: 500000,
      officerId: 'OFF001',
    })
    expect(showToast).toHaveBeenCalledWith({
      message: 'Account created successfully. Account Number: 9876543210',
      type: 'success',
    })
    expect(result.current.successData).toEqual({
      nuban: '9876543210',
      accountName: 'Doe John',
    })
  })

  it('queues transaction when offline', async () => {
    vi.mocked(useNetworkStatus).mockReturnValue({
      isOnline: false,
      connectionType: 'unknown',
      since: new Date(),
    })

    const showToast = vi.fn()
    vi.mocked(useToast).mockReturnValue({ showToast, dismissToast: vi.fn() })

    const updatePendingCount = vi.fn()
    vi.mocked(useSync).mockReturnValue({ updatePendingCount } as unknown as ReturnType<typeof useSync>)

    vi.mocked(addToQueue).mockResolvedValue(undefined)
    vi.mocked(getPendingCount).mockResolvedValue(1)

    const { result } = renderHook(() => useNewAccountDeposit())

    act(() => {
      result.current.setFirstName('Jane')
      result.current.setSurname('Doe')
      result.current.setBvn('12345678901')
      result.current.setGender('Female')
      result.current.setProductId('2')
      result.current.setInitialDeposit('10000')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(addToQueue).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'NewAccountDeposit',
        status: 'PENDING',
      })
    )
    expect(showToast).toHaveBeenCalledWith({
      message: 'Saved offline. Will sync when online.',
      type: 'warning',
    })
    expect(updatePendingCount).toHaveBeenCalledWith(1)
  })

  it('resets form after successful post', async () => {
    vi.mocked(createAccountWithDeposit).mockResolvedValue({
      accountNumber: 'ACC-1',
      accountName: 'Doe John',
      nuban: '9876543210',
      depositStatus: 'POSTED',
    })

    const { result } = renderHook(() => useNewAccountDeposit())

    act(() => {
      result.current.setFirstName('John')
      result.current.setSurname('Doe')
      result.current.setOtherName('Smith')
      result.current.setBvn('12345678901')
      result.current.setGender('Male')
      result.current.setProductId('1')
      result.current.setInitialDeposit('1000')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.form.firstName).toBe('')
    expect(result.current.form.surname).toBe('')
    expect(result.current.form.otherName).toBe('')
    expect(result.current.form.bvn).toBe('')
    expect(result.current.form.gender).toBe('')
    expect(result.current.form.productId).toBe('')
    expect(result.current.form.initialDeposit).toBe('')
  })
})
