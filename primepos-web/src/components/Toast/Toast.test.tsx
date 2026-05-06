import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ToastProvider } from './ToastProvider'
import { useToast } from './useToast'

function TestComponent() {
  const { showToast, dismissToast } = useToast()
  return (
    <div>
      <button onClick={() => showToast({ message: 'Hello', type: 'success' })}>Show</button>
      <button onClick={() => showToast({ message: 'Warning', type: 'warning', duration: 2000 })}>
        Show Warning
      </button>
      <button onClick={() => dismissToast('test-id')}>Dismiss</button>
    </div>
  )
}

describe('ToastProvider', () => {
  it('throws when useToast is called outside provider', () => {
    function BadComponent() {
      useToast()
      return null
    }
    expect(() => render(<BadComponent />)).toThrow('useToast must be used within a ToastProvider')
  })

  it('shows a toast when showToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    act(() => {
      screen.getByText('Show').click()
    })

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('auto-dismisses toast after duration', () => {
    vi.useFakeTimers()
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    act(() => {
      screen.getByText('Show').click()
    })

    expect(screen.getByText('Hello')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(4000)
    })

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(screen.queryByText('Hello')).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it('supports manual dismiss', () => {
    vi.useFakeTimers()
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    act(() => {
      screen.getByText('Show').click()
    })

    expect(screen.getByText('Hello')).toBeInTheDocument()

    const dismissBtn = screen.getByLabelText('Dismiss notification')
    act(() => {
      dismissBtn.click()
    })

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(screen.queryByText('Hello')).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it('renders multiple toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    act(() => {
      screen.getByText('Show').click()
      screen.getByText('Show Warning').click()
    })

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })
})
