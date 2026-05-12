import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders initials for a full name', () => {
    render(<Avatar name="Adediran Blessing" />)
    expect(screen.getByText('AB')).toBeInTheDocument()
  })

  it('renders single initial for a single name', () => {
    render(<Avatar name="Blessing" />)
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('applies a consistent color for the same name', () => {
    const { container: first } = render(<Avatar name="Adediran Blessing" />)
    const { container: second } = render(<Avatar name="Adediran Blessing" />)

    const firstCircle = first.querySelector('div')
    const secondCircle = second.querySelector('div')

    expect(firstCircle).toHaveStyle({
      backgroundColor: secondCircle?.getAttribute('style')?.match(/background-color:\s*([^;]+)/)?.[1],
    })
  })

  it('has an accessible label', () => {
    render(<Avatar name="Adediran Blessing" />)
    expect(screen.getByLabelText(/Avatar for Adediran Blessing/i)).toBeInTheDocument()
  })
})
