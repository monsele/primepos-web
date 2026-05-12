export function validateDateRange(
  fromDate: string,
  toDate: string
): string | null {
  if (!fromDate || !toDate) {
    return null
  }

  if (toDate < fromDate) {
    return 'To date must be after From date'
  }

  return null
}
