import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuickActions, quickActions } from './QuickActions'
import * as NavigationContext from '../../contexts/NavigationContext'

describe('QuickActions', () => {
  const mockNavigateTo = vi.fn()

  beforeEach(() => {
    mockNavigateTo.mockClear()
    vi.spyOn(NavigationContext, 'useNavigation').mockReturnValue({
      navigateTo: mockNavigateTo,
      goBack: vi.fn(),
      replace: vi.fn(),
      currentScreen: 'dashboard',
      screenHistory: [],
      transitionDirection: 'none',
      isInnerScreen: false,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders 4 quick action cards in a grid', () => {
    render(<QuickActions />)

    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()

    quickActions.forEach((action) => {
      expect(screen.getByTestId(`quick-action-${action.id}`)).toBeInTheDocument()
    })
  })

  it('renders correct labels and subtitles for each action', () => {
    render(<QuickActions />)

    quickActions.forEach((action) => {
      const card = screen.getByTestId(`quick-action-${action.id}`)
      expect(card).toHaveTextContent(action.label)
      expect(card).toHaveTextContent(action.subtitle)
    })
  })

  it('renders correct icons for each action', () => {
    render(<QuickActions />)

    quickActions.forEach((action) => {
      const card = screen.getByTestId(`quick-action-${action.id}`)
      expect(card).toHaveTextContent(action.icon)
    })
  })

  it('navigates to the correct screen when a card is tapped', async () => {
    const user = userEvent.setup()
    render(<QuickActions />)

    const cashInCard = screen.getByTestId('quick-action-cash-in')
    await user.click(cashInCard)
    expect(mockNavigateTo).toHaveBeenCalledWith('cashIn')

    const cashOutCard = screen.getByTestId('quick-action-cash-out')
    await user.click(cashOutCard)
    expect(mockNavigateTo).toHaveBeenCalledWith('cashOut')

    const loanRepayCard = screen.getByTestId('quick-action-loan-repay')
    await user.click(loanRepayCard)
    expect(mockNavigateTo).toHaveBeenCalledWith('loanRepayment')

    const newAccountCard = screen.getByTestId('quick-action-new-account')
    await user.click(newAccountCard)
    expect(mockNavigateTo).toHaveBeenCalledWith('newAccount')
  })

  it('has accessible labels on each card', () => {
    render(<QuickActions />)

    quickActions.forEach((action) => {
      const card = screen.getByTestId(`quick-action-${action.id}`)
      expect(card).toHaveAttribute('aria-label', `${action.label}: ${action.subtitle}`)
    })
  })
})
