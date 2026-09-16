import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Search,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Filter,
  Check,
  X,
  Clock,
  Truck
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function NgoVolunteers() {
  const [activeTab, setActiveTab] = useState('ROSTER') // 'ROSTER' | 'PENDING'
  const [volunteers, setVolunteers] = useState([])
  const [pendingVolunteers, setPendingVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingPending, setLoadingPending] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL')
  const [scope, setScope] = useState('CORPS')
  const [updatingId, setUpdatingId] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)
  const [rejectingVol, setRejectingVol] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionInProgress, setActionInProgress] = useState(false)

  const fetchPendingVolunteers = async () => {
    setLoadingPending(true)
    try {
      const res = await apiClient.get('/ngo/volunteers/pending')
      if (res.data?.data) {
        setPendingVolunteers(res.data.data)
      } else {
        setPendingVolunteers([])
      }
    } catch {
      setPendingVolunteers([])
    } finally {
      setLoadingPending(false)
    }
  }

  const fetchVolunteers = async (currentScope = scope) => {
    setLoading(true)
    setError(null)
    try {
      const params = currentScope === 'ALL' ? { scope: 'all' } : {}
      const res = await apiClient.get('/ngo/volunteers', { params })
      if (res.data?.data) {
        setVolunteers(res.data.data)
      } else {
        setError('No volunteer personnel records returned from server.')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to connect to backend server. Please verify MySQL and backend service are running.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleApproveVolunteer = async (volId) => {
    setActionInProgress(true)
    try {
      await apiClient.patch(`/ngo/volunteers/${volId}/approve`)
      setActionSuccess('Volunteer registration approved! Personnel is now activated on the active roster.')
      fetchPendingVolunteers()
      fetchVolunteers()
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed.')
    } finally {
      setActionInProgress(false)
    }
  }

  const handleRejectVolunteer = async () => {
    if (!rejectingVol) return
    setActionInProgress(true)
    try {
      await apiClient.patch(`/ngo/volunteers/${rejectingVol.id}/reject`, { reason: rejectReason })
      setActionSuccess(`Application for ${rejectingVol.name} rejected.`)
      setRejectingVol(null)
      setRejectReason('')
      fetchPendingVolunteers()
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed.')
    } finally {
      setActionInProgress(false)
    }
  }

  useEffect(() => {
    let ignore = false
    const params = scope === 'ALL' ? { scope: 'all' } : {}

    apiClient.get('/ngo/volunteers', { params })
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setVolunteers(res.data.data)
          } else {
            setError('No volunteer personnel records returned from server.')
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
  }, [scope])

  const handleToggleAvailability = async (volunteerId, currentStatus) => {
    const nextStatus =
      currentStatus === 'AVAILABLE'
        ? 'BUSY'
        : currentStatus === 'BUSY'
        ? 'OFFLINE'
        : 'AVAILABLE'

    setUpdatingId(volunteerId)
    setActionSuccess(null)
    try {
      const res = await apiClient.patch(`/ngo/volunteers/${volunteerId}/availability?availability=${nextStatus}`)
      if (res.data?.data) {
        setVolunteers((prev) =>
          prev.map((v) => (v.id === volunteerId ? res.data.data : v))
        )
        setActionSuccess(`Volunteer status updated to ${nextStatus}.`)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update volunteer availability.')
    } finally {
      setUpdatingId(null)
    }
  }

  const getAvailabilityBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge variant="success">AVAILABLE</Badge>
      case 'BUSY':
        return <Badge variant="warning">BUSY / DEPLOYED</Badge>
      case 'OFFLINE':
        return <Badge variant="neutral">OFFLINE</Badge>
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  const filteredVolunteers = volunteers.filter((vol) => {
    const matchesSearch =
      (vol.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (vol.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (vol.phone?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (vol.skills?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (vol.address?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (vol.districtName?.toLowerCase() || '').includes(search.toLowerCase())

    const matchesAvailability =
      availabilityFilter === 'ALL' || vol.availability === availabilityFilter

    return matchesSearch && matchesAvailability
  })

  // Summary Metrics
  const totalFleet = volunteers.length
  const availableCount = volunteers.filter((v) => v.availability === 'AVAILABLE').length
  const busyCount = volunteers.filter((v) => v.availability === 'BUSY').length
  const avgReliability =
    totalFleet > 0
      ? Math.round(
          volunteers.reduce((acc, v) => acc + (v.reliabilityScore || 85), 0) / totalFleet
        )
      : 0

  return (
    <AppLayout role="NGO">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-900 text-white">
                <Users className="w-5 h-5 text-red-500" />
              </span>
              <h1 className="text-2xl font-bold font-heading text-slate-900">
                Volunteer Field Fleet
              </h1>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Registered volunteer roster, real-time availability status, skills profile, and reliability scoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/ngo/recognition">
              <Button size="sm" variant="secondary" className="gap-2">
                <Award className="w-3.5 h-3.5" />
                <span>Issue Recognitions</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchVolunteers()}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Action Success Banner */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Tab Selection */}
        <div role="tablist" aria-label="NGO volunteer fleet management tabs" className="flex items-center gap-3 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-thin">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'ROSTER'}
            onClick={() => setActiveTab('ROSTER')}
            className={`pb-3 px-4 text-xs font-bold font-mono tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ROSTER'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Active Corps Fleet</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-700">
              {volunteers.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'PENDING'}
            onClick={() => {
              setActiveTab('PENDING')
              fetchPendingVolunteers()
            }}
            className={`pb-3 px-4 text-xs font-bold font-mono tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'PENDING'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending Enlistments</span>
            {pendingVolunteers.length > 0 ? (
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-bold">
                {pendingVolunteers.length} PENDING
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-500">
                0
              </span>
            )}
          </button>
        </div>

        {activeTab === 'PENDING' ? (
          /* PENDING ENLISTMENTS VIEW */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Candidate Applications Awaiting NGO Clearance
                </h3>
                <p className="text-xs text-slate-500">
                  Volunteers who chose this NGO during registration. Verify credentials and transport before admitting to active deployment.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPendingVolunteers}
                disabled={loadingPending}
                className="gap-1.5 text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingPending ? 'animate-spin' : ''}`} />
                Refresh Queue
              </Button>
            </div>

            {loadingPending ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                Auditing candidate applications...
              </div>
            ) : pendingVolunteers.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-slate-900">Queue Clear</h4>
                <p className="text-xs text-slate-500 mt-1">
                  No volunteer enlistment applications currently awaiting review for this NGO.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingVolunteers.map((vol) => (
                  <div
                    key={vol.id}
                    className="p-5 bg-white rounded-xl border-l-4 border-amber-500 border border-slate-200 shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                              ENLISTMENT APPLICANT
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">ID #{vol.id}</span>
                          </div>
                          <h4 className="font-bold text-base text-slate-900 mt-1">{vol.name}</h4>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono">{vol.email}</span>
                        </div>
                        {vol.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono">{vol.phone}</span>
                          </div>
                        )}
                        {vol.transport && (
                          <div className="flex items-center gap-2 text-slate-700">
                            <Truck className="w-3.5 h-3.5 text-orange-600" />
                            <span>Transport: <strong>{vol.transport}</strong></span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>Coordinates: {vol.latitude}, {vol.longitude}</span>
                        </div>
                      </div>

                      {vol.skills && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                          {vol.skills.split(',').map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRejectingVol(vol)
                          setRejectReason('')
                        }}
                        disabled={actionInProgress}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApproveVolunteer(vol.id)}
                        disabled={actionInProgress}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Admit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rejection Dialog Modal */}
            {rejectingVol && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-slate-900">
                  <h3 className="font-bold text-base text-slate-900 mb-1">
                    Decline Volunteer Application
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Rejecting application for <strong>{rejectingVol.name}</strong> ({rejectingVol.email}). State the justification for audit records.
                  </p>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Reason for Rejection
                    </label>
                    <textarea
                      rows={3}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Required certification expired or outside NGO operating jurisdiction."
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRejectingVol(null)}
                      disabled={actionInProgress}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleRejectVolunteer}
                      disabled={actionInProgress}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Confirm Rejection
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ACTIVE ROSTER VIEW */
          <>
        {/* Live Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Total Fleet</p>
            <p className="text-2xl font-bold font-heading tabular-nums text-slate-900 mt-1">{totalFleet}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Available Ready</p>
            <p className="text-2xl font-bold font-heading tabular-nums text-emerald-700 mt-1">{availableCount}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">On Mission (Busy)</p>
            <p className="text-2xl font-bold font-heading tabular-nums text-amber-600 mt-1">{busyCount}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Avg Reliability</p>
            <p className="text-2xl font-bold font-heading tabular-nums text-primary mt-1">{avgReliability}%</p>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-600 border border-slate-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900">Connection Error</h4>
              <p className="text-xs text-red-700 mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-red-700 border-red-300 hover:bg-red-100"
                onClick={() => fetchVolunteers()}
              >
                Retry Connection
              </Button>
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Roster Scope:</span>
              <button
                type="button"
                onClick={() => setScope('CORPS')}
                className={`px-3 py-1 text-xs font-semibold rounded-control transition ${
                  scope === 'CORPS'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                District & Affiliated Corps
              </button>
              <button
                type="button"
                onClick={() => setScope('ALL')}
                className={`px-3 py-1 text-xs font-semibold rounded-control transition ${
                  scope === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Platform Responders
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 pt-2 border-t border-slate-100">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search volunteers by name, skill, phone, or district..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-control focus:outline-hidden focus:ring-1 focus:ring-slate-400 text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Status:</span>
              </div>

              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-control px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
              >
                <option value="ALL">All Availabilities</option>
                <option value="AVAILABLE">Available</option>
                <option value="BUSY">Busy (Deployed)</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Volunteers Table / Cards */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading volunteer fleet from database...</p>
          </div>
        ) : error && volunteers.length === 0 ? (
          <Card>
            <EmptyState
              icon={AlertCircle}
              title="Unable to load volunteer fleet"
              description={error}
              action={
                <Button size="sm" onClick={fetchVolunteers}>
                  Retry Connection
                </Button>
              }
            />
          </Card>
        ) : filteredVolunteers.length === 0 ? (
          <Card>
            <EmptyState
              icon={Users}
              title="No volunteers match criteria"
              description="Try adjusting your search query or availability filter."
              action={
                (search || availabilityFilter !== 'ALL') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSearch('')
                      setAvailabilityFilter('ALL')
                    }}
                  >
                    Reset Filters
                  </Button>
                )
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVolunteers.map((vol) => {
              const reliability = vol.reliabilityScore != null ? Math.round(vol.reliabilityScore) : 85

              return (
                <div
                  key={vol.id}
                  className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 shadow-xs transition-all space-y-3.5"
                >
                  {/* Top Bar: Name, Badges, Status Toggle */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold font-heading text-slate-900">{vol.name}</h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-semibold tabular-nums">
                          VOL-{String(vol.id).padStart(4, '0')}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                        {vol.phone && (
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {vol.phone}
                          </span>
                        )}
                        {vol.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {vol.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {getAvailabilityBadge(vol.availability)}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[11px] h-7 px-2"
                        disabled={updatingId === vol.id}
                        onClick={() => handleToggleAvailability(vol.id, vol.availability)}
                        title="Click to rotate availability status"
                      >
                        {updatingId === vol.id ? 'Updating...' : 'Toggle'}
                      </Button>
                    </div>
                  </div>

                  {/* Location & Sector Assignment */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-medium text-slate-800">{vol.districtName || vol.address || 'Operating Sector'}</span>
                    </div>
                    {vol.ngoName && (
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {vol.ngoName}
                      </span>
                    )}
                  </div>

                  {/* Skills Tags */}
                  {vol.skills && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {vol.skills.split(',').map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded-sm border border-slate-200"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Reliability Score Bar */}
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Reliability Rating
                      </span>
                      <span
                        className={`font-mono font-bold tabular-nums ${
                          reliability >= 90
                            ? 'text-emerald-700'
                            : reliability >= 75
                            ? 'text-primary'
                            : 'text-amber-600'
                        }`}
                      >
                        {reliability}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                      <div
                        className={`h-full transition-all duration-300 ${
                          reliability >= 90
                            ? 'bg-emerald-600'
                            : reliability >= 75
                            ? 'bg-primary'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${reliability}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        </>
        )}
      </div>
    </AppLayout>
  )
}
