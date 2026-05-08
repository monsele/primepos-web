import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { DateInput } from './DateInput'

describe('DateInput', () => {
  it('formats digits into DD/MM/YYYY', () => {
    const onChange = vi.fn()

    render(
      <DateInput
        label="Date of Birth"
        value=""
        onChange={onChange}
      />
    )

    fireEvent.change(screen.getByLabelText('Date of Birth'), {
      target: { value: '01011990' },
    })

    expect(onChange).toHaveBeenCalledWith('01/01/1990')
  })

  it('shows validation error text', () => {
    render(
      <DateInput
        label="Date of Birth"
        value="32/13/2010"
        onChange={vi.fn()}
        error="Enter a valid date"
      />
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid date')
  })
})
