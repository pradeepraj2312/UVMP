import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Users,
  Building2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Navigation,
  LogOut,
  Calendar,
  Info
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function VolunteerTaskDetail() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionFeedback, setActionFeedback] = useState(null)

  const fetchTaskDetail = () => {
    setLoading(true)
    setError(null)
    apiClient.get(`/volunteer/tasks/${taskId}`)
      .then((res) => {
        if (res.data?.data) {
          setTask(res.data.data)
        } else {
          setError('Task details not found.')
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

    apiClient.get(`/volunteer/tasks/${taskId}`)
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setTask(res.data.data)
          } else {
            setError('Task details not found.')
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
  }, [taskId])

  const handleSelfAssign = async () => {
    setActionLoading(true)
    setActionFeedback(null)
    try {
      await apiClient.post(`/volunteer/tasks/${taskId}/accept`)
      setActionFeedback('Mission accepted! You are now assigned.')
      fetchTaskDetail()
    } catch (err) {
      setActionFeedback(err.response?.data?.message || 'Failed to accept mission.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCheckIn = async () => {
    setActionLoading(true)
    setActionFeedback(null)
    try {
      await apiClient.post(`/volunteer/tasks/${taskId}/check-in`)
      setActionFeedback('Check-in recorded! Shift is now in progress.')
      fetchTaskDetail()
    } catch (err) {
      setActionFeedback(err.response?.data?.message || 'Failed to check in.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCheckOut = async () => {
    setActionLoading(true)
    setActionFeedback(null)
    try {
      await apiClient.post(`/volunteer/tasks/${taskId}/check-out`)
      setActionFeedback('Check-out complete! Your hours have been validated and logged.')
      fetchTaskDetail()
    } catch (err) {
      setActionFeedback(err.response?.data?.message || 'Failed to check out.')
    } finally {
      setActionLoading(false)
    }
  }

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return <Badge variant="danger">CRITICAL URGENCY</Badge>
      case 'HIGH':
        return <Badge variant="warning">HIGH URGENCY</Badge>
      case 'MEDIUM':
        return <Badge variant="info">MEDIUM URGENCY</Badge>
      default:
        return <Badge variant="neutral">LOW URGENCY</Badge>
    }
  }

  if (loading) {
    return (
      <AppLayout role="VOLUNTEER">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Retrieving mission briefing dossier...</p>
        </div>
      </AppLayout>
    )
  }

  if (error || !task) {
    return (
      <AppLayout role="VOLUNTEER">
        <div className="space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error || 'Task not found'}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/volunteer/tasks')}>
              Back to Missions
            </Button>
          </div>
          <EmptyState
            title="Mission details unavailable"
            description="The requested task could not be retrieved from the database."
            actionLabel="Back to Missions"
            onAction={() => navigate('/volunteer/tasks')}
          />
        </div>
      </AppLayout>
    )
  }

  const getUrgencyBorderClass = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'severity-left-critical'
      case 'HIGH':
        return 'severity-left-high'
      case 'MEDIUM':
        return 'severity-left-medium'
      default:
        return 'severity-left-low'
    }
  }

  const capacityPct = Math.round(((task.volunteersAssigned || 0) / (task.volunteersNeeded || 1)) * 100)

  return (
    <AppLayout role="VOLUNTEER">
      <div className="space-y-6 pb-12">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Link
            to="/volunteer/tasks"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mission Operations Board
          </Link>
          <Badge variant={task.status === 'COMPLETED' ? 'success' : 'info'}>
            TASK STATUS: {task.status}
          </Badge>
        </div>

        {/* Mission Dossier Header */}
        <div className={`bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4 ${getUrgencyBorderClass(task.urgency)}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-semibold tabular-nums">
                TSK-{String(task.id).padStart(4, '0')}
              </span>
              {getUrgencyBadge(task.urgency)}
              {task.isAssignedToMe && (
                <Badge variant={task.assignmentStatus === 'COMPLETED' ? 'success' : task.assignmentStatus === 'IN_PROGRESS' ? 'warning' : 'info'}>
                  DEPLOYMENT: {task.assignmentStatus}
                </Badge>
              )}
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-mono tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Dispatched: {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'Recent'}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">{task.title}</h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{task.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block text-slate-900">Field Location</span>
                <span className="text-slate-600">{task.location || 'Emergency Site'}</span>
                {task.latitude && task.longitude && (
                  <span className="block text-[11px] text-slate-500 font-mono mt-0.5 tabular-nums">
                    GPS: {task.latitude.toFixed(4)}, {task.longitude.toFixed(4)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block text-slate-900">Coordinating NGO</span>
                <span className="text-slate-700 font-medium">{task.ngoName}</span>
                <span className="block text-[11px] text-slate-500">{task.districtName}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Users className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-900">Team Quota</span>
                  <span className="text-slate-600 font-mono tabular-nums">
                    {task.volunteersAssigned || 0} / {task.volunteersNeeded}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(100, capacityPct)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="p-3.5 bg-slate-50 border-l-4 border-primary border border-slate-200 rounded-lg flex items-center gap-3 text-xs font-semibold text-slate-900">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Interactive Field Terminal: Dark Telemetry Console */}
        <div className="bg-slate-900 text-white p-6 rounded-lg border border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-800 text-red-400 flex items-center justify-center">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-heading text-white">Field Operations Terminal</h2>
                <p className="text-xs text-slate-400">Manage your on-site check-in, shift duration, and completion verification</p>
              </div>
            </div>

            <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
              PROTOCOL: UVMP-FIELD-OPS-v2
            </span>
          </div>

          {!task.isAssignedToMe ? (
            <div className="p-5 bg-slate-800/80 rounded-lg border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white font-heading">Ready to Deploy to this Mission?</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Self-assignment will lock your readiness status to BUSY and notify the coordinating NGO.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSelfAssign}
                disabled={actionLoading || task.status === 'COMPLETED'}
                className="font-medium shrink-0"
              >
                <Navigation className="w-4 h-4 mr-1.5" />
                {task.status === 'COMPLETED' ? 'Mission Concluded' : 'Accept Mission & Deploy'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Assignment Milestones */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-slate-800 bg-slate-800/50">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-mono">1. Deployment Assigned</span>
                  <strong className="text-sm text-white font-bold font-mono tabular-nums block mt-1">
                    {task.assignedAt ? new Date(task.assignedAt).toLocaleTimeString() : 'Verified'}
                  </strong>
                </div>

                <div className={`p-4 rounded-lg border ${task.checkInTime ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-800/50 text-slate-400'}`}>
                  <span className="text-[11px] uppercase tracking-wider block font-mono">2. On-Site Check-In</span>
                  <strong className="text-sm font-bold font-mono tabular-nums block mt-1">
                    {task.checkInTime ? new Date(task.checkInTime).toLocaleTimeString() : 'Pending Arrival'}
                  </strong>
                </div>

                <div className={`p-4 rounded-lg border ${task.checkOutTime ? 'border-amber-500/60 bg-amber-950/40 text-amber-300' : 'border-slate-800 bg-slate-800/50 text-slate-400'}`}>
                  <span className="text-[11px] uppercase tracking-wider block font-mono">3. Field Check-Out</span>
                  <strong className="text-sm font-bold font-mono tabular-nums block mt-1">
                    {task.checkOutTime ? new Date(task.checkOutTime).toLocaleTimeString() : 'Awaiting Completion'}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {task.assignmentStatus === 'ASSIGNED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleCheckIn}
                    disabled={actionLoading}
                    className="font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Record On-Site Check-In
                  </Button>
                )}

                {task.assignmentStatus === 'IN_PROGRESS' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCheckOut}
                    disabled={actionLoading}
                    className="font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-1.5" />
                    Submit Check-Out & Log Hours
                  </Button>
                )}

                {task.assignmentStatus === 'COMPLETED' && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-700/80 rounded-lg text-xs font-semibold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Mission completed! {task.hoursLogged || 0} hours credited to your service record.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Required Skills & Safety Briefing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold font-heading text-slate-900">Prerequisite Skills & Qualifications</h3>
            {task.requiredSkills ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {task.requiredSkills.split(',').map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-sm bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-600">Open to all community volunteers without specialized requirements.</p>
            )}
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold font-heading text-slate-900">Safety & Field Coordination Protocol</h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
              <li>Always check in with the NGO Incident Commander upon arriving at the coordinates.</li>
              <li>Wear proper high-visibility identification and PPE during active field response.</li>
              <li>Perform a formal check-out via this terminal when concluding your shift to record hours.</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
