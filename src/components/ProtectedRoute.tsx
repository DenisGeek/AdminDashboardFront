import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  // 1. Логируем все значения из localStorage
  console.log('[ProtectedRoute] Checking auth...')
  console.log('[ProtectedRoute] localStorage:', {
    access_token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token'),
    user: localStorage.getItem('user'),
    token_expires: localStorage.getItem('token_expires'),
  })

  // 2. Проверяем токен
  const token = localStorage.getItem('access_token')
  if (!token) {
    console.error('[ProtectedRoute] No access_token found')
    return <Navigate to="/login" replace />
  }

  // 3. Парсим пользователя с обработкой ошибок
  let user = null
  try {
    const userString = localStorage.getItem('user')
    if (userString) {
      user = JSON.parse(userString)
      console.log('[ProtectedRoute] Parsed user:', user)
    }
  } catch (e) {
    console.error('[ProtectedRoute] Failed to parse user:', e)
  }

  // 4. Проверяем срок действия
  if (user?.exp) {
    const isExpired = user.exp * 1000 < Date.now()
    console.log(`[ProtectedRoute] Token expiration check: 
      Expires: ${new Date(user.exp * 1000)}
      Current: ${new Date()}
      Is expired: ${isExpired}`)

    if (isExpired) {
      console.error('[ProtectedRoute] Token expired')
      clearAuthData()
      return <Navigate to="/login" replace />
    }
  }

  console.log('[ProtectedRoute] Access granted')
  return children
}

function clearAuthData() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  localStorage.removeItem('token_expires')
}
