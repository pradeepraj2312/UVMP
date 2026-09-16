import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Search,
  RefreshCw,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Building2,
  Truck,
  Award,
  ShieldCheck,
  Eye,
  X,
  CheckCircle2,
  Clock,
  ExternalLink,
  Activity
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import StatCard from '../../components/StatCard'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'
import apiClient from '../../api/client'

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [affiliationFilter, setAffiliationFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)

  const fetchVolunteers = () => {
    setLoading(true)
    setError(null)
    apiClient.get('/admin/volunteers')
      .then((res) => {
        if (res.data?.data) {
          setVolunteers(res.data.data)
        } else {
          setError('No volunteer records returned from central registry.')
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

    apiClient.get('/admin/volunteers')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setVolunteers(res.data.data)
          } else {
            setError('No volunteer records returned from central registry.')
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

  // Filtered volunteers
  const filteredVolunteers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return volunteers.filter((v) => {
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
  }, [volunteers, searchQuery, affiliationFilter, statusFilter])

  // Aggregate Stats
  const totalCount = volunteers.length
  const availableCount = volunteers.filter((v) => v.availability === 'AVAILABLE').length
  const busyCount = volunteers.filter((v) => v.availability === 'BUSY').length
  const pendingCount = volunteers.filter((v) => v.status === 'PENDING').length

  return (
    <AppLayout role="ADMIN">
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-heading text-slate-900">Volunteer Force Registry</h1>
                <Badge variant="success">MULTI-JURISDICTION</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Centralized registry and operational oversight of registered crisis response volunteers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchVolunteers} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Roster
            </Button>
            <Link to="/admin/approvals">
              <Button variant="primary" size="sm">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Approvals Hub
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Volunteers"
            value={totalCount}
            description="Registered personnel"
            icon={<Users className="w-5 h-5 text-slate-700" />}
          />
          <StatCard
            label="Ready for Dispatch"
            value={availableCount}
            description="Available for immediate tasking"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            label="Active Deployments"
            value={busyCount}
            description="Currently engaged on field tasks"
            icon={<Activity className="w-5 h-5 text-amber-600" />}
          />
          <StatCard
            label="Pending Review"
            value={pendingCount}
            description="Applications awaiting clearance"
            icon={<Clock className="w-5 h-5 text-blue-600" />}
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchVolunteers}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Retry
            </Button>
          </div>
        )}

        {/* Main Table Container */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, phone, skills..."
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

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <select
                value={affiliationFilter}
                onChange={(e) => setAffiliationFilter(e.target.value)}
                aria-label="Filter volunteers by affiliation"
                className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Affiliations</option>
                <option value="DISTRICT">District Authorities</option>
                <option value="NGO">Partner NGOs</option>
                <option value="GENERAL_POOL">General Volunteer Pool</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter volunteers by readiness"
                className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Ready (Available)</option>
                <option value="BUSY">Active (Busy)</option>
                <option value="OFFLINE">Offline</option>
                <option value="PENDING">Pending Review</option>
                <option value="ACTIVE">Account Active</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Loading volunteer personnel records...</p>
            </div>
          ) : filteredVolunteers.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No volunteers match the specified filters.</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setAffiliationFilter('ALL')
                  setStatusFilter('ALL')
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Building2 className="w-3 h-3" />
                            {v.ngoName}
                          </span>
                        ) : v.affiliationType === 'DISTRICT' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <MapPin className="w-3 h-3" />
                            {v.districtName}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
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
            </div>
          )}

          {/* Footer Count */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>
              Showing {filteredVolunteers.length} of {volunteers.length} registered volunteers
            </span>
            <span>
              UVMP Operational Deployment Registry
            </span>
          </div>
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
            {/* Header info */}
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

            {/* Profile Grid */}
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

            {/* Skills */}
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
