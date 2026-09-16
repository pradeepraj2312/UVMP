import { Menu, Bell, LogOut, User as UserIcon } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function Navbar({ role, onMenu }) {
  const { user, logout } = useAuth()

  const currentRole = role || user?.role || 'GUEST'
  const displayName = user?.name || 'Authorized User'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {onMenu && (
          <button
            type="button"
            onClick={onMenu}
            aria-label="Open navigation menu"
            className="md:hidden p-2 text-accent hover:bg-gray-100 rounded-control transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">Portal</span>
          <span className="text-gray-300">/</span>
          <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-wide uppercase font-heading">
            {currentRole.replace(/_/g, ' ')}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Grid Active
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 text-gray-500 hover:text-primary hover:bg-orange-50/60 rounded-control transition-colors focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-secondary to-amber-500 rounded-full ring-2 ring-white animate-pulse" />
        </button>

        <div className="h-5 w-px bg-border hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {initials || <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-semibold text-accent block leading-tight">{displayName}</span>
            <span className="text-[10px] text-gray-500 block lowercase leading-tight">{user?.email || 'authenticated'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          title="Sign out of portal"
          aria-label="Sign out of portal"
          className="p-2 text-gray-400 hover:text-primary hover:bg-red-50/70 rounded-control transition-colors ml-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
