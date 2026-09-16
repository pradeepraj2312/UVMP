import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield,
  AlertTriangle,
  Users,
  Building2,
  MapPin,
  LogIn,
  ArrowRight,
  Radio,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  PhoneCall
} from 'lucide-react'
import { useAuth } from '../../context/useAuth'

export default function Landing() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ' UTC+05:30'
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const getDashboardPath = () => {
    if (!user) return '/login'
    const role = user.role?.toUpperCase()
    if (role === 'ADMIN') return '/admin'
    if (role === 'DISTRICT' || role === 'DISTRICT_AUTHORITY') return '/district'
    if (role === 'NGO') return '/ngo'
    if (role === 'VOLUNTEER') return '/volunteer'
    return '/login'
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-600 selection:text-white">
      {/* Top Telemetry Ticker */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 py-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ACTIVE
            </span>
            <span className="text-slate-400 hidden sm:inline">
              UVMP NATIONAL DISASTER RESPONSE INFRASTRUCTURE
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="tabular-nums font-mono">{timeStr}</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-red-400 font-semibold">
              <PhoneCall className="w-3.5 h-3.5" />
              NDMA HOTLINE: 1078 / 112
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-red-900/30 border border-red-500/30 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-wider text-white">UVMP<span className="text-red-500">-AI</span></span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950/80 border border-red-800 text-red-400 font-mono font-bold">OPS</span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-tight leading-none">Unified Volunteer & Disaster Management</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Direct Citizen Incident SOS */}
            <Link
              to="/incident-report"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-600/15 border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white transition-all font-semibold text-xs tracking-wide shadow-sm hover:shadow-red-900/40"
            >
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">CITIZEN SOS</span> REPORT
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => navigate(getDashboardPath())}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold text-xs tracking-wide shadow-md shadow-red-900/40 hover:brightness-110 transition-all cursor-pointer"
              >
                <span>ENTER COMMAND CENTER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs tracking-wide transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                <span>SIGN IN</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          {/* Subtle Background Radar Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(193,39,45,0.18),rgba(255,255,255,0))] pointer-events-none" />

          <div className="relative text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono mb-4 shadow-sm">
              <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>INTER-AGENCY CRISIS TELEMETRY & 50/30/20 AI DISPATCH</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Mission-Critical Command for <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300">Disaster Mobilization</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              UVMP synchronizes District Authorities, accredited NGOs, and emergency volunteer corps under a unified, real-time command grid with verified credentialing.
            </p>
          </div>

          {/* Citizen SOS Banner */}
          <div className="mb-14 max-w-4xl mx-auto">
            <div className="relative rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/40 border border-red-600/40 p-5 sm:p-6 shadow-xl shadow-red-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white uppercase tracking-wider">Citizen Emergency SOS Portal</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-600 text-white">NO LOGIN REQUIRED</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    Witnessing or trapped in a life-safety crisis? Transmit coordinates, category, and severity directly to the District Command Desk.
                  </p>
                </div>
              </div>
              <Link
                to="/incident-report"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 transition-all shrink-0 hover:scale-102"
              >
                <span>Report Incident Now</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Four Distinct Registration Entry Points */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-lg font-bold uppercase tracking-widest text-slate-300 font-mono">
                Select Your Operational Command Role
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose the appropriate accreditation pathway. All registrations undergo verified clearance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Volunteer */}
              <div className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/60 transition-all p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-orange-950/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-orange-400 tracking-wider uppercase">Field Corps</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Volunteer Responder</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Register with your emergency skills, transport, and availability. Choose an NGO, District, or General Pool.
                  </p>
                </div>
                <Link
                  to="/register/volunteer"
                  className="w-full py-2.5 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-950/50"
                >
                  <span>Register Volunteer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 2: NGO */}
              <div className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-red-500/60 transition-all p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-red-950/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider uppercase">Relief Agency</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Partner NGO</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Request official NGO accreditation, manage relief tasks, mobilize affiliated personnel, and award recognition certificates.
                  </p>
                </div>
                <Link
                  to="/register/ngo"
                  className="w-full py-2.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-red-950/50"
                >
                  <span>Register NGO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 3: District Authority */}
              <div className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/60 transition-all p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-amber-950/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400 tracking-wider uppercase">Command Sector</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">District Authority</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Petition for municipal or district operational command. Oversee incident triage, convert tasks, and monitor active NGOs.
                  </p>
                </div>
                <Link
                  to="/register/district-authority"
                  className="w-full py-2.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-950/50"
                >
                  <span>Register District</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 4: Sign In */}
              <div className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 transition-all p-6 flex flex-col justify-between hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-600" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 transition-transform">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Existing Accounts</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Sign In Portal</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Access your active command console. Supports Administrator, District Authority, NGO Coordinator, and Volunteer sessions.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <span>Account Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Operational Architecture Pillars */}
          <div className="max-w-5xl mx-auto mt-20 pt-12 border-t border-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <div className="flex items-center gap-2.5 mb-2 text-red-400">
                  <Sparkles className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-white">50/30/20 AI Dispatch</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calculates composite candidate scores grounded in Skill Compatibility (50%), GPS Proximity (30%), and Field Reliability (20%).
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <div className="flex items-center gap-2.5 mb-2 text-orange-400">
                  <Shield className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-white">Multi-Tier Approval Matrix</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict authorization governance: NGOs verify their corps, District Authorities vet direct enlistments, and Admin certifies agencies.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <div className="flex items-center gap-2.5 mb-2 text-amber-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-white">Verifiable Credentials</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cryptographically trackable certificates of service with tamper-proof reference codes, service hours, and rating verification.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600" />
            <span>UVMP-AI National Emergency Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Disaster Relief: 1078</span>
            <span>Emergency Police/Fire/Ambulance: 112</span>
            <Link to="/login" className="hover:text-slate-300 transition-colors">Admin Desk</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
