import { createContext } from 'react'
import type { Officer } from '../types/auth'

interface AuthStateContext {
  user: Officer | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthContextValue extends AuthStateContext {
  startLogin: () => void
  login: (user: Officer, token: string) => void
  logout: () => void
  setError: (message: string) => void
  clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
