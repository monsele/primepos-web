import { describe, it, expect } from 'vitest'
import { formatTime } from './date'

describe('formatTime', () => {
  it('formats ISO string to local time in HH:MM AM/PM', () => {
    const result = formatTime('2026-05-02T10:42:00Z')
    expect(result).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/)
  })

  it('converts UTC time correctly', () => {
    const result = formatTime('2026-05-02T14:30:00Z')
    expect(result).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/)
  })

  it('handles midnight UTC', () => {
    const result = formatTime('2026-05-02T00:00:00Z')
    expect(result).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/)
  })

  it('returns fallback for invalid date string', () => {
    const result = formatTime('not-a-date')
    expect(result).toBe('--:--')
  })
})
