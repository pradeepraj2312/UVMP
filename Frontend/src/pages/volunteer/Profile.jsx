import { useState, useEffect } from 'react'
import {
  Phone,
  Zap,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Tag,
  Plus,
  X
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function VolunteerProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Editable fields
  const [phone, setPhone] = useState('')
  const [availability, setAvailability] = useState('AVAILABLE')
  const [skillsList, setSkillsList] = useState([])
  const [newSkill, setNewSkill] = useState('')
  const [latitude, setLatitude] = useState(0.0)
  const [longitude, setLongitude] = useState(0.0)

  const fetchProfile = () => {
    setLoading(true)
    setError(null)
    apiClient.get('/volunteer/profile')
      .then((res) => {
        if (res.data?.data) {
          const p = res.data.data
          setProfile(p)
          setPhone(p.phone || '')
          setAvailability(p.availability || 'AVAILABLE')
          setLatitude(p.latitude || 0.0)
          setLongitude(p.longitude || 0.0)
          if (p.skills) {
            setSkillsList(p.skills.split(',').map((s) => s.trim()).filter(Boolean))
          } else {
            setSkillsList([])
          }
        } else {
          setError('Volunteer profile data not found.')
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to connect to backend server. Please verify MySQL and backend service are running.'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    let ignore = false

    apiClient.get('/volunteer/profile')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            const p = res.data.data
            setProfile(p)
            setPhone(p.phone || '')
            setAvailability(p.availability || 'AVAILABLE')
            setLatitude(p.latitude || 0.0)
            setLongitude(p.longitude || 0.0)
            if (p.skills) {
              setSkillsList(p.skills.split(',').map((s) => s.trim()).filter(Boolean))
            } else {
              setSkillsList([])
            }
          } else {
            setError('Volunteer profile data not found.')
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
            err.message ||
            'Failed to connect to backend server. Please verify MySQL and backend service are running.'
          )
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    if (!skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()])
    }
    setNewSkill('')
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    try {
      await apiClient.put('/volunteer/profile', {
        phone,
        availability,
        skills: skillsList.join(', '),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3500)
      fetchProfile()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout role="VOLUNTEER">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading volunteer profile record...</p>
        </div>
      </AppLayout>
    )
  }

  if (error || !profile) {
    return (
      <AppLayout role="VOLUNTEER">
        <div className="space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error || 'Profile unavailable'}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchProfile}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Retry
            </Button>
          </div>
          <EmptyState
            title="Profile Record Error"
            description="The volunteer identity dossier could not be retrieved from MySQL."
            actionLabel="Retry"
            onAction={fetchProfile}
          />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout role="VOLUNTEER">
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900">Volunteer Identity & Dossier</h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Manage your verified credentials, emergency skills list, deployment readiness, and field coordinates
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchProfile}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Reload Profile
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving} className="font-medium">
              <Save className="w-4 h-4 mr-1.5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3.5 bg-emerald-50 border-l-4 border-emerald-600 border border-slate-200 rounded-lg flex items-center gap-3 text-xs font-semibold text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Profile and deployment readiness updated successfully in database!</span>
          </div>
        )}

        {/* Profile Card & Reliability Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity & Reliability Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs text-center space-y-4">
              <div className="w-16 h-16 rounded-lg bg-slate-900 mx-auto flex items-center justify-center text-white text-xl font-bold font-mono">
                {profile.name?.charAt(0) || 'V'}
              </div>
              <div>
                <h2 className="text-lg font-bold font-heading text-slate-900">{profile.name}</h2>
                <p className="text-xs text-slate-600 mt-0.5 font-mono">{profile.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant={availability === 'AVAILABLE' ? 'success' : availability === 'BUSY' ? 'warning' : 'neutral'}>
                    STATUS: {availability}
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Affiliated NGO:</span>
                  <span className="font-semibold text-slate-900">{profile.ngoName || 'General Pool'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Registered Since:</span>
                  <span className="font-semibold text-slate-900 font-mono tabular-nums">
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Reliability Rating Box */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Reliability Rating
                </span>
                <span className="text-lg font-bold font-mono tabular-nums text-amber-600">{profile.reliabilityScore || 85}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min(100, profile.reliabilityScore || 85)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Calculated dynamically via attendance rate, on-site check-in promptness, and shift completion feedback.
              </p>
            </div>
          </div>

          {/* Form & Editable Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold font-heading text-slate-900 border-b border-slate-200 pb-3">Operational Details & Readiness</h3>
              <form onSubmit={handleSave} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1-555-0199"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-control border border-slate-200 bg-slate-50 text-slate-900 font-mono focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Readiness Status
                    </label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-control border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                    >
                      <option value="AVAILABLE">AVAILABLE - Ready for Dispatch</option>
                      <option value="BUSY">BUSY - Deployed on Active Duty</option>
                      <option value="OFFLINE">OFFLINE - Temporarily Unavailable</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Home Base Latitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-control border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-400 font-mono tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Home Base Longitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-control border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-400 font-mono tabular-nums"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Specialized Skills & Badges */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold font-heading text-slate-900 border-b border-slate-200 pb-3">Emergency Response Skills</h3>
              <div className="space-y-4 pt-1">
                <p className="text-xs text-slate-600">
                  Your certified skills are utilized by the AI Matching Engine (50% Skill Match, 30% Proximity, 20% Reliability).
                </p>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                    >
                      <Tag className="w-3.5 h-3.5 text-slate-500" />
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-600 transition ml-0.5"
                        title="Remove skill"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {skillsList.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No specialized skills tagged yet.</span>
                  )}
                </div>

                {/* Add New Skill Input */}
                <form onSubmit={handleAddSkill} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Trauma Care, Water Rescue, Drone Operator"
                    className="flex-1 px-3 py-2 text-xs rounded-control border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                  />
                  <Button type="submit" variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Skill
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
