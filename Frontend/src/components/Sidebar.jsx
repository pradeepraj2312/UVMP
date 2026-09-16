import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  MapPin,
  Building2,
  Users,
  AlertTriangle,
  ClipboardList,
  Award,
  UserCheck,
  FileText,
  X,
  Shield,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function Sidebar({ role, open, onClose }) {
  const { user } = useAuth()
  const location = useLocation()
  const currentRole = role || user?.role || 'ADMIN'

  const navItemsByRole = {
    ADMIN: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { to: '/admin/approvals', label: 'Approvals Hub', icon: ShieldCheck },
      { to: '/admin/districts', label: 'Districts', icon: MapPin },
      { to: '/admin/ngos', label: 'Registered NGOs', icon: Building2 },
      { to: '/admin/volunteers', label: 'Volunteers Roster', icon: Users },
      { to: '/admin/reports', label: 'Platform Reports', icon: FileText },
    ],
    DISTRICT_AUTHORITY: [
      { to: '/district', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { to: '/district/incidents', label: 'Citizen Incidents', icon: AlertTriangle },
      { to: '/district/tasks', label: 'Task Board', icon: ClipboardList },
      { to: '/district/ngos', label: 'Registered NGOs', icon: Building2 },
      { to: '/district/volunteers', label: 'District Volunteers', icon: Users },
    ],
    DISTRICT: [
      { to: '/district', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { to: '/district/incidents', label: 'Citizen Incidents', icon: AlertTriangle },
      { to: '/district/tasks', label: 'Task Board', icon: ClipboardList },
      { to: '/district/ngos', label: 'Registered NGOs', icon: Building2 },
      { to: '/district/volunteers', label: 'District Volunteers', icon: Users },
    ],
    NGO: [
      { to: '/ngo', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { to: '/ngo/tasks', label: 'Manage Tasks', icon: ClipboardList },
      { to: '/ngo/volunteers', label: 'Volunteer Roster', icon: Users },
      { to: '/ngo/recognition', label: 'Certificates & Rating', icon: Award },
    ],
    VOLUNTEER: [
      { to: '/volunteer', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { to: '/volunteer/tasks', label: 'My Tasks', icon: ClipboardList },
      { to: '/volunteer/profile', label: 'Skills & Profile', icon: UserCheck },
      { to: '/volunteer/certificates', label: 'Certificates', icon: Award },
    ],
  }

  const items = navItemsByRole[currentRole] || navItemsByRole.ADMIN

  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-accent/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-accent text-white flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-control bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-red-950/40">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base tracking-tight leading-none text-white">
                UVMP<span className="text-secondary font-extrabold">.AI</span>
              </span>
              <span className="text-[9px] font-semibold text-orange-400/90 uppercase tracking-wider mt-0.5">
                Disaster Response
              </span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close navigation sidebar"
              className="md:hidden text-gray-400 hover:text-white p-2 rounded-control focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Role Workspace Label */}
        <div className="px-6 pt-5 pb-2">
          <p className="text-[10px] font-bold text-orange-400/90 uppercase tracking-wider font-heading">
            {currentRole.replace(/_/g, ' ')} WORKSPACE
          </p>
        </div>

        {/* Navigation Items */}
        <nav role="navigation" aria-label="Portal Navigation" className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-control text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none min-h-[40px] ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-red-950/30 font-bold border-l-2 border-orange-300'
                    : 'text-gray-300 hover:text-orange-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800 flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
          </span>
          <div className="flex flex-col text-[11px]">
            <span className="text-gray-200 font-medium leading-none">Emergency Grid</span>
            <span className="text-gray-400 text-[10px] mt-0.5">Systems Operational</span>
          </div>
        </div>
      </aside>
    </>
  )
}
