export interface Client {
  id: string
  name: string
  email: string
  balanceInTokens: number
  createdAt: string
  updatedAt: string | null
}

export interface Rate {
  value: number
  lastUpdated: string
  baseCurrency: string
  targetCurrency: string
}

export interface UpdateRateRequest {
  newRate: number
  baseCurrency: string
  targetCurrency: string
}

export interface Payment {
  id: string
  clientId: string
  amount: number
  currency: string
  date: string
  description: string
  status: string
}
