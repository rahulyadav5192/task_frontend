import axios, { AxiosHeaders } from 'axios'
import { clearToken, getToken } from '../utils/storage'

const baseURL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export const client = axios.create({
  baseURL: baseURL || undefined,
})

client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    const headers = AxiosHeaders.from(config.headers)
    headers.set('Authorization', `Bearer ${token}`)
    config.headers = headers
  }
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearToken()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(err)
  }
)
