import { useState, useEffect, useMemo } from 'react'
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Award,
  Filter,
  Eye,
  Building2,
  Activity,
  UserCheck,
  AlertCircle,
  ExternalLink,
  Truck,
  Check,
  X,
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function DistrictVolunteers() {
  const [activeTab, setActiveTab] = useState('ROSTER') // 'ROSTER' | 'PENDING'
  const [volunteers, setVolunteers] = useState([])
  const [pendingVolunteers, setPendingVolunteers] = useState([])
  const [districts, setDistricts] = useState([])
  const [districtFilter, setDistrictFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [loadingPending, setLoadingPending] = useState(false)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)
  const [actionInProgress, setActionInProgress] = useState(false)
  const [rejectingVol, setRejectingVol] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [search, setSearch] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL')
  const [ngoFilter, setNgoFilter] = useState('ALL')
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(null)

  const fetchPendingVolunteers = async () => {
    setLoadingPending(true)
    try {
      const res = await apiClient.get('/district/volunteers/pending')
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

  const handleApproveVolunteer = async (volId) => {
    setActionInProgress(true)
    try {
      await apiClient.patch(`/district/volunteers/${volId}/approve`)
      setActionSuccess('Volunteer registration approved! Personnel is now activated on the active district roster.')
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
      await apiClient.patch(`/district/volunteers/${rejectingVol.id}/reject`, { reason: rejectReason })
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

  const fetchVolunteers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/district/volunteers')
      if (res.data?.data) {
        setVolunteers(res.data.data)
      } else {
        setVolunteers([])
        setError('No volunteer personnel returned from backend.')
      }
    } catch (err) {
      setVolunteers([])
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load district volunteers. Please verify backend service is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    apiClient.get('/district/list')
      .then((res) => {
        if (!ignore && res.data?.data) {
          setDistricts(res.data.data)
        }
      })
      .catch(() => {})

    apiClient.get('/district/volunteers')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setVolunteers(res.data.data)
          } else {
            setVolunteers([])
            setError('No volunteer personnel returned from backend.')
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          setVolunteers([])
          setError(
            err.response?.data?.message ||
            err.message ||
            'Failed to load district volunteers. Please verify backend service is running.'
          )
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    apiClient.get('/district/volunteers/pending')
      .then((res) => {
        if (!ignore && res.data?.data) {
          setPendingVolunteers(res.data.data)
        }
      })
      .catch(() => {})

    return () => {
      ignore = true
    }
  }, [])

  const handleUpdateAvailability = async (volunteerId, newAvailability) => {
    setStatusUpdating(volunteerId)
    setActionError(null)
    try {
      await apiClient.patch(
        `/district/volunteers/${volunteerId}/availability`,
        null,
        { params: { availability: newAvailability } }
      )
      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === volunteerId ? { ...v, availability: newAvailability } : v
        )
      )
      if (selectedVolunteer?.id === volunteerId) {
        setSelectedVolunteer((prev) =>
          prev ? { ...prev, availability: newAvailability } : null
        )
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
        err.message ||
        `Failed to update availability for volunteer #${volunteerId}. Please check backend connection.`
      )
    } finally {
      setStatusUpdating(null)
    }
  }

  // Calculate unique NGOs for dropdown
  const uniqueNgos = useMemo(() => {
    const names = new Set(
      volunteers.map((v) => v.ngoName || 'Independent / Direct')
    )
    return Array.from(names)
  }, [volunteers])

  // Key performance metrics
  const metrics = useMemo(() => {
    const total = volunteers.length
    const available = volunteers.filter((v) => v.availability === 'AVAILABLE').length
    const busy = volunteers.filter((v) => v.availability === 'BUSY').length
    const avgReliability = total > 0
      ? (volunteers.reduce((sum, v) => sum + (v.reliabilityScore || 0), 0) / total).toFixed(1)
      : '0.0'
    return { total, available, busy, avgReliability }
  }, [volunteers])

  // Filtered dataset
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v) => {
      const matchesAvailability =
        availabilityFilter === 'ALL' || v.availability === availabilityFilter
      const matchesNgo =
        ngoFilter === 'ALL' ||
        (v.ngoName || 'Independent / Direct') === ngoFilter
      const matchesDistrict =
        districtFilter === 'ALL' ||
        String(v.districtId) === String(districtFilter) ||
        (v.districtName && v.districtName.toLowerCase().includes(districtFilter.toLowerCase()))
      const query = search.toLowerCase().trim()
      const matchesSearch =
        !query ||
        (v.name && v.name.toLowerCase().includes(query)) ||
        (v.email && v.email.toLowerCase().includes(query)) ||
        (v.phone && v.phone.includes(query)) ||
        (v.skills && v.skills.toLowerCase().includes(query)) ||
        (v.ngoName && v.ngoName.toLowerCase().includes(query)) ||
        (v.districtName && v.districtName.toLowerCase().includes(query))

      return matchesAvailability && matchesNgo && matchesDistrict && matchesSearch
    })
  }, [volunteers, availabilityFilter, ngoFilter, districtFilter, search])

  const getReliabilityBadge = (score) => {
    if (score >= 95) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <Award className="w-3 h-3 text-emerald-600" />
          Elite ({score}%)
        </span>
      )
    }
    if (score >= 85) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          <UserCheck className="w-3 h-3 text-blue-600" />
          High ({score}%)
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        Standard ({score}%)
      </span>
    )
  }

  const getAvailabilityBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge variant="success">AVAILABLE</Badge>
      case 'BUSY':
        return <Badge variant="warning">BUSY / ON MISSION</Badge>
      case 'OFFLINE':
      default:
        return <Badge variant="neutral">OFFLINE</Badge>
    }
  }

  return (
    <AppLayout role="DISTRICT_AUTHORITY">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-red-100 text-primary">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-heading text-accent">
                District Volunteer Oversight
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Field-ready personnel, certifications, real-time availability, and dispatch readiness
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={fetchVolunteers}
              loading={loading}
            >
              Refresh Roster
            </Button>
          </div>
        </div>

        {/* Error Notification Banners */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span><strong>Backend Service Error:</strong> {error}</span>
            </div>
            <Button size="xs" variant="outline" onClick={fetchVolunteers} loading={loading}>
              Retry Connection
            </Button>
          </div>
        )}

        {actionError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-card flex items-center justify-between gap-3 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span><strong>Volunteer Update Notice:</strong> {actionError}</span>
            </div>
            <Button size="xs" variant="ghost" onClick={() => setActionError(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Action Success Banner */}
        {actionSuccess && (
          <div className="p-3.5 bg-emerald-50 border-l-4 border-emerald-600 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{actionSuccess}</span>
            </div>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div role="tablist" aria-label="District volunteer management tabs" className="flex items-center gap-3 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-thin">
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
            <span>Active District Roster</span>
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
            <span>Pending Direct Enlistments</span>
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
          /* PENDING DIRECT ENLISTMENTS VIEW */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Direct District Enlistments Awaiting Approval
                </h3>
                <p className="text-xs text-slate-500">
                  Volunteers who registered directly under this District Authority (without NGO affiliation). Verify skills, address, and transport assets before approving.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPendingVolunteers}
                disabled={loadingPending}
                className="gap-2 text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingPending ? 'animate-spin' : ''}`} />
                Refresh Candidates
              </Button>
            </div>

            {loadingPending ? (
              <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
                <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500 font-medium">Checking direct volunteer applications...</p>
              </div>
            ) : pendingVolunteers.length === 0 ? (
              <Card>
                <EmptyState
                  icon={UserCheck}
                  title="No Pending Direct Enlistments"
                  description="All direct volunteer enlistments for this district authority have been processed. No pending applications."
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingVolunteers.map((vol) => (
                  <div
                    key={vol.id}
                    className="bg-white border-2 border-amber-300 rounded-lg p-5 shadow-xs transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold font-heading text-slate-900">{vol.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold uppercase">
                            DIRECT ENLISTMENT PENDING
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
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        VOL-{String(vol.id).padStart(4, '0')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Location / Address</span>
                        <span className="font-medium text-slate-800">{vol.address || 'Unspecified address'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Transport Asset</span>
                        <span className="font-medium text-slate-800 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-slate-400" />
                          {vol.transport || 'None / On Foot'}
                        </span>
                      </div>
                    </div>

                    {vol.skills && (
                      <div>
                        <span className="text-slate-400 text-[11px] font-medium block mb-1">Declared Competencies</span>
                        <div className="flex flex-wrap gap-1">
                          {vol.skills.split(',').map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded-sm border border-slate-200"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRejectingVol(vol)}
                        disabled={actionInProgress}
                        className="text-red-700 border-red-200 hover:bg-red-50 text-xs"
                      >
                        <X className="w-3.5 h-3.5 text-red-600 mr-1" />
                        Reject Enlistment
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveVolunteer(vol.id)}
                        disabled={actionInProgress}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Approve to Roster
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ACTIVE ROSTER VIEW */
          <>
        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Volunteer Corps
                </p>
                <p className="text-2xl font-bold text-accent mt-1">{metrics.total}</p>
              </div>
              <span className="p-3 bg-red-50 text-primary rounded-xl">
                <Users className="w-6 h-6" />
              </span>
            </div>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Immediate Standby
                </p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{metrics.available}</p>
              </div>
              <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </span>
            </div>
          </Card>

          <Card className="border-l-4 border-l-amber-500 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deployed Missions
                </p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{metrics.busy}</p>
              </div>
              <span className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Activity className="w-6 h-6" />
              </span>
            </div>
          </Card>

          <Card className="border-l-4 border-l-blue-500 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Reliability
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{metrics.avgReliability}%</p>
              </div>
              <span className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Award className="w-6 h-6" />
              </span>
            </div>
          </Card>
        </div>

        {/* Search, Filter & Quick Roster Control */}
        <Card className="p-4 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, skill, phone, or direct/NGO affiliation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-primary focus:outline-none transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              {/* Availability Filter */}
              <select
                aria-label="Filter by Status"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="text-xs py-1.5 px-3 border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:border-primary"
              >
                <option value="ALL">All Availabilities</option>
                <option value="AVAILABLE">AVAILABLE (Standby)</option>
                <option value="BUSY">BUSY (Active)</option>
                <option value="OFFLINE">OFFLINE</option>
              </select>

              {/* NGO Affiliation Filter */}
              <select
                aria-label="Filter by NGO Affiliation"
                value={ngoFilter}
                onChange={(e) => setNgoFilter(e.target.value)}
                className="text-xs py-1.5 px-3 border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:border-primary"
              >
                <option value="ALL">All Affiliations</option>
                {uniqueNgos.map((ngo) => (
                  <option key={ngo} value={ngo}>
                    {ngo}
                  </option>
                ))}
              </select>

              {/* District Area Filter */}
              {districts.length > 0 && (
                <select
                  aria-label="Filter by Assigned District Sector"
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="text-xs py-1.5 px-3 border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:border-primary"
                >
                  <option value="ALL">All Sectors</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Reset Active Filters */}
              {(availabilityFilter !== 'ALL' || ngoFilter !== 'ALL' || districtFilter !== 'ALL' || search) && (
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    setAvailabilityFilter('ALL')
                    setNgoFilter('ALL')
                    setDistrictFilter('ALL')
                    setSearch('')
                  }}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Reset All
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Volunteers Table */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-accent">Active Field Personnel List</h2>
              <Badge variant="neutral" className="text-[11px]">
                Showing {filteredVolunteers.length} of {volunteers.length}
              </Badge>
            </div>
            <p className="text-xs text-gray-400">
              Direct and NGO-affiliated personnel available across administrative zones
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
              <p className="text-xs text-gray-500 font-medium">Synchronizing field roster...</p>
            </div>
          ) : filteredVolunteers.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={Users}
                title="No field personnel match criteria"
                description="Try broadening your filter criteria or search query to view active personnel."
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setAvailabilityFilter('ALL')
                      setNgoFilter('ALL')
                      setDistrictFilter('ALL')
                      setSearch('')
                    }}
                  >
                    Clear Filter Parameters
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-500 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3 px-4">Personnel Profile</th>
                    <th className="py-3 px-4">Operational Status</th>
                    <th className="py-3 px-4">Reliability Rating</th>
                    <th className="py-3 px-4">Affiliation & Sector</th>
                    <th className="py-3 px-4">Registered Skills</th>
                    <th className="py-3 px-4 text-right">Roster Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVolunteers.map((vol) => {
                    const initials = vol.name
                      ? vol.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'VO'

                    return (
                      <tr
                        key={vol.id}
                        className="hover:bg-gray-50/60 transition-colors cursor-pointer group"
                        onClick={() => setSelectedVolunteer(vol)}
                      >
                        {/* Name & Contact */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-50 text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-red-100 group-hover:border-primary transition-colors">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-accent group-hover:text-primary transition-colors">
                                {vol.name}
                              </p>
                              <div className="text-[11px] text-gray-400 flex items-center gap-2">
                                <span>{vol.email}</span>
                                {vol.phone && (
                                  <>
                                    <span>•</span>
                                    <span>{vol.phone}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {getAvailabilityBadge(vol.availability)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>
                              {vol.latitude?.toFixed(4)}, {vol.longitude?.toFixed(4)}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="xs"
                              icon={Eye}
                              onClick={() => setSelectedVolunteer(vol)}
                            >
                              Dossier
                            </Button>
                            <select
                              aria-label="Set Volunteer Availability"
                              value={vol.availability}
                              disabled={statusUpdating === vol.id}
                              onChange={(e) => handleUpdateAvailability(vol.id, e.target.value)}
                              className="text-[11px] font-medium py-1 px-2 border border-gray-200 rounded-md bg-white text-gray-700 hover:border-primary outline-none focus:ring-1 focus:ring-primary/20"
                            >
                              <option value="AVAILABLE">Available</option>
                              <option value="BUSY">Busy</option>
                              <option value="OFFLINE">Offline</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        </>
        )}

        {/* Volunteer Details / Dossier Modal */}
        {selectedVolunteer && (
          <Modal
            isOpen={!!selectedVolunteer}
            onClose={() => setSelectedVolunteer(null)}
            title="Volunteer Responder Dossier"
            description={`Profile verification and operational assignment record for ${selectedVolunteer.name}`}
            size="lg"
          >
            <div className="space-y-6">
              {/* Header Profile Banner */}
              <div className="flex items-start justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-primary font-bold flex items-center justify-center text-base border border-red-200">
                    {selectedVolunteer.name
                      ? selectedVolunteer.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'VO'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-accent">{selectedVolunteer.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      {selectedVolunteer.ngoName || 'Independent / Direct Volunteer'}
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {selectedVolunteer.districtName || ('Operating Sector ' + selectedVolunteer.districtId)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getAvailabilityBadge(selectedVolunteer.availability)}
                  {getReliabilityBadge(selectedVolunteer.reliabilityScore || 85)}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white border border-gray-100 rounded-lg space-y-1">
                  <span className="text-gray-400 flex items-center gap-1 font-medium">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> Direct Email
                  </span>
                  <p className="font-semibold text-accent">{selectedVolunteer.email}</p>
                </div>

                <div className="p-3 bg-white border border-gray-100 rounded-lg space-y-1">
                  <span className="text-gray-400 flex items-center gap-1 font-medium">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> Mobile / Emergency Hotlink
                  </span>
                  <p className="font-semibold text-accent">
                    {selectedVolunteer.phone || 'No phone recorded'}
                  </p>
                </div>
              </div>

              {/* Field Deployment Coordinates */}
              <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    Field GPS Geo-Coordinates
                  </span>
                  <a
                    href={`https://www.google.com/maps?q=${selectedVolunteer.latitude},${selectedVolunteer.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    Open in Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs font-mono text-gray-700">
                  Latitude: {selectedVolunteer.latitude?.toFixed(6)} | Longitude:{' '}
                  {selectedVolunteer.longitude?.toFixed(6)}
                </p>
                <p className="text-[11px] text-gray-500">
                  Used by the AI Volunteer Matching Engine to compute Haversine travel distances for rapid incident response dispatch.
                </p>
              </div>

              {/* Skills and Certifications */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-accent uppercase tracking-wider">
                  Verified Specialized Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVolunteer.skills ? (
                    selectedVolunteer.skills.split(',').map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-medium flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">No skills registered</span>
                  )}
                </div>
              </div>

              {/* Readiness & Reliability Assessment */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-accent">Reliability Track Record</span>
                  <span className="font-bold text-primary">
                    {selectedVolunteer.reliabilityScore || 85.0}% Verified
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(selectedVolunteer.reliabilityScore || 85, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-gray-500 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  Reliability accounts for 20% of the AI matching algorithm, reflecting punctuality, task completion rate, and verified field feedback.
                </p>
              </div>

              {/* Authority Quick Controls */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Update Status:</span>
                  <select
                    aria-label="Set Volunteer Availability In Dossier"
                    value={selectedVolunteer.availability}
                    disabled={statusUpdating === selectedVolunteer.id}
                    onChange={(e) =>
                      handleUpdateAvailability(selectedVolunteer.id, e.target.value)
                    }
                    className="text-xs py-1.5 px-3 border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:border-primary"
                  >
                    <option value="AVAILABLE">AVAILABLE (Standby)</option>
                    <option value="BUSY">BUSY (Active Mission)</option>
                    <option value="OFFLINE">OFFLINE (Resting)</option>
                  </select>
                </div>

                <Button variant="secondary" size="sm" onClick={() => setSelectedVolunteer(null)}>
                  Close Dossier
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Rejection Modal */}
        {rejectingVol && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-sm font-heading">
                    Reject Enlistment: {rejectingVol.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRejectingVol(null)
                    setRejectReason('')
                  }}
                  className="text-slate-400 hover:text-white text-base"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-600">
                  Please specify the reason for declining this candidate's application. The reason will be recorded and shown to the applicant upon sign-in attempt.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rejection Justification <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Identity could not be confirmed; Jurisdictional zone mismatch; Ineligible transport asset."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-control focus:outline-hidden focus:ring-1 focus:ring-slate-500 bg-slate-50 text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRejectingVol(null)
                      setRejectReason('')
                    }}
                    disabled={actionInProgress}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleRejectVolunteer}
                    disabled={actionInProgress || !rejectReason.trim()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Confirm Rejection
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
