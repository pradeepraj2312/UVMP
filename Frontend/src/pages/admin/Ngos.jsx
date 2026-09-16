import { useState, useEffect } from 'react'
import {
  Building2,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Phone,
  Mail,
  FileCheck,
  ShieldCheck,
  Ban
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function Ngos() {
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [actionNgoId, setActionNgoId] = useState(null)

  const fetchNgos = () => {
    setLoading(true)
    setError(null)
    apiClient.get('/admin/ngos')
      .then((res) => {
        if (res.data?.data) {
          setNgos(res.data.data)
        } else {
          setError('No NGO accreditation records returned.')
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

    apiClient.get('/admin/ngos')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setNgos(res.data.data)
          } else {
            setError('No NGO accreditation records returned.')
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

  const handleUpdateStatus = async (ngoId, newStatus) => {
    setActionNgoId(ngoId)
    try {
      await apiClient.patch(`/admin/ngos/${ngoId}/status?status=${newStatus}`)
      setNgos(prev =>
        prev.map(n => n.id === ngoId ? { ...n, registrationStatus: newStatus } : n)
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update NGO status.')
    } finally {
      setActionNgoId(null)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">APPROVED</Badge>
      case 'PENDING':
        return <Badge variant="warning">PENDING AUDIT</Badge>
      case 'SUSPENDED':
        return <Badge variant="danger">SUSPENDED</Badge>
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  const filteredNgos = ngos.filter((n) => {
    if (statusFilter !== 'ALL' && n.registrationStatus !== statusFilter) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const nameMatch = n.name?.toLowerCase().includes(q)
      const regMatch = n.registrationNumber?.toLowerCase().includes(q)
      const emailMatch = n.email?.toLowerCase().includes(q)
      const contactMatch = n.contactPerson?.toLowerCase().includes(q)
      if (!nameMatch && !regMatch && !emailMatch && !contactMatch) return false
    }
    return true
  })

  if (loading) {
    return (
      <AppLayout role="ADMIN">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Auditing partner NGO accreditation records...</p>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout role="ADMIN">
        <div className="space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchNgos}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Retry Connection
            </Button>
          </div>
          <EmptyState
            title="NGO Registry Unavailable"
            description="Could not connect to partner agency records in MySQL."
            actionLabel="Retry"
            onAction={fetchNgos}
          />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout role="ADMIN">
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Certified Agency Registry</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-foreground tracking-tight mt-0.5">NGO Accreditation & Oversight</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review certified disaster response agencies, audit credentials, and grant operational deployment licenses
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={fetchNgos}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh Registry
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-3.5 rounded-xl border border-border shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by NGO name, reg number, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Audit Status:
            </span>
            <div className="flex gap-1 bg-muted/60 p-1 rounded-lg">
              {['ALL', 'APPROVED', 'PENDING', 'SUSPENDED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* NGO Cards List */}
        {filteredNgos.length === 0 ? (
          <EmptyState
            title="No matching NGOs found"
            description="No relief agencies match the current filter or search criteria."
            actionLabel="Reset Filters"
            onAction={() => {
              setStatusFilter('ALL')
              setSearchQuery('')
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredNgos.map((ngo) => {
              const borderLeftClass =
                ngo.registrationStatus === 'APPROVED'
                  ? 'border-l-4 border-l-emerald-600'
                  : ngo.registrationStatus === 'PENDING'
                  ? 'border-l-4 border-l-orange-500'
                  : 'border-l-4 border-l-red-600'

              return (
                <div
                  key={ngo.id}
                  className={`p-5 bg-card rounded-xl border border-border ${borderLeftClass} hover:border-slate-400 dark:hover:border-slate-600 transition shadow-xs flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-foreground">{ngo.name}</h3>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            Reg #{ngo.registrationNumber || 'UVMP-NGO-' + ngo.id}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(ngo.registrationStatus)}
                    </div>

                    <div className="pt-2 border-t border-border/80 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between bg-muted/40 px-2.5 py-1.5 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          Official Registry Email:
                        </span>
                        <strong className="font-mono text-foreground text-[11px]">{ngo.email}</strong>
                      </div>
                      <div className="flex items-center justify-between bg-muted/40 px-2.5 py-1.5 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" />
                          Emergency Ops Desk:
                        </span>
                        <strong className="font-mono text-foreground text-[11px]">{ngo.phone || '+91 98000 11222'}</strong>
                      </div>
                      <div className="flex items-center justify-between bg-muted/40 px-2.5 py-1.5 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5" />
                          Incident Commander:
                        </span>
                        <strong className="text-foreground text-[11px]">{ngo.contactPerson || 'Lead Coordinator'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Status Action Controls */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Sector ID: <strong className="text-foreground">SEC-{String(ngo.districtId || 1).padStart(3, '0')}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {ngo.registrationStatus !== 'APPROVED' ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleUpdateStatus(ngo.id, 'APPROVED')}
                          disabled={actionNgoId === ngo.id}
                        >
                          <ShieldCheck className="w-4 h-4 mr-1" />
                          Approve License
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(ngo.id, 'SUSPENDED')}
                          disabled={actionNgoId === ngo.id}
                        >
                          <Ban className="w-3.5 h-3.5 mr-1 text-red-500" />
                          Suspend Agency
                        </Button>
                      )}
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
