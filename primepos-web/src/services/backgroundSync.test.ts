import { describe, it, expect, vi } from 'vitest'
import { syncOfflineData, getSyncStatus } from './backgroundSync'
import * as cacheStrategy from './cacheStrategy'
import * as syncMetadata from './storage/syncMetadata'

describe('backgroundSync', () => {
  describe('syncOfflineData', () => {
    it('syncs portfolio data and caches all items', async () => {
      const cacheAccountSpy = vi.spyOn(cacheStrategy, 'cacheAccount').mockResolvedValue()
      const cacheLoanSpy = vi.spyOn(cacheStrategy, 'cacheLoan').mockResolvedValue()
      const cacheGroupSpy = vi.spyOn(cacheStrategy, 'cacheGroup').mockResolvedValue()
      const setSyncMetadataSpy = vi.spyOn(syncMetadata, 'setSyncMetadata').mockResolvedValue()

      await syncOfflineData('OFF-001')

      expect(cacheAccountSpy).toHaveBeenCalled()
      expect(cacheLoanSpy).toHaveBeenCalled()
      expect(cacheGroupSpy).toHaveBeenCalled()
      expect(setSyncMetadataSpy).toHaveBeenCalled()
    })
  })

  describe('getSyncStatus', () => {
    it('returns sync status with counts', async () => {
      vi.spyOn(syncMetadata, 'getSyncMetadata').mockResolvedValue({
        lastSyncAccounts: '2026-05-09T12:00:00Z',
        lastSyncLoans: '2026-05-09T12:00:00Z',
        lastSyncGroups: '2026-05-09T12:00:00Z',
      })

      const result = await getSyncStatus()

      expect(result.lastSync).toBe('2026-05-09T12:00:00Z')
    })
  })
})