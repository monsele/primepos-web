import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ServicesMenuScreen from './ServicesMenuScreen'

vi.mock('../../contexts/NavigationContext', () => ({
  useNavigation: vi.fn(),
}))

import { useNavigation } from '../../contexts/NavigationContext'

describe('ServicesMenuScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigation).mockReturnValue({
      navigateTo: vi.fn(),
      goBack: vi.fn(),
      replace: vi.fn(),
      currentScreen: 'servicesMenu',
      screenHistory: [],
      transitionDirection: 'none',
      isInnerScreen: false,
    })
  })

  it('renders services menu screen', () => {
    render(<ServicesMenuScreen />)
    expect(screen.getByTestId('services-menu-screen')).toBeInTheDocument()
  })

  it('renders INQUIRIES group with Loan Inquiry', () => {
    render(<ServicesMenuScreen />)
    expect(screen.getByText('INQUIRIES')).toBeInTheDocument()
    expect(screen.getByText('Loan Inquiry')).toBeInTheDocument()
    expect(screen.getByText('Account Balance')).toBeInTheDocument()
    expect(screen.getByText('Account Statement')).toBeInTheDocument()
  })

  it('filters items when searching', () => {
    render(<ServicesMenuScreen />)

    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'loan' } })

    expect(screen.getByText('Loan Inquiry')).toBeInTheDocument()
    expect(screen.queryByText('Account Balance')).not.toBeInTheDocument()
  })

  it('shows empty state when no matches', () => {
    render(<ServicesMenuScreen />)

    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'xyz' } })

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('navigates to Loan Inquiry when selected', () => {
    const navigateTo = vi.fn()
    vi.mocked(useNavigation).mockReturnValue({
      navigateTo,
      goBack: vi.fn(),
      replace: vi.fn(),
      currentScreen: 'servicesMenu',
      screenHistory: [],
      transitionDirection: 'none',
      isInnerScreen: false,
    })

    render(<ServicesMenuScreen />)

    const loanInquiryButton = screen.getByText('Loan Inquiry').closest('button')
    if (loanInquiryButton) {
      fireEvent.click(loanInquiryButton)
    }

    expect(navigateTo).toHaveBeenCalledWith('loanInquiry')
  })
})
