import { useState, useEffect } from 'react'
import {
  Award,
  Shield,
  Calendar,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Printer,
  FileCheck,
  X
} from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import apiClient from '../../api/client'

export default function Certificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCert, setSelectedCert] = useState(null)
  const [copiedCode, setCopiedCode] = useState(null)

  const fetchCertificates = () => {
    setLoading(true)
    setError(null)
    apiClient.get('/volunteer/certificates')
      .then((res) => {
        if (res.data?.data) {
          setCertificates(res.data.data)
        } else {
          setError('No certificate records returned.')
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

    apiClient.get('/volunteer/certificates')
      .then((res) => {
        if (!ignore) {
          if (res.data?.data) {
            setCertificates(res.data.data)
          } else {
            setError('No certificate records returned.')
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

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  const getBadgeStyle = (badgeType) => {
    switch (badgeType) {
      case 'HERO':
        return {
          label: 'Hero of Relief',
          borderClass: 'border-l-4 border-l-amber-500',
          textColor: 'text-amber-700',
          badgeVariant: 'warning'
        }
      case 'LIFESAVER':
        return {
          label: 'Lifesaver Citation',
          borderClass: 'border-l-4 border-l-red-600',
          textColor: 'text-red-700',
          badgeVariant: 'danger'
        }
      case 'FIELD_MASTER':
        return {
          label: 'Field Master',
          borderClass: 'border-l-4 border-l-sky-600',
          textColor: 'text-sky-700',
          badgeVariant: 'info'
        }
      default:
        return {
          label: 'Community Star',
          borderClass: 'border-l-4 border-l-emerald-600',
          textColor: 'text-emerald-700',
          badgeVariant: 'success'
        }
    }
  }

  if (loading) {
    return (
      <AppLayout role="VOLUNTEER">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Validating cryptographic credentials...</p>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout role="VOLUNTEER">
        <div className="space-y-6">
          <div className="p-4 bg-red-50 border-l-4 border-red-600 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchCertificates}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Retry Connection
            </Button>
          </div>
          <EmptyState
            title="Unable to load certificate registry"
            description="The credentials registry could not connect to MySQL."
            actionLabel="Retry"
            onAction={fetchCertificates}
          />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout role="VOLUNTEER">
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900">Verified Honors & Credentials</h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Official recognized certificates issued by partner NGOs with tamper-proof validation hashes
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchCertificates}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh Credentials
          </Button>
        </div>

        {/* Certificate Cards Grid */}
        {certificates.length === 0 ? (
          <EmptyState
            title="No certificates issued yet"
            description="Complete emergency deployments and record field check-out hours. Coordinating NGOs issue official recognition citations for high-reliability service."
            actionLabel="Explore Active Missions"
            onAction={() => (window.location.href = '/volunteer/tasks')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => {
              const badgeStyle = getBadgeStyle(cert.badgeType)
              return (
                <div
                  key={cert.id}
                  className={`p-5 rounded-lg border border-slate-200 ${badgeStyle.borderClass} bg-white shadow-xs flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={badgeStyle.badgeVariant}>{badgeStyle.label}</Badge>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : 'Issued'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold font-heading text-slate-900">{cert.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                        {cert.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Issuing Organization:</span>
                        <strong className="text-slate-900">{cert.ngoName}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Recognized Deployment Hours:</span>
                        <strong className="text-primary font-mono tabular-nums font-bold">{cert.hoursRecognized} Hours</strong>
                      </div>
                    </div>

                    {/* Copyable Verification Code */}
                    <div className="p-2.5 bg-slate-50 rounded-control border border-slate-200 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                          Verification Hash Code
                        </span>
                        <code className="text-xs font-mono font-bold text-slate-800 tabular-nums select-all">
                          {cert.certificateCode}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(cert.certificateCode)}
                        className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-control transition flex items-center justify-center"
                        title="Copy verification hash"
                        aria-label="Copy verification hash code"
                      >
                        {copiedCode === cert.certificateCode ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedCert(cert)}
                      className="font-medium"
                    >
                      <FileCheck className="w-4 h-4 mr-1.5" />
                      View Official Certificate
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Certificate Modal Preview */}
        {selectedCert && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Official Certificate Preview"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          >
            <div className="bg-white w-full max-w-2xl rounded-lg border border-slate-300 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary" />
                  Official Credential Verification Preview
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-1.5 hover:bg-slate-200 rounded-control text-slate-600 hover:text-slate-900 transition flex items-center justify-center"
                    title="Print Certificate"
                    aria-label="Print official certificate"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    aria-label="Close certificate preview"
                    className="p-1.5 hover:bg-slate-200 rounded-control text-slate-600 hover:text-slate-900 transition flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Certificate Frame */}
              <div className="p-8 text-center space-y-5 bg-white border-2 border-slate-300 m-4 rounded-lg">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-800 mx-auto flex items-center justify-center border border-slate-300">
                  <Award className="w-7 h-7 text-amber-500" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-mono font-semibold">
                    Unified Volunteer Management Platform
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">
                    Certificate of Humanitarian Service
                  </h2>
                  <p className="text-xs text-slate-500">In recognition of distinguished community disaster response</p>
                </div>

                <div className="py-2.5 border-y border-slate-200">
                  <span className="text-xs text-slate-500">This honor is proudly conferred upon</span>
                  <h3 className="text-xl font-bold text-primary mt-0.5 font-heading">
                    {selectedCert.volunteerName}
                  </h3>
                </div>

                <div className="max-w-md mx-auto space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900">{selectedCert.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{selectedCert.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-slate-600 border-t border-slate-200">
                  <div className="text-left">
                    <span className="block font-semibold text-slate-900">{selectedCert.ngoName}</span>
                    <span className="text-slate-500">Disaster Relief Authority</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-semibold text-slate-900">
                      {selectedCert.issuedAt ? new Date(selectedCert.issuedAt).toLocaleDateString() : 'Active'}
                    </span>
                    <span className="font-mono text-[11px] block text-slate-500 tabular-nums">{selectedCert.certificateCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
