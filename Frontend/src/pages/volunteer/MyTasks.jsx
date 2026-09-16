import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList,
  Compass,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Navigation,
  Check,
  Building2
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function MyTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('my') // 'my', 'discover', 'all'
  const [urgencyFilter, setUrgencyFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [actionTaskId, setActionTaskId] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)

  const fetchTasks = () => {
    setLoading(true)
    setError(null)
    apiClient.get('/volunteer/tasks')
      .then((res) => {
        if (res.data?.data) {
          setTasks(res.data.data)
        } else {
          setError('No missions returned from volunteer task service.')
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

    apiClient.get('/volunteer/tasks')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setTasks(res.data.data)
          } else {
            setError('No missions returned from volunteer task service.')
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

  const handleSelfAssign = async (taskId) => {
    setActionTaskId(taskId)
    setActionSuccess(null)
    try {
      await apiClient.post(`/volunteer/tasks/${taskId}/accept`)
      setActionSuccess(taskId)
      setTimeout(() => setActionSuccess(null), 3000)
      fetchTasks()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept mission')
    } finally {
      setActionTaskId(null)
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

  const getAssignmentStatusBadge = (task) => {
    if (!task.isAssignedToMe) {
      return <Badge variant="neutral">AVAILABLE</Badge>
    }
    switch (task.assignmentStatus) {
      case 'IN_PROGRESS':
        return <Badge variant="warning">ON SITE / IN PROGRESS</Badge>
      case 'COMPLETED':
        return <Badge variant="success">COMPLETED</Badge>
      default:
        return <Badge variant="info">ASSIGNED TO ME</Badge>
    }
  }

  const filteredTasks = tasks.filter((task) => {
    // Tab filtering
    if (activeTab === 'my') {
      if (!task.isAssignedToMe) return false
    } else if (activeTab === 'discover') {
      if (task.isAssignedToMe || task.status === 'COMPLETED') return false
    }

    // Urgency filtering
    if (urgencyFilter !== 'ALL' && task.urgency !== urgencyFilter) {
      return false
    }

    // Keyword filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const titleMatch = task.title?.toLowerCase().includes(q)
      const locMatch = task.location?.toLowerCase().includes(q)
      const skillsMatch = task.requiredSkills?.toLowerCase().includes(q)
      const ngoMatch = task.ngoName?.toLowerCase().includes(q)
      if (!titleMatch && !locMatch && !skillsMatch && !ngoMatch) return false
    }

    return true
  })

  if (loading) {
    return (
      <AppLayout role="VOLUNTEER">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Scanning task dispatch board...</p>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout role="VOLUNTEER">
        <div className="space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchTasks}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Retry Connection
            </Button>
          </div>
          <EmptyState
            title="Failed to fetch missions"
            description="The disaster response task directory could not be reached."
            actionLabel="Retry"
            onAction={fetchTasks}
          />
        </div>
      </AppLayout>
    )
  }

  const myMissionsCount = tasks.filter((t) => t.isAssignedToMe).length
  const discoverCount = tasks.filter((t) => !t.isAssignedToMe && t.status !== 'COMPLETED').length

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

  return (
    <AppLayout role="VOLUNTEER">
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900">Mission Operations Board</h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Discover open crisis assignments, review field briefings, and track your active shifts
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchTasks}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh Missions
          </Button>
        </div>

        {/* Tab Selection: Segmented Dark Bar */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-control w-fit border border-slate-200">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition flex items-center gap-2 ${
              activeTab === 'my'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            My Deployed Missions
            <span className={`px-1.5 py-0.2 rounded-xs font-mono text-[10px] tabular-nums ${activeTab === 'my' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {myMissionsCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition flex items-center gap-2 ${
              activeTab === 'discover'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Discover Open Tasks
            <span className={`px-1.5 py-0.2 rounded-xs font-mono text-[10px] tabular-nums ${activeTab === 'discover' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {discoverCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All District Tasks
            <span className={`px-1.5 py-0.2 rounded-xs font-mono text-[10px] tabular-nums ${activeTab === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {tasks.length}
            </span>
          </button>
        </div>

        {/* Search & Urgency Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, skill, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-control border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Urgency:
            </span>
            <div className="flex gap-1">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((u) => (
                <button
                  key={u}
                  onClick={() => setUrgencyFilter(u)}
                  className={`px-2.5 py-1 text-xs rounded-control font-medium transition ${
                    urgencyFilter === u
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Cards Grid */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            title="No matching missions found"
            description={
              activeTab === 'my'
                ? 'You do not have any active assignments under this filter. Switch to "Discover Open Tasks" to find missions.'
                : 'No tasks meet your active search and urgency criteria.'
            }
            actionLabel={activeTab === 'my' ? 'Discover Open Tasks' : 'Clear Filters'}
            onAction={() => {
              if (activeTab === 'my') {
                setActiveTab('discover')
              } else {
                setUrgencyFilter('ALL')
                setSearchQuery('')
              }
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white border border-slate-200 hover:border-slate-300 transition-all rounded-lg p-5 shadow-xs flex flex-col justify-between ${getUrgencyBorderClass(task.urgency)}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-semibold tabular-nums">
                        TSK-{String(task.id).padStart(4, '0')}
                      </span>
                      {getUrgencyBadge(task.urgency)}
                      {getAssignmentStatusBadge(task)}
                    </div>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Active'}
                    </span>
                  </div>

                  <div>
                    <Link
                      to={`/volunteer/tasks/${task.id}`}
                      className="text-base font-bold font-heading text-slate-900 hover:text-primary transition line-clamp-1"
                    >
                      {task.title}
                    </Link>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{task.location || 'Emergency Site Location'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{task.ngoName} • {task.districtName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono tabular-nums">
                        Capacity: <strong className="text-slate-900">{task.volunteersAssigned || 0}</strong> / {task.volunteersNeeded} Responders
                      </span>
                    </div>
                  </div>

                  {task.requiredSkills && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {task.requiredSkills.split(',').map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-sm bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-800"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {task.isAssignedToMe && task.hoursLogged > 0 && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-control flex items-center justify-between text-xs text-emerald-800">
                      <span>Shift Logged:</span>
                      <strong className="font-bold font-mono tabular-nums">{task.hoursLogged} Hours</strong>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                  <Link to={`/volunteer/tasks/${task.id}`}>
                    <Button variant="ghost" size="sm" className="text-xs text-slate-700 hover:text-slate-900">
                      Briefing Dossier
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>

                  {!task.isAssignedToMe ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSelfAssign(task.id)}
                      disabled={actionTaskId === task.id || task.status === 'COMPLETED'}
                      className="font-medium"
                    >
                      {actionSuccess === task.id ? (
                        <>
                          <Check className="w-4 h-4 mr-1 text-white" />
                          Accepted!
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4 mr-1.5" />
                          Accept & Deploy
                        </>
                      )}
                    </Button>
                  ) : (
                    <Link to={`/volunteer/tasks/${task.id}`}>
                      <Button
                        variant={task.assignmentStatus === 'IN_PROGRESS' ? 'secondary' : 'outline'}
                        size="sm"
                        className="font-medium"
                      >
                        {task.assignmentStatus === 'IN_PROGRESS' ? 'Check Out' : 'Open Field Terminal'}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
