import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList,
  Search,
  RefreshCw,
  AlertCircle,
  MapPin,
  Clock,
  Sparkles,
  Users,
  ChevronRight,
  Filter,
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function NgoTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [urgencyFilter, setUrgencyFilter] = useState('ALL')

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/ngo/tasks')
      if (res.data?.data) {
        setTasks(res.data.data)
      } else {
        setError('No mission tasks returned from server.')
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

  useEffect(() => {
    let ignore = false

    apiClient.get('/ngo/tasks')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setTasks(res.data.data)
          } else {
            setError('No mission tasks returned from server.')
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

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return <Badge variant="danger">CRITICAL</Badge>
      case 'HIGH':
        return <Badge variant="warning">HIGH</Badge>
      case 'MEDIUM':
        return <Badge variant="info">MEDIUM</Badge>
      default:
        return <Badge variant="neutral">LOW</Badge>
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <Badge variant="warning">IN PROGRESS</Badge>
      case 'ASSIGNED':
        return <Badge variant="info">ASSIGNED</Badge>
      case 'OPEN':
        return <Badge variant="neutral">OPEN</Badge>
      case 'COMPLETED':
        return <Badge variant="success">COMPLETED</Badge>
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (task.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (task.location?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (task.requiredSkills?.toLowerCase() || '').includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
    const matchesUrgency = urgencyFilter === 'ALL' || task.urgency === urgencyFilter

    return matchesSearch && matchesStatus && matchesUrgency
  })

  // Summary counts
  const totalTasks = tasks.length
  const activeTasks = tasks.filter(t => t.status === 'OPEN' || t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length
  const criticalTasks = tasks.filter(t => t.urgency === 'CRITICAL' && t.status !== 'COMPLETED').length

  return (
    <AppLayout role="NGO">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-900 text-white">
                <ClipboardList className="w-5 h-5 text-red-500" />
              </span>
              <h1 className="text-2xl font-bold font-heading text-slate-900">
                Task & Mission Dispatch
              </h1>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Field operation tasks assigned by District Authorities. Launch AI volunteer matching to dispatch personnel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTasks}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Live Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Total Assigned</p>
            <p className="text-2xl font-bold font-heading tabular-nums text-slate-900 mt-1">{totalTasks}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Active Missions</p>
            <p className="text-2xl font-bold font-heading tabular-nums text-primary mt-1">{activeTasks}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Critical Priority</p>
            <p className="text-2xl font-bold font-heading tabular-nums text-red-600 mt-1">{criticalTasks}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Mission Success</p>
            <p className="text-2xl font-bold font-heading tabular-nums text-emerald-700 mt-1">{completedTasks}</p>
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
                onClick={fetchTasks}
              >
                Retry Connection
              </Button>
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks by title, location, or required skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-control focus:outline-hidden focus:ring-1 focus:ring-slate-400 text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-control px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open (Unassigned)</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-control px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
              >
                <option value="ALL">All Urgency</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Cards List */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading NGO tasks from live database...</p>
          </div>
        ) : error && tasks.length === 0 ? (
          <Card>
            <EmptyState
              icon={AlertCircle}
              title="Unable to load tasks"
              description={error}
              action={
                <Button size="sm" onClick={fetchTasks}>
                  Retry Connection
                </Button>
              }
            />
          </Card>
        ) : filteredTasks.length === 0 ? (
          <Card>
            <EmptyState
              icon={ClipboardList}
              title="No missions match criteria"
              description="Try adjusting your search query, status, or urgency filters."
              action={
                (search || statusFilter !== 'ALL' || urgencyFilter !== 'ALL') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSearch('')
                      setStatusFilter('ALL')
                      urgencyFilter !== 'ALL' && setUrgencyFilter('ALL')
                    }}
                  >
                    Reset Filters
                  </Button>
                )
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTasks.map((task) => {
              const assignedCount = task.volunteersAssigned || 0
              const requiredCount = task.volunteersRequired || 1
              const percentFilled = Math.min(100, Math.round((assignedCount / requiredCount) * 100))

              return (
                <div
                  key={task.id}
                  className={`bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${getUrgencyBorderClass(task.urgency)}`}
                >
                  <div className="flex-1 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-semibold tabular-nums">
                        TSK-{String(task.id).padStart(4, '0')}
                      </span>
                      {getUrgencyBadge(task.urgency)}
                      {getStatusBadge(task.status)}
                      {task.incidentId && (
                        <span className="text-[11px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded-sm border border-slate-200 tabular-nums">
                          INC-{String(task.incidentId).padStart(4, '0')}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-semibold font-heading text-slate-900 hover:text-primary transition-colors">
                        <Link to={`/ngo/tasks/${task.id}`}>
                          {task.title}
                        </Link>
                      </h3>
                      {task.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{task.location || 'Coordinates logged'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {task.createdAt
                            ? new Date(task.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Logged recently'}
                        </span>
                      </div>
                    </div>

                    {/* Skills requirements */}
                    {task.requiredSkills && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-medium text-slate-500 mr-1">Skills:</span>
                        {task.requiredSkills.split(',').map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded-sm border border-slate-200"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Personnel & Dispatch Action */}
                  <div className="flex flex-col md:items-end justify-between gap-4 md:border-l md:border-slate-200 md:pl-6 shrink-0 min-w-[220px]">
                    <div className="w-full space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          Crew Capacity
                        </span>
                        <span className="font-mono font-semibold tabular-nums text-slate-900">
                          {assignedCount} / {requiredCount}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div
                          className={`h-full transition-all duration-300 ${
                            percentFilled >= 100
                              ? 'bg-emerald-600'
                              : percentFilled > 0
                              ? 'bg-primary'
                              : 'bg-slate-300'
                          }`}
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <Link to={`/ngo/tasks/${task.id}`}>
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full gap-2 shadow-xs group font-medium"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
                          <span>AI Dispatch Desk</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
