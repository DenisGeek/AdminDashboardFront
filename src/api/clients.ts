import type { Client } from '../types'

export const getClients = async (): Promise<Client[]> => {
  const token = localStorage.getItem('access_token')
  const response = await fetch('/clients', {
    // method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch clients')
  }

  return response.json()
}
