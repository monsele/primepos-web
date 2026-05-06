import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConnectionBanner } from './ConnectionBanner'

describe('ConnectionBanner', () => {
  it('renders online state', () => {
    render(<ConnectionBanner isOnline={true} />)
    expect(screen.getByText('Connected — All features available')).toBeInTheDocument()
  })

  it('renders offline state', () => {
    render(<ConnectionBanner isOnline={false} />)
    expect(screen.getByText('Offline — Limited features available')).toBeInTheDocument()
  })

  it('has aria-live polite for accessibility', () => {
    render(<ConnectionBanner isOnline={true} />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })
})
