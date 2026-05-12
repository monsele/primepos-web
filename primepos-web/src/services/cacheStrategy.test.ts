import { describe, it, expect, vi } from 'vitest'
import {
  cacheAccount,
  getCachedAccount,
  cacheLoan,
  getCachedLoan,
  cacheGroup,
  getCachedGroup,
} from './cacheStrategy'
import * as accountsStorage from './storage/accounts'
import * as loansStorage from './storage/loans'
import * as groupsStorage from './storage/groups'
import type { Account } from '../types/account'
import type { Loan } from '../types/loan'
import type { Group } from '../types/group'

const mockAccount: Account = {
  accountNumber: '1234567890',
  accountName: 'Test User',
  bookBalance: 100000,
  usableBalance: 90000,
  branchId: 'TEST001',
}

const mockLoan: Loan = {
  loanNumber: 'LN-001',
  customerName: 'Test User',
  product: 'Test Loan Product',
  loanPurpose: 'Personal',
  loanAmount: 50000000,
  currentBalance: 50000000,
  outstandingInterest: 2500000,
  startDate: '2024-01-15',
  maturityDate: '2025-01-15',
  status: 'ACTIVE',
}

const mockGroup: Group = {
  id: 'GRP-001',
  groupCode: 'GRP001',
  groupName: 'Test Group',
  branchId: 'BRANCH001',
  memberCount: 10,
}

describe('cacheStrategy', () => {
  describe('cacheAccount', () => {
    it('caches account data', async () => {
      const setSpy = vi.spyOn(accountsStorage, 'setAccount').mockResolvedValue()

      await cacheAccount(mockAccount)

      expect(setSpy).toHaveBeenCalledWith(mockAccount.accountNumber, mockAccount)
    })
  })

  describe('getCachedAccount', () => {
    it('retrieves cached account data', async () => {
      const getSpy = vi
        .spyOn(accountsStorage, 'getAccount')
        .mockResolvedValue(mockAccount)

      const result = await getCachedAccount('1234567890')

      expect(getSpy).toHaveBeenCalledWith('1234567890')
      expect(result).toEqual(mockAccount)
    })

    it('returns undefined for non-existent account', async () => {
      vi.spyOn(accountsStorage, 'getAccount').mockResolvedValue(undefined)

      const result = await getCachedAccount('nonexistent')

      expect(result).toBeUndefined()
    })
  })

  describe('cacheLoan', () => {
    it('caches loan data', async () => {
      const setSpy = vi.spyOn(loansStorage, 'setLoan').mockResolvedValue()

      await cacheLoan(mockLoan)

      expect(setSpy).toHaveBeenCalledWith(mockLoan.loanNumber, mockLoan)
    })
  })

  describe('getCachedLoan', () => {
    it('retrieves cached loan data', async () => {
      const getSpy = vi.spyOn(loansStorage, 'getLoan').mockResolvedValue(mockLoan)

      const result = await getCachedLoan('LN-001')

      expect(getSpy).toHaveBeenCalledWith('LN-001')
      expect(result).toEqual(mockLoan)
    })
  })

  describe('cacheGroup', () => {
    it('caches group data', async () => {
      const setSpy = vi.spyOn(groupsStorage, 'setGroup').mockResolvedValue()

      await cacheGroup(mockGroup)

      expect(setSpy).toHaveBeenCalledWith(mockGroup.id, mockGroup)
    })
  })

  describe('getCachedGroup', () => {
    it('retrieves cached group data', async () => {
      const getSpy = vi.spyOn(groupsStorage, 'getGroup').mockResolvedValue(mockGroup)

      const result = await getCachedGroup('GRP-001')

      expect(getSpy).toHaveBeenCalledWith('GRP-001')
      expect(result).toEqual(mockGroup)
    })
  })
})