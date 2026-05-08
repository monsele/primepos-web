import type { Group } from '../types/group'

export async function fetchGroups(branchId: string): Promise<Group[]> {
  // Mock implementation for MVP
  await new Promise((resolve) => setTimeout(resolve, 500))

  const mockGroups: Group[] = [
    {
      id: 'GRP001',
      groupCode: 'GR-001',
      groupName: 'Ago Palace Market Women',
      branchId,
      memberCount: 12,
    },
    {
      id: 'GRP002',
      groupCode: 'GR-002',
      groupName: 'Oshodi Traders Association',
      branchId,
      memberCount: 8,
    },
    {
      id: 'GRP003',
      groupCode: 'GR-003',
      groupName: 'Ikeja Cooperative Society',
      branchId,
      memberCount: 15,
    },
    {
      id: 'GRP004',
      groupCode: 'GR-004',
      groupName: 'Yaba Tech Entrepreneurs',
      branchId,
      memberCount: 6,
    },
    {
      id: 'GRP005',
      groupCode: 'GR-005',
      groupName: 'Surulere Small Business Group',
      branchId,
      memberCount: 10,
    },
  ]

  return mockGroups
}

export async function searchGroups(query: string, branchId: string): Promise<Group[]> {
  const groups = await fetchGroups(branchId)
  if (!query.trim()) return groups

  const q = query.toLowerCase()
  return groups.filter(
    (g) =>
      g.groupName.toLowerCase().includes(q) ||
      g.groupCode.toLowerCase().includes(q)
  )
}
