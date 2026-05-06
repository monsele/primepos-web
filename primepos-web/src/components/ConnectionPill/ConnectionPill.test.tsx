import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConnectionPill } from './ConnectionPill'

describe('ConnectionPill', () => {
  it('renders Online when connected', () => {
    render(<ConnectionPill isOnline={true} />)
    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  it('renders Offline when disconnected', () => {
    render(<ConnectionPill isOnline={false} />)
    expect(screen.getByText('Offline')).toBeInTheDocument()
  })
})
