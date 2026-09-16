import { useState, useEffect, useMemo } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRightCircle,
  Search,
  MapPin,
  Phone,
  User,
  Users,
  Eye,
  RefreshCw,
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function DistrictIncidents() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [actionLoading, setActionLoading] = useState(false)

  // Details and Convert Modal State
  const [activeIncident, setActiveIncident] = useState(null)
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [ngos, setNgos] = useState([])
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    districtId: 1,
    ngoId: '',
    requiredSkills: 'First Aid, Search & Rescue',
    locationAddress: '',
    latitude: 0,
    longitude: 0,
    urgency: 'HIGH',
    volunteersNeeded: 5,
  })

  // Manual refresh handler
  const fetchIncidents = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/incidents')
      if (res.data?.data) {
        setIncidents(res.data.data)
      } else {
        setIncidents([])
        setError('No incident records returned from backend.')
      }
    } catch (err) {
      setIncidents([])
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch incidents. Please ensure MySQL and backend are running.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    let ignore = false

    apiClient.get('/incidents')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setIncidents(res.data.data)
          } else {
            setIncidents([])
            setError('No incident records returned from backend.')
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          setIncidents([])
          setError(
            err.response?.data?.message ||
            err.message ||
            'Failed to fetch incidents. Please ensure MySQL and backend are running.'
          )
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    apiClient.get('/district/ngos')
      .then((res) => {
        if (!ignore && res.data?.data) setNgos(res.data.data)
      })
      .catch(() => {
        // empty NGOs list
      })

    return () => {
      ignore = true
    }
  }, [])

  // Verify Incident
  const handleVerify = async (incident) => {
    setActionLoading(true)
    setActionError(null)
    try {
      await apiClient.patch(`/incidents/${incident.id}/verify`)
      setIncidents((prev) =>
        prev.map((i) => (i.id === incident.id ? { ...i, status: 'VERIFIED' } : i))
      )
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
        err.message ||
        `Failed to verify incident ${incident.referenceCode || incident.id}. Please check backend connection.`
      )
    } finally {
      setActionLoading(false)
    }
  }

  // Reject Incident
  const handleReject = async (incident) => {
    setActionLoading(true)
    setActionError(null)
    try {
      await apiClient.patch(`/incidents/${incident.id}/reject`)
      setIncidents((prev) =>
        prev.map((i) => (i.id === incident.id ? { ...i, status: 'REJECTED' } : i))
      )
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
        err.message ||
        `Failed to reject incident ${incident.referenceCode || incident.id}. Please check backend connection.`
      )
    } finally {
      setActionLoading(false)
    }
  }

  // Open Convert to Task Modal
  const openConvertModal = (incident) => {
    setActiveIncident(incident)
    setActionError(null)
    setTaskForm({
      title: `${incident.incidentType} Response: ${incident.locationAddress || 'Emergency Site'}`,
      description: incident.description,
      districtId: 1,
      ngoId: ngos.length > 0 ? ngos[0].id : '',
      requiredSkills: incident.incidentType.includes('Flood')
        ? 'Water Rescue, First Aid, Boat Operations'
        : incident.incidentType.includes('Medical')
        ? 'Medical, Trauma Care, Nursing'
        : 'Search & Rescue, Logistics, First Aid',
      locationAddress: incident.locationAddress || '',
      latitude: incident.latitude || 12.9716,
      longitude: incident.longitude || 77.5946,
      urgency: incident.severity || 'HIGH',
      volunteersNeeded: Math.max(3, Math.ceil((incident.peopleAffected || 1) / 3)),
    })
    setIsConvertModalOpen(true)
  }

  // Submit Convert to Task
  const handleConvertSubmit = async (e) => {
    e.preventDefault()
    if (!activeIncident) return
    setActionLoading(true)
    setActionError(null)

    try {
      const res = await apiClient.post(`/incidents/${activeIncident.id}/convert-to-task`, taskForm)
      const createdTask = res.data?.data
      setIncidents((prev) =>
        prev.map((i) =>
          i.id === activeIncident.id
            ? { ...i, status: 'CONVERTED_TO_TASK', convertedTaskId: createdTask?.id }
            : i
        )
      )
      setIsConvertModalOpen(false)
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
        err.message ||
        'Failed to convert incident to task. Please check backend connection.'
      )
    } finally {
      setActionLoading(false)
    }
  }

  // Filter and Search Incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter
      const query = search.toLowerCase()
      const matchesSearch =
        !search ||
        (inc.referenceCode && inc.referenceCode.toLowerCase().includes(query)) ||
        (inc.reporterName && inc.reporterName.toLowerCase().includes(query)) ||
        (inc.description && inc.description.toLowerCase().includes(query)) ||
        (inc.locationAddress && inc.locationAddress.toLowerCase().includes(query)) ||
        (inc.incidentType && inc.incidentType.toLowerCase().includes(query))

      return matchesStatus && matchesSearch
    })
  }, [incidents, statusFilter, search])

  const pendingCount = incidents.filter((i) => i.status === 'REPORTED').length

  return (
    <AppLayout role="DISTRICT_AUTHORITY">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Citizen Incident Triage Desk</h1>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#C1272D] text-white rounded tabular-nums">
                  {pendingCount} Pending Triage
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify incoming citizen emergency SOS alerts and convert high-priority incidents into actionable tasks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              loading={loading}
              onClick={fetchIncidents}
            >
              Refresh Feeds
            </Button>
          </div>
        </div>

        {/* Error Notification Banners */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span><strong>Backend Connection Error:</strong> {error}</span>
            </div>
            <Button size="xs" variant="outline" onClick={fetchIncidents} loading={loading}>
              Retry Connection
            </Button>
          </div>
        )}

        {actionError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between gap-3 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span><strong>Action Notice:</strong> {actionError}</span>
            </div>
            <Button size="xs" variant="ghost" onClick={() => setActionError(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'REPORTED', 'VERIFIED', 'CONVERTED_TO_TASK', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Alerts' : st === 'REPORTED' ? 'New Reported' : st === 'CONVERTED_TO_TASK' ? 'Converted' : st}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, address, reporter..."
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-500"
            />
          </div>
        </div>

        {/* Incidents Table / Roster */}
        <Card
          title={`Active Disaster Incident Reports (${filteredIncidents.length})`}
          description="Live triage queue for citizen reports"
        >
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
              <div className="w-7 h-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>Fetching live emergency incident reports...</span>
            </div>
          ) : error && incidents.length === 0 ? (
            <EmptyState
              icon={AlertCircle}
              title="Unable to Load Incident Reports"
              description={error}
              action={
                <Button variant="primary" size="sm" onClick={fetchIncidents} icon={RefreshCw}>
                  Retry Connection
                </Button>
              }
            />
          ) : filteredIncidents.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No incidents match your filter"
              description="All reported incidents in this category have been triaged or none currently exist."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Reference & Severity</th>
                    <th className="py-3 px-4">Emergency Details</th>
                    <th className="py-3 px-4">Location & Coordinates</th>
                    <th className="py-3 px-4">Reporter Info</th>
                    <th className="py-3 px-4">Triage Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {filteredIncidents.map((inc) => {
                    const sev = (inc.severity || 'MEDIUM').toUpperCase()
                    const sevRowClass =
                      sev === 'CRITICAL'
                        ? 'border-l-4 border-l-[#C1272D]'
                        : sev === 'HIGH'
                        ? 'border-l-4 border-l-[#F26522]'
                        : sev === 'LOW'
                        ? 'border-l-4 border-l-emerald-600'
                        : 'border-l-4 border-l-amber-500'

                    return (
                      <tr key={inc.id} className={`hover:bg-slate-50 transition-colors ${sevRowClass}`}>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-900 block tabular-nums">
                            {inc.referenceCode || `INC-${String(inc.id).padStart(5, '0')}`}
                          </span>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-mono font-bold rounded uppercase ${
                              inc.severity === 'CRITICAL'
                                ? 'bg-red-100 text-[#C1272D]'
                                : inc.severity === 'HIGH'
                                ? 'bg-orange-100 text-[#F26522]'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inc.severity}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <strong className="text-slate-900 font-semibold block truncate">
                            {inc.incidentType}
                          </strong>
                          <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5 leading-relaxed">
                            {inc.description}
                          </p>
                          {inc.peopleAffected > 1 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#C1272D] mt-1 tabular-nums">
                              <Users className="w-3 h-3" />
                              ~{inc.peopleAffected} persons affected
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-start gap-1 text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="truncate">{inc.locationAddress || 'Coordinate location'}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 block mt-0.5 tabular-nums">
                            {inc.latitude?.toFixed(4)}, {inc.longitude?.toFixed(4)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-slate-900 font-medium">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{inc.reporterName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 font-mono tabular-nums">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{inc.reporterPhone}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Badge status={inc.status} />
                          {inc.convertedTaskId && (
                            <span className="block text-[10px] font-mono font-semibold text-slate-600 mt-1 tabular-nums">
                              Task #{inc.convertedTaskId}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Eye}
                            onClick={() => {
                              setActiveIncident(inc)
                              setIsDetailModalOpen(true)
                            }}
                          >
                            View
                          </Button>

                          {inc.status === 'REPORTED' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={CheckCircle2}
                                loading={actionLoading}
                                onClick={() => handleVerify(inc)}
                                className="text-emerald-700 hover:bg-emerald-50 border-emerald-300"
                              >
                                Verify
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={XCircle}
                                loading={actionLoading}
                                onClick={() => handleReject(inc)}
                                className="text-red-700 hover:bg-red-50 border-red-300"
                              >
                                Dismiss
                              </Button>
                            </>
                          )}

                          {inc.status !== 'CONVERTED_TO_TASK' && inc.status !== 'REJECTED' && (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={ArrowRightCircle}
                              onClick={() => openConvertModal(inc)}
                            >
                              Convert to Task
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* View Incident Detail Modal */}
        <Modal
          open={isDetailModalOpen}
          title={activeIncident?.referenceCode || 'Emergency Incident Details'}
          subtitle={`Reported ${activeIncident?.createdAt ? new Date(activeIncident.createdAt).toLocaleString() : 'Recently'}`}
          onClose={() => setIsDetailModalOpen(false)}
        >
          {activeIncident && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-red-50 rounded-control border border-red-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-700 block">Incident Category</span>
                  <strong className="text-sm text-primary font-heading">{activeIncident.incidentType}</strong>
                </div>
                <Badge status={activeIncident.severity} />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                  Situation Description
                </label>
                <div className="p-3 bg-gray-50 rounded-control border border-border text-gray-700 leading-relaxed">
                  {activeIncident.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-control border border-border">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">People Affected</span>
                  <span className="text-base font-bold text-accent">{activeIncident.peopleAffected || 1} persons</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-control border border-border">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Current Status</span>
                  <Badge status={activeIncident.status} />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-control border border-border">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Incident Location</span>
                <p className="font-semibold text-accent">{activeIncident.locationAddress || 'N/A'}</p>
                <p className="font-mono text-gray-500 mt-1">
                  Latitude: {activeIncident.latitude} | Longitude: {activeIncident.longitude}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-control border border-border">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Citizen Reporter</span>
                <p className="font-semibold text-accent">{activeIncident.reporterName}</p>
                <p className="text-gray-500">Phone: {activeIncident.reporterPhone} {activeIncident.reporterEmail && `| ${activeIncident.reporterEmail}`}</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
                {activeIncident.status !== 'CONVERTED_TO_TASK' && activeIncident.status !== 'REJECTED' && (
                  <Button
                    variant="primary"
                    icon={ArrowRightCircle}
                    onClick={() => {
                      setIsDetailModalOpen(false)
                      openConvertModal(activeIncident)
                    }}
                  >
                    Convert to Task
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* Convert Incident to Task Modal */}
        <Modal
          open={isConvertModalOpen}
          title="Convert Incident to Operational Task"
          subtitle="Generate a verified disaster response mission from this citizen alert"
          onClose={() => setIsConvertModalOpen(false)}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleConvertSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-accent mb-1">
                Mission Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-control text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-accent mb-1">
                Operational Task Description <span className="text-danger">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-accent mb-1">
                  Assign to NGO Partner
                </label>
                <select
                  value={taskForm.ngoId}
                  onChange={(e) => setTaskForm({ ...taskForm, ngoId: e.target.value ? parseInt(e.target.value) : '' })}
                  className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Direct District Coordination</option>
                  {ngos.map((ngo) => (
                    <option key={ngo.id} value={ngo.id}>
                      {ngo.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-accent mb-1">
                  Urgency Level <span className="text-danger">*</span>
                </label>
                <select
                  value={taskForm.urgency}
                  onChange={(e) => setTaskForm({ ...taskForm, urgency: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-accent mb-1">
                  Required Skills (AI Matching Filter)
                </label>
                <input
                  type="text"
                  value={taskForm.requiredSkills}
                  onChange={(e) => setTaskForm({ ...taskForm, requiredSkills: e.target.value })}
                  placeholder="e.g. First Aid, Boat Operations"
                  className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-accent mb-1">
                  Volunteers Needed <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={taskForm.volunteersNeeded}
                  onChange={(e) => setTaskForm({ ...taskForm, volunteersNeeded: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-accent mb-1">
                Target Location Address
              </label>
              <input
                type="text"
                value={taskForm.locationAddress}
                onChange={(e) => setTaskForm({ ...taskForm, locationAddress: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsConvertModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={actionLoading} icon={ArrowRightCircle}>
                Create & Dispatch Task
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  )
}
