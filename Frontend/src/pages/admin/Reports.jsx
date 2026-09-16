import { useState, useEffect } from 'react'
import {
  Clock,
  Zap,
  Award,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import StatCard from '../../components/StatCard'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function Reports() {
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReports = () => {
    setLoading(true)
    setError(null)
    apiClient.get('/admin/reports')
      .then((res) => {
        if (res.data?.data) {
          setReports(res.data.data)
        } else {
          setError('No reporting analytics returned from server.')
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

    apiClient.get('/admin/reports')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setReports(res.data.data)
          } else {
            setError('No reporting analytics returned from server.')
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

  const handleExportCSV = () => {
    if (!reports?.districtBreakdown) return
    const headers = ['District ID', 'District Name', 'Region', 'Total Incidents', 'Resolved', 'Total Tasks', 'Completed', 'Volunteers', 'Efficiency %']
    const rows = reports.districtBreakdown.map(d => [
      d.districtId,
      `"${d.districtName}"`,
      `"${d.region}"`,
      d.totalIncidents,
      d.resolvedIncidents,
      d.totalTasks,
      d.completedTasks,
      d.totalVolunteers,
      `${d.responseEfficiencyScore}%`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `UVMP-Disaster-Analytics-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <AppLayout role="ADMIN">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Aggregating cross-sector disaster response analytics...</p>
        </div>
      </AppLayout>
    )
  }

  if (error || !reports) {
    return (
      <AppLayout role="ADMIN">
        <div className="space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error || 'Reports unavailable'}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchReports}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Retry Connection
            </Button>
          </div>
          <EmptyState
            title="Analytics Engine Offline"
            description="Could not compile disaster response statistics from the backend."
            actionLabel="Retry"
            onAction={fetchReports}
          />
        </div>
      </AppLayout>
    )
  }

  // Calculate percentages for distributions
  const sevEntries = Object.entries(reports.incidentSeverityBreakdown || {})
  const totalSev = sevEntries.reduce((acc, [, val]) => acc + val, 0) || 1

  const statusEntries = Object.entries(reports.taskStatusBreakdown || {})
  const totalTasks = statusEntries.reduce((acc, [, val]) => acc + val, 0) || 1

  const availEntries = Object.entries(reports.volunteerAvailabilityBreakdown || {})
  const totalVolunteers = availEntries.reduce((acc, [, val]) => acc + val, 0) || 1

  return (
    <AppLayout role="ADMIN">
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">National Crisis Analytics Engine</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-foreground tracking-tight mt-0.5">Disaster Analytics & Operations Reports</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comprehensive telemetry on response efficiency, workforce mobilization, and crisis resolution metrics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchReports}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Recalculate
            </Button>
            <Button variant="primary" size="sm" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-1.5" />
              Export CSV Report
            </Button>
          </div>
        </div>

        {/* 3 Top Executive Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            label="Total Shift Hours"
            value={`${reports.totalHoursLogged || 0} hrs`}
            description="Validated volunteer time on mission"
            icon={<Clock className="w-5 h-5 text-red-600" />}
          />
          <StatCard
            label="Platform Reliability"
            value={`${reports.averageReliabilityScore || 85}%`}
            description="Average responder attendance index"
            icon={<Zap className="w-5 h-5 text-orange-500" />}
          />
          <StatCard
            label="Honors Awarded"
            value={reports.totalRecognitionsIssued || 0}
            description="Verifiable certificates generated"
            icon={<Award className="w-5 h-5 text-indigo-500" />}
          />
        </div>

        {/* 3 Distribution Visualizers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Incident Severity Breakdown */}
          <Card
            title="Incident Severity Distribution"
            description="Reported citizen crises categorized by urgency level"
          >
            <div className="space-y-3 pt-2">
              {sevEntries.map(([sev, count]) => {
                const pct = Math.round((count / totalSev) * 100)
                const color =
                  sev === 'CRITICAL'
                    ? 'bg-[#C1272D]'
                    : sev === 'HIGH'
                    ? 'bg-[#F26522]'
                    : sev === 'MEDIUM'
                    ? 'bg-blue-600'
                    : 'bg-slate-400'
                return (
                  <div key={sev} className="space-y-1.5 bg-muted/30 p-2.5 rounded-lg border border-border/60">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-semibold text-foreground tracking-wide">{sev}</span>
                      <span className="font-mono tabular-nums text-xs text-muted-foreground">
                        <strong className="text-foreground">{count}</strong> ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Task Lifecycle Funnel */}
          <Card
            title="Mission Execution Lifecycle"
            description="Operational progression from creation to completion"
          >
            <div className="space-y-3 pt-2">
              {statusEntries.map(([status, count]) => {
                const pct = Math.round((count / totalTasks) * 100)
                const color =
                  status === 'COMPLETED'
                    ? 'bg-emerald-600'
                    : status === 'IN_PROGRESS'
                    ? 'bg-[#F26522]'
                    : 'bg-indigo-600'
                return (
                  <div key={status} className="space-y-1.5 bg-muted/30 p-2.5 rounded-lg border border-border/60">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-semibold text-foreground tracking-wide">{status}</span>
                      <span className="font-mono tabular-nums text-xs text-muted-foreground">
                        <strong className="text-foreground">{count}</strong> ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Volunteer Workforce Readiness */}
          <Card
            title="Volunteer Workforce Readiness"
            description="Active responder dispatch availability status"
          >
            <div className="space-y-3 pt-2">
              {availEntries.map(([avail, count]) => {
                const pct = Math.round((count / totalVolunteers) * 100)
                const color =
                  avail === 'AVAILABLE'
                    ? 'bg-emerald-600'
                    : avail === 'BUSY'
                    ? 'bg-[#F26522]'
                    : 'bg-slate-500'
                return (
                  <div key={avail} className="space-y-1.5 bg-muted/30 p-2.5 rounded-lg border border-border/60">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-semibold text-foreground tracking-wide">{avail}</span>
                      <span className="font-mono tabular-nums text-xs text-muted-foreground">
                        <strong className="text-foreground">{count}</strong> ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* District Breakdown Detailed Table */}
        <Card
          title="Sector Performance & Efficiency Diagnostics"
          description="Detailed cross-district response metrics, mission completion ratios, and volunteer capacity"
        >
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">District / Sector</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4 text-center">Incidents Linked</th>
                  <th className="py-3 px-4 text-center">Total Tasks</th>
                  <th className="py-3 px-4 text-center">Tasks Completed</th>
                  <th className="py-3 px-4 text-center">Volunteer Density</th>
                  <th className="py-3 px-4 text-center">Resolution Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.districtBreakdown?.map((row) => (
                  <tr key={row.districtId} className="hover:bg-muted/20 transition">
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          SEC-{String(row.districtId).padStart(3, '0')}
                        </span>
                        <span>{row.districtName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{row.region}</td>
                    <td className="py-3.5 px-4 text-center text-muted-foreground font-mono tabular-nums font-medium">
                      {row.totalIncidents}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums font-medium text-foreground">
                      {row.totalTasks}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                      {row.completedTasks}
                    </td>
                    <td className="py-3.5 px-4 text-center text-muted-foreground font-mono tabular-nums">
                      {row.totalVolunteers} Responders
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono tabular-nums font-bold">
                        {row.responseEfficiencyScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
