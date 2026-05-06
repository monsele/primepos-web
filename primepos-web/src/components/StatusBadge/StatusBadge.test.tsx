import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('renders POSTED text for posted status', () => {
    render(<StatusBadge status="POSTED" />)
    expect(screen.getByText('POSTED')).toBeInTheDocument()
  })

  it('renders PENDING text for pending status', () => {
    render(<StatusBadge status="PENDING" />)
    expect(screen.getByText('PENDING')).toBeInTheDocument()
  })

  it('has correct test id for posted', () => {
    render(<StatusBadge status="POSTED" />)
    expect(screen.getByTestId('status-badge-posted')).toBeInTheDocument()
  })

  it('has correct test id for pending', () => {
    render(<StatusBadge status="PENDING" />)
    expect(screen.getByTestId('status-badge-pending')).toBeInTheDocument()
  })
})
