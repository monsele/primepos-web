import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AccountCard } from './AccountCard'
import type { Account } from '../../types/account'

describe('AccountCard', () => {
  it('renders account details with correct formatting', () => {
    const account: Account = {
      accountNumber: '12345',
      accountName: 'Test User',
      bookBalance: 5_000_000,
      usableBalance: 4_500_000,
      branchId: 'BR001',
    }

    render(<AccountCard account={account} />)

    expect(screen.getByText('Account Found')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('₦50,000.00')).toBeInTheDocument()
    expect(screen.getByText('₦45,000.00')).toBeInTheDocument()
    expect(screen.getByTestId('account-card')).toBeInTheDocument()
  })
})
