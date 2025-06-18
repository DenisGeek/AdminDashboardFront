import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { refreshTokens } from '../api/auth'
import { useEffect, useState } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      console.log('[ProtectedRoute] Checking auth...')

      // 1. Проверяем токен
      const token = localStorage.getItem('access_token')
      if (!token) {
        console.error('[ProtectedRoute] No access_token found')
        setIsAuthenticated(false)
        setIsAuthChecked(true)
        return
      }

      // 2. Парсим пользователя
      let user = null
      try {
        const userString = localStorage.getItem('user')
        if (userString) user = JSON.parse(userString)
      } catch (e) {
        console.error('[ProtectedRoute] Failed to parse user:', e)
      }

      // 3. Проверяем срок действия
      if (user?.exp) {
        const isExpired = user.exp * 1000 < Date.now()

        if (isExpired) {
          const refreshToken = localStorage.getItem('refresh_token')
          if (!refreshToken) {
            clearAuthData()
            setIsAuthenticated(false)
            setIsAuthChecked(true)
            return
          }

          refreshTokens(refreshToken)
            .then(({ tokens, user }) => {
              localStorage.setItem('access_token', tokens.access)
              localStorage.setItem('refresh_token', tokens.refresh)
              localStorage.setItem('user', JSON.stringify(user))
              localStorage.setItem('token_expires', user.exp.toString())
              console.log('[ProtectedRoute] Data saved to localStorage')
              setIsAuthenticated(true)
            })
            .catch(() => {
              clearAuthData()
              setIsAuthenticated(false)
            })
            .finally(() => setIsAuthChecked(true))
          return
        }
      }

      setIsAuthenticated(true)
      setIsAuthChecked(true)
    }

    checkAuth()
  }, [])

  if (!isAuthChecked) {
    return null // или индикатор загрузки
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function clearAuthData() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  localStorage.removeItem('token_expires')
}
