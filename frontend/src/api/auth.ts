import { mockDB } from '../services/mockData'

export interface LoginResponse {
  token: string
  user: any
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  // Mock login - accept any credentials for now, or check against a hardcoded user
  // For prototype mode, we just return success
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          name: 'Admin User',
          email: email,
          role: 'admin'
        }
      })
    }, 500) // Simulate network delay
  })
}

export async function fetchProfile() {
  return Promise.resolve({
    id: 1,
    name: 'Admin User',
    email: 'admin@credix.com',
    role: 'admin'
  })
}
