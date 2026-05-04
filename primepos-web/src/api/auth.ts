// import { apiClient } from './client'
import type { LoginRequest, LoginResponse } from '../types/auth'

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  // Simulate API delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock validation for development/testing
  if (credentials.staffId === 'YB101375' && credentials.password === 'password') {
    return {
      accessToken: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
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
  }

  throw new Error('Invalid credentials. Please try again.')
}

// Future: real API call
// export async function login(credentials: LoginRequest): Promise<LoginResponse> {
//   return apiClient<LoginResponse>('/auth/login', {
//     method: 'POST',
//     body: JSON.stringify(credentials),
//   })
// }
