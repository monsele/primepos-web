import { useState, useEffect, useCallback } from 'react'
import type { GroupMember } from '../../types/group'

export interface UseGroupMembersReturn {
  members: GroupMember[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useGroupMembers(groupId: string | null): UseGroupMembersReturn {
  const [members, setMembers] = useState<GroupMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = useCallback(() => {
    setIsLoading(true)
    setError(null)

    // Mock API call - simulate with setTimeout
    const timer = setTimeout(() => {
      // Mock data - replace with actual API response
      const mockMembers: GroupMember[] = [
        { id: '1', customerName: 'Ada Okafor', accountNumber: '1000000001', amount: null },
        { id: '2', customerName: 'Bola Adeyemi', accountNumber: '1000000002', amount: null },
        { id: '3', customerName: 'Chioma Nwosu', accountNumber: '1000000003', amount: null },
        { id: '4', customerName: 'Damilola Ogunleye', accountNumber: '1000000004', amount: null },
        { id: '5', customerName: 'Efe Eghosa', accountNumber: '1000000005', amount: null },
        { id: '6', customerName: 'Funmi Adebayo', accountNumber: '1000000006', amount: null },
        { id: '7', customerName: 'Grace Okafor', accountNumber: '1000000007', amount: null },
      ]

      setMembers(mockMembers)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const refetch = useCallback(() => {
    fetchMembers()
  }, [fetchMembers])

  useEffect(() => {
    if (groupId) {
      const cleanup = fetchMembers() // eslint-disable-line react-hooks/set-state-in-effect
      return cleanup
    } else {
      setMembers([]) // eslint-disable-line react-hooks/set-state-in-effect
      setError(null) // eslint-disable-line react-hooks/set-state-in-effect
      setIsLoading(false) // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [groupId, fetchMembers]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    members,
    isLoading,
    error,
    refetch
  }
}