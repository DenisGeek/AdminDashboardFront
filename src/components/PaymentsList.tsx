import type { Payment } from '../types'
interface PaymentsListProps {
  payments: Payment[]
}
export default function PaymentsList({ payments }: PaymentsListProps) {
  return (
    <div className="payments-list">
      <h2>Последние платежи</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Клиент</th>
            <th>Сумма</th>
            <th>Дата</th>
            <th>Описание</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key="{payment.id}">
              <td>{payment.id.substring(0, 6)}...</td>
              <td>{payment.clientId.substring(0, 6)}...</td>
              <td>{payment.amount.toFixed(2)}</td>
              <td>{new Date(payment.date).toLocaleDateString()}</td>
              <td>{payment.description || '-'}</td>
              <td>{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
