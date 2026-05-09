import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { clear } from 'idb-keyval'
import { getGroup, setGroup, deleteGroup, getAllGroups, clearGroups } from './groups'
import type { Group } from './types'

const mockGroup: Group = {
  id: 'GRP001',
  groupCode: 'G-001',
  groupName: 'Test Group',
  branchId: 'BR001',
  memberCount: 5,
}

describe('groups CRUD', () => {
  beforeEach(async () => {
    await clear()
  })

  it('setGroup stores a group', async () => {
    await expect(setGroup('GRP001', mockGroup)).resolves.toBeUndefined()
  })

  it('getGroup retrieves a stored group', async () => {
    await setGroup('GRP001', mockGroup)
    const result = await getGroup('GRP001')
    expect(result).toEqual(mockGroup)
  })

  it('getGroup returns undefined for non-existent group', async () => {
    const result = await getGroup('NONEXISTENT')
    expect(result).toBeUndefined()
  })

  it('setGroup updates an existing group', async () => {
    await setGroup('GRP001', mockGroup)
    const updated = { ...mockGroup, groupName: 'Updated Group' }
    await setGroup('GRP001', updated)
    const result = await getGroup('GRP001')
    expect(result).toEqual(updated)
  })

  it('deleteGroup removes a group', async () => {
    await setGroup('GRP001', mockGroup)
    await deleteGroup('GRP001')
    const result = await getGroup('GRP001')
    expect(result).toBeUndefined()
  })

  it('getAllGroups returns all groups', async () => {
    await setGroup('GRP001', mockGroup)
    await setGroup('GRP002', { ...mockGroup, id: 'GRP002', groupCode: 'G-002' })
    const all = await getAllGroups()
    expect(all.length).toBe(2)
  })

  it('clearGroups removes all groups', async () => {
    await setGroup('GRP001', mockGroup)
    await setGroup('GRP002', { ...mockGroup, id: 'GRP002' })
    await clearGroups()
    const all = await getAllGroups()
    expect(all.length).toBe(0)
  })

  it('getAllGroups returns empty array when no groups', async () => {
    const all = await getAllGroups()
    expect(all).toEqual([])
  })
})
