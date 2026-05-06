export interface CashInRequest {
  accountNumber: string
  payeeName: string
  amount: number // in kobo
  sendSms: boolean
  officerId: string
}

export interface CashInResponse {
  transactionId: string
  status: 'POSTED'
  createdAt: string
}

export async function postCashIn(payload: CashInRequest): Promise<CashInResponse> {
  void payload
  // Mock implementation for MVP
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    transactionId: `TXN-${Date.now()}`,
    status: 'POSTED',
    createdAt: new Date().toISOString(),
  }
}
