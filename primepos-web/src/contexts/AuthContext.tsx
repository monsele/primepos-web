import { useReducer, useCallback, type ReactNode } from 'react'
import { authReducer, initialState } from './authReducer'
import { AuthContext } from './authContextValue'
import type { Officer } from '../types/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const startLogin = useCallback(() => {
    dispatch({ type: 'LOGIN_START' })
  }, [])

  const login = useCallback((user: Officer, token: string) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } })
  }, [])

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
  }, [])

  const setError = useCallback((message: string) => {
    dispatch({ type: 'LOGIN_FAILURE', payload: message })
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        startLogin,
        login,
        logout,
        setError,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
