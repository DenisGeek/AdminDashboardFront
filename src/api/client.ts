import axios from 'axios'

// 1. Создаем экземпляр axios
const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Базовый URL API
  timeout: 10000, // Таймаут 10 секунд
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// 2. Добавляем интерсептор для авторизации
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 3. Добавляем интерсептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Попытка обновить токен
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post('/auth/refresh', { refreshToken })

        localStorage.setItem('access_token', response.data.access)
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        // Если обновление не удалось - разлогиниваем
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('token_expires')
        localStorage.removeItem('user')

        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
