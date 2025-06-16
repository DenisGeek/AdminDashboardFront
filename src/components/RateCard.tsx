import { useState } from 'react'
import { updateRate } from '../api/rate'
import type { Rate } from '../types'

interface RateCardProps {
  rate: Rate
  onRateUpdated: (newRate: Rate) => void
}

export default function RateCard({ rate, onRateUpdated }: RateCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newValue, setNewValue] = useState(rate.value.toString())
  const [error, setError] = useState('')

  const handleUpdate = async () => {
    try {
      const numericValue = parseFloat(newValue)
      if (isNaN(numericValue) || numericValue <= 0) {
        throw new Error('Курс должен быть положительным числом')
      }

      const updatedRate = await updateRate({
        newRate: numericValue,
        baseCurrency: rate.baseCurrency,
        targetCurrency: rate.targetCurrency,
      })

      onRateUpdated(updatedRate)
      setIsEditing(false)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления')
    }
  }

  return (
    <div className="rate-card">
      <h3>Курс обмена</h3>
      {isEditing ? (
        <div>
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            step="0.01"
            min="0.01"
          />
          <button onClick={handleUpdate}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <div>
          <p>
            1 {rate.targetCurrency} = {rate.value} {rate.baseCurrency}
          </p>
          <p>Обновлено: {new Date(rate.lastUpdated).toLocaleString()}</p>
          <button onClick={() => setIsEditing(true)}>Изменить курс</button>
        </div>
      )}
    </div>
  )
}
