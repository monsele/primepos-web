import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { DateRangeInput } from './DateRangeInput'
import { validateDateRange } from './dateRange'

describe('DateRangeInput', () => {
  it('validates that to date is not earlier than from date', () => {
    expect(validateDateRange('2026-05-10', '2026-05-09')).toBe(
      'To date must be after From date'
    )
    expect(validateDateRange('2026-05-09', '2026-05-09')).toBeNull()
  })

  it('shows the validation error and forwards date changes', () => {
    const onFromDateChange = vi.fn()
    const onToDateChange = vi.fn()

    render(
      <DateRangeInput
        fromDate="2026-05-10"
        toDate="2026-05-09"
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
        error="To date must be after From date"
      />
    )

    fireEvent.change(screen.getByLabelText('From Date'), {
      target: { value: '2026-05-01' },
    })
    fireEvent.change(screen.getByLabelText('To Date'), {
      target: { value: '2026-05-31' },
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'To date must be after From date'
    )
    expect(onFromDateChange).toHaveBeenCalledWith('2026-05-01')
    expect(onToDateChange).toHaveBeenCalledWith('2026-05-31')
  })
})
