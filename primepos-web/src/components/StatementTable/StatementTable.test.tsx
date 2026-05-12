import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatementTable } from './StatementTable'

describe('StatementTable', () => {
  it('renders debit and credit values with blanks for null amounts', () => {
    render(
      <StatementTable
        entries={[
          {
            date: '2026-05-01T09:15:00Z',
            description: 'Opening Balance',
            debit: null,
            credit: 250_000,
            balance: 250_000,
          },
          {
            date: '2026-05-02T13:42:00Z',
            description: 'Cash Withdrawal',
            debit: 50_000,
            credit: null,
            balance: 200_000,
          },
        ]}
      />
    )

    expect(screen.getByText('Opening Balance')).toBeInTheDocument()
    expect(screen.getByText('Cash Withdrawal')).toBeInTheDocument()
    expect(screen.getAllByText('₦2,500.00')).toHaveLength(2)
    expect(screen.getByText('₦500.00')).toBeInTheDocument()
    expect(screen.getAllByText('₦2,000.00')).toHaveLength(1)
  })
})
