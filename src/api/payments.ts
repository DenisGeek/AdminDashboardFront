import type { Payment } from '../types'

export const getRecentPayments = async (
  count: number = 5
): Promise<Payment[]> => {
  const token = localStorage.getItem('token')
  const response = await fetch(`http://localhost:5000/payments?take=${count}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Ошибка получения платежей')
  }

  return response.json()
}
