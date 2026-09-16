import { Navigate } from 'react-router-dom'
import { useAuth } from './context/useAuth'

export default function App() {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-muted-foreground">Loading UVMP Portal...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const role = user.role?.toUpperCase()

  if (role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }
  if (role === 'DISTRICT' || role === 'DISTRICT_AUTHORITY') {
    return <Navigate to="/district" replace />
  }
  if (role === 'NGO') {
    return <Navigate to="/ngo" replace />
  }
  if (role === 'VOLUNTEER') {
    return <Navigate to="/volunteer" replace />
  }

  return <Navigate to="/login" replace />
}
