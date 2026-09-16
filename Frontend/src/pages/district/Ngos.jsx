import { useState, useEffect, useMemo } from 'react'
import {
  Building2,
  AlertCircle,
  Search,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function DistrictNgos() {
  const [ngos, setNgos] = useState([])
  const [districts, setDistricts] = useState([])
  const [districtFilter, setDistrictFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [actionLoading, setActionLoading] = useState(null)

  const fetchNgos = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/district/ngos')
      if (res.data?.data) {
        setNgos(res.data.data)
      } else {
        setNgos([])
        setError('No NGO partners returned from backend.')
      }
    } catch (err) {
      setNgos([])
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load registered NGOs. Please verify backend service is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    apiClient.get('/district/list')
      .then((res) => {
        if (!ignore && res.data?.data) {
          setDistricts(res.data.data)
        }
      })
      .catch(() => {})

    apiClient.get('/district/ngos')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setNgos(res.data.data)
          } else {
            setNgos([])
            setError('No NGO partners returned from backend.')
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          setNgos([])
          setError(
            err.response?.data?.message ||
            err.message ||
            'Failed to load registered NGOs. Please verify backend service is running.'
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

  const handleUpdateStatus = async (ngoId, newStatus) => {
    setActionLoading(ngoId)
    setActionError(null)
    try {
      await apiClient.patch(`/district/ngos/${ngoId}/status`, null, { params: { status: newStatus } })
      setNgos((prev) =>
        prev.map((n) => (n.id === ngoId ? { ...n, registrationStatus: newStatus } : n))
      )
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
        err.message ||
        `Failed to update status for NGO #${ngoId}. Please check backend connection.`
      )
    } finally {
      setActionLoading(null)
    }
  }

  const filteredNgos = useMemo(() => {
    return ngos.filter((n) => {
      const matchesStatus = statusFilter === 'ALL' || n.registrationStatus === statusFilter
      const matchesDistrict =
        districtFilter === 'ALL' ||
        String(n.districtId) === String(districtFilter)
      const query = search.toLowerCase()
      const matchesSearch =
        !search ||
        (n.name && n.name.toLowerCase().includes(query)) ||
        (n.email && n.email.toLowerCase().includes(query)) ||
        (n.contactInfo && n.contactInfo.toLowerCase().includes(query))

      return matchesStatus && matchesDistrict && matchesSearch
    })
  }, [ngos, statusFilter, districtFilter, search])

  const pendingCount = ngos.filter((n) => n.registrationStatus === 'PENDING').length

  return (
    <AppLayout role="DISTRICT_AUTHORITY">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Registered District NGOs</h1>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#F26522] text-white rounded tabular-nums">
                  {pendingCount} Pending Approvals
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify NGO credentials, monitor active relief organizations, and approve operating permits in your district.
            </p>
          </div>

          <Button variant="outline" size="sm" icon={RefreshCw} loading={loading} onClick={fetchNgos}>
            Refresh Roster
          </Button>
        </div>

        {/* Error Notification Banners */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span><strong>Backend Service Error:</strong> {error}</span>
            </div>
            <Button size="xs" variant="outline" onClick={fetchNgos} loading={loading}>
              Retry Connection
            </Button>
          </div>
        )}

        {actionError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between gap-3 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span><strong>NGO Update Notice:</strong> {actionError}</span>
            </div>
            <Button size="xs" variant="ghost" onClick={() => setActionError(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    statusFilter === st ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'All Partners' : st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="py-1 px-2.5 border border-slate-200 rounded text-xs bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="ALL">All Response Districts</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by NGO name, contact..."
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-500"
            />
          </div>
        </div>

        {/* NGO List Card */}
        <Card title={`Partner NGO Organizations (${filteredNgos.length})`} description="Affiliated relief agencies deployed in this district">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
              <div className="w-7 h-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>Loading registered NGOs...</span>
            </div>
          ) : error && ngos.length === 0 ? (
            <EmptyState
              icon={AlertCircle}
              title="Unable to Load Partner NGOs"
              description={error}
              action={
                <Button variant="primary" size="sm" onClick={fetchNgos} icon={RefreshCw}>
                  Retry Connection
                </Button>
              }
            />
          ) : filteredNgos.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No NGOs found"
              description="No non-governmental organizations match your search or filter."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Organization Name</th>
                    <th className="py-3 px-4">Operating Contact</th>
                    <th className="py-3 px-4">Operating Location</th>
                    <th className="py-3 px-4">Permit Status</th>
                    <th className="py-3 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredNgos.map((ngo) => (
                    <tr key={ngo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="text-slate-900 font-semibold block text-sm">{ngo.name}</strong>
                            <span className="text-[10px] font-mono text-slate-400 tabular-nums">NGO Partner ID: #{ngo.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-accent font-medium">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{ngo.email || 'contact@ngo.local'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{ngo.phone || '+91 98450 00000'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{ngo.contactInfo || 'District Sector'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5 ml-4">
                          {districts.find((d) => d.id === ngo.districtId)?.name || ('Sector ' + ngo.districtId)}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge status={ngo.registrationStatus} />
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                        {ngo.registrationStatus === 'PENDING' ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={CheckCircle2}
                              loading={actionLoading === ngo.id}
                              onClick={() => handleUpdateStatus(ngo.id, 'APPROVED')}
                              className="text-emerald-700 hover:bg-emerald-50 border-emerald-300"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={XCircle}
                              loading={actionLoading === ngo.id}
                              onClick={() => handleUpdateStatus(ngo.id, 'REJECTED')}
                              className="text-danger hover:bg-red-50 border-red-300"
                            >
                              Reject
                            </Button>
                          </>
                        ) : ngo.registrationStatus === 'APPROVED' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={XCircle}
                            loading={actionLoading === ngo.id}
                            onClick={() => handleUpdateStatus(ngo.id, 'REJECTED')}
                            className="text-gray-500 hover:text-danger hover:bg-red-50"
                          >
                            Revoke Permit
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={CheckCircle2}
                            loading={actionLoading === ngo.id}
                            onClick={() => handleUpdateStatus(ngo.id, 'APPROVED')}
                            className="text-emerald-700 hover:bg-emerald-50 border-emerald-300"
                          >
                            Re-approve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
