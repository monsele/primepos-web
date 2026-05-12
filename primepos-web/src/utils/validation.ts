export function isValidBvn(bvn: string): boolean {
  return /^\d{11}$/.test(bvn)
}

export function isValidDateOfBirth(value: string): boolean {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return false

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])

  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false
  }

  const today = new Date()
  const adultDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )

  return date <= adultDate
}
