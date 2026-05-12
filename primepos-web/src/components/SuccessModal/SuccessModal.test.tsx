import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SuccessModal } from './SuccessModal'

describe('SuccessModal', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('renders the account number', () => {
    render(<SuccessModal accountNumber="1234567890" onDone={vi.fn()} />)

    expect(screen.getByTestId('success-account-number')).toHaveTextContent(
      '1234567890'
    )
  })

  it('copies the account number', async () => {
    render(<SuccessModal accountNumber="1234567890" onDone={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'COPY' }))

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('1234567890')
    })
    expect(screen.getByRole('button', { name: 'COPIED' })).toBeInTheDocument()
  })

  it('calls onDone when DONE is clicked', () => {
    const onDone = vi.fn()
    render(<SuccessModal accountNumber="1234567890" onDone={onDone} />)

    fireEvent.click(screen.getByRole('button', { name: 'DONE' }))

    expect(onDone).toHaveBeenCalledTimes(1)
  })
})
