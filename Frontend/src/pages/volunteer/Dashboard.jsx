import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  RefreshCw,
  Compass,
  Zap,
  ArrowRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  LogOut,
  Navigation
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import StatCard from '../../components/StatCard'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function VolunteerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [statusFeedback, setStatusFeedback] = useState(null)

  const fetchDashboard = () => {
    setLoading(true)
    setError(null)
    apiClient.get('/volunteer/dashboard')
      .then((res) => {
        if (res.data?.data) {
          setData(res.data.data)
        } else {
          setError('No data returned from Volunteer Dashboard API.')
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

    apiClient.get('/volunteer/dashboard')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setData(res.data.data)
          } else {
            setError('No data returned from Volunteer Dashboard API.')
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

  const handleToggleAvailability = async () => {
    if (!data) return
    const nextAvailability = data.availability === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE'
    setActionLoading(true)
    setStatusFeedback(null)
    try {
      await apiClient.put('/volunteer/profile', {
        availability: nextAvailability
      })
      setData(prev => ({ ...prev, availability: nextAvailability }))
      setStatusFeedback(`Availability updated to ${nextAvailability}`)
      setTimeout(() => setStatusFeedback(null), 3000)
    } catch (err) {
      setStatusFeedback(err.response?.data?.message || 'Failed to update availability.')
      setTimeout(() => setStatusFeedback(null), 4000)
    } finally {
      setActionLoading(false)
    }
  }

  const handleQuickCheckIn = async (taskId) => {
    setActionLoading(true)
    try {
      await apiClient.post(`/volunteer/tasks/${taskId}/check-in`)
      fetchDashboard()
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleQuickCheckOut = async (taskId) => {
    setActionLoading(true)
    try {
      await apiClient.post(`/volunteer/tasks/${taskId}/check-out`)
      fetchDashboard()
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed')
    } finally {
      setActionLoading(false)
    }
  }

  const getTierDisplay = (tier) => {
    switch (tier) {
      case 'PLATINUM_HERO':
        return {
          title: 'Platinum Hero',
          color: 'from-amber-400 to-yellow-600',
          textColor: 'text-amber-500',
          bgLight: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
        }
      case 'GOLD_RESPONDER':
        return {
          title: 'Gold Responder',
          color: 'from-yellow-400 to-amber-500',
          textColor: 'text-amber-600',
          bgLight: 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40'
        }
      case 'SILVER_VOLUNTEER':
        return {
          title: 'Silver Volunteer',
          color: 'from-slate-300 to-slate-500',
          textColor: 'text-slate-600 dark:text-slate-300',
          bgLight: 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
        }
      default:
        return {
          title: 'Bronze Recruit',
          color: 'from-orange-400 to-amber-700',
          textColor: 'text-orange-600',
          bgLight: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/40'
        }
    }
  }

  if (loading) {
    return (
      <AppLayout role="VOLUNTEER">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Connecting to Volunteer Mission Hub...</p>
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
            <Button variant="outline" size="sm" onClick={fetchDashboard}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Retry Connection
            </Button>
          </div>
          <EmptyState
            title="Unable to load volunteer hub"
            description="The volunteer mission coordination service could not be reached. Ensure MySQL and the backend service are running."
            actionLabel="Retry"
            onAction={fetchDashboard}
          />
        </div>
      </AppLayout>
    )
  }

  const tierInfo = getTierDisplay(data.tierBadge)

  const getActiveUrgencyBorder = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'severity-left-critical'
      case 'HIGH':
        return 'severity-left-high'
      default:
        return 'severity-left-medium'
    }
  }

  return (
    <AppLayout role="VOLUNTEER">
      <div className="space-y-6 pb-12">
        {/* Top Header & Emergency Readiness Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-heading text-slate-900">{data.name}</h1>
                <Badge variant={data.availability === 'AVAILABLE' ? 'success' : data.availability === 'BUSY' ? 'warning' : 'neutral'}>
                  {data.availability}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {data.ngoName || 'General Volunteer Pool'} • {data.districtName || 'Disaster Relief Sector'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {statusFeedback && (
              <span className="text-xs font-mono font-medium text-primary">{statusFeedback}</span>
            )}
            <button
              onClick={handleToggleAvailability}
              disabled={actionLoading || data.availability === 'BUSY'}
              title={data.availability === 'BUSY' ? 'Cannot go offline while deployed on a mission' : 'Toggle Readiness'}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-control text-xs font-semibold transition border ${
                data.availability === 'AVAILABLE'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              {data.availability === 'AVAILABLE' ? (
                <ToggleRight className="w-5 h-5 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-slate-400" />
              )}
              <span>{data.availability === 'AVAILABLE' ? 'Ready for Dispatch' : 'Marked Offline'}</span>
            </button>
            <Link to="/volunteer/tasks">
              <Button variant="primary" size="sm" className="font-medium">
                <Compass className="w-4 h-4 mr-1.5" />
                Find Missions
              </Button>
            </Link>
          </div>
        </div>

        {/* Gamified Tier Progress Bar */}
        <div className={`p-4 rounded-lg border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase tracking-wider font-mono text-slate-500">Current Merit Tier:</span>
                <span className="text-sm font-bold font-heading text-slate-900">{tierInfo.title}</span>
              </div>
              <p className="text-xs text-slate-600 font-mono tabular-nums">
                Progress towards next recognition milestone: {data.nextTierProgress || 0}%
              </p>
            </div>
          </div>
          <div className="w-full md:w-64">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-[#F26522] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, data.nextTierProgress || 0))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Service Hours"
            value={`${data.totalHoursLogged || 0} hrs`}
            description="Validated deployment time"
            icon={<Clock className="w-5 h-5 text-primary" />}
          />
          <StatCard
            label="Missions Completed"
            value={data.completedTasks || 0}
            description="Emergency responses resolved"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            label="Reliability Score"
            value={`${data.reliabilityScore || 85}%`}
            description="Response & check-in index"
            icon={<Zap className="w-5 h-5 text-amber-600" />}
          />
          <StatCard
            label="Honors & Badges"
            value={data.badgesCount || 0}
            description="Verified certificates awarded"
            icon={<Award className="w-5 h-5 text-slate-700" />}
          />
        </div>

        {/* Active Deployment / On-Duty Mission Card */}
        <div>
          <h2 className="text-base font-bold font-heading text-slate-900 mb-3 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            Active Field Deployment
          </h2>
          {data.activeAssignment ? (
            <div className={`p-5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-4 ${getActiveUrgencyBorder(data.activeAssignment.urgency)}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={data.activeAssignment.urgency === 'CRITICAL' ? 'danger' : 'warning'}>
                      {data.activeAssignment.urgency}
                    </Badge>
                    <Badge variant={data.activeAssignment.status === 'IN_PROGRESS' ? 'warning' : 'info'}>
                      {data.activeAssignment.status === 'IN_PROGRESS' ? 'ON SITE - IN PROGRESS' : 'ASSIGNED - PENDING ARRIVAL'}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold font-heading text-slate-900">{data.activeAssignment.taskTitle}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {data.activeAssignment.location || 'Emergency coordinate on map'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/volunteer/tasks/${data.activeAssignment.taskId}`}>
                    <Button variant="outline" size="sm">
                      View Full Dossier
                    </Button>
                  </Link>
                  {data.activeAssignment.status === 'ASSIGNED' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleQuickCheckIn(data.activeAssignment.taskId)}
                      disabled={actionLoading}
                      className="font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Check In On Site
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleQuickCheckOut(data.activeAssignment.taskId)}
                      disabled={actionLoading}
                      className="font-medium"
                    >
                      <LogOut className="w-4 h-4 mr-1.5" />
                      Check Out & Log Hours
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <span className="font-semibold block text-slate-900">Assigned At</span>
                  <span className="font-mono tabular-nums">{data.activeAssignment.assignedAt ? new Date(data.activeAssignment.assignedAt).toLocaleString() : 'Recently'}</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-900">Check-in Timestamp</span>
                  <span className="font-mono tabular-nums">{data.activeAssignment.checkInTime ? new Date(data.activeAssignment.checkInTime).toLocaleTimeString() : 'Awaiting arrival'}</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-900">Field Telemetry</span>
                  <span className="text-primary font-mono font-medium">GPS Coordination Active</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-heading text-slate-900">Currently In Standby Mode</h4>
                    <p className="text-xs text-slate-600">
                      No active on-duty deployment. Explore new missions needing your skills in {data.districtName || 'your district'}.
                    </p>
                  </div>
                </div>
                <Link to="/volunteer/tasks">
                  <Button variant="primary" size="sm" className="font-medium">
                    Browse Missions
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/volunteer/tasks" className="block group">
            <div className="p-5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 shadow-xs transition h-full">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                  <Compass className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold font-heading text-slate-900 group-hover:text-primary transition">Task Discovery</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse open emergency relief tasks, review skill prerequisites, and self-assign to missions.
              </p>
            </div>
          </Link>

          <Link to="/volunteer/profile" className="block group">
            <div className="p-5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 shadow-xs transition h-full">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-bold font-heading text-slate-900 group-hover:text-primary transition">Skills & Readiness</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Update specialized certifications, emergency contact details, and location coordinates.
              </p>
            </div>
          </Link>

          <Link to="/volunteer/certificates" className="block group">
            <div className="p-5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 shadow-xs transition h-full">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                  <Award className="w-5 h-5 text-slate-700" />
                </div>
                <h3 className="font-bold font-heading text-slate-900 group-hover:text-primary transition">Verified Honors</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                View cryptographic verification certificate codes and download official service credentials.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
