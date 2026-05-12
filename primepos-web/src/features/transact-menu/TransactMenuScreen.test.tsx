import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TransactMenuScreen from './TransactMenuScreen'

vi.mock('../../contexts/NavigationContext', () => ({
  useNavigation: vi.fn(),
}))

import { useNavigation } from '../../contexts/NavigationContext'

describe('TransactMenuScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigation).mockReturnValue({
      navigateTo: vi.fn(),
      goBack: vi.fn(),
      replace: vi.fn(),
      currentScreen: 'transactMenu',
      screenHistory: [],
      transitionDirection: 'none',
      isInnerScreen: false,
    })
  })

  it('renders transact menu screen', () => {
    render(<TransactMenuScreen />)
    expect(screen.getByTestId('transact-menu-screen')).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<TransactMenuScreen />)
    expect(screen.getByTestId('search-input')).toBeInTheDocument()
  })

  it('renders CASH group with items', () => {
    render(<TransactMenuScreen />)
    expect(screen.getByText('CASH')).toBeInTheDocument()
    expect(screen.getByText('Cash In')).toBeInTheDocument()
    expect(screen.getByText('Cash Out')).toBeInTheDocument()
    expect(screen.getByText('New Account Deposit')).toBeInTheDocument()
    expect(screen.getByText('Batch BBLS Deposit')).toBeInTheDocument()
  })

  it('renders CARD group with items', () => {
    render(<TransactMenuScreen />)
    expect(screen.getByText('CARD')).toBeInTheDocument()
    expect(screen.getByText('Card Transactions')).toBeInTheDocument()
  })

  it('filters items when searching', () => {
    render(<TransactMenuScreen />)

    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'cash' } })

    expect(screen.getByText('Cash In')).toBeInTheDocument()
    expect(screen.getByText('Cash Out')).toBeInTheDocument()
    expect(screen.queryByText('Card Transactions')).not.toBeInTheDocument()
  })

  it('filters by subtitle', () => {
    render(<TransactMenuScreen />)

    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'pos' } })

    expect(screen.getByText('Card Transactions')).toBeInTheDocument()
    expect(screen.queryByText('Cash In')).not.toBeInTheDocument()
  })

  it('hides empty groups when filtering', () => {
    render(<TransactMenuScreen />)

    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'card' } })

    expect(screen.queryByText('CASH')).not.toBeInTheDocument()
    expect(screen.getByText('CARD')).toBeInTheDocument()
  })

  it('shows empty state when no matches', () => {
    render(<TransactMenuScreen />)

    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'xyz' } })

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('navigates to target screen when menu item clicked', () => {
    const navigateTo = vi.fn()
    vi.mocked(useNavigation).mockReturnValue({
      navigateTo,
      goBack: vi.fn(),
      replace: vi.fn(),
      currentScreen: 'transactMenu',
      screenHistory: [],
      transitionDirection: 'none',
      isInnerScreen: false,
    })

    render(<TransactMenuScreen />)

    const cashInButton = screen.getByText('Cash In').closest('button')
    if (cashInButton) {
      fireEvent.click(cashInButton)
    }

    expect(navigateTo).toHaveBeenCalledWith('cashIn')
  })
})
