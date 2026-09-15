'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { toast } from '@/lib/toast'

interface CommunityItem {
  id: string
  name: string
  slug: string
  description?: string
  cover_image_url?: string
  banner_url?: string
  avatar_url?: string
  image_url?: string
  location_city?: string
  city?: string
  member_count?: number
  members_count?: number
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  created_at: string
  creator?: {
    id: string
    name: string
    username: string
    profile_image_url: string
    breed?: string
    owner?: {
      id?: string
      email?: string
      role?: string
      status?: string
      created_at?: string
    }
  }
}

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<CommunityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  // Selected Community Details Popup Modal
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityItem | null>(null)

  // Rejection Modal State
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [submittingReject, setSubmittingReject] = useState(false)

  // Track animating out row IDs for 250ms ease-in collapse
  const [collapsingIds, setCollapsingIds] = useState<Record<string, boolean>>({})

  const fetchCommunities = async () => {
    setLoading(true)
    try {
      const res = await apiFetch<{ communities: CommunityItem[] }>('/admin/communities/pending')
      if (res && res.communities) {
        setCommunities(res.communities)
      }
    } catch (err) {
      console.error('[AdminCommunities] Fetch error:', err)
      toast.error('Failed to load communities queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommunities()
  }, [])

  const handleApprove = async (id: string, packName: string) => {
    // 250ms row collapse animation
    setCollapsingIds((prev) => ({ ...prev, [id]: true }))

    setTimeout(async () => {
      try {
        const res = await apiFetch<{ success: boolean; community: CommunityItem }>(
          `/admin/communities/${id}/approve`,
          { method: 'POST' }
        )
        if (res && res.success) {
          toast.success(`Pack "${packName}" approved! 🐾`)
          setCommunities((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: 'approved' } : c))
          )
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to approve pack')
      } finally {
        setCollapsingIds((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
      }
    }, 250)
  }

  const handleOpenRejectModal = (id: string) => {
    setRejectingId(id)
    setRejectionReason('')
  }

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectingId || submittingReject) return

    setSubmittingReject(true)
    const targetId = rejectingId

    // 250ms row collapse animation
    setCollapsingIds((prev) => ({ ...prev, [targetId]: true }))

    try {
      const res = await apiFetch<{ success: boolean; community: CommunityItem }>(
        `/admin/communities/${targetId}/reject`,
        {
          method: 'POST',
          json: { reason: rejectionReason.trim() },
        }
      )

      if (res && res.success) {
        toast.success('Community rejected with feedback')
        setCommunities((prev) =>
          prev.map((c) =>
            c.id === targetId
              ? { ...c, status: 'rejected', rejection_reason: rejectionReason }
              : c
          )
        )
        setRejectingId(null)
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject community')
    } finally {
      setSubmittingReject(false)
      setCollapsingIds((prev) => {
        const next = { ...prev }
        delete next[targetId]
        return next
      })
    }
  }

  const filteredList = communities.filter((c) => {
    if (filter === 'all') return true
    return c.status === filter
  })

  return (
    <div className="space-y-6">
      {/* Title & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-[28px] sm:text-[32px] font-bold text-[#011E14] tracking-tight"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Community Approvals Queue
          </h1>
          <p className="text-xs text-[#727974] mt-1">
            Review new pet packs created by community leads, verify location guidelines, and approve or reject.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#EDE8E1] shadow-2xs">
          {[
            { id: 'pending', label: 'Pending Queue', count: communities.filter((c) => c.status === 'pending').length },
            { id: 'approved', label: 'Approved', count: communities.filter((c) => c.status === 'approved').length },
            { id: 'rejected', label: 'Rejected', count: communities.filter((c) => c.status === 'rejected').length },
            { id: 'all', label: 'All Packs', count: communities.length },
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
                      isActive ? 'bg-[#E8843A] text-white' : 'bg-[#F5F2ED] text-[#727974]'
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

      {/* Main Approvals Table */}
      <div className="bg-white rounded-3xl border border-[#EDE8E1] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#EDE8E1] text-[#727974] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Pack Info</th>
                <th className="py-3.5 px-6">Created By</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6">Members</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE8E1]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#727974]">
                    Loading communities queue...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#727974] space-y-2">
                    <span className="material-symbols-outlined text-[36px] text-[#15803D]">
                      check_circle
                    </span>
                    <p className="font-bold text-[#011E14]">Queue Clear!</p>
                    <p className="text-xs">No communities currently match this filter tab.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((comm) => {
                  const isCollapsing = Boolean(collapsingIds[comm.id])

                  return (
                    <tr
                      key={comm.id}
                      onClick={() => setSelectedCommunity(comm)}
                      style={{
                        transition: 'all 250ms cubic-bezier(0.4, 0, 1, 1)',
                        opacity: isCollapsing ? 0 : 1,
                        maxHeight: isCollapsing ? 0 : '120px',
                        transform: isCollapsing ? 'scaleY(0)' : 'scaleY(1)',
                        overflow: 'hidden',
                      }}
                      className="hover:bg-[#FFFBF7] cursor-pointer transition-colors duration-100 group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#EDE8E1] flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#E8843A] transition-colors">
                            {comm.avatar_url || comm.cover_image_url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={comm.avatar_url || comm.cover_image_url}
                                alt={comm.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-[#E8843A] text-[20px]">
                                groups
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#011E14] text-[13px] group-hover:text-[#E8843A] transition-colors flex items-center gap-1">
                              <span>{comm.name}</span>
                              <span className="material-symbols-outlined text-[14px] text-[#727974] opacity-0 group-hover:opacity-100 transition-opacity">
                                visibility
                              </span>
                            </p>
                            <p className="text-[11px] text-[#727974] line-clamp-1 max-w-xs">
                              {comm.description || `/${comm.slug}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {comm.creator?.profile_image_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={comm.creator.profile_image_url}
                              alt={comm.creator.name}
                              className="w-7 h-7 rounded-full object-cover border border-[#EDE8E1]"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#EDE8E1] flex items-center justify-center text-[#E8843A] text-[12px]">
                              🐾
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-[#011E14] leading-tight">
                              {comm.creator?.name || 'Pet Lead'}
                            </p>
                            <p className="text-[10px] text-[#727974]">
                              {comm.creator?.owner?.email || `@${comm.creator?.username || 'user'}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-[#727974] font-medium">
                        {comm.location_city || comm.city || 'Bangalore'}
                      </td>

                      <td className="py-4 px-6 text-[#011E14] font-bold">
                        {comm.member_count || comm.members_count || 1} members
                      </td>

                      <td className="py-4 px-6">
                        {comm.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#C2410C] font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-pulse"></span>
                            <span>Pending</span>
                          </span>
                        )}
                        {comm.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold text-[11px]">
                            <span>✓ Approved</span>
                          </span>
                        )}
                        {comm.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] font-bold text-[11px]">
                            <span>✗ Rejected</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {comm.status === 'pending' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleApprove(comm.id, comm.name)
                                }}
                                className="px-3 py-1.5 rounded-full bg-[#15803D] hover:bg-[#166534] text-white font-bold text-[11px] transition-all shadow-2xs active:scale-95 flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[14px]">check</span>
                                <span>Approve Pack</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenRejectModal(comm.id)
                                }}
                                className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] font-bold text-[11px] transition-colors active:scale-95 flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                          {comm.status !== 'pending' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedCommunity(comm)
                              }}
                              className="px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5F2ED] text-[#011E14] border border-[#EDE8E1] font-bold text-[11px] transition-colors"
                            >
                              View Details
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Community Details Popup Modal */}
      {selectedCommunity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#EDE8E1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Header Cover Banner */}
            <div className="relative h-36 bg-gradient-to-r from-[#163328] to-[#476457] shrink-0">
              {selectedCommunity.cover_image_url || selectedCommunity.banner_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedCommunity.cover_image_url || selectedCommunity.banner_url}
                  alt={selectedCommunity.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <span className="material-symbols-outlined text-[64px]">groups</span>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedCommunity(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors z-10"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>

              {/* Avatar Overlay */}
              <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-2xl bg-white p-1 shadow-md border border-[#EDE8E1]">
                {selectedCommunity.avatar_url || selectedCommunity.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={selectedCommunity.avatar_url || selectedCommunity.image_url}
                    alt={selectedCommunity.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#E8843A]">
                    <span className="material-symbols-outlined text-[28px]">pets</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 pt-9 overflow-y-auto space-y-6 flex-1 font-sans">
              {/* Title & Status */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    className="text-[22px] font-bold text-[#011E14] leading-tight"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    {selectedCommunity.name}
                  </h3>
                  <p className="text-xs font-bold text-[#E8843A] mt-0.5">
                    /{selectedCommunity.slug}
                  </p>
                </div>

                <div>
                  {selectedCommunity.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEDD5] text-[#C2410C] font-bold text-xs">
                      <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
                      <span>Pending Approval</span>
                    </span>
                  )}
                  {selectedCommunity.status === 'approved' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold text-xs">
                      <span>✓ Approved Pack</span>
                    </span>
                  )}
                  {selectedCommunity.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] font-bold text-xs">
                      <span>✗ Application Rejected</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE8E1] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#727974] tracking-wider">
                  Community Description
                </span>
                <p className="text-xs text-[#011E14] leading-relaxed">
                  {selectedCommunity.description || 'No detailed description provided for this pack application.'}
                </p>
              </div>

              {/* Rejection Banner if rejected */}
              {selectedCommunity.status === 'rejected' && selectedCommunity.rejection_reason && (
                <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] space-y-1 text-xs">
                  <span className="font-bold text-[#DC2626] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <span>Rejection Reason Feedback</span>
                  </span>
                  <p className="text-[#991B1B]">{selectedCommunity.rejection_reason}</p>
                </div>
              )}

              {/* Grid of Community Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Location */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#EDE8E1] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF9F2] text-[#E8843A] flex items-center justify-center shrink-0 border border-[#FDE8D3]">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#727974]">Location / City</p>
                    <p className="font-bold text-[#011E14]">
                      {selectedCommunity.location_city || selectedCommunity.city || 'Bangalore'}
                    </p>
                  </div>
                </div>

                {/* Member Count */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#EDE8E1] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E4F5EB] text-[#166534] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">groups</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#727974]">Total Members</p>
                    <p className="font-bold text-[#011E14]">
                      {selectedCommunity.member_count || selectedCommunity.members_count || 1} members
                    </p>
                  </div>
                </div>

                {/* Created By Pet Lead */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#EDE8E1] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F5F2ED] text-[#011E14] flex items-center justify-center shrink-0 overflow-hidden">
                    {selectedCommunity.creator?.profile_image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={selectedCommunity.creator.profile_image_url}
                        alt={selectedCommunity.creator.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">pets</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-[#727974]">Created By (Pet Lead)</p>
                    <p className="font-bold text-[#011E14] truncate">
                      {selectedCommunity.creator?.name || 'Pet Lead'}
                    </p>
                    <p className="text-[10px] text-[#727974] truncate">
                      @{selectedCommunity.creator?.username || 'user'}
                    </p>
                  </div>
                </div>

                {/* Owner Email */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#EDE8E1] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F5F2ED] text-[#011E14] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-[#727974]">Owner Email</p>
                    <p className="font-bold text-[#011E14] font-mono text-[11px] truncate">
                      {selectedCommunity.creator?.owner?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Submitted Date */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#EDE8E1] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F5F2ED] text-[#727974] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#727974]">Submitted Date</p>
                    <p className="font-bold text-[#011E14]">
                      {new Date(selectedCommunity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Account Role */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#EDE8E1] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F5F2ED] text-[#727974] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#727974]">Account Role</p>
                    <p className="font-bold text-[#011E14] capitalize">
                      {selectedCommunity.creator?.owner?.role || 'User'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 bg-[#FAF7F2] border-t border-[#EDE8E1] flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCommunity(null)}
                className="px-5 py-2 rounded-full bg-white border border-[#EDE8E1] hover:bg-[#F5F2ED] text-[#011E14] text-xs font-bold transition-colors"
              >
                Close Details
              </button>

              {selectedCommunity.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const id = selectedCommunity.id
                      const name = selectedCommunity.name
                      setSelectedCommunity(null)
                      handleApprove(id, name)
                    }}
                    className="px-4 py-2 rounded-full bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-2xs transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Approve Pack</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const id = selectedCommunity.id
                      setSelectedCommunity(null)
                      handleOpenRejectModal(id)
                    }}
                    className="px-4 py-2 rounded-full bg-white hover:bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Community Feedback Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-[#EDE8E1] shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#DC2626] text-[24px]">
                  warning
                </span>
                <h3
                  className="text-[18px] font-bold text-[#011E14]"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Reject Pack Application
                </h3>
              </div>
              <button
                onClick={() => setRejectingId(null)}
                className="text-[#727974] hover:text-[#011E14]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#727974] leading-relaxed">
              Provide feedback for the pack creator on why this community application was not approved.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason (e.g. Duplicate pack name, vague location, or inappropriate description)..."
                rows={3}
                className="w-full p-3 bg-[#FAF7F2] border border-[#EDE8E1] focus:border-[#DC2626] rounded-2xl text-xs text-[#011E14] focus:outline-none transition-colors"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F5F2ED] text-[#011E14] text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReject}
                  className="px-5 py-2 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  {submittingReject ? (
                    <span className="material-symbols-outlined text-[16px] animate-spin">
                      progress_activity
                    </span>
                  ) : (
                    <span>Confirm Rejection</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
