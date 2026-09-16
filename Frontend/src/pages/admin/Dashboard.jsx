import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldAlert,
  Building2,
  Users,
  AlertTriangle,
  ClipboardList,
  MapPin,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  FileText,
  Activity,
  Shield,
  UserCheck,
  Search,
  Filter,
  Phone,
  Mail,
  Award,
  Truck,
  CheckCircle2,
  ExternalLink,
  Eye
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import StatCard from '../../components/StatCard'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'
import apiClient from '../../api/client'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Directory state
  const [activeTab, setActiveTab] = useState('volunteers') // 'volunteers' | 'districtAuthorities' | 'admins'
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [affiliationFilter, setAffiliationFilter] = useState('ALL')
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)

  const fetchDashboard = () => {
    setLoading(true)
    setError(null)
    apiClient.get('/admin/dashboard')
      .then((res) => {
        if (res.data?.data) {
          setData(res.data.data)
        } else {
          setError('No data returned from Admin Command Center.')
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

    apiClient.get('/admin/dashboard')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setData(res.data.data)
          } else {
            setError('No data returned from Admin Command Center.')
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

  // Filtered Volunteers
  const filteredVolunteers = useMemo(() => {
    if (!data?.volunteers) return []
    const q = searchQuery.toLowerCase().trim()
    return data.volunteers.filter((v) => {
      const matchSearch =
        !q ||
        v.name?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.phone?.toLowerCase().includes(q) ||
        v.districtName?.toLowerCase().includes(q) ||
        v.ngoName?.toLowerCase().includes(q) ||
        v.skills?.toLowerCase().includes(q)

      const matchAffiliation =
        affiliationFilter === 'ALL' ||
        v.affiliationType === affiliationFilter

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'AVAILABLE' && v.availability === 'AVAILABLE') ||
        (statusFilter === 'BUSY' && v.availability === 'BUSY') ||
        (statusFilter === 'OFFLINE' && v.availability === 'OFFLINE') ||
        (statusFilter === 'PENDING' && v.status === 'PENDING') ||
        (statusFilter === 'ACTIVE' && v.status === 'ACTIVE')

      return matchSearch && matchAffiliation && matchStatus
    })
  }, [data?.volunteers, searchQuery, affiliationFilter, statusFilter])

  // Filtered District Authorities
  const filteredDistrictAuthorities = useMemo(() => {
    if (!data?.districtAuthorities) return []
    const q = searchQuery.toLowerCase().trim()
    return data.districtAuthorities.filter((da) => {
      const matchSearch =
        !q ||
        da.name?.toLowerCase().includes(q) ||
        da.email?.toLowerCase().includes(q) ||
        da.districtName?.toLowerCase().includes(q) ||
        da.region?.toLowerCase().includes(q)

      const matchStatus =
        statusFilter === 'ALL' ||
        da.status === statusFilter ||
        da.districtStatus === statusFilter

      return matchSearch && matchStatus
    })
  }, [data?.districtAuthorities, searchQuery, statusFilter])

  // Filtered Admins
  const filteredAdmins = useMemo(() => {
    if (!data?.admins) return []
    const q = searchQuery.toLowerCase().trim()
    return data.admins.filter((a) => {
      const matchSearch =
        !q ||
        a.name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q)

      const matchStatus = statusFilter === 'ALL' || a.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [data?.admins, searchQuery, statusFilter])

  if (loading) {
    return (
      <AppLayout role="ADMIN">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Connecting to Emergency Operations Command Center...</p>
        </div>
      </AppLayout>
    )
  }

  if (error || !data) {
    return (
      <AppLayout role="ADMIN">
        <div className="space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error || 'Data unavailable'}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchDashboard}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Retry Connection
            </Button>
          </div>
          <EmptyState
            title="Command Center Disconnected"
            description="The administrative crisis telemetry feed could not reach MySQL."
            actionLabel="Retry"
            onAction={fetchDashboard}
          />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout role="ADMIN">
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-heading text-slate-900">Disaster Command Center</h1>
                <Badge variant="danger">SYSTEM ACTIVE</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Multi-jurisdictional crisis orchestration, district telemetry, and resource attribution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchDashboard}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh Telemetry
            </Button>
            <Link to="/admin/reports">
              <Button variant="primary" size="sm" className="font-medium">
                <FileText className="w-4 h-4 mr-1.5" />
                Disaster Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* 5 Core Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Response Districts"
            value={data.totalDistricts || 0}
            description="Operational sectors"
            icon={<MapPin className="w-5 h-5 text-primary" />}
          />
          <StatCard
            label="Partner NGOs"
            value={`${data.approvedNgos || 0} / ${data.totalNgos || 0}`}
            description="Approved relief agencies"
            icon={<Building2 className="w-5 h-5 text-slate-700" />}
          />
          <StatCard
            label="Volunteer Force"
            value={`${data.availableVolunteers || 0} Ready`}
            description={`Of ${data.totalVolunteers || 0} registered`}
            icon={<Users className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            label="Incident Triage"
            value={`${data.pendingIncidents || 0} Pending`}
            description={`Of ${data.totalIncidents || 0} total reports`}
            icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          />
          <StatCard
            label="Active Deployments"
            value={data.activeTasks || 0}
            description={`${data.completedTasks || 0} resolved`}
            icon={<ClipboardList className="w-5 h-5 text-primary" />}
          />
        </div>

        {/* District Readiness Matrix */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold font-heading text-slate-900">Sector Readiness & Inter-Agency Coordination</h3>
            <p className="text-xs text-slate-600 mt-0.5">Real-time volunteer and NGO distribution across declared disaster zones</p>
          </div>
          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">District / Sector</th>
                  <th className="py-2.5 px-4 font-semibold">Region</th>
                  <th className="py-2.5 px-4 text-center font-semibold">NGO Units</th>
                  <th className="py-2.5 px-4 text-center font-semibold">Volunteer Force</th>
                  <th className="py-2.5 px-4 text-center font-semibold">Active Missions</th>
                  <th className="py-2.5 px-4 text-center font-semibold">Incidents Linked</th>
                  <th className="py-2.5 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.districtStats?.map((d) => (
                  <tr key={d.districtId} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {d.districtName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{d.region}</td>
                    <td className="py-3 px-4 text-center font-mono font-semibold tabular-nums text-slate-800">
                      {d.ngosCount}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold tabular-nums text-emerald-700">
                      {d.volunteersCount}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-800 border border-slate-200 font-mono font-semibold tabular-nums">
                        {d.activeTasksCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600 font-mono tabular-nums">
                      {d.incidentsCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link to={`/admin/districts`}>
                        <Button variant="ghost" size="sm" className="text-xs text-slate-700 hover:text-slate-900">
                          Inspect
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* UNIFIED PERSONNEL & AUTHORITY DIRECTORY (VOLUNTEERS, DISTRICT AUTHORITIES, ADMINS) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold font-heading text-slate-900">Unified Personnel & Authority Directory</h3>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Centralized registry of Platform Administrators, District Authorities, and Field Volunteers
              </p>
            </div>

            {/* Directory Navigation Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs self-start">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('volunteers')
                  setStatusFilter('ALL')
                  setAffiliationFilter('ALL')
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                  activeTab === 'volunteers'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Volunteers</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800">
                  {data.volunteers?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('districtAuthorities')
                  setStatusFilter('ALL')
                  setAffiliationFilter('ALL')
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                  activeTab === 'districtAuthorities'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>District Authorities</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-100 text-blue-800">
                  {data.districtAuthorities?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('admins')
                  setStatusFilter('ALL')
                  setAffiliationFilter('ALL')
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                  activeTab === 'admins'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-red-600" />
                <span>Administrators</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-red-100 text-red-800">
                  {data.admins?.length || 0}
                </span>
              </button>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === 'volunteers'
                    ? 'Search volunteer, email, skills...'
                    : activeTab === 'districtAuthorities'
                    ? 'Search officer, district, region...'
                    : 'Search administrator...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {activeTab === 'volunteers' && (
                <>
                  {/* Affiliation Filter */}
                  <select
                    value={affiliationFilter}
                    onChange={(e) => setAffiliationFilter(e.target.value)}
                    aria-label="Filter volunteers by affiliation"
                    className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="ALL">All Affiliations</option>
                    <option value="DISTRICT">District Authorities</option>
                    <option value="NGO">NGO Partner Units</option>
                    <option value="GENERAL_POOL">General Volunteer Pool</option>
                  </select>

                  {/* Availability / Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter volunteers by readiness status"
                    className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="ALL">All Readiness</option>
                    <option value="AVAILABLE">Ready / Available</option>
                    <option value="BUSY">Active On Mission (Busy)</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="PENDING">Pending Review</option>
                  </select>
                </>
              )}

              {activeTab === 'districtAuthorities' && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter district authorities by confirmation status"
                  className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Confirmed / Active</option>
                  <option value="PENDING">Pending Approval</option>
                </select>
              )}

              {activeTab === 'admins' && (
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                  Global Platform Command
                </span>
              )}
            </div>
          </div>

          {/* TAB 1: FIELD VOLUNTEERS TABLE */}
          {activeTab === 'volunteers' && (
            <div className="overflow-x-auto pt-1">
              {filteredVolunteers.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <Users className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">No volunteers match the specified criteria.</p>
                  <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setAffiliationFilter('ALL') }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Volunteer Name</th>
                      <th className="py-2.5 px-4 font-semibold">Affiliation</th>
                      <th className="py-2.5 px-4 font-semibold">Skills & Qualifications</th>
                      <th className="py-2.5 px-4 text-center font-semibold">Transport</th>
                      <th className="py-2.5 px-4 text-center font-semibold">Availability</th>
                      <th className="py-2.5 px-4 text-center font-semibold">Reliability</th>
                      <th className="py-2.5 px-4 text-center font-semibold">Account Status</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredVolunteers.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 transition">
                        {/* Name & Contact */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                              {v.name?.charAt(0)?.toUpperCase() || 'V'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{v.name}</span>
                                <span className="font-mono text-[10px] px-1 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200 tabular-nums">
                                  VOL-{String(v.id).padStart(4, '0')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  {v.email}
                                </span>
                                {v.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-slate-400" />
                                    {v.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Affiliation */}
                        <td className="py-3 px-4">
                          {v.affiliationType === 'NGO' ? (
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {v.ngoName}
                              </span>
                            </div>
                          ) : v.affiliationType === 'DISTRICT' ? (
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {v.districtName}
                              </span>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              General Volunteer Pool
                            </span>
                          )}
                        </td>

                        {/* Skills */}
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {v.skills?.split(',').map((skill, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Transport */}
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700">
                            <Truck className="w-3 h-3 text-slate-400" />
                            {v.transport || 'None'}
                          </span>
                        </td>

                        {/* Availability */}
                        <td className="py-3 px-4 text-center">
                          {v.availability === 'AVAILABLE' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Ready
                            </span>
                          ) : v.availability === 'BUSY' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              On Mission
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              Offline
                            </span>
                          )}
                        </td>

                        {/* Reliability Score */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                              {v.reliabilityScore != null ? Number(v.reliabilityScore).toFixed(0) : '85'}%
                            </span>
                            <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full bg-emerald-500"
                                style={{ width: `${Math.min(100, Math.max(0, v.reliabilityScore || 85))}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={
                              v.status === 'ACTIVE'
                                ? 'success'
                                : v.status === 'PENDING'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {v.status || 'ACTIVE'}
                          </Badge>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedVolunteer(v)}
                            className="text-xs text-slate-700 hover:text-slate-900"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Inspect
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: DISTRICT AUTHORITIES TABLE */}
          {activeTab === 'districtAuthorities' && (
            <div className="overflow-x-auto pt-1">
              {filteredDistrictAuthorities.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">No district authority records match the specified query.</p>
                  <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setStatusFilter('ALL') }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Authority Officer</th>
                      <th className="py-2.5 px-4 font-semibold">Assigned Sector / District</th>
                      <th className="py-2.5 px-4 font-semibold">Regional Command</th>
                      <th className="py-2.5 px-4 text-center font-semibold">Jurisdiction Status</th>
                      <th className="py-2.5 px-4 text-center font-semibold">Account Status</th>
                      <th className="py-2.5 px-4 text-center font-semibold">Appointed Date</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredDistrictAuthorities.map((da) => (
                      <tr key={da.id} className="hover:bg-slate-50 transition">
                        {/* Officer info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                              {da.name?.charAt(0)?.toUpperCase() || 'D'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{da.name}</div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-400" />
                                {da.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* District Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            {da.districtName}
                          </div>
                        </td>

                        {/* Region */}
                        <td className="py-3 px-4 text-slate-600">
                          {da.region}
                        </td>

                        {/* Jurisdiction Status */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              da.districtStatus === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                da.districtStatus === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                            ></span>
                            {da.districtStatus || 'ACTIVE'}
                          </span>
                        </td>

                        {/* Account Status */}
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={
                              da.status === 'ACTIVE'
                                ? 'success'
                                : da.status === 'PENDING'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {da.status}
                          </Badge>
                        </td>

                        {/* Appointed Date */}
                        <td className="py-3 px-4 text-center text-[11px] text-slate-500 font-mono tabular-nums">
                          {da.createdAt ? new Date(da.createdAt).toLocaleDateString() : 'Active Officer'}
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right">
                          <Link to="/admin/districts">
                            <Button variant="ghost" size="sm" className="text-xs text-slate-700 hover:text-slate-900">
                              District Ops
                              <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 3: ADMINISTRATORS TABLE */}
          {activeTab === 'admins' && (
            <div className="overflow-x-auto pt-1">
              {filteredAdmins.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <Shield className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">No administrators found.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Administrator</th>
                      <th className="py-2.5 px-4 font-semibold">Security Role</th>
                      <th className="py-2.5 px-4 text-center font-semibold">Authority Scope</th>
                      <th className="py-2.5 px-4 text-center font-semibold">System Status</th>
                      <th className="py-2.5 px-4 text-center font-semibold">Account Established</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredAdmins.map((adm) => (
                      <tr key={adm.id} className="hover:bg-slate-50 transition">
                        {/* Admin info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-bold text-xs shrink-0">
                              {adm.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{adm.name}</span>
                                <span className="font-mono text-[10px] px-1.5 py-0.2 bg-red-50 text-red-700 rounded border border-red-200">
                                  ID-{adm.id}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-400" />
                                {adm.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Security Role */}
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white border border-slate-700 tracking-wider uppercase">
                            {adm.role}
                          </span>
                        </td>

                        {/* Authority Scope */}
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            Multi-District Command & Control
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center">
                          <Badge variant="success">
                            {adm.status || 'ACTIVE'}
                          </Badge>
                        </td>

                        {/* Created At */}
                        <td className="py-3 px-4 text-center text-[11px] text-slate-500 font-mono tabular-nums">
                          {adm.createdAt ? new Date(adm.createdAt).toLocaleDateString() : 'Initial Setup'}
                        </td>

                        {/* Verification */}
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmed Officer
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Directory footer counter */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>
              {activeTab === 'volunteers' && `Showing ${filteredVolunteers.length} of ${data.volunteers?.length || 0} registered volunteers`}
              {activeTab === 'districtAuthorities' && `Showing ${filteredDistrictAuthorities.length} of ${data.districtAuthorities?.length || 0} appointed district authorities`}
              {activeTab === 'admins' && `Showing ${filteredAdmins.length} of ${data.admins?.length || 0} platform administrators`}
            </span>
            <span className="text-[11px] text-slate-400">
              UVMP Administrative Security Protocol
            </span>
          </div>
        </div>

        {/* Priority Feeds Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Urgent Missions */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold font-heading text-slate-900">High-Priority Field Deployments</h3>
              <p className="text-xs text-slate-600 mt-0.5">Active crisis interventions requiring multi-agency coordination</p>
            </div>
            <div className="space-y-2.5 pt-1">
              {data.criticalTasks?.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No critical urgency tasks active.</p>
              ) : (
                data.criticalTasks?.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-3 hover:border-slate-300 shadow-xs transition severity-left-critical"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-100 border border-slate-200 text-slate-700 rounded-xs tabular-nums">
                          TSK-{String(task.id).padStart(4, '0')}
                        </span>
                        {getUrgencyBadge(task.urgency)}
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{task.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        {task.location || 'Emergency Site'} • NGO: {task.ngoName || 'Coordinating Unit'}
                      </p>
                    </div>
                    <Badge variant={task.status === 'IN_PROGRESS' ? 'warning' : 'info'}>
                      {task.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Incident Alerts */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold font-heading text-slate-900">Latest Incident Triage Queue</h3>
              <p className="text-xs text-slate-600 mt-0.5">Live citizen SOS reports requiring verification & task conversion</p>
            </div>
            <div className="space-y-2.5 pt-1">
              {data.recentIncidents?.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No recent incident reports.</p>
              ) : (
                data.recentIncidents?.map((inc) => (
                  <div
                    key={inc.id}
                    className={`p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-3 hover:border-slate-300 shadow-xs transition ${inc.severity === 'CRITICAL' ? 'severity-left-critical' : inc.severity === 'HIGH' ? 'severity-left-high' : 'severity-left-medium'}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-100 border border-slate-200 text-slate-700 rounded-xs tabular-nums">
                          INC-{String(inc.id).padStart(4, '0')}
                        </span>
                        <Badge variant={inc.severity === 'CRITICAL' ? 'danger' : 'warning'}>
                          {inc.severity}
                        </Badge>
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{inc.incidentType}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 flex items-center gap-1 font-mono tabular-nums">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {inc.createdAt ? new Date(inc.createdAt).toLocaleString() : 'Recent'} • By: {inc.reporterName}
                      </p>
                    </div>
                    <Badge variant={inc.status === 'CONVERTED_TO_TASK' ? 'success' : inc.status === 'VERIFIED' ? 'info' : 'warning'}>
                      {inc.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/districts" className="block group">
            <div className="p-5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 shadow-xs transition h-full">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold font-heading text-slate-900 group-hover:text-primary transition">Districts Registry</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Declare new response districts, update boundary sectors, and inspect local authority assignments.
              </p>
            </div>
          </Link>

          <Link to="/admin/ngos" className="block group">
            <div className="p-5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 shadow-xs transition h-full">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                  <Building2 className="w-5 h-5 text-slate-700" />
                </div>
                <h3 className="font-bold font-heading text-slate-900 group-hover:text-primary transition">NGO Accreditation</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verify NGO registration credentials, approve pending agencies, and manage status suspensions.
              </p>
            </div>
          </Link>

          <Link to="/admin/volunteers" className="block group">
            <div className="p-5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 shadow-xs transition h-full">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold font-heading text-slate-900 group-hover:text-primary transition">Volunteers Roster</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Oversee multi-jurisdiction volunteer force, inspect qualifications, and monitor field readiness.
              </p>
            </div>
          </Link>

          <Link to="/admin/reports" className="block group">
            <div className="p-5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 shadow-xs transition h-full">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                  <Activity className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-bold font-heading text-slate-900 group-hover:text-primary transition">Cross-Sector Analytics</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate response time diagnostics, volunteer mobilization heatmaps, and disaster resolution metrics.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Volunteer Detail Modal */}
      {selectedVolunteer && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedVolunteer(null)}
          title="Volunteer Personnel Profile"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                {selectedVolunteer.name?.charAt(0)?.toUpperCase() || 'V'}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{selectedVolunteer.name}</div>
                <div className="font-mono text-[11px] text-slate-500">
                  Volunteer ID: VOL-{String(selectedVolunteer.id).padStart(4, '0')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="text-[10px] uppercase font-mono text-slate-500">Email Address</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedVolunteer.email}</p>
              </div>
              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="text-[10px] uppercase font-mono text-slate-500">Phone Number</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedVolunteer.phone || 'Not provided'}</p>
              </div>
              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="text-[10px] uppercase font-mono text-slate-500">Affiliation</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {selectedVolunteer.affiliationType === 'NGO'
                    ? selectedVolunteer.ngoName
                    : selectedVolunteer.affiliationType === 'DISTRICT'
                    ? selectedVolunteer.districtName
                    : 'General Volunteer Pool'}
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="text-[10px] uppercase font-mono text-slate-500">Readiness Status</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedVolunteer.availability}</p>
              </div>
              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="text-[10px] uppercase font-mono text-slate-500">Transport Asset</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedVolunteer.transport || 'None'}</p>
              </div>
              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="text-[10px] uppercase font-mono text-slate-500">Reliability Score</span>
                <p className="font-semibold text-emerald-700 mt-0.5">
                  {selectedVolunteer.reliabilityScore != null ? Number(selectedVolunteer.reliabilityScore).toFixed(1) : '85.0'} / 100
                </p>
              </div>
            </div>

            <div className="p-3 bg-white rounded border border-slate-200">
              <span className="text-[10px] uppercase font-mono text-slate-500">Declared Competencies & Skills</span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {selectedVolunteer.skills?.split(',').map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedVolunteer(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  )
}
