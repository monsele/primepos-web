import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

vi.mock('./api/auth', () => ({
  login: vi.fn(),
}))

vi.mock('./hooks/useNetworkStatus', () => ({
  useNetworkStatus: vi.fn(() => ({
    isOnline: true,
    connectionType: '4g',
    since: new Date(),
  })),
}))

import { login as loginApi } from './api/auth'

describe('App Login Flow', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.useRealTimers()
    vi.mocked(loginApi).mockResolvedValue({
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
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
    })
  })

  it('logs in with correct credentials and shows dashboard', async () => {
    render(<App />)

    // Should start on login screen
    expect(screen.getByText('Sign In to Your Account')).toBeInTheDocument()

    // Fill credentials
    fireEvent.change(screen.getByLabelText('Staff ID / Username'), {
      target: { value: 'YB101375' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password' },
    })

    // Click sign in
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    // Wait for dashboard to appear
    await waitFor(
      () => {
        expect(screen.getByText('Welcome, Yahaya Ahmed')).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // Dashboard elements should be visible
    expect(screen.getByText('Online')).toBeInTheDocument()
    expect(screen.getByText('Connected — All features available')).toBeInTheDocument()
  })

  it('shows error and stays on login screen with wrong credentials', async () => {
    vi.mocked(loginApi).mockRejectedValue(new Error('Invalid credentials. Please try again.'))

    render(<App />)

    fireEvent.change(screen.getByLabelText('Staff ID / Username'), {
      target: { value: 'wrong' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    // Wait for error to appear
    await waitFor(
      () => {
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials')
      },
      { timeout: 3000 }
    )

    // Should still be on login screen
    expect(screen.getByText('Sign In to Your Account')).toBeInTheDocument()
  })
})
