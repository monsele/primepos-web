import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChangePassword } from './useChangePassword'
import * as auth from '../../api/auth'

vi.mock('../../api/auth')

describe('useChangePassword', () => {
  const mockChangePassword = vi.spyOn(auth, 'changePassword')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns initial state', () => {
    const { result } = renderHook(() => useChangePassword())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.errors).toEqual({})
  })

  it('validates required fields', async () => {
    const { result } = renderHook(() => useChangePassword())

    let response: { success: boolean; error?: string }
    await act(async () => {
      response = await result.current.handleChangePassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    })

    expect(response!.success).toBe(false)
    expect(result.current.errors.currentPassword).toBe('Current password is required')
    expect(result.current.errors.newPassword).toBe('New password is required')
    expect(result.current.errors.confirmPassword).toBe(
      'Please confirm your new password',
    )
  })

  it('validates password minimum length', async () => {
    const { result } = renderHook(() => useChangePassword())

    await act(async () => {
      await result.current.handleChangePassword({
        currentPassword: 'current',
        newPassword: 'short',
        confirmPassword: 'short',
      })
    })

    expect(result.current.errors.newPassword).toBe(
      'Password must be at least 8 characters',
    )
  })

  it('validates password match', async () => {
    const { result } = renderHook(() => useChangePassword())

    await act(async () => {
      await result.current.handleChangePassword({
        currentPassword: 'current',
        newPassword: 'newpassword',
        confirmPassword: 'different',
      })
    })

    expect(result.current.errors.confirmPassword).toBe('Passwords do not match')
  })

  it('calls API on valid data', async () => {
    mockChangePassword.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useChangePassword())

    let response: { success: boolean; error?: string }
    await act(async () => {
      response = await result.current.handleChangePassword({
        currentPassword: 'currentpass',
        newPassword: 'newpassword',
        confirmPassword: 'newpassword',
      })
    })

    expect(mockChangePassword).toHaveBeenCalledWith({
      currentPassword: 'currentpass',
      newPassword: 'newpassword',
    })
    expect(response!.success).toBe(true)
  })

  it('handles API error', async () => {
    mockChangePassword.mockRejectedValueOnce(new Error('Current password is incorrect'))

    const { result } = renderHook(() => useChangePassword())

    await act(async () => {
      await result.current.handleChangePassword({
        currentPassword: 'wrong',
        newPassword: 'newpassword',
        confirmPassword: 'newpassword',
      })
    })

    expect(result.current.errors.general).toBe('Current password is incorrect')
  })

  it('clears errors', () => {
    const { result } = renderHook(() => useChangePassword())

    act(() => {
      result.current.clearErrors()
    })

    expect(result.current.errors).toEqual({})
  })

  it('sets loading state during API call', async () => {
    let resolvePromise: () => void
    mockChangePassword.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolvePromise = resolve
        }),
    )

    const { result } = renderHook(() => useChangePassword())

    act(() => {
      result.current.handleChangePassword({
        currentPassword: 'currentpass',
        newPassword: 'newpassword',
        confirmPassword: 'newpassword',
      })
    })

    expect(result.current.isLoading).toBe(true)

    await act(async () => {
      resolvePromise!()
    })

    expect(result.current.isLoading).toBe(false)
  })
})