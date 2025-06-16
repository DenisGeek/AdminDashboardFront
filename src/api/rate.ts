import type { Rate, UpdateRateRequest } from '../types'

export const getRate = async (): Promise<Rate> => {
  const token = localStorage.getItem('token')
  const response = await fetch('http://localhost:5000/rate', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Ошибка получения курса')
  }

  return response.json()
}

export const updateRate = async (data: UpdateRateRequest): Promise<Rate> => {
  const token = localStorage.getItem('token')
  const response = await fetch('http://localhost:5000/rate', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Ошибка обновления курса')
  }

  return response.json()
}
