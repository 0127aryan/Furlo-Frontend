'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { toast } from '@/lib/toast'
import { subscribeModerationQueue } from '@/lib/subscribeModerationQueue'

interface ReportItem {
  id: string
  target_type: 'post' | 'comment' | 'community' | 'pet'
  target_id: string
  reason_category: string
  description?: string
  status: 'open' | 'resolved' | 'dismissed'
  action_taken?: string
  created_at: string
  reporter?: {
    email: string
    name?: string
    username?: string
    pet_id?: string
  }
  pet?: {
    id: string
    name: string
    username: string
  }
  target_content?: {
    caption?: string
    post_type?: string
    location_city?: string
    like_count?: number
    comment_count?: number
    status?: string
    created_at?: string
    media_urls?: string[]
    author?: {
      id?: string
      name?: string
      username?: string
      avatar?: string
      breed?: string
    }
  }
}

export default function AdminModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'open' | 'resolved' | 'all'>('open')
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null)

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await apiFetch<{ reports: ReportItem[] }>('/admin/reports')
      if (res && res.reports) {
        setReports(res.reports)
        // Update selected report if open in modal
        if (selectedReport) {
          const updated = res.reports.find((r) => r.id === selectedReport.id)
          if (updated) setSelectedReport(updated)
        }
      }
    } catch (err) {
      console.error('[AdminModeration] Fetch error:', err)
      toast.error('Failed to fetch moderation reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()

    const unsub = subscribeModerationQueue((payload) => {
      if (payload.type === 'report_created') {
        fetchReports()
      } else if (payload.type === 'report_action' && payload.reportId) {
        setReports((prev) =>
          prev.map((r) =>
            r.id === payload.reportId
              ? { ...r, status: 'resolved', action_taken: payload.action || r.action_taken }
              : r
          )
        )
        setSelectedReport((prev) =>
          prev && prev.id === payload.reportId
            ? { ...prev, status: 'resolved', action_taken: payload.action || prev.action_taken }
            : prev
        )
      }
    })

    return () => unsub()
  }, [])

  const handleAction = async (
    reportId: string,
    action: 'remove_content' | 'warn_user' | 'suspend_user' | 'dismiss'
  ) => {
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/admin/reports/${reportId}/action`,
        {
          method: 'POST',
          json: { action },
        }
      )

      if (res && res.success) {
        toast.success(
          action === 'remove_content'
            ? 'Content removed from platform'
            : action === 'dismiss'
            ? 'Report dismissed'
            : 'Moderation action applied'
        )

        setReports((prev) =>
          prev.map((r) =>
            r.id === reportId ? { ...r, status: 'resolved', action_taken: action } : r
          )
        )

        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport((prev) =>
            prev ? { ...prev, status: 'resolved', action_taken: action } : null
          )
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to apply moderation action')
    }
  }

  const filteredList = reports.filter((r) => {
    if (filter === 'all') return true
    return r.status === filter
  })

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-[28px] sm:text-[32px] font-bold text-[#011E14] tracking-tight"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Content Moderation Queue
          </h1>
          <p className="text-xs text-[#727974] mt-1">
            Review user-flagged posts, comments, or pet profiles for spam, harassment, or medical misinformation. Click any row to view complete content & report details.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#EDE8E1] shadow-2xs">
          {[
            { id: 'open', label: 'Open Reports', count: reports.filter((r) => r.status === 'open').length },
            { id: 'resolved', label: 'Resolved', count: reports.filter((r) => r.status === 'resolved').length },
            { id: 'all', label: 'All History', count: reports.length },
          ].map((tab) => {
            const isActive = filter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#163328] text-white shadow-2xs'
                    : 'text-[#727974] hover:text-[#011E14] hover:bg-[#FAF7F2]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-[#DC2626] text-white' : 'bg-[#F5F2ED] text-[#727974]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-3xl border border-[#EDE8E1] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#EDE8E1] text-[#727974] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Target Content</th>
                <th className="py-3.5 px-6">Report Category</th>
                <th className="py-3.5 px-6">Reported By</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE8E1]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#727974]">
                    Loading moderation queue...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#727974] space-y-2">
                    <span className="material-symbols-outlined text-[36px] text-[#15803D]">
                      verified_user
                    </span>
                    <p className="font-bold text-[#011E14]">Queue Clean!</p>
                    <p className="text-xs">No moderation reports match this filter tab.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedReport(r)}
                    className="hover:bg-[#FAF7F2] transition-colors duration-100 cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="space-y-1 max-w-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#011E14] font-bold text-[10px] uppercase border border-[#EDE8E1] group-hover:bg-[#163328] group-hover:text-white transition-colors">
                          {r.target_type}
                        </span>
                        <p className="font-medium text-[#011E14] text-[12px] line-clamp-2">
                          {r.target_content?.caption || r.description || `ID: ${r.target_id.substring(0, 8)}...`}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] font-bold text-[11px]">
                        {r.reason_category}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-[#727974] font-medium">
                      {r.reporter?.email || 'Anonymous'}
                    </td>

                    <td className="py-4 px-6 text-[#727974]">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6">
                      {r.status === 'open' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] font-bold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse"></span>
                          <span>Open</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold text-[11px]">
                          <span>Resolved ({r.action_taken || 'done'})</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      {r.status === 'open' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAction(r.id, 'remove_content')}
                            className="px-3 py-1.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-[11px] transition-colors shadow-2xs active:scale-95"
                          >
                            Remove Content
                          </button>
                          <button
                            onClick={() => handleAction(r.id, 'dismiss')}
                            className="px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5F2ED] text-[#011E14] border border-[#EDE8E1] font-bold text-[11px] transition-colors active:scale-95"
                          >
                            Dismiss
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#727974] italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reported Content Details Popup Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-[#011E14]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EDE8E1] p-6 space-y-6 relative animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE8E1]">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#163328] text-white font-bold text-[11px] uppercase tracking-wider">
                  {selectedReport.target_type}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] font-bold text-[11px]">
                  🚨 {selectedReport.reason_category}
                </span>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EDE8E1] text-[#011E14] flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Report Metadata Info Card */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EDE8E1] space-y-3">
              <h3 className="font-bold text-[#011E14] text-[14px] flex items-center gap-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <span className="material-symbols-outlined text-[18px] text-[#DC2626]">flag</span>
                <span>Report Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#727974] font-medium block">Reported By:</span>
                  <span className="font-bold text-[#011E14]">
                    {selectedReport.reporter?.name
                      ? `${selectedReport.reporter.name} (${selectedReport.reporter.email})`
                      : selectedReport.reporter?.email || 'Anonymous'}
                  </span>
                </div>

                <div>
                  <span className="text-[#727974] font-medium block">Reported On:</span>
                  <span className="font-bold text-[#011E14]">
                    {new Date(selectedReport.created_at).toLocaleString('en-US', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <span className="text-[#727974] font-medium block">Reason / Reporter Notes:</span>
                  <p className="font-medium text-[#011E14] bg-white p-2.5 rounded-xl border border-[#EDE8E1] mt-1 text-[13px] leading-relaxed">
                    {selectedReport.description || 'No additional details submitted.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Target Content Card Preview */}
            <div className="space-y-3">
              <h3 className="font-bold text-[#011E14] text-[14px] flex items-center gap-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <span className="material-symbols-outlined text-[18px] text-[#E8843A]">article</span>
                <span>Reported Content Preview</span>
              </h3>

              {selectedReport.target_content ? (
                <div className="bg-white rounded-2xl border border-[#EDE8E1] p-4 shadow-2xs space-y-4">
                  {/* Author Header */}
                  {selectedReport.target_content.author && (
                    <div className="flex items-center gap-3">
                      {selectedReport.target_content.author.avatar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={selectedReport.target_content.author.avatar}
                          alt={selectedReport.target_content.author.name || 'Author'}
                          className="w-10 h-10 rounded-full object-cover border border-[#EDE8E1]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#E8843A] flex items-center justify-center border border-[#EDE8E1]">
                          <span className="material-symbols-outlined text-[20px]">pets</span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-[#011E14] text-[14px]">
                            {selectedReport.target_content.author.name || 'Pet Profile'}
                          </h4>
                          {selectedReport.target_content.author.breed && (
                            <span className="bg-[#C9EAD9] text-[#163328] px-2 py-0.2 rounded-full text-[10px] font-bold uppercase">
                              {selectedReport.target_content.author.breed}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#727974]">
                          @{selectedReport.target_content.author.username}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Caption / Content Text */}
                  <p className="text-[14px] text-[#011E14] leading-relaxed whitespace-pre-wrap">
                    {selectedReport.target_content.caption || 'No text content available.'}
                  </p>

                  {/* Media Gallery */}
                  {selectedReport.target_content.media_urls &&
                    selectedReport.target_content.media_urls.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {selectedReport.target_content.media_urls.map((url, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl overflow-hidden border border-[#EDE8E1] aspect-video bg-[#FAF7F2]"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`Media ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Content Stats Bar */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#727974] pt-2 border-t border-[#EDE8E1]">
                    <span>❤️ {selectedReport.target_content.like_count ?? 0} Likes</span>
                    <span>💬 {selectedReport.target_content.comment_count ?? 0} Comments</span>
                    {selectedReport.target_content.location_city && (
                      <span>📍 {selectedReport.target_content.location_city}</span>
                    )}
                    {selectedReport.target_content.created_at && (
                      <span>
                        📅 Posted {new Date(selectedReport.target_content.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#EDE8E1] text-center text-[#727974] text-xs">
                  <span className="material-symbols-outlined text-[28px] text-[#887366] block mb-1">
                    info
                  </span>
                  <span>Target content ID ({selectedReport.target_id}) has been removed or is unavailable.</span>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#EDE8E1]">
              <div className="text-xs">
                <span className="text-[#727974] font-medium">Status: </span>
                {selectedReport.status === 'open' ? (
                  <span className="font-bold text-[#DC2626]">Open (Action Pending)</span>
                ) : (
                  <span className="font-bold text-[#15803D]">
                    Resolved ({selectedReport.action_taken || 'done'})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {selectedReport.status === 'open' && (
                  <>
                    <button
                      onClick={() => handleAction(selectedReport.id, 'remove_content')}
                      className="px-4 py-2 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs transition-colors shadow-2xs active:scale-95 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      <span>Remove Content</span>
                    </button>
                    <button
                      onClick={() => handleAction(selectedReport.id, 'dismiss')}
                      className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F5F2ED] text-[#011E14] border border-[#EDE8E1] font-bold text-xs transition-colors active:scale-95 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Dismiss Report</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 rounded-full bg-[#163328] hover:bg-[#011E14] text-white font-bold text-xs transition-colors shadow-2xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
