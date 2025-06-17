import { useEffect, useState } from 'react'
import apiClient from '../api/client'

interface Client {
  id: string
  name: string
  email: string
  balanceInTokens: number
  createdAt: string
  updatedAt: string | null
}

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchClients = async () => {
    try {
      const response = await apiClient.get('/clients')
      return response.data
    } catch (error) {
      console.error('Failed to fetch clients:', error)
      throw error
    }
  }

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients()
        setClients(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  if (loading) return <div className="loading">Загрузка клиентов...</div>
  if (error) return <div className="error">Ошибка: {error}</div>
  if (clients.length === 0) return <div>Нет данных о клиентах</div>

  return (
    <div className="client-list">
      <h2>Список клиентов</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Баланс (T)</th>
            <th>Дата создания</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={`${client.id}-${client.createdAt}`}>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.balanceInTokens.toFixed(2)}</td>
              <td>{new Date(client.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
