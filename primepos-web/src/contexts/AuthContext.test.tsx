import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider } from './AuthContext'
import { useAuth } from './useAuth'
import { authReducer, initialState } from './authReducer'
import type { AuthState, AuthAction, Officer } from '../types/auth'

const mockOfficer: Officer = {
  staffId: 'YB101375',
  name: 'Yahaya Ahmed',
  email: '',
  mobile: '09034584045',
  branchId: 'OGBA001',
  branchName: 'Ogba Branch',
  department: 'Credit & Outreach Unit',
  tillAccount: '00711100010031',
  role: 'Loan Officer',
}

describe('authReducer', () => {
  it('handles LOGIN_START', () => {
    const action: AuthAction = { type: 'LOGIN_START' }
    const state = authReducer(initialState, action)
    expect(state.isLoading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('handles LOGIN_SUCCESS', () => {
    const action: AuthAction = {
      type: 'LOGIN_SUCCESS',
      payload: { user: mockOfficer, token: 'mock-token' },
    }
    const state = authReducer(initialState, action)
    expect(state.isLoading).toBe(false)
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(mockOfficer)
    expect(state.token).toBe('mock-token')
    expect(state.error).toBeNull()
  })

  it('handles LOGIN_FAILURE', () => {
    const action: AuthAction = { type: 'LOGIN_FAILURE', payload: 'Invalid credentials' }
    const state = authReducer({ ...initialState, isLoading: true }, action)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBe('Invalid credentials')
    expect(state.isAuthenticated).toBe(false)
  })

  it('handles LOGOUT', () => {
    const loggedInState: AuthState = {
      ...initialState,
      isAuthenticated: true,
      user: mockOfficer,
      token: 'mock-token',
    }
    const action: AuthAction = { type: 'LOGOUT' }
    const state = authReducer(loggedInState, action)
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('handles CLEAR_ERROR', () => {
    const errorState: AuthState = { ...initialState, error: 'Some error' }
    const action: AuthAction = { type: 'CLEAR_ERROR' }
    const state = authReducer(errorState, action)
    expect(state.error).toBeNull()
  })
})

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
  })

  it('returns auth state and actions inside AuthProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()

    act(() => {
      result.current.login(mockOfficer, 'token')
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockOfficer)

    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })
})
