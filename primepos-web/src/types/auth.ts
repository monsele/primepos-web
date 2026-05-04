export interface Officer {
  staffId: string
  name: string
  email: string
  mobile: string
  branchId: string
  branchName: string
  department: string
  tillAccount: string
  role: string
}

export interface AuthState {
  user: Officer | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: Officer; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }

export interface LoginRequest {
  staffId: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: Officer
}
