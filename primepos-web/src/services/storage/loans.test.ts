import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { clear } from 'idb-keyval'
import { getLoan, setLoan, deleteLoan, getAllLoans, clearLoans } from './loans'
import type { Loan } from './types'

const mockLoan: Loan = {
  loanNumber: 'LN001',
  customerName: 'Test Customer',
  product: 'Personal Loan',
  loanPurpose: 'Business',
  loanAmount: 500000,
  currentBalance: 400000,
  outstandingInterest: 5000,
  startDate: '2026-01-01',
  maturityDate: '2026-12-31',
  status: 'ACTIVE',
}

describe('loans CRUD', () => {
  beforeEach(async () => {
    await clear()
  })

  it('setLoan stores a loan', async () => {
    await expect(setLoan('LN001', mockLoan)).resolves.toBeUndefined()
  })

  it('getLoan retrieves a stored loan', async () => {
    await setLoan('LN001', mockLoan)
    const result = await getLoan('LN001')
    expect(result).toEqual(mockLoan)
  })

  it('getLoan returns undefined for non-existent loan', async () => {
    const result = await getLoan('NONEXISTENT')
    expect(result).toBeUndefined()
  })

  it('setLoan updates an existing loan', async () => {
    await setLoan('LN001', mockLoan)
    const updated = { ...mockLoan, customerName: 'Updated Customer' }
    await setLoan('LN001', updated)
    const result = await getLoan('LN001')
    expect(result).toEqual(updated)
  })

  it('deleteLoan removes a loan', async () => {
    await setLoan('LN001', mockLoan)
    await deleteLoan('LN001')
    const result = await getLoan('LN001')
    expect(result).toBeUndefined()
  })

  it('getAllLoans returns all loans', async () => {
    await setLoan('LN001', mockLoan)
    await setLoan('LN002', { ...mockLoan, loanNumber: 'LN002' })
    const all = await getAllLoans()
    expect(all.length).toBe(2)
  })

  it('clearLoans removes all loans', async () => {
    await setLoan('LN001', mockLoan)
    await setLoan('LN002', { ...mockLoan, loanNumber: 'LN002' })
    await clearLoans()
    const all = await getAllLoans()
    expect(all.length).toBe(0)
  })

  it('getAllLoans returns empty array when no loans', async () => {
    const all = await getAllLoans()
    expect(all).toEqual([])
  })
})
