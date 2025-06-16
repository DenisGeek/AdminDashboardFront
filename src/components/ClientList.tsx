import { useEffect, useState } from 'react'

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

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/clients', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Ошибка загрузки клиентов')
        }

        const data = await response.json()
        setClients(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  if (loading) return <div>Загрузка...</div>
  if (error) return <div className="error">{error}</div>

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
            <tr key={client.id}>
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
