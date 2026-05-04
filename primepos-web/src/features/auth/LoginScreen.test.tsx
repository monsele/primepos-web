import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '../../contexts/AuthContext'
import LoginScreen from './LoginScreen'

vi.mock('../../api/auth', () => ({
  login: vi.fn(),
}))

import { login as loginApi } from '../../api/auth'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('LoginScreen', () => {
  beforeEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
    vi.mocked(loginApi).mockResolvedValue({
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
    })
  })

  it('renders login form with brand and inputs', () => {
    render(<LoginScreen />, { wrapper })
    expect(screen.getByText('PrimePOS')).toBeInTheDocument()
    expect(screen.getByText('Mobile Teller Platform')).toBeInTheDocument()
    expect(screen.getByLabelText('Staff ID / Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    render(<LoginScreen />, { wrapper })
    const form = document.querySelector('form')!
    fireEvent.submit(form)
    await waitFor(() => {
      expect(screen.getAllByText('Required').length).toBeGreaterThanOrEqual(2)
    })
  })

  it('toggles password visibility', () => {
    render(<LoginScreen />, { wrapper })
    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'password')

    fireEvent.click(screen.getByRole('button', { name: /show password/i }))
    expect(passwordInput).toHaveAttribute('type', 'text')

    fireEvent.click(screen.getByRole('button', { name: /hide password/i }))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows loading state during login', async () => {
    vi.useFakeTimers()
    vi.mocked(loginApi).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
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
      }), 500))
    )

    render(<LoginScreen />, { wrapper })
    fireEvent.change(screen.getByLabelText('Staff ID / Username'), {
      target: { value: 'YB101375' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    // Immediately after click, loading state should be active
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled()

    vi.advanceTimersByTime(600)

    vi.useRealTimers()
  })

  it('shows error message on invalid login', async () => {
    vi.mocked(loginApi).mockRejectedValue(new Error('Invalid credentials'))

    render(<LoginScreen />, { wrapper })
    fireEvent.change(screen.getByLabelText('Staff ID / Username'), {
      target: { value: 'wrong' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials')
    })
  })
})
