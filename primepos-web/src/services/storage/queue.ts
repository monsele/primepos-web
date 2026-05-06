/**
 * Placeholder queue service for Story 1.2.
 * Returns mock pendingCount=0 until Epic 8 implements real IndexedDB queue storage.
 */

export async function getPendingCount(): Promise<number> {
  return 0
}

export async function addToQueue(): Promise<void> {
  // Placeholder — will be implemented in Epic 8
}
