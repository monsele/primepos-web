import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchInput from './SearchInput'

describe('SearchInput', () => {
  it('renders with placeholder', () => {
    render(<SearchInput value="" onChange={vi.fn()} placeholder="Search..." />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} />)

    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'cash' } })

    expect(onChange).toHaveBeenCalledWith('cash')
  })

  it('shows clear button when text entered', () => {
    render(<SearchInput value="cash" onChange={vi.fn()} />)
    expect(screen.getByTestId('search-clear')).toBeInTheDocument()
  })

  it('hides clear button when empty', () => {
    render(<SearchInput value="" onChange={vi.fn()} />)
    expect(screen.queryByTestId('search-clear')).not.toBeInTheDocument()
  })

  it('clears value when clear button clicked', () => {
    const onChange = vi.fn()
    render(<SearchInput value="cash" onChange={onChange} />)

    const clearButton = screen.getByTestId('search-clear')
    fireEvent.click(clearButton)

    expect(onChange).toHaveBeenCalledWith('')
  })
})
