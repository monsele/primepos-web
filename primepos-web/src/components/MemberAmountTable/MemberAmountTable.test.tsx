import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import MemberAmountTable from './MemberAmountTable'
import type { GroupMember } from '../../../types/group'

function TestWrapper({ initialMembers }: { initialMembers: GroupMember[] }) {
  const [members, setMembers] = useState(initialMembers)

  const handleAmountChange = (memberId: string, amount: number | null) => {
    setMembers(prev =>
      prev.map(m => m.id === memberId ? { ...m, amount } : m)
    )
  }

  return (
    <MemberAmountTable
      members={members}
      onAmountChange={handleAmountChange}
    />
  )
}

describe('MemberAmountTable', () => {
  const mockMembers: GroupMember[] = [
    {
      id: '1',
      customerName: 'John Doe',
      accountNumber: '1234567890',
      amount: 10000 // 100 naira in kobo
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      accountNumber: '0987654321',
      amount: null
    }
  ]

  it('renders member table with correct data', () => {
    render(<TestWrapper initialMembers={mockMembers} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('1234567890')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('0987654321')).toBeInTheDocument()
    expect(screen.getByDisplayValue('100.00')).toBeInTheDocument()
  })

  it('displays correct total and customer count', () => {
    render(<TestWrapper initialMembers={mockMembers} />)

    expect(screen.getByText('Customers: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: ₦100.00')).toBeInTheDocument()
  })

  it('calls onAmountChange when amount input changes', () => {
    const mockOnChange = vi.fn()

    render(
      <MemberAmountTable
        members={mockMembers}
        onAmountChange={mockOnChange}
      />
    )

    const input = screen.getAllByRole('spinbutton')[1] // Second member's input
    fireEvent.change(input, { target: { value: '50.00' } })

    expect(mockOnChange).toHaveBeenCalledWith('2', 5000)
  })

  it('updates total when amounts change', async () => {
    const user = userEvent.setup()

    render(<TestWrapper initialMembers={mockMembers} />)

    const input = screen.getAllByRole('spinbutton')[1]
    await user.clear(input)
    await user.type(input, '200.00')

    expect(screen.getByText('Customers: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: ₦300.00')).toBeInTheDocument()
  })
})