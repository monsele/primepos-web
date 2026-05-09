import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { clear } from 'idb-keyval'
import { getOfficer, setOfficer, deleteOfficer, getAllOfficers, clearOfficers } from './officers'
import type { Officer } from './types'

const mockOfficer: Officer = {
  staffId: 'STF001',
  name: 'Test Officer',
  email: 'test@example.com',
  mobile: '08012345678',
  branchId: 'BR001',
  branchName: 'Test Branch',
  department: 'Operations',
  tillAccount: 'TILL001',
  role: 'Teller',
}

describe('officers CRUD', () => {
  beforeEach(async () => {
    await clear()
  })

  it('setOfficer stores an officer', async () => {
    await expect(setOfficer('STF001', mockOfficer)).resolves.toBeUndefined()
  })

  it('getOfficer retrieves a stored officer', async () => {
    await setOfficer('STF001', mockOfficer)
    const result = await getOfficer('STF001')
    expect(result).toEqual(mockOfficer)
  })

  it('getOfficer returns undefined for non-existent officer', async () => {
    const result = await getOfficer('NONEXISTENT')
    expect(result).toBeUndefined()
  })

  it('setOfficer updates an existing officer', async () => {
    await setOfficer('STF001', mockOfficer)
    const updated = { ...mockOfficer, name: 'Updated Officer' }
    await setOfficer('STF001', updated)
    const result = await getOfficer('STF001')
    expect(result).toEqual(updated)
  })

  it('deleteOfficer removes an officer', async () => {
    await setOfficer('STF001', mockOfficer)
    await deleteOfficer('STF001')
    const result = await getOfficer('STF001')
    expect(result).toBeUndefined()
  })

  it('getAllOfficers returns all officers', async () => {
    await setOfficer('STF001', mockOfficer)
    await setOfficer('STF002', { ...mockOfficer, staffId: 'STF002' })
    const all = await getAllOfficers()
    expect(all.length).toBe(2)
  })

  it('clearOfficers removes all officers', async () => {
    await setOfficer('STF001', mockOfficer)
    await clearOfficers()
    const all = await getAllOfficers()
    expect(all.length).toBe(0)
  })

  it('getAllOfficers returns empty array when no officers', async () => {
    const all = await getAllOfficers()
    expect(all).toEqual([])
  })
})
