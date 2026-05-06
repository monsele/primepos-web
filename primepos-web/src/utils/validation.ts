export function isValidBvn(bvn: string): boolean {
  return /^\d{11}$/.test(bvn)
}
