import { Link } from 'react-router-dom'
import {
  Shield,
  Users,
  Building2,
  MapPin,
  ArrowRight,
  ShieldAlert
} from 'lucide-react'

export default function Register() {
  const roles = [
    {
      to: '/register/volunteer',
      title: 'Volunteer Responder',
      badge: 'FIELD CORPS',
      desc: 'Enlist with your specialized disaster skills (First Aid, Search & Rescue, Logistics) and select an NGO, District, or General Pool affiliation.',
      icon: Users,
      color: 'orange',
      btnText: 'Start Volunteer Enlistment'
    },
    {
      to: '/register/ngo',
      title: 'NGO Partner Agency',
      badge: 'RELIEF ENTITY',
      desc: 'Submit platform accreditation, register coordinator credentials, and link your humanitarian unit to operating districts.',
      icon: Building2,
      color: 'red',
      btnText: 'Start NGO Accreditation'
    },
    {
      to: '/register/district-authority',
      title: 'District Authority',
      badge: 'COMMAND SECTOR',
      desc: 'Petition for municipal or district operational command jurisdiction to triage emergency citizen reports and coordinate disaster tasks.',
      icon: MapPin,
      color: 'amber',
      btnText: 'Start District Registration'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto w-full">
        {/* Top SOS Link */}
        <div className="mb-6">
          <Link
            to="/incident-report"
            className="group flex items-center justify-between p-3.5 bg-red-600/20 text-red-300 border border-red-500/40 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-red-600/30 text-red-400 group-hover:text-white rounded-lg">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wide">Looking to report an emergency?</p>
                <p className="text-[11px] text-slate-300">Submit an anonymous citizen crisis SOS without logging in</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-red-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-red-500 border border-slate-800 shadow-sm mb-3 hover:scale-105 transition-transform">
            <Shield className="w-6 h-6" />
          </Link>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Accreditation & Enlistment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Choose your designated command role to initiate specialized registration.
          </p>
        </div>

        {/* 3 Entry Point Cards */}
        <div className="grid grid-cols-1 gap-4">
          {roles.map((r) => {
            const Icon = r.icon
            return (
              <div
                key={r.title}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white shrink-0">
                    <Icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider px-2 py-0.5 rounded bg-orange-950/80 border border-orange-900/60">
                        {r.badge}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white">{r.title}</h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">{r.desc}</p>
                  </div>
                </div>

                <Link
                  to={r.to}
                  className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shrink-0 shadow-md shadow-orange-950/40"
                >
                  <span>{r.btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          Already have an authorized command key?{' '}
          <Link to="/login" className="font-semibold text-orange-400 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  )
}
