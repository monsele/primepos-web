import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DetailList, { type DetailItem } from './DetailList'

describe('DetailList', () => {
  const mockItems: DetailItem[] = [
    { label: 'Name', value: 'John Doe' },
    { label: 'Staff ID', value: 'STF001' },
    { label: 'Branch', value: 'Main Branch' },
  ]

  it('renders all label-value pairs', () => {
    render(<DetailList items={mockItems} />)
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Staff ID')).toBeInTheDocument()
    expect(screen.getByText('STF001')).toBeInTheDocument()
    expect(screen.getByText('Branch')).toBeInTheDocument()
    expect(screen.getByText('Main Branch')).toBeInTheDocument()
  })

  it('renders empty list when no items provided', () => {
    render(<DetailList items={[]} />)
    
    const list = screen.getByTestId('detail-list')
    expect(list).toBeInTheDocument()
    expect(list.children.length).toBe(0)
  })

  it('applies data-testid when provided', () => {
    render(<DetailList items={mockItems} data-testid="custom-test-id" />)
    
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })
})