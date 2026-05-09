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

export function formatDisplayDate(dateString: string): string {
  if (!dateString) {
    return '--/--/----'
  }

  const normalized = dateString.length === 10
    ? `${dateString}T00:00:00`
    : dateString
  const date = new Date(normalized)

  if (isNaN(date.getTime())) {
    return '--/--/----'
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
