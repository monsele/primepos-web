import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MenuScreen from './MenuScreen'
import { useAuth } from '../../contexts/useAuth'
import { useNavigation } from '../../contexts/NavigationContext'
import { useSync } from '../../contexts/useSync'

vi.mock('../../contexts/useAuth')
vi.mock('../../contexts/NavigationContext')
vi.mock('../../contexts/useSync')

const mockOfficer = {
  staffId: 'STF001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  mobile: '08012345678',
  branchId: 'BR001',
  branchName: 'Main Branch',
  department: 'Operations',
  tillAccount: 'TILL-001',
  role: 'Officer',
}

describe('MenuScreen', () => {
  const mockNavigateTo = vi.fn()
  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockOfficer,
      logout: mockLogout,
    })
    ;(useNavigation as ReturnType<typeof vi.fn>).mockReturnValue({
      navigateTo: mockNavigateTo,
    })
    ;(useSync as ReturnType<typeof vi.fn>).mockReturnValue({
      pendingCount: 5,
    })
  })

  it('renders officer card with officer data', () => {
    render(<MenuScreen />)
    expect(screen.getByTestId('officer-card')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders offline data section', () => {
    render(<MenuScreen />)
    expect(screen.getByText('Offline Data')).toBeInTheDocument()
    expect(screen.getByText('Unposted Transactions')).toBeInTheDocument()
    expect(screen.getByText('Better Life Records')).toBeInTheDocument()
    expect(screen.getByText('Portfolio Data')).toBeInTheDocument()
    expect(screen.getByText('Groups')).toBeInTheDocument()
    expect(screen.getByText('Loan Records')).toBeInTheDocument()
  })

  it('renders settings section', () => {
    render(<MenuScreen />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('My Profile')).toBeInTheDocument()
    expect(screen.getByText('Change Password')).toBeInTheDocument()
    expect(screen.getByText('Sync Data')).toBeInTheDocument()
    expect(screen.getByText('App Settings')).toBeInTheDocument()
  })

  it('renders sign out button', () => {
    render(<MenuScreen />)
    expect(screen.getByTestId('sign-out-button')).toBeInTheDocument()
  })

  it('shows pending count badge on Unposted Transactions', () => {
    render(<MenuScreen />)
    expect(screen.getByTestId('badge')).toHaveTextContent('5')
  })

  it('does not show badge when pending count is 0', () => {
    ;(useSync as ReturnType<typeof vi.fn>).mockReturnValue({
      pendingCount: 0,
    })
    render(<MenuScreen />)
    expect(screen.queryByTestId('badge')).not.toBeInTheDocument()
  })

  it('navigates when menu item is clicked', () => {
    render(<MenuScreen />)
    fireEvent.click(screen.getByText('Better Life Records'))
    expect(mockNavigateTo).toHaveBeenCalledWith('betterLife')
  })

  it('navigates to unposted transactions when clicked', () => {
    render(<MenuScreen />)
    fireEvent.click(screen.getByText('Unposted Transactions'))
    expect(mockNavigateTo).toHaveBeenCalledWith('unpostedTransactions')
  })

  it('navigates to profile when My Profile is clicked', () => {
    render(<MenuScreen />)
    fireEvent.click(screen.getByText('My Profile'))
    expect(mockNavigateTo).toHaveBeenCalledWith('profile')
  })

  it('shows confirmation dialog when sign out button is clicked', () => {
    render(<MenuScreen />)
    fireEvent.click(screen.getByTestId('sign-out-button'))
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to sign out?')).toBeInTheDocument()
  })

  it('calls logout when confirmed in dialog', () => {
    render(<MenuScreen />)
    fireEvent.click(screen.getByTestId('sign-out-button'))
    const buttons = screen.getAllByText('Sign Out')
    fireEvent.click(buttons[buttons.length - 1])
    expect(mockLogout).toHaveBeenCalled()
  })

  it('returns null when user is not available', () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      logout: mockLogout,
    })
    const { container } = render(<MenuScreen />)
    expect(container.firstChild).toBeNull()
  })
})