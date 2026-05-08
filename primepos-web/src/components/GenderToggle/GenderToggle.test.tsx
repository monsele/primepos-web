import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { GenderToggle } from './GenderToggle'

describe('GenderToggle', () => {
  it('toggles between male and female', () => {
    const onChange = vi.fn()

    render(<GenderToggle value="" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Male' }))
    fireEvent.click(screen.getByRole('button', { name: 'Female' }))

    expect(onChange).toHaveBeenNthCalledWith(1, 'Male')
    expect(onChange).toHaveBeenNthCalledWith(2, 'Female')
  })

  it('renders validation errors', () => {
    render(
      <GenderToggle value="" onChange={vi.fn()} error="Gender is required" />
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Gender is required')
  })
})
