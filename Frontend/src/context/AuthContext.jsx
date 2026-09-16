import { useState, useEffect, useCallback } from 'react'
import apiClient from '../api/client'
import { AuthContext } from './AuthContextDefinition'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('uvmp_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('uvmp_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('uvmp_token')
      const savedUser = localStorage.getItem('uvmp_user')
      if (savedToken && savedUser) {
        if (savedToken.startsWith('demo_token_')) {
          try {
            setUser(JSON.parse(savedUser))
          } catch {
            setUser(null)
          }
          setLoading(false)
          return
        }
        try {
          const res = await apiClient.get('/auth/me')
          if (res.data?.data) {
            setUser(res.data.data)
            localStorage.setItem('uvmp_user', JSON.stringify(res.data.data))
          }
        } catch {
          localStorage.removeItem('uvmp_token')
          localStorage.removeItem('uvmp_user')
          setUser(null)
          setToken(null)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password })
      const { token: jwtToken, user: userData } = res.data?.data || {}
      if (jwtToken && userData) {
        localStorage.setItem('uvmp_token', jwtToken)
        localStorage.setItem('uvmp_user', JSON.stringify(userData))
        setToken(jwtToken)
        setUser(userData)
        return userData
      }
      throw new Error('Invalid response format from server')
    } catch (err) {
      // If backend is offline, support seamless local demo access for the 4 seed accounts
      const demoAccounts = {
        'admin@uvmp.local': { id: 1, name: 'Platform Admin', email: 'admin@uvmp.local', role: 'ADMIN', status: 'ACTIVE' },
        'district@uvmp.local': { id: 2, name: 'District Authority Officer', email: 'district@uvmp.local', role: 'DISTRICT_AUTHORITY', status: 'ACTIVE' },
        'ngo1@uvmp.local': { id: 3, name: 'Hope Relief NGO', email: 'ngo1@uvmp.local', role: 'NGO', status: 'ACTIVE' },
        'volunteer1@uvmp.local': { id: 4, name: 'Alex Volunteer', email: 'volunteer1@uvmp.local', role: 'VOLUNTEER', status: 'ACTIVE' },
      }

      const isNetworkError = !err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')
      if (isNetworkError && demoAccounts[email]) {
        const mockUser = demoAccounts[email]
        const mockToken = `demo_token_${mockUser.role.toLowerCase()}`
        localStorage.setItem('uvmp_token', mockToken)
        localStorage.setItem('uvmp_user', JSON.stringify(mockUser))
        setToken(mockToken)
        setUser(mockUser)
        return mockUser
      }

      throw err
    }
  }, [])

  const register = useCallback(async (name, email, password, role, extra = {}) => {
    try {
      const res = await apiClient.post('/auth/register', { name, email, password, role, ...extra })
      const { token: jwtToken, user: userData } = res.data?.data || {}
      if (jwtToken && userData) {
        localStorage.setItem('uvmp_token', jwtToken)
        localStorage.setItem('uvmp_user', JSON.stringify(userData))
        setToken(jwtToken)
        setUser(userData)
        return userData
      }
      throw new Error('Invalid response format from server')
    } catch (err) {
      const isNetworkErr = !err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')
      if (isNetworkErr) {
        const mockUser = {
          id: Math.floor(100 + Math.random() * 900),
          name,
          email,
          role,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        }
        const mockToken = `demo_token_${role.toLowerCase()}`
        localStorage.setItem('uvmp_token', mockToken)
        localStorage.setItem('uvmp_user', JSON.stringify(mockUser))
        setToken(mockToken)
        setUser(mockUser)
        return mockUser
      }
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('uvmp_token')
    localStorage.removeItem('uvmp_user')
    setUser(null)
    setToken(null)
  }, [])

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
