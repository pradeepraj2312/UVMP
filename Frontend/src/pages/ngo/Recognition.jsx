import { useState, useEffect } from 'react'
import {
  Award,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Shield,
  Star,
  HeartHandshake,
  Clock,
  User,
  Search,
  Filter,
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function NgoRecognition() {
  const [recognitions, setRecognitions] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Award Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [copiedCode, setCopiedCode] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)

  // Filter state
  const [search, setSearch] = useState('')
  const [badgeFilter, setBadgeFilter] = useState('ALL')

  // Award form state
  const [form, setForm] = useState({
    volunteerId: '',
    taskId: '',
    title: '',
    badgeType: 'HERO',
    hoursRecognized: 12,
    description: '',
  })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [recRes, volRes, taskRes] = await Promise.all([
        apiClient.get('/ngo/recognition'),
        apiClient.get('/ngo/volunteers'),
        apiClient.get('/ngo/tasks'),
      ])

      if (recRes.data?.data) setRecognitions(recRes.data.data)
      if (volRes.data?.data) setVolunteers(volRes.data.data)
      if (taskRes.data?.data) setTasks(taskRes.data.data)
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

    Promise.all([
      apiClient.get('/ngo/recognition'),
      apiClient.get('/ngo/volunteers'),
      apiClient.get('/ngo/tasks'),
    ])
      .then(([recRes, volRes, taskRes]) => {
        if (!ignore) {
          if (recRes.data?.data) setRecognitions(recRes.data.data)
          if (volRes.data?.data) setVolunteers(volRes.data.data)
          if (taskRes.data?.data) setTasks(taskRes.data.data)
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

  const handleOpenModal = () => {
    setForm({
      volunteerId: volunteers.length > 0 ? String(volunteers[0].id) : '',
      taskId: tasks.length > 0 ? String(tasks[0].id) : '',
      title: '',
      badgeType: 'HERO',
      hoursRecognized: 12,
      description: '',
    })
    setModalOpen(true)
  }

  const handleSubmitAward = async (e) => {
    e.preventDefault()
    if (!form.volunteerId) {
      alert('Please select a volunteer candidate.')
      return
    }
    if (!form.title.trim()) {
      alert('Please enter an award title.')
      return
    }

    setSubmitting(true)
    setActionSuccess(null)
    try {
      const payload = {
        volunteerId: Number(form.volunteerId),
        taskId: form.taskId ? Number(form.taskId) : null,
        title: form.title.trim(),
        badgeType: form.badgeType,
        hoursRecognized: Number(form.hoursRecognized) || 6.0,
        description: form.description.trim() || 'Recognized for exemplary service and selfless field relief conduct.',
      }

      const res = await apiClient.post('/ngo/recognition/award', payload)
      if (res.data?.data) {
        setRecognitions((prev) => [res.data.data, ...prev])
        setModalOpen(false)
        setActionSuccess(`Certificate awarded! Verifiable code: ${res.data.data.certificateCode}`)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to award recognition.')
    } finally {
      setSubmitting(false)
    }
  }

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'HERO':
        return <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
      case 'LIFESAVER':
        return <HeartHandshake className="w-5 h-5 text-red-500" />
      case 'FIELD_MASTER':
        return <Shield className="w-5 h-5 text-sky-500 fill-sky-400" />
      default:
        return <Award className="w-5 h-5 text-primary fill-primary" />
    }
  }

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'HERO':
        return 'warning'
      case 'LIFESAVER':
        return 'danger'
      case 'FIELD_MASTER':
        return 'info'
      default:
        return 'neutral'
    }
  }

  const filteredRecognitions = recognitions.filter((r) => {
    const matchesSearch =
      (r.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (r.volunteerName?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (r.certificateCode?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (r.description?.toLowerCase() || '').includes(search.toLowerCase())

    const matchesBadge = badgeFilter === 'ALL' || r.badgeType === badgeFilter

    return matchesSearch && matchesBadge
  })

  const getBadgeBorderClass = (type) => {
    switch (type) {
      case 'LIFESAVER':
        return 'border-l-4 border-l-red-600'
      case 'HERO':
        return 'border-l-4 border-l-amber-500'
      case 'FIELD_MASTER':
        return 'border-l-4 border-l-sky-600'
      default:
        return 'border-l-4 border-l-primary'
    }
  }

  return (
    <AppLayout role="NGO">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-900 text-white">
                <Award className="w-5 h-5 text-red-500" />
              </span>
              <h1 className="text-2xl font-bold font-heading text-slate-900">
                Volunteer Recognition & Service Honors
              </h1>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Issue verifiable disaster response service certificates, commendations, and boost volunteer reliability merit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenModal}
              disabled={volunteers.length === 0}
              className="gap-2 shadow-xs font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Service Award</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Action Success Toast Banner */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Live Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Total Commendations</p>
            <p className="text-2xl font-bold font-heading tabular-nums text-slate-900 mt-1">{recognitions.length}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Hero Badges</p>
            <p className="text-2xl font-bold font-heading tabular-nums text-amber-600 mt-1">
              {recognitions.filter((r) => r.badgeType === 'HERO').length}
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Lifesaver Honors</p>
            <p className="text-2xl font-bold font-heading tabular-nums text-red-600 mt-1">
              {recognitions.filter((r) => r.badgeType === 'LIFESAVER').length}
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Hours Validated</p>
            <p className="text-2xl font-bold font-heading tabular-nums text-primary mt-1">
              {recognitions.reduce((acc, r) => acc + (r.hoursRecognized || 0), 0)} hrs
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-600 border border-slate-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900">Connection Error</h4>
              <p className="text-xs text-red-700 mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-red-700 border-red-300 hover:bg-red-100"
                onClick={fetchData}
              >
                Retry Connection
              </Button>
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search certificates by title, volunteer name, or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-control focus:outline-hidden focus:ring-1 focus:ring-slate-400 text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Badge:</span>
              </div>

              <select
                value={badgeFilter}
                onChange={(e) => setBadgeFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-control px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
              >
                <option value="ALL">All Honor Badges</option>
                <option value="HERO">Hero</option>
                <option value="LIFESAVER">Lifesaver</option>
                <option value="FIELD_MASTER">Field Master</option>
                <option value="COMMUNITY_STAR">Community Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Certificate Cards Grid */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading recognition certificates from live database...</p>
          </div>
        ) : error && recognitions.length === 0 ? (
          <Card>
            <EmptyState
              icon={AlertCircle}
              title="Unable to load certificates"
              description={error}
              action={
                <Button size="sm" onClick={fetchData}>
                  Retry Connection
                </Button>
              }
            />
          </Card>
        ) : filteredRecognitions.length === 0 ? (
          <Card>
            <EmptyState
              icon={Award}
              title="No certificates issued"
              description="Honor your volunteer crew with verifiable merit certificates and field service commendations."
              action={
                <Button size="sm" variant="primary" onClick={handleOpenModal}>
                  Issue First Award
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecognitions.map((rec) => (
              <div
                key={rec.id}
                className={`bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 shadow-xs transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group ${getBadgeBorderClass(rec.badgeType)}`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      {getBadgeIcon(rec.badgeType)}
                    </div>
                    <Badge variant={getBadgeVariant(rec.badgeType)}>
                      {rec.badgeType}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold font-heading text-slate-900 group-hover:text-primary transition-colors">
                      {rec.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                      <User className="w-3.5 h-3.5 text-primary" />
                      {rec.volunteerName}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    "{rec.description}"
                  </p>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1 text-[11px] font-mono tabular-nums">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {rec.hoursRecognized || 6} Service Hours
                    </span>
                    <span className="text-[11px] font-medium text-slate-600">
                      {rec.ngoName || 'Relief Command'}
                    </span>
                  </div>

                  {/* Verifiable Certificate Code & Copy */}
                  <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-control border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-700 font-bold tabular-nums truncate">
                      {rec.certificateCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(rec.certificateCode)}
                      title="Copy Certificate Code"
                      className="text-slate-500 hover:text-slate-900 p-0.5 ml-1 transition-colors"
                    >
                      {copiedCode === rec.certificateCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Issue Service Award Modal */}
        <Modal
          open={modalOpen}
          title="Issue Volunteer Service Award"
          subtitle="Award official commendations and automatically boost volunteer reliability merit."
          onClose={() => setModalOpen(false)}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSubmitAward} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Recipient Volunteer <span className="text-red-600">*</span>
              </label>
              <select
                value={form.volunteerId}
                onChange={(e) => setForm({ ...form, volunteerId: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-control focus:outline-hidden focus:ring-1 focus:ring-slate-400 text-slate-900"
              >
                {volunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.email || `ID #${v.id}`}) — Score: {v.reliabilityScore != null ? v.reliabilityScore.toFixed(0) : 85}%
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Honor Badge</label>
                <select
                  value={form.badgeType}
                  onChange={(e) => setForm({ ...form, badgeType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-control focus:outline-hidden focus:ring-1 focus:ring-slate-400 text-slate-900"
                >
                  <option value="HERO">Hero Award</option>
                  <option value="LIFESAVER">Lifesaver Honor</option>
                  <option value="FIELD_MASTER">Field Master</option>
                  <option value="COMMUNITY_STAR">Community Star</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Recognized Hours</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  step="0.5"
                  value={form.hoursRecognized}
                  onChange={(e) => setForm({ ...form, hoursRecognized: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-control focus:outline-hidden focus:ring-1 focus:ring-slate-400 font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Commendation Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Flood Evacuation Squad Bravo Leader"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-control focus:outline-hidden focus:ring-1 focus:ring-slate-400 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Related Mission (Optional)</label>
              <select
                value={form.taskId}
                onChange={(e) => setForm({ ...form, taskId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-control focus:outline-hidden focus:ring-1 focus:ring-slate-400 text-slate-900"
              >
                <option value="">-- General Field Contribution --</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    TSK-{String(t.id).padStart(4, '0')}: {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Citation Narrative</label>
              <textarea
                rows={3}
                placeholder="Describe the volunteer's meritorious response effort, speed, and dedication..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-control focus:outline-hidden focus:ring-1 focus:ring-slate-400 text-slate-900 resize-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={submitting}
                className="gap-2 font-medium"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{submitting ? 'Generating Certificate...' : 'Award Certificate'}</span>
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  )
}
