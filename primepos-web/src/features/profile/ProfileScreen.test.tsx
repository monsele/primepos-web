import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProfileScreen from './ProfileScreen'
import { useAuth } from '../../contexts/useAuth'
import { useNavigation } from '../../contexts/NavigationContext'

vi.mock('../../contexts/useAuth')
vi.mock('../../contexts/NavigationContext')

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

describe('ProfileScreen', () => {
  const mockNavigateTo = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockOfficer,
    })
    ;(useNavigation as ReturnType<typeof vi.fn>).mockReturnValue({
      navigateTo: mockNavigateTo,
    })
  })

  it('renders profile screen with officer details', () => {
    render(<ProfileScreen />)
    
    expect(screen.getByTestId('profile-screen')).toBeInTheDocument()
  })

  it('renders all profile fields from officer data', () => {
    render(<ProfileScreen />)
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Staff ID')).toBeInTheDocument()
    expect(screen.getByText('STF001')).toBeInTheDocument()
    expect(screen.getByText('Mobile')).toBeInTheDocument()
    expect(screen.getByText('08012345678')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    expect(screen.getByText('Branch')).toBeInTheDocument()
    expect(screen.getByText('Main Branch')).toBeInTheDocument()
    expect(screen.getByText('Department')).toBeInTheDocument()
    expect(screen.getByText('Operations')).toBeInTheDocument()
    expect(screen.getByText('Till Account')).toBeInTheDocument()
    expect(screen.getByText('TILL-001')).toBeInTheDocument()
  })

  it('renders system date in DD/MM/YYYY format', () => {
    render(<ProfileScreen />)
    
    const today = new Date()
    const expectedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`
    expect(screen.getByText(expectedDate)).toBeInTheDocument()
  })

  it('renders Change Password button', () => {
    render(<ProfileScreen />)
    
    expect(screen.getByRole('button', { name: 'Change Password' })).toBeInTheDocument()
  })

  it('navigates to change password screen when button clicked', () => {
    render(<ProfileScreen />)
    
    fireEvent.click(screen.getByRole('button', { name: 'Change Password' }))
    expect(mockNavigateTo).toHaveBeenCalledWith('changePassword')
  })

  it('returns null when user is not available', () => {
    ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
    })
    
    const { container } = render(<ProfileScreen />)
    expect(container.firstChild).toBeNull()
  })
})