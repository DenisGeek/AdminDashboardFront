import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('[LoginPage] Attempting login...')
      const { tokens, user } = await login(email, password)

      console.log('[LoginPage] Login successful, tokens:', {
        access: tokens.access ? 'exists' : 'missing',
        refresh: tokens.refresh ? 'exists' : 'missing',
      })
      console.log('[LoginPage] User data:', user)

      localStorage.setItem('access_token', tokens.access)
      localStorage.setItem('refresh_token', tokens.refresh)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token_expires', user.exp.toString())

      console.log('[LoginPage] Data saved to localStorage')
      console.log('[LoginPage] Navigating to /dashboard...')
      navigate('/dashboard')
    } catch (err) {
      console.error('[LoginPage] Login failed:', err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h1>Вход в систему</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            placeholder="admin@mirra.dev"
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
