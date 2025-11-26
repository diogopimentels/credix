import axios from 'axios'

const env = (import.meta as any).env || {}
// Prefer explicit VITE_API_URL, otherwise use sensible dev default
const baseURL = env.VITE_API_URL || (env.DEV ? 'http://localhost:4000' : '')

const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn
}

http.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      ;(config.headers as any).Authorization = `Bearer ${token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      if (onUnauthorized) onUnauthorized()
    }
    return Promise.reject(error)
  }
)

export default http
