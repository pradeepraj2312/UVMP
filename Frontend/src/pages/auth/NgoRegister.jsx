import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Building2,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react'
import apiClient from '../../api/client'

export default function NgoRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    contactInfo: '',
    licenseNumber: '',
    districtId: ''
  })

  const [districts, setDistricts] = useState([])
  const [loadingDistricts, setLoadingDistricts] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successData, setSuccessData] = useState(null)

  useEffect(() => {
    apiClient.get('/public/registration-options')
      .then((res) => {
        if (res.data?.data?.districts) {
          const distList = res.data.data.districts
          setDistricts(distList)
          if (distList.length > 0) {
            setFormData((prev) => ({ ...prev, districtId: String(distList[0].id) }))
          }
        }
      })
      .catch(() => {
        setError('Failed to fetch operational districts list.')
      })
      .finally(() => setLoadingDistricts(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      contactInfo: `${formData.contactInfo.trim()} (License: ${formData.licenseNumber.trim() || 'N/A'})`,
      licenseNumber: formData.licenseNumber.trim(),
      districtId: Number(formData.districtId)
    }

    try {
      const res = await apiClient.post('/auth/register/ngo', payload)
      if (res.data?.data) {
        setSuccessData(res.data.data)
      } else {
        setSuccessData({
          message: 'Your NGO accreditation petition has been recorded.',
          approver: 'UVMP Platform Administration'
        })
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'NGO registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (successData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl relative text-center">
          <div className="w-16 h-16 rounded-full bg-red-600/10 border-2 border-red-500/50 flex items-center justify-center text-red-400 mx-auto mb-6">
            <Clock className="w-8 h-8 animate-spin-slow" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-mono font-bold uppercase mb-3">
            Status: PENDING ACCREDITATION AUDIT
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">NGO Registration Submitted</h2>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 mb-6 text-left space-y-2">
            <p className="font-semibold text-white">Reviewing Body:</p>
            <p className="text-red-400 font-mono text-base font-bold flex items-center gap-2">
              <Shield className="w-4 h-4" />
              UVMP Platform Administration
            </p>
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-800 leading-relaxed">
              Your disaster relief organization's credentials and statutory registration details have been placed into the administrative accreditation queue. Once verified by Platform Administration, coordinator credentials will be unlocked.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
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
          <span className="text-red-400 font-bold">FORM-NGO-02 // RELIEF AGENCY</span>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/40 p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-wide">NGO Partner Accreditation</h1>
              <p className="text-xs text-slate-400">Onboard your relief foundation or humanitarian agency onto the UVMP network.</p>
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
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Official Organization Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. National Emergency Relief Foundation"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-red-500 focus:outline-none text-sm text-white placeholder-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Official Agency Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@relief-agency.org"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-red-500 focus:outline-none text-sm text-white placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Coordinator Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-red-500 focus:outline-none text-sm text-white placeholder-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Agency Operations Hotline *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98111 22334"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-red-500 focus:outline-none text-sm text-white placeholder-slate-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Lead Coordinator Name & Title *</label>
                <input
                  type="text"
                  required
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Verma (Disaster Director)"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-red-500 focus:outline-none text-sm text-white placeholder-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Primary Operating District *</label>
                <select
                  required
                  value={formData.districtId}
                  onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                  disabled={loadingDistricts || districts.length === 0}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-red-500 focus:outline-none text-sm text-white"
                >
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.region})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Statutory Registration / FCRA / DARPAN ID</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="e.g. DARPAN-MH-2024-8891"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-red-500 focus:outline-none text-sm text-white placeholder-slate-600 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Transmitting Accreditation Petition...</span>
              </>
            ) : (
              <>
                <span>Submit NGO Accreditation Application</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
