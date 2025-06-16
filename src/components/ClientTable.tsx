import type { Client } from '../types'

interface ClientTableProps {
  clients: Client[]
  conversionRate: number // Теперь принимаем только число для конвертации
}

export default function ClientTable({ clients }: ClientTableProps) {
  return (
    <div className="client-table">
      <h2>Клиенты</h2>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Email</th>
            <th>Баланс (T)</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.balanceInTokens}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
