import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  AlertCircle,
  ClipboardList,
  Building2,
  Users,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Plus,
  MapPin,
  Clock,
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import StatCard from '../../components/StatCard'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function DistrictDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    districtId: 1,
    ngoId: '',
    requiredSkills: 'First Aid, Logistics',
    locationAddress: '',
    latitude: 12.9716,
    longitude: 77.5946,
    urgency: 'HIGH',
    volunteersNeeded: 5,
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [ngos, setNgos] = useState([])

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/district/dashboard')
      if (res.data?.data) {
        setData(res.data.data)
      } else {
        setError('No data returned from district operations API.')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to connect to backend server. Please verify MySQL and backend are running.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    apiClient.get('/district/dashboard')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setData(res.data.data)
          } else {
            setError('No data returned from district operations API.')
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
            err.message ||
            'Failed to connect to backend server. Please verify MySQL and backend are running.'
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

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError(null)
    try {
      await apiClient.post('/tasks', taskForm)
      setIsTaskModalOpen(false)
      setTaskForm({
        title: '',
        description: '',
        districtId: 1,
        ngoId: '',
        requiredSkills: 'First Aid, Logistics',
        locationAddress: '',
        latitude: 12.9716,
        longitude: 77.5946,
        urgency: 'HIGH',
        volunteersNeeded: 5,
      })
      fetchDashboard()
    } catch (err) {
      setCreateError(
        err.response?.data?.message ||
        err.message ||
        'Failed to create mission. Please check backend connection.'
      )
    } finally {
      setCreateLoading(false)
    }
  }

  return (
    <AppLayout role="DISTRICT_AUTHORITY">
      <div className="space-y-6">
        {/* Operations Center Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <p className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                {data?.region || 'ZONE 1 - HIGH ALERT'} • LIVE TELEMETRY
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight mt-1">
              {data?.districtName || 'Central Operations Command'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time disaster coordination, citizen alert triage, and NGO mission dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              loading={loading}
              onClick={fetchDashboard}
            >
              Sync
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsTaskModalOpen(true)}
            >
              Create Mission
            </Button>
          </div>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span><strong>Backend Connection Notice:</strong> {error}</span>
            </div>
            <Button size="xs" variant="outline" onClick={fetchDashboard} loading={loading}>
              Retry Connection
            </Button>
          </div>
        )}

        {!data && !loading && error ? (
          <EmptyState
            icon={AlertCircle}
            title="Unable to Load Live Operations Dashboard"
            description={error}
            action={
              <Button variant="primary" size="sm" onClick={fetchDashboard} icon={RefreshCw}>
                Retry Connection
              </Button>
            }
          />
        ) : (
          <>
            {/* Severity Telemetry Hero Gauge */}
            {(() => {
              const crit = data?.severityDistribution?.CRITICAL || 0
              const high = data?.severityDistribution?.HIGH || 0
              const med = data?.severityDistribution?.MEDIUM || 0
              const low = (data?.totalIncidents || 0) - crit - high - med
              const validLow = low > 0 ? low : 0
              const totalActive = crit + high + med + validLow || 1
              const pCrit = Math.round((crit / totalActive) * 100)
              const pHigh = Math.round((high / totalActive) * 100)
              const pMed = Math.round((med / totalActive) * 100)
              const pLow = 100 - pCrit - pHigh - pMed

              return (
                <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                      <h2 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-700">
                        Incident Severity Telemetry
                      </h2>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                      Total Active Triage: <strong>{data?.totalIncidents ?? 0} incidents</strong>
                    </span>
                  </div>

                  {/* Multi-segment Telemetry Bar */}
                  <div className="w-full h-3 bg-slate-100 rounded-sm overflow-hidden flex" role="progressbar" aria-label="Incident severity distribution">
                    {crit > 0 && (
                      <div
                        style={{ width: `${pCrit}%` }}
                        className="bg-[#C1272D] transition-all duration-500 relative group cursor-pointer"
                        title={`Critical: ${crit} (${pCrit}%)`}
                      />
                    )}
                    {high > 0 && (
                      <div
                        style={{ width: `${pHigh}%` }}
                        className="bg-[#F26522] transition-all duration-500 relative group cursor-pointer"
                        title={`High Priority: ${high} (${pHigh}%)`}
                      />
                    )}
                    {med > 0 && (
                      <div
                        style={{ width: `${pMed}%` }}
                        className="bg-amber-500 transition-all duration-500 relative group cursor-pointer"
                        title={`Medium: ${med} (${pMed}%)`}
                      />
                    )}
                    {validLow > 0 && (
                      <div
                        style={{ width: `${pLow}%` }}
                        className="bg-emerald-600 transition-all duration-500 relative group cursor-pointer"
                        title={`Low / Advisory: ${validLow} (${pLow}%)`}
                      />
                    )}
                  </div>

                  {/* Telemetry Indicator Readouts */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-xs bg-[#C1272D] shrink-0"></span>
                      <div>
                        <span className="text-[11px] text-slate-500 block leading-tight">Critical (Life Hazard)</span>
                        <span className="text-base font-bold font-mono tabular-nums text-slate-900 leading-none">
                          {crit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-xs bg-[#F26522] shrink-0"></span>
                      <div>
                        <span className="text-[11px] text-slate-500 block leading-tight">High Priority</span>
                        <span className="text-base font-bold font-mono tabular-nums text-slate-900 leading-none">
                          {high}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-xs bg-amber-500 shrink-0"></span>
                      <div>
                        <span className="text-[11px] text-slate-500 block leading-tight">Medium (Logistics)</span>
                        <span className="text-base font-bold font-mono tabular-nums text-slate-900 leading-none">
                          {med}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-xs bg-emerald-600 shrink-0"></span>
                      <div>
                        <span className="text-[11px] text-slate-500 block leading-tight">Low / Monitored</span>
                        <span className="text-base font-bold font-mono tabular-nums text-slate-900 leading-none">
                          {validLow}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Live Metric KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Citizen SOS Reports"
                value={data?.totalIncidents ?? 0}
                trend={`${data?.pendingIncidents ?? 0} pending triage`}
                icon={AlertTriangle}
                tone={data?.pendingIncidents > 0 ? 'danger' : 'primary'}
              />
              <StatCard
                label="Verified & Converted"
                value={data?.convertedTasks ?? 0}
                trend={`${data?.verifiedIncidents ?? 0} confirmed on-ground`}
                icon={ShieldCheck}
                tone="success"
              />
              <StatCard
                label="Active Relief Tasks"
                value={data?.activeTasks ?? 0}
                trend="Dispatched missions"
                icon={ClipboardList}
                tone="secondary"
              />
              <StatCard
                label="Mobilized Network"
                value={`${data?.totalVolunteers ?? 0} Vol`}
                trend={`${data?.totalNgos ?? 0} active NGOs`}
                icon={Users}
                tone="neutral"
              />
            </div>

            {/* Main Operational Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Panel 1: Citizen SOS Reports Awaiting Triage */}
              <Card
                title="Citizen Incidents Awaiting Triage"
                description="Incoming reports requiring verification and task conversion"
                actions={
                  <Link to="/district/incidents" className="text-xs font-semibold text-slate-700 flex items-center gap-1 hover:text-slate-900">
                    View Queue <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                }
              >
                <div className="space-y-2.5">
                  {(data?.recentIncidents || []).length === 0 ? (
                    <p className="py-8 text-center text-xs text-slate-500">No active incidents in queue.</p>
                  ) : (
                    data.recentIncidents.slice(0, 4).map((inc) => {
                      const sev = (inc.severity || 'MEDIUM').toUpperCase()
                      const sevClass =
                        sev === 'CRITICAL'
                          ? 'severity-left-critical'
                          : sev === 'HIGH'
                          ? 'severity-left-high'
                          : sev === 'LOW'
                          ? 'severity-left-low'
                          : 'severity-left-medium'

                      return (
                        <div
                          key={inc.id}
                          className={`p-3.5 bg-slate-50/60 border border-slate-200/80 rounded-r-md ${sevClass} flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                                {inc.referenceCode || `INC-${inc.id}`}
                              </span>
                              <Badge status={inc.severity} />
                              <Badge status={inc.status} />
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 mt-1 truncate">
                              {inc.incidentType}
                            </h4>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{inc.locationAddress || 'Coordinates Logged'}</span>
                            </p>
                          </div>

                          <Link to="/district/incidents" className="shrink-0 self-center">
                            <Button variant="outline" size="sm" className="text-xs">
                              Triage &rarr;
                            </Button>
                          </Link>
                        </div>
                      )
                    })
                  )}
                </div>
              </Card>

              {/* Panel 2: Live Disaster Relief Tasks */}
              <Card
                title="Active Response Missions"
                description="Tasks deployed across district emergency sectors"
                actions={
                  <Link to="/district/tasks" className="text-xs font-semibold text-slate-700 flex items-center gap-1 hover:text-slate-900">
                    Mission Board <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                }
              >
                <div className="space-y-2.5">
                  {(data?.recentTasks || []).length === 0 ? (
                    <p className="py-8 text-center text-xs text-slate-500">No active tasks scheduled.</p>
                  ) : (
                    data.recentTasks.slice(0, 4).map((task) => {
                      const urg = (task.urgency || 'MEDIUM').toUpperCase()
                      const urgClass =
                        urg === 'CRITICAL'
                          ? 'severity-left-critical'
                          : urg === 'HIGH'
                          ? 'severity-left-high'
                          : 'severity-left-medium'

                      return (
                        <div
                          key={task.id}
                          className={`p-3.5 bg-slate-50/60 border border-slate-200/80 rounded-r-md ${urgClass} flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[11px] font-semibold text-slate-600 tabular-nums">
                                TSK-{String(task.id).padStart(4, '0')}
                              </span>
                              <Badge status={task.status} />
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700">
                                {task.urgency}
                              </span>
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 mt-1 truncate">
                              {task.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1 truncate">
                                <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{task.ngoName || 'District Direct'}</span>
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="flex items-center gap-1 shrink-0 font-mono tabular-nums">
                                <Users className="w-3 h-3 text-slate-400" />
                                {task.volunteersAssigned}/{task.volunteersNeeded} personnel
                              </span>
                            </p>
                          </div>

                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 shrink-0 self-center">
                            <Clock className="w-3 h-3" />
                            Active
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Create Task Modal */}
        <Modal
          open={isTaskModalOpen}
          title="Create District Response Mission"
          subtitle="Directly dispatch a task to local NGOs and volunteer corps"
          onClose={() => {
            setIsTaskModalOpen(false)
            setCreateError(null)
          }}
        >
          {createError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-control flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{createError}</span>
            </div>
          )}
          <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-accent mb-1">
                Task Mission Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="e.g. Sector 2 Sandbag Barrier Construction"
                className="w-full px-3 py-2 border border-border rounded-control text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-accent mb-1">
                Operational Details & Objectives <span className="text-danger">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Specify requirements, safety hazards, and rendezvous coordinates."
                className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-accent mb-1">Assign NGO</label>
                <select
                  value={taskForm.ngoId}
                  onChange={(e) => setTaskForm({ ...taskForm, ngoId: e.target.value ? parseInt(e.target.value) : '' })}
                  className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Direct District Coordination</option>
                  {ngos.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-accent mb-1">Urgency</label>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-accent mb-1">Required Skills</label>
                <input
                  type="text"
                  value={taskForm.requiredSkills}
                  onChange={(e) => setTaskForm({ ...taskForm, requiredSkills: e.target.value })}
                  placeholder="e.g. First Aid, Search & Rescue"
                  className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-accent mb-1">Volunteers Needed</label>
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
              <label className="block font-semibold text-accent mb-1">Location Address</label>
              <input
                type="text"
                required
                value={taskForm.locationAddress}
                onChange={(e) => setTaskForm({ ...taskForm, locationAddress: e.target.value })}
                placeholder="Sector / Landmark location"
                className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsTaskModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={createLoading} icon={Plus}>
                Create Mission
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  )
}
