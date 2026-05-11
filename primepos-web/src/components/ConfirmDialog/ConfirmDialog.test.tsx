import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmDialog from './ConfirmDialog'

describe('ConfirmDialog', () => {
  const mockOnConfirm = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with title and message', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('renders with default button labels', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Test"
        message="Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    )

    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Confirm')).toBeInTheDocument()
  })

  it('renders with custom button labels', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Test"
        message="Message"
        confirmLabel="Yes"
        cancelLabel="No"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    )

    expect(screen.getByText('No')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Test"
        message="Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    )

    fireEvent.click(screen.getByText('Confirm'))
    expect(mockOnConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Test"
        message="Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    )

    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={false}
        title="Test"
        message="Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    )

    expect(container.firstChild).toBeNull()
  })

  it('has correct accessibility attributes', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    )

    const dialog = screen.getByTestId('confirm-dialog')
    expect(dialog).toHaveAttribute('role', 'dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-dialog-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'confirm-dialog-message')
  })
})