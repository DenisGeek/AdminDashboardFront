// src/api/rate.ts
import axios from 'axios'
import type { Rate, UpdateRateRequest } from '../types'
import apiClient from './client'

export const getRate = async (): Promise<Rate> => {
  try {
    const response = await apiClient.get('/rate')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          'Ошибка получения курса'
      )
    }
    throw new Error('Неизвестная ошибка при получении курса')
  }
}

export const updateRate = async (data: UpdateRateRequest): Promise<Rate> => {
  try {
    const response = await apiClient.post('/rate', data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          'Ошибка обновления курса'
      )
    }
    throw new Error('Неизвестная ошибка при обновлении курса')
  }
}
