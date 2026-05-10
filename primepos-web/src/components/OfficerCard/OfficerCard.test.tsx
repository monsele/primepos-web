import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import OfficerCard from './OfficerCard'
import type { Officer } from '../../types/auth'

describe('OfficerCard', () => {
  const mockOfficer: Officer = {
    staffId: 'STF001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '08012345678',
    branchId: 'BR001',
    branchName: 'Main Branch',
    department: 'Operations',
    tillAccount: 'TILL-001',
    role: 'Officer',
  }

  it('renders officer name', () => {
    render(<OfficerCard officer={mockOfficer} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders staff ID', () => {
    render(<OfficerCard officer={mockOfficer} />)
    expect(screen.getByText(/Staff ID: STF001/)).toBeInTheDocument()
  })

  it('renders branch name', () => {
    render(<OfficerCard officer={mockOfficer} />)
    expect(screen.getByText(/Branch: Main Branch/)).toBeInTheDocument()
  })

  it('renders till account', () => {
    render(<OfficerCard officer={mockOfficer} />)
    expect(screen.getByText(/Till: TILL-001/)).toBeInTheDocument()
  })

  it('renders initials avatar', () => {
    render(<OfficerCard officer={mockOfficer} />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders initials correctly for single name', () => {
    const singleNameOfficer = { ...mockOfficer, name: 'John' }
    render(<OfficerCard officer={singleNameOfficer} />)
    expect(screen.getByText('JO')).toBeInTheDocument()
  })

  it('renders initials correctly for three names', () => {
    const threeNameOfficer = { ...mockOfficer, name: 'John Michael Doe' }
    render(<OfficerCard officer={threeNameOfficer} />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })
})