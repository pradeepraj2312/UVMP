import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, AlertCircle, ArrowRight, CheckCircle2, Lock, Mail, Users, Building2, MapPin, ShieldAlert } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import Button from '../../components/Button'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('admin@uvmp.local')
  const [password, setPassword] = useState('Admin123!')
  const [pendingInfo, setPendingInfo] = useState(null)
  const [rejectedInfo, setRejectedInfo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const demoAccounts = [
    { role: 'Admin', email: 'admin@uvmp.local', pass: 'Admin123!', icon: Shield, tone: 'text-primary' },
    { role: 'District Authority', email: 'district@uvmp.local', pass: 'District123!', icon: MapPin, tone: 'text-secondary' },
    { role: 'NGO', email: 'ngo1@uvmp.local', pass: 'Ngo123!', icon: Building2, tone: 'text-amber-600' },
    { role: 'Volunteer', email: 'volunteer1@uvmp.local', pass: 'Volunteer123!', icon: Users, tone: 'text-emerald-600' },
  ]

  const handleDemoSelect = (demoEmail, demoPass) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setError('')
    setPendingInfo(null)
    setRejectedInfo(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setPendingInfo(null)
    setRejectedInfo(null)
    setLoading(true)

    try {
      const user = await login(email, password)
      const role = user.role?.toUpperCase()
      if (role === 'ADMIN') {
        navigate('/admin')
      } else if (role === 'DISTRICT' || role === 'DISTRICT_AUTHORITY') {
        navigate('/district')
      } else if (role === 'NGO') {
        navigate('/ngo')
      } else if (role === 'VOLUNTEER') {
        navigate('/volunteer')
      } else {
        navigate('/login')
      }
    } catch (err) {
      const resData = err.response?.data
      if (resData?.code === 'ACCOUNT_PENDING') {
        setPendingInfo({
          approver: resData.approver || 'Platform Administration',
          message: resData.message || 'Your account is awaiting approval.'
        })
      } else if (resData?.code === 'ACCOUNT_REJECTED') {
        setRejectedInfo({
          reason: resData.reason || 'Criteria not met',
          message: resData.message || 'Registration was rejected.'
        })
      } else {
        setError(resData?.message || err.message || 'Login failed. Please verify credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      {/* Top Banner for Public Incident SOS */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 px-4">
        <Link
          to="/incident-report"
          className="group flex items-center justify-between p-3.5 bg-red-600 text-white border border-red-700 rounded-xl hover:bg-red-700 transition shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-black/20 text-white rounded-lg group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <div className="text-left">
              <p className="text-xs font-bold font-heading uppercase tracking-wide">Emergency SOS Incident Transmit</p>
              <p className="text-[11px] text-red-100">Reporting an active crisis? No credentials required</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-red-500 border border-slate-800 shadow-sm mb-3 hover:scale-105 transition-transform">
            <Shield className="w-6 h-6" />
          </Link>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground tracking-tight">
            UVMP<span className="text-orange-500 font-black">.AI</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Unified Crisis Coordination & Volunteer Mobilization Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card py-7 px-6 sm:px-8 border border-border rounded-xl shadow-xs">
          {/* Informative Pending Approval Banner */}
          {pendingInfo && (
            <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Account Awaiting Authorization</span>
              </div>
              <p className="text-xs leading-relaxed mb-2">{pendingInfo.message}</p>
              <div className="p-2 rounded bg-amber-500/15 border border-amber-500/30 text-[11px] font-mono">
                <span className="font-bold">Pending Review By:</span> {pendingInfo.approver}
              </div>
            </div>
          )}

          {/* Informative Rejection Banner */}
          {rejectedInfo && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-900 dark:text-red-200 text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Registration Declined</span>
              </div>
              <p className="text-xs leading-relaxed mb-2">{rejectedInfo.message}</p>
              <div className="p-2 rounded bg-red-500/15 border border-red-500/30 text-[11px] font-mono">
                <span className="font-bold">Reason Provided:</span> {rejectedInfo.reason}
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Official Email / Call-Sign
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@uvmp.local"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-background border border-border rounded-lg text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Access Key / Password
                </label>
                <span className="text-[11px] text-muted-foreground hover:text-red-600 cursor-pointer">
                  Recovery Key?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-background border border-border rounded-lg text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-colors font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-2.5 mt-2 font-heading tracking-wide uppercase text-xs font-bold"
            >
              Authenticate & Enter Command Center
            </Button>
          </form>

          {/* 1-Click Demo Accounts Quick Selector */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider text-center mb-3">
              Rapid Role Access Keys (Demo)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon
                const isSelected = email === acc.email
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleDemoSelect(acc.email, acc.pass)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition ${
                      isSelected
                        ? 'border-red-600 bg-red-50/50 dark:bg-red-950/20 text-foreground font-semibold shadow-xs'
                        : 'border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${acc.tone}`} />
                    <span className="truncate text-xs">{acc.role}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-red-600 ml-auto shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-muted-foreground">
            New organization or responder?{' '}
            <Link to="/register" className="font-semibold text-red-600 dark:text-red-400 hover:underline">
              Request Platform Accreditation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
