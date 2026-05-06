import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './Header'
import { useNavigation } from '../../contexts/NavigationContext'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'

vi.mock('../../contexts/NavigationContext')
vi.mock('../../hooks/useNetworkStatus')

describe('Header', () => {
  const mockGoBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNetworkStatus).mockReturnValue({
      isOnline: true,
      connectionType: '4g',
      since: new Date(),
    })
  })

  describe('dashboard mode', () => {
    beforeEach(() => {
      vi.mocked(useNavigation).mockReturnValue({
        currentScreen: 'dashboard',
        screenHistory: [],
        transitionDirection: 'none',
        navigateTo: vi.fn(),
        goBack: mockGoBack,
        replace: vi.fn(),
        isInnerScreen: false,
      })
    })

    it('shows brand logo and title', () => {
      render(<Header />)
      expect(screen.getByText('P')).toBeInTheDocument()
      expect(screen.getByText('PrimePOS')).toBeInTheDocument()
      expect(screen.getByText('Mobile Teller Platform')).toBeInTheDocument()
    })

    it('shows ConnectionPill with online status', () => {
      render(<Header />)
      expect(screen.getByText('Online')).toBeInTheDocument()
    })

    it('shows offline ConnectionPill when offline', () => {
      vi.mocked(useNetworkStatus).mockReturnValue({
        isOnline: false,
        connectionType: 'unknown',
        since: new Date(),
      })
      render(<Header />)
      expect(screen.getByText('Offline')).toBeInTheDocument()
    })
  })

  describe('inner screen mode', () => {
    beforeEach(() => {
      vi.mocked(useNavigation).mockReturnValue({
        currentScreen: 'cashIn',
        screenHistory: ['dashboard'],
        transitionDirection: 'push',
        navigateTo: vi.fn(),
        goBack: mockGoBack,
        replace: vi.fn(),
        isInnerScreen: true,
      })
    })

    it('shows back button and screen title', () => {
      render(<Header />)
      expect(screen.getByLabelText('Go back')).toBeInTheDocument()
      expect(screen.getByText('Cash In')).toBeInTheDocument()
    })

    it('calls goBack when back button is clicked', () => {
      render(<Header />)
      fireEvent.click(screen.getByLabelText('Go back'))
      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })

    it('does not show brand elements', () => {
      render(<Header />)
      expect(screen.queryByText('PrimePOS')).not.toBeInTheDocument()
      expect(screen.queryByText('Mobile Teller Platform')).not.toBeInTheDocument()
    })
  })
})
