import { describe, it, expect } from 'vitest'
import { isValidBvn } from './validation'

describe('isValidBvn', () => {
  it('returns true for 11-digit numeric string', () => {
    expect(isValidBvn('12345678901')).toBe(true)
  })

  it('returns false for less than 11 digits', () => {
    expect(isValidBvn('123')).toBe(false)
  })

  it('returns false for more than 11 digits', () => {
    expect(isValidBvn('123456789012')).toBe(false)
  })

  it('returns false for non-numeric characters', () => {
    expect(isValidBvn('abc')).toBe(false)
  })

  it('returns false for alphanumeric mix', () => {
    expect(isValidBvn('1234567890a')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidBvn('')).toBe(false)
  })
})
