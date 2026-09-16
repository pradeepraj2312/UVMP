import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  AlertCircle,
  Clock,
  ArrowRight,
  Landmark
} from 'lucide-react'
import apiClient from '../../api/client'

export default function DistrictAuthorityRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    districtName: '',
    region: 'Metropolitan & Urban Command Zone'
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successData, setSuccessData] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      districtName: formData.districtName.trim(),
      region: formData.region.trim()
    }

    try {
      const res = await apiClient.post('/auth/register/district-authority', payload)
      if (res.data?.data) {
        setSuccessData(res.data.data)
      } else {
        setSuccessData({
          message: 'District Authority petition recorded.',
          approver: 'UVMP Platform Administration'
        })
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'District Authority registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (successData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl relative text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 mx-auto mb-6">
            <Clock className="w-8 h-8 animate-spin-slow" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-400 text-xs font-mono font-bold uppercase mb-3">
            Status: PENDING JURISDICTION CLEARANCE
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">District Authority Petition Submitted</h2>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 mb-6 text-left space-y-2">
            <p className="font-semibold text-white">Reviewing Body:</p>
            <p className="text-amber-400 font-mono text-base font-bold flex items-center gap-2">
              <Shield className="w-4 h-4" />
              UVMP Platform Administration
            </p>
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-800 leading-relaxed">
              Your sector jurisdiction petition for <strong className="text-slate-200">{formData.districtName}</strong> has been transmitted to Platform Administration. Once government credentials and command boundaries are validated, your command desk login will be authorized.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Go to Sign In
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Return to Landing
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 text-xs font-mono">
          <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            &larr; Back to Operational Portal
          </Link>
          <span className="text-amber-400 font-bold">FORM-DIST-03 // COMMAND SECTOR</span>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-900/40 p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-wide">District Authority Command Desk</h1>
              <p className="text-xs text-slate-400">Establish or claim operational command jurisdiction for your municipal or district zone.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Officer Full Legal Name & Designation *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Commander Vinod Deshmukh (District Disaster Officer)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Official Government / Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="officer@disaster-authority.gov.in"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Command Desk Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Direct Command Desk Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 94222 55667"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder-slate-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Jurisdiction Sector Name *</label>
                <input
                  type="text"
                  required
                  value={formData.districtName}
                  onChange={(e) => setFormData({ ...formData, districtName: e.target.value })}
                  placeholder="e.g. Pune Metropolitan Command Sector"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Region / Operational Zone *</label>
              <input
                type="text"
                required
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                placeholder="e.g. Western Ghats Coastal Zone"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting Jurisdiction Petition...</span>
              </>
            ) : (
              <>
                <span>Submit District Authority Petition</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
