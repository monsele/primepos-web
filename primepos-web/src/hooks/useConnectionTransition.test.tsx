import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useEffect } from 'react'
import { useConnectionTransition } from './useConnectionTransition'
import { useNetworkStatus } from './useNetworkStatus'

vi.mock('./useNetworkStatus')

function createTestComponent(onTransition: (type: string) => void) {
  return function TestComponent() {
    const { wentOffline, cameOnline } = useConnectionTransition()
    useEffect(() => {
      if (wentOffline) onTransition('offline')
      if (cameOnline) onTransition('online')
    }, [wentOffline, cameOnline])
    return null
  }
}

describe('useConnectionTransition', () => {
  beforeEach(() => {
    vi.mocked(useNetworkStatus).mockReturnValue({
      isOnline: true,
      connectionType: '4g',
      since: new Date(),
    })
  })

  it('does not fire on initial mount', () => {
    const onTransition = vi.fn()
    const TestComponent = createTestComponent(onTransition)
    render(<TestComponent />)
    expect(onTransition).not.toHaveBeenCalled()
  })

  it('detects wentOffline on online→offline transition', () => {
    const onTransition = vi.fn()
    const TestComponent = createTestComponent(onTransition)
    const { rerender } = render(<TestComponent />)

    vi.mocked(useNetworkStatus).mockReturnValue({
      isOnline: false,
      connectionType: '4g',
      since: new Date(),
    })
    act(() => rerender(<TestComponent />))

    expect(onTransition).toHaveBeenCalledWith('offline')
    expect(onTransition).toHaveBeenCalledTimes(1)
  })

  it('detects cameOnline on offline→online transition', () => {
    vi.mocked(useNetworkStatus).mockReturnValue({
      isOnline: false,
      connectionType: '4g',
      since: new Date(),
    })

    const onTransition = vi.fn()
    const TestComponent = createTestComponent(onTransition)
    const { rerender } = render(<TestComponent />)

    expect(onTransition).not.toHaveBeenCalled()

    vi.mocked(useNetworkStatus).mockReturnValue({
      isOnline: true,
      connectionType: '4g',
      since: new Date(),
    })
    act(() => rerender(<TestComponent />))

    expect(onTransition).toHaveBeenCalledWith('online')
    expect(onTransition).toHaveBeenCalledTimes(1)
  })

  it('does not flag transition when isOnline has not changed', () => {
    const onTransition = vi.fn()
    const TestComponent = createTestComponent(onTransition)
    const { rerender } = render(<TestComponent />)

    act(() => rerender(<TestComponent />))

    expect(onTransition).not.toHaveBeenCalled()
  })
})
