import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute({ roles }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-muted-foreground">Authenticating session...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (roles && roles.length > 0) {
    const userRole = user.role?.toUpperCase()
    const isAuthorized =
      roles.includes(userRole) ||
      (userRole === 'DISTRICT' && roles.includes('DISTRICT_AUTHORITY')) ||
      (userRole === 'DISTRICT_AUTHORITY' && roles.includes('DISTRICT'))

    if (!isAuthorized) {
      if (userRole === 'ADMIN') return <Navigate to="/admin" replace />
      if (userRole === 'DISTRICT' || userRole === 'DISTRICT_AUTHORITY') return <Navigate to="/district" replace />
      if (userRole === 'NGO') return <Navigate to="/ngo" replace />
      if (userRole === 'VOLUNTEER') return <Navigate to="/volunteer" replace />
      return <Navigate to="/login" replace />
    }
  }

  return <Outlet />
}
