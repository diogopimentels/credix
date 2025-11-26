import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { loginRequest } from '../api/auth'

type AuthContextValue = {
  user: any | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem('token'))

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    const data = await loginRequest(email, password)
    const t = data.token
    setToken(t)
    localStorage.setItem('token', t)
    setUser(data.user || null)
    setLoading(false)
  }, [])

  useEffect(() => {
    async function verify() {
      const tokenFromStorage = localStorage.getItem('token')
      if (!tokenFromStorage) {
        setLoading(false)
        return
      }
      // Mock verification: just assume valid if token exists
      setUser({ id: 1, name: 'Admin User', email: 'admin@credix.com', role: 'admin' })
      setToken(tokenFromStorage)
      setLoading(false)
    }
    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
