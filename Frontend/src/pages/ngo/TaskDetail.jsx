import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  UserPlus,
  UserMinus,
  Play,
  Check,
  Phone,
  Mail,
  Zap,
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function NgoTaskDetail() {
  const { taskId } = useParams()

  const [taskData, setTaskData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // AI Matching state
  const [aiCandidates, setAiCandidates] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)
  const [aiLimit, setAiLimit] = useState(10)

  // Action states
  const [assigningId, setAssigningId] = useState(null)
  const [unassigningId, setUnassigningId] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [actionSuccess, setActionSuccess] = useState(null)

  const fetchTaskDetail = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get(`/ngo/tasks/${taskId}`)
      if (res.data?.data) {
        setTaskData(res.data.data)
      } else {
        setError('Task details could not be retrieved.')
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

  const runAiMatching = async () => {
    setAiLoading(true)
    setAiError(null)
    try {
      const res = await apiClient.get(`/ai/match?taskId=${taskId}&limit=${aiLimit}`)
      if (res.data?.data) {
        setAiCandidates(res.data.data)
      } else {
        setAiError('No AI matching recommendations returned.')
      }
    } catch (err) {
      setAiError(
        err.response?.data?.message ||
        err.message ||
        'AI Matching Engine failed to execute. Ensure volunteer coordinates and skills are seeded in database.'
      )
    } finally {
      setAiLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    apiClient.get(`/ngo/tasks/${taskId}`)
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setTaskData(res.data.data)
          } else {
            setError('Task details could not be retrieved.')
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

  const handleAssignVolunteer = async (volunteerId) => {
    setAssigningId(volunteerId)
    setActionSuccess(null)
    try {
      const res = await apiClient.post(`/ngo/tasks/${taskId}/assign?volunteerId=${volunteerId}`)
      if (res.data?.data) {
        setTaskData(res.data.data)
        setActionSuccess(`Volunteer #${volunteerId} successfully deployed to this mission.`)
        // Auto-refresh AI candidate list if visible
        if (aiCandidates.length > 0) {
          runAiMatching()
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign volunteer to mission.')
    } finally {
      setAssigningId(null)
    }
  }

  const handleUnassignVolunteer = async (volunteerId) => {
    if (!window.confirm('Are you sure you want to release this volunteer from the mission?')) {
      return
    }
    setUnassigningId(volunteerId)
    setActionSuccess(null)
    try {
      const res = await apiClient.delete(`/ngo/tasks/${taskId}/unassign/${volunteerId}`)
      if (res.data?.data) {
        setTaskData(res.data.data)
        setActionSuccess(`Volunteer #${volunteerId} released from mission.`)
        // Auto-refresh AI candidates
        if (aiCandidates.length > 0) {
          runAiMatching()
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unassign volunteer.')
    } finally {
      setUnassigningId(null)
    }
  }

  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true)
    setActionSuccess(null)
    try {
      const res = await apiClient.patch(`/ngo/tasks/${taskId}/status?status=${newStatus}`)
      if (res.data?.data) {
        // Re-fetch detail to get updated assigned volunteers shift completions
        await fetchTaskDetail()
        setActionSuccess(`Mission status advanced to ${newStatus}.`)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update mission status.')
    } finally {
      setStatusUpdating(false)
    }
  }

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return <Badge variant="danger">CRITICAL PRIORITY</Badge>
      case 'HIGH':
        return <Badge variant="warning">HIGH PRIORITY</Badge>
      case 'MEDIUM':
        return <Badge variant="info">MEDIUM PRIORITY</Badge>
      default:
        return <Badge variant="neutral">LOW PRIORITY</Badge>
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <Badge variant="warning">IN PROGRESS</Badge>
      case 'ASSIGNED':
        return <Badge variant="info">CREW ASSIGNED</Badge>
      case 'OPEN':
        return <Badge variant="neutral">OPEN / UNASSIGNED</Badge>
      case 'COMPLETED':
        return <Badge variant="success">MISSION COMPLETED</Badge>
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <AppLayout role="NGO">
        <div className="p-16 text-center bg-white rounded-card border border-border">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500 font-medium">Loading mission details from live database...</p>
        </div>
      </AppLayout>
    )
  }

  if (error || !taskData) {
    return (
      <AppLayout role="NGO">
        <div className="space-y-4">
          <Link to="/ngo/tasks" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Mission Tasks</span>
          </Link>
          <Card>
            <EmptyState
              icon={AlertCircle}
              title="Mission Not Found or Server Unreachable"
              description={error || 'Unable to retrieve mission details.'}
              action={
                <div className="flex gap-2">
                  <Button size="sm" onClick={fetchTaskDetail}>
                    Retry Connection
                  </Button>
                  <Link to="/ngo/tasks">
                    <Button size="sm" variant="outline">
                      Return to Tasks
                    </Button>
                  </Link>
                </div>
              }
            />
          </Card>
        </div>
      </AppLayout>
    )
  }

  const task = taskData
  const assignedVolunteers = task.assignedVolunteers || []
  const assignedCount = task.volunteersAssigned || assignedVolunteers.length
  const requiredCount = task.volunteersRequired || 1
  const percentFilled = Math.min(100, Math.round((assignedCount / requiredCount) * 100))

  return (
    <AppLayout role="NGO">
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/ngo/tasks"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Mission Tasks</span>
          </Link>

          <span className="text-xs font-mono text-gray-400">
            TSK-{String(task.id).padStart(4, '0')}
          </span>
        </div>

        {/* Action Success Toast Banner */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-card flex items-center justify-between gap-3 text-xs text-emerald-800">
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
        {/* Mission Overview Hero Card */}
        {(() => {
          const urg = (task.urgency || 'MEDIUM').toUpperCase()
          const urgClass =
            urg === 'CRITICAL'
              ? 'severity-left-critical'
              : urg === 'HIGH'
              ? 'severity-left-high'
              : 'severity-left-medium'

          return (
            <div className={`bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4 ${urgClass}`}>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-semibold tabular-nums">
                      MISSION #{task.id}
                    </span>
                    {getUrgencyBadge(task.urgency)}
                    {getStatusBadge(task.status)}
                    {task.incidentId && (
                      <span className="text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-sm border border-slate-200 font-mono tabular-nums">
                        SOS Incident #{task.incidentId}
                      </span>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight">
                    {task.title}
                  </h1>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {task.description || 'No extended mission briefing provided.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-5 pt-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C1272D] shrink-0" />
                      <span className="font-medium text-slate-700">{task.location || 'Coordinates Logged'}</span>
                      {task.latitude && task.longitude && (
                        <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                          ({task.latitude.toFixed(4)}, {task.longitude.toFixed(4)})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px] tabular-nums">
                        Created:{' '}
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mission Operational Controls */}
                <div className="flex flex-col gap-2 shrink-0 lg:w-60 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Mission Control
                  </span>

                  {task.status !== 'IN_PROGRESS' && task.status !== 'COMPLETED' && (
                    <Button
                      size="sm"
                      variant="primary"
                      className="gap-2 w-full justify-center"
                      disabled={statusUpdating}
                      onClick={() => handleStatusChange('IN_PROGRESS')}
                    >
                      <Play className="w-3.5 h-3.5" />
                      Start Field Operation
                    </Button>
                  )}

                  {task.status !== 'COMPLETED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 w-full justify-center text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                      disabled={statusUpdating}
                      onClick={() => handleStatusChange('COMPLETED')}
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Mark Completed
                    </Button>
                  )}

                  {task.status === 'COMPLETED' && (
                    <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-100/70 p-2 rounded font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Mission Concluded</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Required Skills Chips */}
              {task.requiredSkills && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Required Skills:</span>
                  {task.requiredSkills.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-100 text-slate-800 font-medium px-2.5 py-0.5 rounded-sm border border-slate-200"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Capacity Progress Bar */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Crew Deployment:</span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums">
                      {assignedCount} of {requiredCount} personnel ({percentFilled}%)
                    </span>
                  </span>
                  <span className="text-slate-500 font-mono text-[11px] tabular-nums">
                    {Math.max(0, requiredCount - assignedCount)} openings remaining
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-sm h-2 overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      percentFilled >= 100
                        ? 'bg-emerald-600'
                        : percentFilled > 0
                        ? 'bg-[#F26522]'
                        : 'bg-slate-300'
                    }`}
                    style={{ width: `${percentFilled}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })()}

        {/* Section Grid: Left = Assigned Roster, Right = AI Volunteer Matching Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Deployed Personnel Roster (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card
              title="Active Field Roster"
              description={`${assignedVolunteers.length} volunteer personnel currently dispatched to this mission`}
            >
              {assignedVolunteers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No personnel dispatched yet</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                    Use the AI Volunteer Matching Engine on the right to match and assign verified personnel.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  {assignedVolunteers.map((vol) => (
                    <div
                      key={vol.assignmentId || vol.volunteerId}
                      className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-lg flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{vol.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                            #VOL-{vol.volunteerId}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                          {vol.phone && (
                            <span className="flex items-center gap-1 font-mono tabular-nums">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {vol.phone}
                            </span>
                          )}
                          {vol.skills && (
                            <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 truncate max-w-[140px]">
                              {vol.skills}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        size="xs"
                        variant="outline"
                        loading={unassigningId === vol.volunteerId}
                        onClick={() => handleUnassignVolunteer(vol.volunteerId)}
                        className="text-[11px] text-slate-600 hover:text-red-700 hover:border-red-300 shrink-0"
                      >
                        <UserMinus className="w-3 h-3 mr-1" />
                        Release
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right: AI Volunteer Matching Engine (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Dark Precision Command Console Header */}
            <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-lg shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold font-heading text-white">
                      AI Volunteer Matching Engine
                    </h2>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Multi-Factor Optimization Algorithm
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={aiLimit}
                    onChange={(e) => setAiLimit(Number(e.target.value))}
                    className="text-xs bg-slate-800 border border-slate-700 text-white rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                  </select>

                  <Button
                    size="sm"
                    variant="primary"
                    disabled={aiLoading}
                    onClick={runAiMatching}
                    className="gap-2 font-semibold text-xs"
                  >
                    <Zap className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                    <span>{aiLoading ? 'Computing...' : 'Run AI Match'}</span>
                  </Button>
                </div>
              </div>

              {/* Matching Algorithm Formula Explainer Strip */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-3 border-t border-slate-800">
                <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                  <span className="font-mono font-bold text-amber-400 block">50% Skill Match</span>
                  <span className="text-[10px] text-slate-400">Keyword overlap</span>
                </div>
                <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                  <span className="font-mono font-bold text-sky-400 block">30% Haversine</span>
                  <span className="text-[10px] text-slate-400">Geographic radius</span>
                </div>
                <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                  <span className="font-mono font-bold text-emerald-400 block">20% Reliability</span>
                  <span className="text-[10px] text-slate-400">Mission track record</span>
                </div>
              </div>
            </div>

            {/* AI Error Alert */}
            {aiError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-red-800">AI Matching Engine Notice</h4>
                  <p className="text-xs text-red-700 mt-1">{aiError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-red-700 border-red-300 hover:bg-red-100 text-xs"
                    onClick={runAiMatching}
                  >
                    Retry AI Computation
                  </Button>
                </div>
              </div>
            )}

            {/* AI Candidates List */}
            {aiLoading ? (
              <div className="p-10 text-center bg-white rounded-lg border border-slate-200">
                <Sparkles className="w-7 h-7 text-[#C1272D] animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-700 font-semibold">Running 50/30/20 Multi-Factor Scoring Algorithm...</p>
                <p className="text-[11px] text-slate-400 mt-1">Analyzing skill overlap, Haversine spherical distances, and volunteer reliability indices.</p>
              </div>
            ) : aiCandidates.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-lg border border-slate-200">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h3 className="text-xs font-bold text-slate-700">AI Recommendation Engine Ready</h3>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                  Click <strong>"Run AI Match"</strong> above to compute real-time scores for all available volunteers against this mission.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span className="font-mono text-[11px] tabular-nums">
                    {aiCandidates.length} Candidates Ranked by Composite Score
                  </span>
                  <span className="text-[10px] text-slate-400">Human confirmation required</span>
                </div>

                {aiCandidates.map((cand, idx) => {
                  const isAssigned = assignedVolunteers.some(v => v.volunteerId === cand.volunteerId)

                  return (
                    <div
                      key={cand.volunteerId}
                      className={`p-4 bg-white border rounded-lg space-y-3 transition-all ${
                        isAssigned
                          ? 'border-emerald-300 bg-emerald-50/20 opacity-80'
                          : idx === 0
                          ? 'border-slate-400 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Candidate Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                              idx === 0
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-900">{cand.name}</h3>
                              <Badge
                                variant={
                                  cand.availability === 'AVAILABLE'
                                    ? 'success'
                                    : 'warning'
                                }
                              >
                                {cand.availability}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                              {cand.phone && (
                                <span className="flex items-center gap-1 font-mono tabular-nums">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  {cand.phone}
                                </span>
                              )}
                              {cand.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  {cand.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Composite Score & Single Command CTA */}
                        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">Match Score</span>
                            <span
                              className={`text-base font-bold font-mono tabular-nums ${
                                cand.compositeScore >= 80
                                  ? 'text-emerald-700'
                                  : cand.compositeScore >= 60
                                  ? 'text-[#F26522]'
                                  : 'text-amber-700'
                              }`}
                            >
                              {cand.compositeScore.toFixed(1)}%
                            </span>
                          </div>

                          {isAssigned ? (
                            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Assigned
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="primary"
                              disabled={assigningId === cand.volunteerId || cand.availability !== 'AVAILABLE'}
                              onClick={() => handleAssignVolunteer(cand.volunteerId)}
                              className="text-xs gap-1.5"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>{assigningId === cand.volunteerId ? 'Deploying...' : 'Dispatch'}</span>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* 3 Precision Telemetry Progress Meters */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-2.5 rounded border border-slate-100 text-xs">
                        {/* Meter 1: Skill Match (50%) */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500 font-medium">Skill Alignment (50%)</span>
                            <span className="font-mono font-bold text-slate-800 tabular-nums">
                              {cand.skillScore.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-xs h-1.5 overflow-hidden">
                            <div
                              className="bg-amber-500 h-full transition-all"
                              style={{ width: `${Math.min(100, cand.skillScore)}%` }}
                            />
                          </div>
                        </div>

                        {/* Meter 2: Haversine Proximity (30%) */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500 font-medium">Proximity (30%)</span>
                            <span className="font-mono font-bold text-slate-800 tabular-nums">
                              {cand.distanceKm ? `${cand.distanceKm.toFixed(1)} km` : `${cand.proximityScore.toFixed(0)}%`}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-xs h-1.5 overflow-hidden">
                            <div
                              className="bg-sky-500 h-full transition-all"
                              style={{ width: `${Math.min(100, cand.proximityScore)}%` }}
                            />
                          </div>
                        </div>

                        {/* Meter 3: Historical Reliability (20%) */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500 font-medium">Reliability (20%)</span>
                            <span className="font-mono font-bold text-slate-800 tabular-nums">
                              {cand.reliabilityScore.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-xs h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full transition-all"
                              style={{ width: `${Math.min(100, cand.reliabilityScore)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Matched & Missing Skills */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        {cand.matchedSkills && cand.matchedSkills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-[10px] font-mono font-semibold text-emerald-800 uppercase">Matched:</span>
                            {cand.matchedSkills.map((s, i) => (
                              <span
                                key={i}
                                className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium px-1.5 py-0.5 rounded-xs"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                        {cand.missingSkills && cand.missingSkills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 ml-2">
                            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">Missing:</span>
                            {cand.missingSkills.map((s, i) => (
                              <span
                                key={i}
                                className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-medium px-1.5 py-0.5 rounded-xs"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Natural Language AI Justification */}
                      {cand.recommendationReason && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                          <strong className="text-slate-700 font-mono text-[10px] uppercase">Telemetry Rationale: </strong>
                          {cand.recommendationReason}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
