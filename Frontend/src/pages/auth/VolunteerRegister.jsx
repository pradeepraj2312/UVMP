import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Users,
  Building2,
  MapPin,
  Compass,
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
  Radio
} from 'lucide-react'
import apiClient from '../../api/client'

const SKILLS_LIST = [
  'Trauma First Aid',
  'Search & Rescue',
  'Medical Triage',
  'Emergency Driving',
  'Water & Flood Rescue',
  'Fire Safety & Suppression',
  'Food & Shelter Logistics',
  'Telecom & Radio Ops',
  'Disaster Counseling'
]

const TRANSPORT_OPTIONS = [
  { id: 'NONE', label: 'On-Foot / Public Transit', desc: 'Urban walking or localized rapid response' },
  { id: 'MOTORCYCLE', label: 'Motorcycle / Two-Wheeler', desc: 'Fast passage through congested or debris zones' },
  { id: 'FOUR_WHEELER', label: '4x4 / Light Emergency Vehicle', desc: 'Personnel & medical supply transport' },
  { id: 'HEAVY', label: 'Heavy Logistics / Truck', desc: 'Large-scale food, tent, and equipment haulage' }
]

export default function VolunteerRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    transport: 'NONE',
    latitude: 18.5204,
    longitude: 73.8567
  })

  const [selectedSkills, setSelectedSkills] = useState(['Trauma First Aid'])
  const [affiliationType, setAffiliationType] = useState('NGO') // 'NGO', 'DISTRICT', 'COMMON'
  const [selectedNgoId, setSelectedNgoId] = useState('')
  const [selectedDistrictId, setSelectedDistrictId] = useState('')

  const [options, setOptions] = useState({ ngos: [], districts: [] })
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [gpsStatus, setGpsStatus] = useState(null)
  const [successData, setSuccessData] = useState(null)

  useEffect(() => {
    apiClient.get('/public/registration-options')
      .then((res) => {
        if (res.data?.data) {
          const ngos = res.data.data.ngos || []
          const districts = res.data.data.districts || []
          setOptions({ ngos, districts })
          if (ngos.length > 0) setSelectedNgoId(String(ngos[0].id))
          if (districts.length > 0) setSelectedDistrictId(String(districts[0].id))
        }
      })
      .catch(() => {
        setError('Failed to load active accreditation lists. Please check server connection.')
      })
      .finally(() => setLoadingOptions(false))
  }, [])

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported by browser.')
      return
    }
    setGpsStatus('Acquiring satellite fix...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6))
        const lng = parseFloat(pos.coords.longitude.toFixed(6))
        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
        setGpsStatus(`Locked: ${lat}, ${lng}`)
      },
      (err) => {
        setGpsStatus('GPS acquisition failed: ' + err.message)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    if (selectedSkills.length === 0) {
      setError('Please select at least one core emergency skill.')
      setSubmitting(false)
      return
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      skills: selectedSkills.join(', '),
      transport: formData.transport,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      ngoId: affiliationType === 'NGO' && selectedNgoId ? Number(selectedNgoId) : null,
      districtId: affiliationType === 'DISTRICT' && selectedDistrictId ? Number(selectedDistrictId) : null
    }

    try {
      const res = await apiClient.post('/auth/register/volunteer', payload)
      if (res.data?.data) {
        setSuccessData(res.data.data)
      } else {
        setSuccessData({
          message: 'Registration submitted successfully. Pending review.',
          approver: 'Assigned Approving Authority'
        })
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.')
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
            Status: PENDING REVIEW
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">Volunteer Enlistment Submitted</h2>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 mb-6 text-left space-y-2">
            <p className="font-semibold text-white">Reviewing Authority:</p>
            <p className="text-orange-400 font-mono text-base font-bold flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {successData.approver}
            </p>
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-800 leading-relaxed">
              Your credentials, emergency skills, and field transport details have been submitted. For operational security, your account will be activated once verified by the authorized authority above.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
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
      <div className="max-w-3xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6 text-xs font-mono">
          <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            &larr; Back to Operational Portal
          </Link>
          <span className="text-orange-400 font-bold">FORM-VOL-01 // FIELD CORPS</span>
        </div>

        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-900/40 p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-wide">Volunteer Corps Enlistment</h1>
              <p className="text-xs text-slate-400">Enroll as an accredited emergency responder on the UVMP grid.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Credentials */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 font-mono mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              1. Personal & Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Commander Arjun Patel"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 focus:outline-none text-sm text-white placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Official Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="volunteer@domain.org"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 focus:outline-none text-sm text-white placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 focus:outline-none text-sm text-white placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Emergency Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 focus:outline-none text-sm text-white placeholder-slate-600 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Core Disaster Skills */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 font-mono mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              2. Disaster & Life-Safety Skills (Multi-Select)
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Select all specialized capacities you are qualified to execute in emergency conditions.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {SKILLS_LIST.map((skill) => {
                const active = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer ${
                      active
                        ? 'bg-orange-600/20 border-orange-500 text-orange-300 font-semibold shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                        active ? 'bg-orange-500 text-white' : 'border border-slate-700'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{skill}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 3: Transport Availability */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 font-mono mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              3. Field Transport Mobility
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Determines proximity dispatch calculations and vehicle deployment suitability.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRANSPORT_OPTIONS.map((opt) => {
                const selected = formData.transport === opt.id
                return (
                  <div
                    key={opt.id}
                    onClick={() => setFormData({ ...formData, transport: opt.id })}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selected
                        ? 'bg-orange-600/10 border-orange-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selected ? 'border-orange-500 bg-orange-500' : 'border-slate-700'
                        }`}
                      >
                        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-slate-200">{opt.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-7">{opt.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section 4: Operational Base Coordinates */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  4. Base Location & GPS Coordinates
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Used by the 50/30/20 AI engine to calculate distance to incidents.</p>
              </div>
              <button
                type="button"
                onClick={handleDetectGps}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-orange-400" />
                <span>Detect My Current GPS</span>
              </button>
            </div>

            {gpsStatus && (
              <div className="mb-4 text-xs font-mono text-orange-400 bg-orange-950/40 p-2.5 rounded-lg border border-orange-900/50">
                {gpsStatus}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Base Latitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Base Longitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm font-mono text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 5: The 3-Way Affiliation Selection (Crucial Choice) */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-orange-500/40 p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest px-2 py-0.5 rounded bg-orange-950/80 border border-orange-800">
                MANDATORY JURISDICTION ASSIGNMENT
              </span>
              <h2 className="text-lg font-bold text-white mt-2">5. Choose Your Oversight & Affiliation Pathway</h2>
              <p className="text-xs text-slate-300 mt-1">
                Select where your volunteer profile will be mobilized and reviewed. You can select exactly ONE of the three pathways below.
              </p>
            </div>

            {/* Visual 3-Way Radio Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* Option A: Specific NGO */}
              <label
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  affiliationType === 'NGO'
                    ? 'bg-orange-950/30 border-orange-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <input
                    type="radio"
                    name="affiliation"
                    checked={affiliationType === 'NGO'}
                    onChange={() => setAffiliationType('NGO')}
                    className="mt-1 w-4 h-4 text-orange-600 focus:ring-orange-500 bg-slate-950 border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-orange-400" />
                      <span className="font-bold text-sm text-white">Register Under a Specific Partner NGO</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      You join this accredited relief agency's specialized response unit. Your registration is reviewed and approved exclusively by this NGO's leadership.
                    </p>
                  </div>
                </div>

                {affiliationType === 'NGO' && (
                  <div className="w-full md:w-72 shrink-0">
                    <label className="block text-[11px] font-mono text-orange-400 mb-1">Select Approved NGO *</label>
                    <select
                      value={selectedNgoId}
                      onChange={(e) => setSelectedNgoId(e.target.value)}
                      disabled={loadingOptions || options.ngos.length === 0}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-orange-500/70 text-xs font-medium text-white focus:outline-none"
                    >
                      {options.ngos.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.name} ({n.districtName})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </label>

              {/* Option B: Direct District Authority */}
              <label
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  affiliationType === 'DISTRICT'
                    ? 'bg-orange-950/30 border-orange-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <input
                    type="radio"
                    name="affiliation"
                    checked={affiliationType === 'DISTRICT'}
                    onChange={() => setAffiliationType('DISTRICT')}
                    className="mt-1 w-4 h-4 text-orange-600 focus:ring-orange-500 bg-slate-950 border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-sm text-white">Register Directly Under a District Authority</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      You enlist directly into the municipal emergency command pool. Your registration is reviewed and approved exclusively by that District's Authority.
                    </p>
                  </div>
                </div>

                {affiliationType === 'DISTRICT' && (
                  <div className="w-full md:w-72 shrink-0">
                    <label className="block text-[11px] font-mono text-amber-400 mb-1">Select Operating District *</label>
                    <select
                      value={selectedDistrictId}
                      onChange={(e) => setSelectedDistrictId(e.target.value)}
                      disabled={loadingOptions || options.districts.length === 0}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-orange-500/70 text-xs font-medium text-white focus:outline-none"
                    >
                      {options.districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.region})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </label>

              {/* Option C: General Volunteer Pool */}
              <label
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  affiliationType === 'COMMON'
                    ? 'bg-orange-950/30 border-orange-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="affiliation"
                  checked={affiliationType === 'COMMON'}
                  onChange={() => setAffiliationType('COMMON')}
                  className="mt-1 w-4 h-4 text-orange-600 focus:ring-orange-500 bg-slate-950 border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-slate-300" />
                    <span className="font-bold text-sm text-white">No Preference — Place Me in the General Volunteer Pool</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    You are not affiliated with any specific NGO or municipal district. You fall under direct UVMP Platform Administration oversight and can be mobilized nationally for multi-region incidents.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-orange-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Enlistment Application...</span>
                </>
              ) : (
                <>
                  <span>Submit Enlistment Application</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-500 mt-3 font-mono">
              Submission triggers real-time status assignment = PENDING. Account will be gated until approved.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
