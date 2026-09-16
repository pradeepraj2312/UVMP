import { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Building2,
  MapPin,
  Users,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  Check,
  X,
  FileCheck,
  AlertTriangle,
  Truck
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function AdminApprovals() {
  const [activeTab, setActiveTab] = useState('NGOS') // 'NGOS' | 'DISTRICTS' | 'VOLUNTEERS'
  const [pendingNgos, setPendingNgos] = useState([])
  const [pendingDistricts, setPendingDistricts] = useState([])
  const [pendingVolunteers, setPendingVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionSuccess, setActionSuccess] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [actionInProgress, setActionInProgress] = useState(false)

  // Rejection modal state
  const [rejectingItem, setRejectingItem] = useState(null) // { type: 'NGO'|'DISTRICT'|'VOLUNTEER', id, name }
  const [rejectionReason, setRejectionReason] = useState('')

  const fetchAllPending = async () => {
    setLoading(true)
    setActionError(null)
    try {
      const [ngosRes, distRes, volRes] = await Promise.all([
        apiClient.get('/admin/ngos/pending').catch(() => ({ data: { data: [] } })),
        apiClient.get('/admin/district-authorities/pending').catch(() => ({ data: { data: [] } })),
        apiClient.get('/admin/volunteers/pending').catch(() => ({ data: { data: [] } }))
      ])

      setPendingNgos(ngosRes.data?.data || [])
      setPendingDistricts(distRes.data?.data || [])
      setPendingVolunteers(volRes.data?.data || [])
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to fetch pending approval queues.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    Promise.all([
      apiClient.get('/admin/ngos/pending').catch(() => ({ data: { data: [] } })),
      apiClient.get('/admin/district-authorities/pending').catch(() => ({ data: { data: [] } })),
      apiClient.get('/admin/volunteers/pending').catch(() => ({ data: { data: [] } }))
    ])
      .then(([ngosRes, distRes, volRes]) => {
        if (!ignore) {
          setPendingNgos(ngosRes.data?.data || [])
          setPendingDistricts(distRes.data?.data || [])
          setPendingVolunteers(volRes.data?.data || [])
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          setActionError(err.response?.data?.message || err.message || 'Failed to fetch pending approval queues.')
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  // Approve handlers
  const handleApproveNgo = async (id) => {
    setActionInProgress(true)
    try {
      await apiClient.patch(`/admin/ngos/${id}/approve`)
      setActionSuccess('NGO accreditation approved! Organization is now certified on the disaster response platform.')
      fetchAllPending()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve NGO.')
    } finally {
      setActionInProgress(false)
    }
  }

  const handleApproveDistrict = async (id) => {
    setActionInProgress(true)
    try {
      await apiClient.patch(`/admin/district-authorities/${id}/approve`)
      setActionSuccess('District Authority jurisdiction sanctioned! Officer account is now activated.')
      fetchAllPending()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve District Authority.')
    } finally {
      setActionInProgress(false)
    }
  }

  const handleApproveVolunteer = async (id) => {
    setActionInProgress(true)
    try {
      await apiClient.patch(`/admin/volunteers/${id}/approve`)
      setActionSuccess('Common Pool Volunteer cleared! Personnel is now enrolled in the general emergency readiness pool.')
      fetchAllPending()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve Common Pool volunteer.')
    } finally {
      setActionInProgress(false)
    }
  }

  // Reject confirmation
  const handleConfirmReject = async () => {
    if (!rejectingItem) return
    setActionInProgress(true)
    try {
      if (rejectingItem.type === 'NGO') {
        await apiClient.patch(`/admin/ngos/${rejectingItem.id}/reject`, { reason: rejectionReason })
        setActionSuccess(`Accreditation for ${rejectingItem.name} rejected.`)
      } else if (rejectingItem.type === 'DISTRICT') {
        await apiClient.patch(`/admin/district-authorities/${rejectingItem.id}/reject`, { reason: rejectionReason })
        setActionSuccess(`Petition for ${rejectingItem.name} rejected.`)
      } else if (rejectingItem.type === 'VOLUNTEER') {
        await apiClient.patch(`/admin/volunteers/${rejectingItem.id}/reject`, { reason: rejectionReason })
        setActionSuccess(`Enlistment for ${rejectingItem.name} rejected.`)
      }
      setRejectingItem(null)
      setRejectionReason('')
      fetchAllPending()
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed.')
    } finally {
      setActionInProgress(false)
    }
  }

  const totalPending = pendingNgos.length + pendingDistricts.length + pendingVolunteers.length

  return (
    <AppLayout role="ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-900 text-white">
                <ShieldCheck className="w-5 h-5 text-red-500" />
              </span>
              <h1 className="text-2xl font-bold font-heading text-slate-900">
                Platform Approvals Command Hub
              </h1>
              {totalPending > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                  {totalPending} ACTION REQUIRED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Authoritative review console for NGO platform accreditations, District Authority jurisdiction petitions, and unaligned Common Pool volunteer enlistments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllPending}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Queues
            </Button>
          </div>
        </div>

        {/* Action Success / Error Banners */}
        {actionSuccess && (
          <div className="p-3.5 bg-emerald-50 border-l-4 border-emerald-600 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{actionSuccess}</span>
            </div>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {actionError && (
          <div className="p-3.5 bg-red-50 border-l-4 border-red-600 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs text-red-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-medium">{actionError}</span>
            </div>
            <button
              onClick={() => setActionError(null)}
              className="text-red-700 hover:text-red-900 font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div role="tablist" aria-label="Platform approvals categories" className="flex items-center gap-3 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-thin">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'NGOS'}
            onClick={() => setActiveTab('NGOS')}
            className={`pb-3 px-4 text-xs font-bold font-mono tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'NGOS'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>NGO Accreditations</span>
            {pendingNgos.length > 0 ? (
              <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-800 font-bold">
                {pendingNgos.length}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-500">
                0
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'DISTRICTS'}
            onClick={() => setActiveTab('DISTRICTS')}
            className={`pb-3 px-4 text-xs font-bold font-mono tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'DISTRICTS'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>District Authorities</span>
            {pendingDistricts.length > 0 ? (
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-bold">
                {pendingDistricts.length}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-500">
                0
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'VOLUNTEERS'}
            onClick={() => setActiveTab('VOLUNTEERS')}
            className={`pb-3 px-4 text-xs font-bold font-mono tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'VOLUNTEERS'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Common Pool Volunteers</span>
            {pendingVolunteers.length > 0 ? (
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-bold">
                {pendingVolunteers.length}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-500">
                0
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: NGO Accreditations */}
        {activeTab === 'NGOS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Pending NGO Platform Accreditations
                </h3>
                <p className="text-xs text-slate-500">
                  Non-Governmental Organizations requesting legal clearance to coordinate disaster relief missions and supervise affiliated volunteer corps.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
                <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500 font-medium">Querying pending NGO accreditation records...</p>
              </div>
            ) : pendingNgos.length === 0 ? (
              <Card>
                <EmptyState
                  icon={ShieldCheck}
                  title="No Pending NGO Accreditations"
                  description="All submitted NGO applications have been adjudicated. No pending accreditations currently in queue."
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingNgos.map((ngo) => (
                  <div
                    key={ngo.id}
                    className="bg-white border-2 border-amber-300 rounded-lg p-5 shadow-xs transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold font-heading text-slate-900">{ngo.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold uppercase">
                            PENDING ACCREDITATION
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                          Reg No: <span className="font-mono font-semibold text-slate-800">{ngo.registrationNumber || 'N/A'}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        NGO-{String(ngo.id).padStart(4, '0')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Primary Contact</span>
                        <span className="font-medium text-slate-800">{ngo.contactPerson || 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Operating District</span>
                        <span className="font-medium text-slate-800">{ngo.districtName || 'All Districts'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Email Address</span>
                        <span className="font-mono text-slate-800">{ngo.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Phone Contact</span>
                        <span className="font-mono text-slate-800">{ngo.phone || 'N/A'}</span>
                      </div>
                    </div>

                    {ngo.address && (
                      <p className="text-xs text-slate-600">
                        <span className="text-slate-400 font-medium">Headquarters:</span> {ngo.address}
                      </p>
                    )}

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRejectingItem({ type: 'NGO', id: ngo.id, name: ngo.name })}
                        disabled={actionInProgress}
                        className="text-red-700 border-red-200 hover:bg-red-50 text-xs"
                      >
                        <X className="w-3.5 h-3.5 text-red-600 mr-1" />
                        Reject Accreditation
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveNgo(ngo.id)}
                        disabled={actionInProgress}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Approve & Accredit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: District Authorities */}
        {activeTab === 'DISTRICTS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Pending District Authority Jurisdiction Petitions
                </h3>
                <p className="text-xs text-slate-500">
                  Government District Officers petitioning to establish jurisdiction control boards, coordinate emergency zones, and dispatch task forces.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
                <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500 font-medium">Querying pending District Authority petitions...</p>
              </div>
            ) : pendingDistricts.length === 0 ? (
              <Card>
                <EmptyState
                  icon={ShieldCheck}
                  title="No Pending District Authority Petitions"
                  description="All official district administration registrations have been adjudicated. No pending petitions currently in queue."
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingDistricts.map((dist) => (
                  <div
                    key={dist.id}
                    className="bg-white border-2 border-amber-300 rounded-lg p-5 shadow-xs transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold font-heading text-slate-900">{dist.districtName || dist.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold uppercase">
                            PENDING SANCTION
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          Jurisdiction State: <span className="font-semibold text-slate-800">{dist.state || 'National Territory'}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        DIST-{String(dist.id).padStart(4, '0')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Officer Name</span>
                        <span className="font-medium text-slate-800">{dist.officerName || dist.name || 'Official Officer'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Headquarters / Office</span>
                        <span className="font-medium text-slate-800">{dist.headquarters || dist.officeAddress || 'District Center'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Official Email</span>
                        <span className="font-mono text-slate-800">{dist.officerEmail || dist.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Emergency Hotline</span>
                        <span className="font-mono text-slate-800">{dist.emergencyNumber || dist.officerPhone || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRejectingItem({ type: 'DISTRICT', id: dist.id, name: dist.districtName || dist.name })}
                        disabled={actionInProgress}
                        className="text-red-700 border-red-200 hover:bg-red-50 text-xs"
                      >
                        <X className="w-3.5 h-3.5 text-red-600 mr-1" />
                        Reject Petition
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveDistrict(dist.id)}
                        disabled={actionInProgress}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Sanction Authority
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Common Pool Volunteers */}
        {activeTab === 'VOLUNTEERS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Pending Common Pool Volunteers
                </h3>
                <p className="text-xs text-slate-500">
                  Unaligned volunteers registered under the General Pool (no specific NGO or direct District Authority). Admin reviews and admits them to the platform emergency roster.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
                <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500 font-medium">Querying pending Common Pool enlistments...</p>
              </div>
            ) : pendingVolunteers.length === 0 ? (
              <Card>
                <EmptyState
                  icon={Users}
                  title="No Pending Common Pool Volunteers"
                  description="All general pool volunteer registrations have been adjudicated. No pending enlistments currently in queue."
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingVolunteers.map((vol) => (
                  <div
                    key={vol.id}
                    className="bg-white border-2 border-blue-200 rounded-lg p-5 shadow-xs transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold font-heading text-slate-900">{vol.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold uppercase">
                            COMMON POOL PENDING
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                          {vol.phone && (
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {vol.phone}
                            </span>
                          )}
                          {vol.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              {vol.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        VOL-{String(vol.id).padStart(4, '0')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Declared Address</span>
                        <span className="font-medium text-slate-800">{vol.address || 'Unspecified location'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Transport Asset</span>
                        <span className="font-medium text-slate-800 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-slate-400" />
                          {vol.transport || 'None / On Foot'}
                        </span>
                      </div>
                    </div>

                    {vol.skills && (
                      <div>
                        <span className="text-slate-400 text-[11px] font-medium block mb-1">Declared Competencies</span>
                        <div className="flex flex-wrap gap-1">
                          {vol.skills.split(',').map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded-sm border border-slate-200"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRejectingItem({ type: 'VOLUNTEER', id: vol.id, name: vol.name })}
                        disabled={actionInProgress}
                        className="text-red-700 border-red-200 hover:bg-red-50 text-xs"
                      >
                        <X className="w-3.5 h-3.5 text-red-600 mr-1" />
                        Reject Enlistment
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveVolunteer(vol.id)}
                        disabled={actionInProgress}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Approve to Common Pool
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rejection Modal */}
        {rejectingItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-sm font-heading">
                    Reject Application: {rejectingItem.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRejectingItem(null)
                    setRejectionReason('')
                  }}
                  className="text-slate-400 hover:text-white text-base"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-600">
                  Please specify the official reason for rejection. This reason will be recorded in the audit trail and presented to the applicant when they attempt to sign in.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rejection Justification <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Official government accreditation documents could not be verified; Incomplete jurisdiction mandate."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-control focus:outline-hidden focus:ring-1 focus:ring-slate-500 bg-slate-50 text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRejectingItem(null)
                      setRejectionReason('')
                    }}
                    disabled={actionInProgress}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleConfirmReject}
                    disabled={actionInProgress || !rejectionReason.trim()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Confirm Rejection
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
