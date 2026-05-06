import { useQuery } from '@tanstack/react-query'
import type { Transaction } from '../../types/transaction'

export async function fetchRecentTransactions(officerId: string): Promise<Transaction[]> {
  void officerId
  await new Promise((r) => setTimeout(r, 500))
  const data: Transaction[] = [
    {
      id: '1',
      customerName: 'Adediran Blessing',
      type: 'Cash In',
      amount: 500000,
      status: 'POSTED',
      createdAt: '2026-05-02T10:42:00Z',
    },
    {
      id: '2',
      customerName: 'Adejumo Olusegun',
      type: 'Loan Repay',
      amount: 1250000,
      status: 'POSTED',
      createdAt: '2026-05-02T10:18:00Z',
    },
  ]
  return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

const QUERY_KEY = (officerId: string) => ['recent-transactions', officerId]
const STALE_TIME = 5 * 60 * 1000 // 5 minutes

export function useRecentTransactions(officerId: string | undefined) {
  return useQuery<Transaction[]>({
    queryKey: QUERY_KEY(officerId?.trim() || ''),
    queryFn: () => fetchRecentTransactions(officerId?.trim() || ''),
    enabled: Boolean(officerId?.trim()),
    staleTime: STALE_TIME,
  })
}
