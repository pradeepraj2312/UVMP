import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  AlertCircle,
  ClipboardList,
  Users,
  Award,
  ArrowRight,
  RefreshCw,
  MapPin,
  Clock,
  Sparkles,
  Activity,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import StatCard from '../../components/StatCard'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function NgoDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/ngo/dashboard')
      if (res.data?.data) {
        setData(res.data.data)
      } else {
        setError('No data returned from NGO dashboard API.')
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

    apiClient.get('/ngo/dashboard')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setData(res.data.data)
          } else {
            setError('No data returned from NGO dashboard API.')
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
      case 'COMPLETED':
        return <Badge variant="success">COMPLETED</Badge>
      case 'OPEN':
      default:
        return <Badge variant="neutral">OPEN</Badge>
    }
  }

  return (
    <AppLayout role="NGO">
      <div className="space-y-6">
        {/* NGO Operations Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded bg-slate-900 text-white">
                <Building2 className="w-4 h-4" />
              </span>
              <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
                {data?.ngoName || 'NGO Emergency Operations Desk'}
              </h1>
              {data?.registrationStatus && (
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded uppercase ${
                  data.registrationStatus === 'PENDING'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {data.registrationStatus}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Field task management, AI volunteer dispatch engine, and community recognition portal.
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
              Sync Desk
            </Button>
            <Link to="/ngo/tasks">
              <Button variant="primary" size="sm" icon={Sparkles}>
                AI Dispatch Hub
              </Button>
            </Link>
          </div>
        </div>

        {/* Accreditation Under Audit Banner */}
        {data?.registrationStatus === 'PENDING' && (
          <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 border border-amber-500/30 rounded-lg flex items-start justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-sm text-foreground">Accreditation Audit In Progress (Status: PENDING)</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Your platform accreditation application has been received and queued in the District Authority & Admin NGO Approvals portal. Once your operational license is verified and approved, full mission dispatch privileges will be activated.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-amber-500 text-white font-mono text-[10px] font-bold shrink-0 uppercase tracking-wider">
              Under Audit
            </span>
          </div>
        )}

        {/* Error Notification Banner */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span><strong>Backend Connection Error:</strong> {error}</span>
            </div>
            <Button size="xs" variant="outline" onClick={fetchDashboard} loading={loading}>
              Retry Connection
            </Button>
          </div>
        )}

        {!data && !loading && error ? (
          <EmptyState
            icon={AlertCircle}
            title="Unable to Load NGO Operations Dashboard"
            description={error}
            action={
              <Button variant="primary" size="sm" onClick={fetchDashboard} icon={RefreshCw}>
                Retry Connection
              </Button>
            }
          />
        ) : (
          <>
            {/* Live Operational Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Assigned District Tasks"
                value={data?.totalAssignedTasks ?? 0}
                trend={`${data?.activeTasks ?? 0} currently active`}
                icon={ClipboardList}
                tone="primary"
              />
              <StatCard
                label="Active Response Missions"
                value={data?.activeTasks ?? 0}
                trend="Ongoing field deployment"
                icon={Activity}
                tone="secondary"
              />
              <StatCard
                label="Registered Volunteers"
                value={data?.totalVolunteers ?? 0}
                trend={`${data?.availableVolunteers ?? 0} on immediate standby`}
                icon={Users}
                tone="neutral"
              />
              <StatCard
                label="Recognitions Issued"
                value={data?.recognitionsAwarded ?? 0}
                trend="Service hours certified"
                icon={Award}
                tone="success"
              />
            </div>

            {/* Main Operations Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Active Tasks & Rapid AI Dispatch Queue */}
              <div className="lg:col-span-2 space-y-6">
                <Card
                  title="Active Tasks & AI Volunteer Dispatch Queue"
                  description="District response operations requiring volunteer mobilization"
                  actions={
                    <Link
                      to="/ngo/tasks"
                      className="text-xs font-semibold text-slate-700 flex items-center gap-1 hover:text-slate-900"
                    >
                      All Tasks <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  }
                >
                  <div className="space-y-2.5">
                    {(data?.recentTasks || []).length === 0 ? (
                      <p className="py-8 text-center text-xs text-slate-500">
                        No active tasks currently assigned to this NGO.
                      </p>
                    ) : (
                      data.recentTasks.map((t) => {
                        const urg = (t.urgency || 'MEDIUM').toUpperCase()
                        const urgClass =
                          urg === 'CRITICAL'
                            ? 'severity-left-critical'
                            : urg === 'HIGH'
                            ? 'severity-left-high'
                            : 'severity-left-medium'

                        return (
                          <div
                            key={t.id}
                            className={`p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-r-md ${urgClass} flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors`}
                          >
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-semibold text-slate-500 tabular-nums">
                                  TSK-{String(t.id).padStart(4, '0')}
                                </span>
                                {getUrgencyBadge(t.urgency)}
                                {getStatusBadge(t.status)}
                              </div>
                              <h4 className="font-semibold text-xs text-slate-900 truncate">
                                {t.title}
                              </h4>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                                <span className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{t.locationAddress || 'Sector coordinates logged'}</span>
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1 font-mono tabular-nums shrink-0">
                                  <Users className="w-3 h-3 text-slate-400" />
                                  {t.volunteersAssigned || 0} / {t.volunteersNeeded} personnel
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <Link to={`/ngo/tasks/${t.id}`}>
                                <Button variant="primary" size="sm" icon={Sparkles} className="text-xs">
                                  Dispatch Match
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Col: Fast NGO Operations Navigation & Readiness Checklist */}
              <div className="space-y-6">
                <Card
                  title="Rapid Action Hub"
                  description="Direct access to operational workflows"
                >
                  <div className="space-y-2.5">
                    <Link
                      to="/ngo/tasks"
                      className="p-3 bg-red-50/50 hover:bg-red-50 border border-red-100 rounded-lg flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 bg-white text-primary rounded-md shadow-2xs">
                          <Sparkles className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-accent group-hover:text-primary transition-colors">
                            AI Volunteer Matching
                          </p>
                          <p className="text-[11px] text-gray-500">
                            50% Skill, 30% Proximity, 20% Reliability
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </Link>

                    <Link
                      to="/ngo/volunteers"
                      className="p-3 bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-lg flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 bg-white text-gray-700 rounded-md shadow-2xs">
                          <Users className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-accent group-hover:text-primary transition-colors">
                            Volunteer Directory
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Availability, skills, and emergency dispatch
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </Link>

                    <Link
                      to="/ngo/recognition"
                      className="p-3 bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-lg flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 bg-white text-amber-600 rounded-md shadow-2xs">
                          <Award className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-accent group-hover:text-primary transition-colors">
                            Awards & Certification
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Issue hours and commendation badges
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>
                </Card>

                <Card
                  title="Field Readiness Checklist"
                  description="Operational protocol verification"
                >
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-accent">GPS Positioning Active</p>
                        <p className="text-[11px] text-gray-500">
                          Responders attribute real-time coordinates for Haversine proximity routing.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-accent">Human-In-The-Loop Confirmation</p>
                        <p className="text-[11px] text-gray-500">
                          All AI recommendations require manual coordinator confirmation before dispatch.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-accent">Post-Mission Certification</p>
                        <p className="text-[11px] text-gray-500">
                          Completed shift hours automatically credit toward volunteer appreciation badges.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
