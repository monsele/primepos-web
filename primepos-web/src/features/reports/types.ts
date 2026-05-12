import type { Screen } from '../../types/navigation'

export interface ReportsSummary {
  totalCollections: number // kobo
  transactionsToday: number
}

export interface ReportType {
  id: string
  label: string
  targetScreen: Screen
}

export const reportTypes: ReportType[] = [
  { id: 'loans-booked', label: 'Loans Booked', targetScreen: 'loansBookedReport' },
  { id: 'e-ledger', label: 'E-Ledger', targetScreen: 'eLedgerReport' },
  { id: 'lo-par', label: 'LO PAR Report', targetScreen: 'loParReport' },
  { id: 'transaction-reports', label: 'Transaction Reports', targetScreen: 'transactionReports' },
  { id: 'lo-performance', label: 'LO Performance', targetScreen: 'loPerformanceReport' },
]
