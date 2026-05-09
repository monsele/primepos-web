import { useDashboardKPIs } from '../dashboard/useDashboardKPIs'
import type { ReportsSummary } from './types'

export function useReportsSummary(): { data?: ReportsSummary } {
  const { data } = useDashboardKPIs()

  return {
    data: data ? {
      totalCollections: data.collections,
      transactionsToday: data.transactionCount,
    } : undefined,
  }
}