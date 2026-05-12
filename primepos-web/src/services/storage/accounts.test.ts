import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { clear } from 'idb-keyval'
import {
  getAccount,
  setAccount,
  deleteAccount,
  getAllAccounts,
  clearAccounts,
} from './accounts'
import type { Account } from './types'

const mockAccount: Account = {
  accountNumber: 'ACC001',
  accountName: 'Test User',
  bookBalance: 100000,
  usableBalance: 90000,
  nuban: '1234567890',
  branchId: 'BR001',
}

describe('accounts CRUD', () => {
  beforeEach(async () => {
    await clear()
  })

  it('setAccount stores an account', async () => {
    await expect(setAccount('ACC001', mockAccount)).resolves.toBeUndefined()
  })

  it('getAccount retrieves a stored account', async () => {
    await setAccount('ACC001', mockAccount)
    const result = await getAccount('ACC001')
    expect(result).toEqual(mockAccount)
  })

  it('getAccount returns undefined for non-existent account', async () => {
    const result = await getAccount('NONEXISTENT')
    expect(result).toBeUndefined()
  })

  it('setAccount updates an existing account', async () => {
    await setAccount('ACC001', mockAccount)
    const updated = { ...mockAccount, accountName: 'Updated User' }
    await setAccount('ACC001', updated)
    const result = await getAccount('ACC001')
    expect(result).toEqual(updated)
  })

  it('deleteAccount removes an account', async () => {
    await setAccount('ACC001', mockAccount)
    await deleteAccount('ACC001')
    const result = await getAccount('ACC001')
    expect(result).toBeUndefined()
  })

  it('getAllAccounts returns all accounts', async () => {
    await setAccount('ACC001', mockAccount)
    await setAccount('ACC002', { ...mockAccount, accountNumber: 'ACC002' })
    const all = await getAllAccounts()
    expect(all.length).toBe(2)
    expect(all.map(a => a.accountNumber).sort()).toEqual(['ACC001', 'ACC002'])
  })

  it('clearAccounts removes all accounts', async () => {
    await setAccount('ACC001', mockAccount)
    await setAccount('ACC002', { ...mockAccount, accountNumber: 'ACC002' })
    await clearAccounts()
    const all = await getAllAccounts()
    expect(all.length).toBe(0)
  })

  it('getAllAccounts returns empty array when no accounts exist', async () => {
    const all = await getAllAccounts()
    expect(all).toEqual([])
  })

  it('deleteAccount is a no-op on non-existent account', async () => {
    await expect(deleteAccount('NONEXISTENT')).resolves.toBeUndefined()
  })
})
