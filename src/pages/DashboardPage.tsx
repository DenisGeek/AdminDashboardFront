import { useEffect, useState } from 'react'
import ClientList from '../components/ClientList'
import PaymentsList from '../components/PaymentsList'
import RateCard from '../components/RateCard'
import { getRate } from '../api/rate'
import { getRecentPayments } from '../api/payments'
import type { Rate, Payment } from '../types'

export default function DashboardPage() {
  const [rate, setRate] = useState<Rate | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rateData, paymentsData] = await Promise.all([
          getRate(),
          getRecentPayments(5),
        ])
        setRate(rateData)
        setPayments(paymentsData)
      } catch (err) {
        setError('Ошибка загрузки данных')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Загрузка...</div>
  if (error) return <div className="error">{error}</div>
  if (!rate) return <div>Курс не загружен</div>

  return (
    <div>
      <h1>Админ панель</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div
          style={{
            flex: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <ClientList />
          <PaymentsList payments={payments} />
        </div>
        <div style={{ flex: 1 }}>
          <RateCard rate={rate} onRateUpdated={(newRate) => setRate(newRate)} />
        </div>
      </div>
    </div>
  )
}
