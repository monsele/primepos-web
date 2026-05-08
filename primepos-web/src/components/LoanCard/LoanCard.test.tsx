import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoanCard } from './LoanCard'
import type { Loan } from '../../types/loan'
import type { GroupLoan } from '../../types/group'

describe('LoanCard', () => {
  it('renders all loan details with correct formatting', () => {
    const loan: Loan = {
      loanNumber: 'LN001',
      customerName: 'Adediran Blessing',
      product: 'Micro Business Loan',
      loanPurpose: 'Working Capital',
      loanAmount: 5_000_000,
      currentBalance: 3_250_000,
      outstandingInterest: 125_000,
      startDate: '2024-01-15',
      maturityDate: '2025-01-15',
      status: 'ACTIVE',
    }

    render(<LoanCard loan={loan} />)

    expect(screen.getByTestId('loan-card')).toBeInTheDocument()
    expect(screen.getByText('Loan Details')).toBeInTheDocument()
    expect(screen.getByText('Adediran Blessing')).toBeInTheDocument()
    expect(screen.getByText('Micro Business Loan')).toBeInTheDocument()
    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    expect(screen.getByText('₦50,000.00')).toBeInTheDocument()
    expect(screen.getByText('₦32,500.00')).toBeInTheDocument()
    expect(screen.getByText('₦1,250.00')).toBeInTheDocument()
    expect(screen.getByText('15/01/2025')).toBeInTheDocument()
    expect(screen.getByText('Working Capital')).toBeInTheDocument()
    expect(screen.getByText('15/01/2024')).toBeInTheDocument()
  })

  it('renders CLOSED status correctly', () => {
    const loan: Loan = {
      loanNumber: 'LN002',
      customerName: 'John Doe',
      product: 'Personal Loan',
      loanPurpose: 'Education',
      loanAmount: 1_000_000,
      currentBalance: 0,
      outstandingInterest: 0,
      startDate: '2023-06-01',
      maturityDate: '2024-06-01',
      status: 'CLOSED',
    }

    render(<LoanCard loan={loan} />)

    expect(screen.getByText('CLOSED')).toBeInTheDocument()
  })

  it('renders group name for group loans', () => {
    const groupLoan: GroupLoan = {
      loanNumber: 'GLN001',
      customerName: 'Group Loan Account',
      product: 'Group Lending Product',
      loanPurpose: 'Working Capital',
      loanAmount: 10_000_000,
      currentBalance: 6_500_000,
      outstandingInterest: 250_000,
      startDate: '2024-02-01',
      maturityDate: '2025-02-01',
      status: 'ACTIVE',
      groupId: 'GRP001',
      groupName: 'Test Group Name',
    }

    render(<LoanCard loan={groupLoan} />)

    expect(screen.getByText('Test Group Name')).toBeInTheDocument()
    expect(screen.getByText('Group Loan Account')).toBeInTheDocument()
  })
})
