import { useState, useEffect } from 'react'
import {
  MapPin,
  Plus,
  RefreshCw,
  AlertCircle,
  Building2,
  Users,
  ClipboardList,
  Calendar,
  X,
  CheckCircle2
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function Districts() {
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createSuccess, setCreateSuccess] = useState(false)

  // New district form
  const [name, setName] = useState('')
  const [region, setRegion] = useState('')

  const fetchDistricts = () => {
    setLoading(true)
    setError(null)
    apiClient.get('/admin/districts')
      .then((res) => {
        if (res.data?.data) {
          setDistricts(res.data.data)
        } else {
          setError('No districts returned from platform registry.')
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

    apiClient.get('/admin/districts')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setDistricts(res.data.data)
          } else {
            setError('No districts returned from platform registry.')
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

  const handleCreateDistrict = async (e) => {
    e.preventDefault()
    if (!name.trim() || !region.trim()) return
    setCreating(true)
    setCreateSuccess(false)
    try {
      await apiClient.post('/admin/districts', { name, region })
      setCreateSuccess(true)
      setName('')
      setRegion('')
      setTimeout(() => {
        setCreateSuccess(false)
        setShowModal(false)
      }, 1500)
      fetchDistricts()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create district.')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <AppLayout role="ADMIN">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading district boundaries and authority registry...</p>
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
            <Button variant="outline" size="sm" onClick={fetchDistricts}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Retry Connection
            </Button>
          </div>
          <EmptyState
            title="Districts Registry Unavailable"
            description="The administrative district service could not be reached."
            actionLabel="Retry"
            onAction={fetchDistricts}
          />
        </div>
      </AppLayout>
    )
  }

  const totalNgos = districts.reduce((acc, d) => acc + (d.ngosCount || 0), 0)
  const totalVolunteers = districts.reduce((acc, d) => acc + (d.volunteersCount || 0), 0)
  const totalTasks = districts.reduce((acc, d) => acc + (d.activeTasksCount || 0), 0)

  return (
    <AppLayout role="ADMIN">
      <div className="space-y-6 pb-12">
        {/* Telemetry Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">National Jurisdiction Network</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-foreground tracking-tight mt-0.5">Districts & Response Sectors</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Establish and coordinate administrative jurisdictions, oversee local authorities, and allocate NGO forces
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchDistricts}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Establish Response District
            </Button>
          </div>
        </div>

        {/* Operational Telemetry Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 text-white p-4 rounded-xl shadow-sm border border-slate-800">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Sectors</p>
            <p className="text-2xl font-mono tabular-nums font-bold text-white mt-0.5">{districts.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Partner NGOs</p>
            <p className="text-2xl font-mono tabular-nums font-bold text-orange-400 mt-0.5">{totalNgos}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Deployed Responders</p>
            <p className="text-2xl font-mono tabular-nums font-bold text-emerald-400 mt-0.5">{totalVolunteers}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Active Missions</p>
            <p className="text-2xl font-mono tabular-nums font-bold text-red-400 mt-0.5">{totalTasks}</p>
          </div>
        </div>

        {/* Districts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {districts.map((d) => (
            <div
              key={d.id}
              className="p-5 bg-card rounded-xl border border-border hover:border-slate-400 dark:hover:border-slate-600 transition shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground line-clamp-1">{d.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{d.region}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border tabular-nums">
                    SEC-{String(d.id).padStart(3, '0')}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-border/80 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2 rounded-lg">
                    <Building2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span><strong className="font-mono tabular-nums text-foreground">{d.ngosCount}</strong> NGOs</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span><strong className="font-mono tabular-nums text-foreground">{d.volunteersCount}</strong> Responders</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2 rounded-lg">
                    <ClipboardList className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span><strong className="font-mono tabular-nums text-foreground">{d.activeTasksCount}</strong> Active Tasks</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                    <span className="font-mono text-[11px]">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Active'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Authority Desk:</span>
                <strong className="font-mono text-foreground">{d.adminEmail || 'district@uvmp.local'}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Establish District Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold font-heading text-foreground uppercase tracking-wide">Establish Response District</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {createSuccess ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Response District established and synchronized to MySQL platform database!</span>
                </div>
              ) : (
                <form onSubmit={handleCreateDistrict} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      District Official Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Northern Valley Relief Sector"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Geographic Region / Terrain *
                    </label>
                    <input
                      type="text"
                      required
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="e.g. Western Ghats Basin"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm" disabled={creating}>
                      {creating ? 'Establishing...' : 'Confirm & Establish'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
