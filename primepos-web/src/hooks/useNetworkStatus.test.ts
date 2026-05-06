import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNetworkStatus } from './useNetworkStatus'

describe('useNetworkStatus', () => {
  let onlineHandler: (() => void) | null = null
  let offlineHandler: (() => void) | null = null

  beforeEach(() => {
    vi.stubGlobal('navigator', {
      onLine: true,
      connection: undefined,
    })

    vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'online') onlineHandler = handler as () => void
      if (event === 'offline') offlineHandler = handler as () => void
    })
    vi.spyOn(window, 'removeEventListener').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    onlineHandler = null
    offlineHandler = null
  })

  it('returns correct initial state', () => {
    const { result } = renderHook(() => useNetworkStatus())
    expect(result.current.isOnline).toBe(true)
    expect(result.current.connectionType).toBe('unknown')
    expect(result.current.since).toBeInstanceOf(Date)
  })

  it('updates isOnline and since when going offline', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useNetworkStatus())
    const initialSince = result.current.since

    act(() => {
      vi.advanceTimersByTime(1000)
      offlineHandler?.()
    })

    expect(result.current.isOnline).toBe(false)
    expect(result.current.since).not.toEqual(initialSince)
    expect(result.current.since!.getTime()).toBeGreaterThan(initialSince!.getTime())

    vi.useRealTimers()
  })

  it('updates isOnline and since when coming back online', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useNetworkStatus())

    act(() => offlineHandler?.())
    expect(result.current.isOnline).toBe(false)
    const offlineSince = result.current.since

    act(() => {
      vi.advanceTimersByTime(1000)
      onlineHandler?.()
    })

    expect(result.current.isOnline).toBe(true)
    expect(result.current.since).not.toEqual(offlineSince)
    expect(result.current.since!.getTime()).toBeGreaterThan(offlineSince!.getTime())

    vi.useRealTimers()
  })

  it('does not change since when isOnline has not changed', () => {
    const { result, rerender } = renderHook(() => useNetworkStatus())
    const initialSince = result.current.since

    rerender()

    expect(result.current.since).toEqual(initialSince)
  })

  it('cleans up event listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useNetworkStatus())

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function))
  })
})
