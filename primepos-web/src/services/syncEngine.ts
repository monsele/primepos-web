import type { QueuedTransaction } from './storage/types'
import { getPendingTransactions, updateTransaction } from './storage/transactions'

export interface SyncResult {
  processed: number
  succeeded: number
  failed: number
  errors: { id: string; message: string }[]
}

export class SyncEngine {
  private readonly MAX_RETRIES = 3
  private readonly BACKOFF_BASE = 1000

  async processQueue(): Promise<SyncResult> {
    const items = await getPendingTransactions()
    const result: SyncResult = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [],
    }

    for (const item of items) {
      result.processed++
      try {
        await this.processItem(item)
        result.succeeded++
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        result.failed++
        result.errors.push({ id: item.id, message })
      }
    }

    return result
  }

  async processItem(item: QueuedTransaction): Promise<void> {
    const statusCode = await this.submitTransaction(item)
    const retryCount = item.retryCount ?? 0

    if (statusCode >= 200 && statusCode < 300) {
      await updateTransaction(item.id, {
        status: 'POSTED',
        postedAt: new Date().toISOString(),
      })
    } else if (statusCode >= 400 && statusCode < 500) {
      await updateTransaction(item.id, {
        status: 'FAILED',
        errorMessage: `Client error: ${statusCode}`,
      })
    } else if (statusCode >= 500 || statusCode === 0) {
      if (retryCount < this.MAX_RETRIES) {
        const backoff = this.calculateBackoff(retryCount)
        await new Promise((resolve) => setTimeout(resolve, backoff))
        await updateTransaction(item.id, {
          retryCount: retryCount + 1,
        })
        await this.processItem({ ...item, retryCount: retryCount + 1 })
      } else {
        await updateTransaction(item.id, {
          status: 'FAILED',
          errorMessage: `Max retries exceeded`,
        })
      }
    }
  }

  async submitTransaction(item: QueuedTransaction): Promise<number> {
    try {
      const response = await fetch(`/api/transactions/${item.type.toLowerCase()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload),
      })
      return response.status
    } catch {
      return 0
    }
  }

  calculateBackoff(retryCount: number): number {
    return Math.pow(2, retryCount) * this.BACKOFF_BASE
  }
}