import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CardTransactionsScreen from './CardTransactionsScreen'

describe('CardTransactionsScreen', () => {
  it('renders 4 card transaction options and info banner', () => {
    render(<CardTransactionsScreen />)

    // Check info banner
    expect(screen.getByText('POS Terminal Required. Please connect a POS terminal device to use card transactions.')).toBeInTheDocument()

    // Check 4 menu options
    expect(screen.getByText('Card Deposit')).toBeInTheDocument()
    expect(screen.getByText('Card Withdrawal')).toBeInTheDocument()
    expect(screen.getByText('Card Balance Check')).toBeInTheDocument()
    expect(screen.getByText('Card Statement')).toBeInTheDocument()
  })
})