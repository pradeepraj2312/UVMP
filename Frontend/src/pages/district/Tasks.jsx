import { useState, useEffect, useMemo } from 'react'
import {
  ClipboardList,
  AlertCircle,
  Search,
  Plus,
  Building2,
  Users,
  MapPin,
  RefreshCw,
  Eye,
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function DistrictTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [urgencyFilter, setUrgencyFilter] = useState('ALL')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [ngos, setNgos] = useState([])

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    districtId: 1,
    ngoId: '',
    requiredSkills: 'First Aid, Logistics',
    locationAddress: '',
    latitude: 12.9716,
    longitude: 77.5946,
    urgency: 'HIGH',
    volunteersNeeded: 5,
  })
  const [createLoading, setCreateLoading] = useState(false)

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/tasks')
      if (res.data?.data) {
        setTasks(res.data.data)
      } else {
        setTasks([])
        setError('No operational tasks returned from backend.')
      }
    } catch (err) {
      setTasks([])
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load operational tasks. Please ensure backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    apiClient.get('/tasks')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setTasks(res.data.data)
          } else {
            setTasks([])
            setError('No operational tasks returned from backend.')
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          setTasks([])
          setError(
            err.response?.data?.message ||
            err.message ||
            'Failed to load operational tasks. Please ensure backend is running.'
          )
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    apiClient.get('/district/ngos')
      .then((res) => {
        if (!ignore && res.data?.data) setNgos(res.data.data)
      })
      .catch(() => {
        // empty NGOs list
      })

    return () => {
      ignore = true
    }
  }, [])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError(null)
    try {
      const res = await apiClient.post('/tasks', taskForm)
      const newTask = res.data?.data
      if (newTask) {
        setTasks((prev) => [newTask, ...prev])
      }
      setIsCreateModalOpen(false)
      setTaskForm({
        title: '',
        description: '',
        districtId: 1,
        ngoId: '',
        requiredSkills: 'First Aid, Logistics',
        locationAddress: '',
        latitude: 12.9716,
        longitude: 77.5946,
        urgency: 'HIGH',
        volunteersNeeded: 5,
      })
    } catch (err) {
      setCreateError(
        err.response?.data?.message ||
        err.message ||
        'Failed to create task. Please check backend connection.'
      )
    } finally {
      setCreateLoading(false)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    setActionError(null)
    try {
      await apiClient.patch(`/tasks/${taskId}/status`, null, { params: { status: newStatus } })
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      )
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
        err.message ||
        `Failed to update status for Task #${taskId}. Please check backend connection.`
      )
    }
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
      const matchesUrgency = urgencyFilter === 'ALL' || task.urgency === urgencyFilter
      const query = search.toLowerCase()
      const matchesSearch =
        !search ||
        (task.title && task.title.toLowerCase().includes(query)) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.locationAddress && task.locationAddress.toLowerCase().includes(query)) ||
        (task.requiredSkills && task.requiredSkills.toLowerCase().includes(query)) ||
        (task.ngoName && task.ngoName.toLowerCase().includes(query))

      return matchesStatus && matchesUrgency && matchesSearch
    })
  }, [tasks, statusFilter, urgencyFilter, search])

  return (
    <AppLayout role="DISTRICT_AUTHORITY">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">District Disaster Missions</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Oversee and coordinate active response missions assigned to district NGO partners.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={RefreshCw} loading={loading} onClick={fetchTasks}>
              Sync Tasks
            </Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
              Create Mission Task
            </Button>
          </div>
        </div>

        {/* Error Notification Banners */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span><strong>Backend Service Error:</strong> {error}</span>
            </div>
            <Button size="xs" variant="outline" onClick={fetchTasks} loading={loading}>
              Retry Connection
            </Button>
          </div>
        )}

        {actionError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between gap-3 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span><strong>Task Operation Failed:</strong> {actionError}</span>
            </div>
            <Button size="xs" variant="ghost" onClick={() => setActionError(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
              {['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    statusFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none"
            >
              <option value="ALL">All Urgencies</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks, skills, NGOs..."
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-500"
            />
          </div>
        </div>

        {/* Tasks Table */}
        <Card title={`District Tasks Queue (${filteredTasks.length})`} description="Track active volunteer response deployment">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
              <div className="w-7 h-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>Loading operational tasks...</span>
            </div>
          ) : error && tasks.length === 0 ? (
            <EmptyState
              icon={AlertCircle}
              title="Unable to Load Operational Tasks"
              description={error}
              action={
                <Button variant="primary" size="sm" onClick={fetchTasks} icon={RefreshCw}>
                  Retry Connection
                </Button>
              }
            />
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No tasks match your criteria"
              description="Create a new task or modify your status and urgency filters."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Task Details</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">NGO Partner</th>
                    <th className="py-3 px-4">Volunteers</th>
                    <th className="py-3 px-4">Status & Urgency</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTasks.map((task) => {
                    const urg = (task.urgency || 'MEDIUM').toUpperCase()
                    const rowClass =
                      urg === 'CRITICAL'
                        ? 'border-l-4 border-l-[#C1272D]'
                        : urg === 'HIGH'
                        ? 'border-l-4 border-l-[#F26522]'
                        : 'border-l-4 border-l-amber-500'

                    return (
                      <tr key={task.id} className={`hover:bg-slate-50 transition-colors ${rowClass}`}>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-semibold text-slate-500 tabular-nums">
                              TSK-{String(task.id).padStart(4, '0')}
                            </span>
                          </div>
                          <strong className="text-slate-900 font-semibold block text-sm mt-0.5">{task.title}</strong>
                          <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">{task.description}</p>
                          {task.requiredSkills && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {task.requiredSkills.split(',').map((sk) => (
                                <span key={sk} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xs text-[10px]">
                                  {sk.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-900">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[180px]">{task.locationAddress || 'District Sector'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5 tabular-nums">
                            {task.latitude?.toFixed(4)}, {task.longitude?.toFixed(4)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span className="font-semibold text-slate-900">{task.ngoName || 'Direct District'}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-bold text-slate-900 font-mono tabular-nums">
                              {task.volunteersAssigned}/{task.volunteersNeeded}
                            </span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-xs overflow-hidden mt-1 flex">
                            <div
                              className="h-full bg-slate-800"
                              style={{
                                width: `${Math.min(100, Math.round(((task.volunteersAssigned || 0) / (task.volunteersNeeded || 1)) * 100))}%`,
                              }}
                            />
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            <Badge status={task.status} />
                            <span className="text-[10px] font-mono font-bold uppercase text-slate-700">{task.urgency}</span>
                          </div>
                        </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => setSelectedTask(task)}
                        >
                          View
                        </Button>
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className="px-2 py-1 bg-white border border-border rounded-control text-[11px] font-semibold text-accent cursor-pointer"
                        >
                          <option value="OPEN">Mark Open</option>
                          <option value="IN_PROGRESS">Mark In Progress</option>
                          <option value="COMPLETED">Mark Completed</option>
                          <option value="CANCELLED">Mark Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Task Detail Modal */}
        <Modal
          open={Boolean(selectedTask)}
          title={selectedTask?.title || 'Task Details'}
          subtitle={`Dispatched by District Authority • Created ${selectedTask?.createdAt ? new Date(selectedTask.createdAt).toLocaleDateString() : 'Today'}`}
          onClose={() => setSelectedTask(null)}
        >
          {selectedTask && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-red-50 rounded-control border border-red-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-700 block">Assigned NGO Partner</span>
                  <strong className="text-sm text-primary font-heading">{selectedTask.ngoName || 'Direct District Team'}</strong>
                </div>
                <div className="flex gap-2">
                  <Badge status={selectedTask.urgency} />
                  <Badge status={selectedTask.status} />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Mission Scope</span>
                <div className="p-3 bg-gray-50 border border-border rounded-control text-gray-700 leading-relaxed">
                  {selectedTask.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 border border-border rounded-control">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Volunteers Needed</span>
                  <strong className="text-base text-accent">{selectedTask.volunteersAssigned} / {selectedTask.volunteersNeeded}</strong>
                </div>
                <div className="p-3 bg-gray-50 border border-border rounded-control">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Required Skills</span>
                  <span className="font-semibold text-accent">{selectedTask.requiredSkills || 'General Relief'}</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-border rounded-control">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Operational Site</span>
                <p className="font-semibold text-accent">{selectedTask.locationAddress}</p>
                <p className="font-mono text-gray-500 mt-1">
                  Coords: {selectedTask.latitude}, {selectedTask.longitude}
                </p>
              </div>

              <div className="flex justify-end pt-3 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedTask(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Create Task Modal */}
        <Modal
          open={isCreateModalOpen}
          title="Create Operational Mission Task"
          subtitle="Mobilize NGO partners and response volunteers"
          onClose={() => {
            setIsCreateModalOpen(false)
            setCreateError(null)
          }}
        >
          {createError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-control flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{createError}</span>
            </div>
          )}
          <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-accent mb-1">Mission Title *</label>
              <input
                type="text"
                required
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="e.g. Sector 3 Drinking Water Distribution"
                className="w-full px-3 py-2 border border-border rounded-control text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-accent mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Describe objectives and equipment required..."
                className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-accent mb-1">Assigned NGO</label>
                <select
                  value={taskForm.ngoId}
                  onChange={(e) => setTaskForm({ ...taskForm, ngoId: e.target.value ? parseInt(e.target.value) : '' })}
                  className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Direct District Coordination</option>
                  {ngos.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-accent mb-1">Urgency</label>
                <select
                  value={taskForm.urgency}
                  onChange={(e) => setTaskForm({ ...taskForm, urgency: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-accent mb-1">Required Skills</label>
                <input
                  type="text"
                  value={taskForm.requiredSkills}
                  onChange={(e) => setTaskForm({ ...taskForm, requiredSkills: e.target.value })}
                  placeholder="e.g. First Aid, Boat Operations"
                  className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-accent mb-1">Volunteers Needed</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={taskForm.volunteersNeeded}
                  onChange={(e) => setTaskForm({ ...taskForm, volunteersNeeded: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-accent mb-1">Location Address *</label>
              <input
                type="text"
                required
                value={taskForm.locationAddress}
                onChange={(e) => setTaskForm({ ...taskForm, locationAddress: e.target.value })}
                placeholder="Sector / Landmark location"
                className="w-full px-3 py-2 border border-border rounded-control text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={createLoading} icon={Plus}>
                Create Task
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  )
}
