import { useQuery, useQueryClient } from '@tanstack/react-query'

export interface DashboardKPIs {
  collections: number // in kobo
  transactionCount: number
  pendingSyncCount: number
}

export async function fetchDailySummary(): Promise<DashboardKPIs> {
  await new Promise((r) => setTimeout(r, 600))
  return {
    collections: 24850000,
    transactionCount: 34,
    pendingSyncCount: 0,
  }
}

const QUERY_KEY = ['daily-summary']
const STALE_TIME = 5 * 60 * 1000 // 5 minutes

export function useDashboardKPIs() {
  return useQuery<DashboardKPIs>({
    queryKey: QUERY_KEY,
    queryFn: fetchDailySummary,
    staleTime: STALE_TIME,
  })
}

export function useInvalidateDailySummary() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY })
  }
}
