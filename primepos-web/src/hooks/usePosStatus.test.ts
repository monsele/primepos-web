import { describe, it, expect } from 'vitest'
import { usePosStatus } from './usePosStatus'

describe('usePosStatus', () => {
  it('returns isConnected: false for MVP', () => {
    const result = usePosStatus()
    expect(result).toEqual({ isConnected: false })
  })
})