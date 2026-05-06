/**
 * Format an ISO 8601 string to local time in "HH:MM AM/PM" format.
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString)
  if (isNaN(date.getTime())) {
    console.warn(`[formatTime] Invalid date string: ${isoString}`)
    return '--:--'
  }
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
