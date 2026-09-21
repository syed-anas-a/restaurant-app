import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, check if we have a stored token
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      // Decode the JWT payload to get basic user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ id: payload.user_id, email: payload.email || null })
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/users/login/', { email, password })
    const { access, refresh } = res.data
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)

    const payload = JSON.parse(atob(access.split('.')[1]))
    setUser({ id: payload.user_id, email })
    return res.data
  }

  const register = async (data) => {
    const res = await api.post('/users/register/', data)
    const { access, refresh } = res.data
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)

    const payload = JSON.parse(atob(access.split('.')[1]))
    setUser({ id: payload.user_id, email: data.email })
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
