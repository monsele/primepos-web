import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BottomNav } from './BottomNav'
import { useNavigation } from '../../contexts/NavigationContext'

vi.mock('../../contexts/NavigationContext')

describe('BottomNav', () => {
  const mockNavigateTo = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigation).mockReturnValue({
      currentScreen: 'dashboard',
      screenHistory: [],
      transitionDirection: 'none',
      navigateTo: mockNavigateTo,
      goBack: vi.fn(),
      replace: vi.fn(),
      isInnerScreen: false,
    })
  })

  it('renders 5 tabs', () => {
    render(<BottomNav />)
    expect(screen.getByRole('tab', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Transact' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Services' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Reports' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'More' })).toBeInTheDocument()
  })

  it('highlights active tab', () => {
    render(<BottomNav />)
    const homeTab = screen.getByRole('tab', { name: 'Home' })
    expect(homeTab).toHaveAttribute('aria-selected', 'true')
    expect(homeTab.className).toContain('active')
  })

  it('shows muted state for inactive tabs', () => {
    render(<BottomNav />)
    const transactTab = screen.getByRole('tab', { name: 'Transact' })
    expect(transactTab).toHaveAttribute('aria-selected', 'false')
    expect(transactTab.className).not.toContain('active')
  })

  it('calls navigateTo when a tab is clicked', () => {
    render(<BottomNav />)
    fireEvent.click(screen.getByRole('tab', { name: 'Transact' }))
    expect(mockNavigateTo).toHaveBeenCalledWith('transactMenu')
  })

  it('shows orange dot on active tab', () => {
    render(<BottomNav />)
    const homeTab = screen.getByRole('tab', { name: 'Home' })
    expect(homeTab.querySelector('span[aria-hidden="true"]')).toBeInTheDocument()
  })
})
