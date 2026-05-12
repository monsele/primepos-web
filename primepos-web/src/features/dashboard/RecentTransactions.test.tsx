import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecentTransactions } from './RecentTransactions'
import type { Transaction } from '../../types/transaction'

const mockTransactions: Transaction[] = [
  {
    id: '1',
    customerName: 'Adediran Blessing',
    type: 'Cash In',
    amount: 500000,
    status: 'POSTED',
    createdAt: '2026-05-02T10:42:00Z',
  },
  {
    id: '2',
    customerName: 'Adejumo Olusegun',
    type: 'Loan Repay',
    amount: 1250000,
    status: 'PENDING',
    createdAt: '2026-05-02T10:18:00Z',
  },
]

describe('RecentTransactions', () => {
  it('renders section title', () => {
    render(<RecentTransactions transactions={mockTransactions} />)
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
  })

  it('renders transaction items with correct data', () => {
    render(<RecentTransactions transactions={mockTransactions} />)
    expect(screen.getByText('Adediran Blessing')).toBeInTheDocument()
    expect(screen.getByText('Adejumo Olusegun')).toBeInTheDocument()
    expect(screen.getAllByTestId('transaction-item')).toHaveLength(2)
  })

  it('caps list at 5 transactions', () => {
    const many = Array.from({ length: 10 }, (_, i) => ({
      ...mockTransactions[0],
      id: String(i + 1),
    }))
    render(<RecentTransactions transactions={many} />)
    expect(screen.getAllByTestId('transaction-item')).toHaveLength(5)
  })

  it('shows empty state when no transactions', () => {
    render(<RecentTransactions transactions={[]} />)
    expect(screen.getByText('No transactions yet')).toBeInTheDocument()
  })

  it('shows empty state when transactions is undefined', () => {
    render(<RecentTransactions transactions={undefined} />)
    expect(screen.getByText('No transactions yet')).toBeInTheDocument()
  })

  it('shows error state when error is provided', () => {
    render(<RecentTransactions transactions={[]} error={new Error('Network failed')} />)
    expect(screen.getByText('Unable to load transactions')).toBeInTheDocument()
  })

  it('shows loading state when isLoading is true', () => {
    render(<RecentTransactions transactions={[]} isLoading />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders status badges for each transaction', () => {
    render(<RecentTransactions transactions={mockTransactions} />)
    expect(screen.getByTestId('status-badge-posted')).toBeInTheDocument()
    expect(screen.getByTestId('status-badge-pending')).toBeInTheDocument()
  })

  it('renders avatars for each transaction', () => {
    render(<RecentTransactions transactions={mockTransactions} />)
    expect(screen.getByLabelText(/Avatar for Adediran Blessing/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Avatar for Adejumo Olusegun/i)).toBeInTheDocument()
  })
})
