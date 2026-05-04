import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLogin } from './useLogin'
import { AuthProvider } from '../../contexts/AuthContext'

// Mock the auth API
vi.mock('../../api/auth', () => ({
  login: vi.fn(),
}))

import { login as loginApi } from '../../api/auth'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates empty fields', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.errors.staffId).toBe('Required')
    expect(result.current.errors.password).toBe('Required')
  })

  it('calls API and handles success', async () => {
    const mockResponse = {
      accessToken: 'token',
      refreshToken: 'refresh',
      user: {
        staffId: 'YB101375',
        name: 'Yahaya Ahmed',
        email: '',
        mobile: '09034584045',
        branchId: 'OGBA001',
        branchName: 'Ogba Branch',
        department: 'Credit & Outreach Unit',
        tillAccount: '00711100010031',
        role: 'Loan Officer',
      },
    }
    vi.mocked(loginApi).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useLogin(), { wrapper })

    act(() => {
      result.current.setStaffId('YB101375')
      result.current.setPassword('password')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(loginApi).toHaveBeenCalledWith({ staffId: 'YB101375', password: 'password' })
    expect(result.current.isSubmitting).toBe(false)
  })

  it('handles API failure with shake', async () => {
    vi.useFakeTimers()
    vi.mocked(loginApi).mockRejectedValue(new Error('Invalid credentials'))

    const { result } = renderHook(() => useLogin(), { wrapper })

    act(() => {
      result.current.setStaffId('wrong')
      result.current.setPassword('wrong')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.shake).toBe(true) // shake is active immediately after error

    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(result.current.shake).toBe(false) // shake resets after timeout
    expect(result.current.isSubmitting).toBe(false)

    vi.useRealTimers()
  })

  it('toggles password visibility', () => {
    const { result } = renderHook(() => useLogin(), { wrapper })

    expect(result.current.showPassword).toBe(false)

    act(() => {
      result.current.togglePassword()
    })

    expect(result.current.showPassword).toBe(true)
  })
})
