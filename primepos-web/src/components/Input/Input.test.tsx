import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Input from './Input'

describe('Input', () => {
  it('renders label and input', () => {
    render(<Input label="Username" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
  })

  it('calls onChange when typing', () => {
    const handleChange = vi.fn()
    render(<Input label="Username" value="" onChange={handleChange} />)
    const input = screen.getByLabelText('Username')
    fireEvent.change(input, { target: { value: 'hello' } })
    expect(handleChange).toHaveBeenCalledWith('hello')
  })

  it('displays error message', () => {
    render(<Input label="Username" value="" onChange={() => {}} error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
    expect(screen.getByLabelText('Username')).toHaveAttribute('aria-invalid', 'true')
  })

  it('disables input when disabled prop is true', () => {
    render(<Input label="Username" value="" onChange={() => {}} disabled />)
    expect(screen.getByLabelText('Username')).toBeDisabled()
  })

  it('uses provided id for label association', () => {
    render(<Input label="Username" value="" onChange={() => {}} id="custom-id" />)
    expect(screen.getByLabelText('Username')).toHaveAttribute('id', 'custom-id')
  })
})
