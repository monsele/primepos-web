import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MenuItem from './MenuItem'

describe('MenuItem', () => {
  it('renders label', () => {
    render(<MenuItem label="Cash In" />)
    expect(screen.getByText('Cash In')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<MenuItem label="Cash In" subtitle="Receive payment" />)
    expect(screen.getByText('Receive payment')).toBeInTheDocument()
  })

  it('renders arrow', () => {
    render(<MenuItem label="Cash In" />)
    expect(screen.getByText('→')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<MenuItem label="Cash In" onClick={onClick} />)

    const button = screen.getByTestId('menu-item')
    fireEvent.click(button)

    expect(onClick).toHaveBeenCalled()
  })

  it('renders badge with count', () => {
    render(<MenuItem label="Unposted" badgeCount={5} />)
    expect(screen.getByTestId('badge')).toHaveTextContent('5')
  })

  it('does not render badge when count is 0', () => {
    render(<MenuItem label="Unposted" badgeCount={0} />)
    expect(screen.queryByTestId('badge')).not.toBeInTheDocument()
  })

  it('does not render badge when badgeCount is undefined', () => {
    render(<MenuItem label="Unposted" />)
    expect(screen.queryByTestId('badge')).not.toBeInTheDocument()
  })

  it('renders badge with large count', () => {
    render(<MenuItem label="Unposted" badgeCount={150} />)
    expect(screen.getByTestId('badge')).toHaveTextContent('150')
  })
})
