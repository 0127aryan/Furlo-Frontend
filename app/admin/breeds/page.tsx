'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

interface PendingApproval {
  id: string
  pet_id: string
  submission_type: 'breed' | 'pet_type' | 'personality_tag'
  pet_type: string
  name: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  pets?: {
    name: string
    username: string
    owner_id: string
  }
}

export default function AdminBreedsPage() {
  const [items, setItems] = useState<PendingApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const fetchApprovals = async () => {
    try {
      setLoading(true)
      const data = await apiFetch<PendingApproval[]>('/admin/pending-breeds')
      setItems(data || [])
    } catch (err: any) {
      console.error('Failed to load pending breeds:', err)
      setError(err.message || 'Failed to load approvals queue.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovals()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      setActionLoadingId(id)
      await apiFetch('/admin/approve-breed', {
        method: 'POST',
        json: { approvalId: id },
      })
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
      )
    } catch (err: any) {
      alert(err.message || 'Failed to approve item.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleReject = async (id: string) => {
    try {
      setActionLoadingId(id)
      await apiFetch('/admin/reject-breed', {
        method: 'POST',
        json: { approvalId: id },
      })
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
      )
    } catch (err: any) {
      alert(err.message || 'Failed to reject item.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true
    return item.status === filter
  })

  const pendingCount = items.filter((i) => i.status === 'pending').length
  const approvedCount = items.filter((i) => i.status === 'approved').length
  const rejectedCount = items.filter((i) => i.status === 'rejected').length

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#fdf8f2', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b"
        style={{
          background: 'rgba(253,248,242,0.95)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(219,193,179,0.3)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[24px]" style={{ color: '#E8843A', fontVariationSettings: "'FILL' 1" }}>
              pets
            </span>
            <span className="font-bold text-[20px]" style={{ fontFamily: 'Outfit, sans-serif', color: '#974900' }}>
              furlo
            </span>
          </Link>
          <span className="h-4 w-px bg-[#dbc1b3]" />
          <span className="text-[14px] font-semibold text-[#476558]">Admin Catalog Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/species"
            className="px-3.5 py-1.5 rounded-lg bg-[#E8843A] text-white text-[13px] font-bold hover:bg-[#974900] transition-colors"
          >
            🐾 Species &amp; Verbs Config
          </Link>

          <button
            onClick={fetchApprovals}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-all hover:bg-white"
            style={{ borderColor: '#ede8e1', color: '#554338' }}
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 flex flex-col gap-6">
        {/* Title */}
        <div>
          <h1 className="text-[26px] font-bold text-[#2D4A3E]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Custom Breed, Species & Personality Tag Approvals
          </h1>
          <p className="text-[14px] text-[#887366] mt-1">
            Review custom breeds, animal types, and personality tags submitted by users during onboarding. Approving adds them to the database catalog.
          </p>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border bg-white flex items-center justify-between" style={{ borderColor: '#ede8e1' }}>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#887366]">Pending Review</p>
              <p className="text-[28px] font-bold text-[#974900] mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {pendingCount}
              </p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#E8843A]">pending_actions</span>
          </div>

          <div className="p-4 rounded-2xl border bg-white flex items-center justify-between" style={{ borderColor: '#ede8e1' }}>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#887366]">Approved</p>
              <p className="text-[28px] font-bold text-[#476558] mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {approvedCount}
              </p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#476558]">check_circle</span>
          </div>

          <div className="p-4 rounded-2xl border bg-white flex items-center justify-between" style={{ borderColor: '#ede8e1' }}>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#887366]">Rejected</p>
              <p className="text-[28px] font-bold text-[#ba1a1a] mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {rejectedCount}
              </p>
            </div>
            <span className="material-symbols-outlined text-[32px] text-[#ba1a1a]">cancel</span>
          </div>
        </div>

        {/* Tabs Filter */}
        <div className="flex border-b border-[#ede8e1] gap-6 text-[14px] font-semibold">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="pb-3 capitalize transition-all relative"
              style={{
                color: filter === tab ? '#974900' : '#887366',
                borderBottom: filter === tab ? '2px solid #974900' : '2px solid transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List of Submissions */}
        {loading ? (
          <div className="p-12 text-center text-[#887366] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[32px] animate-spin">progress_activity</span>
            <p className="text-[14px]">Loading approval submissions...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl border bg-[#fef2f2] border-[#fca5a5] text-[#991b1b]">
            <p className="font-semibold">{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#ede8e1] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[40px] text-[#dbc1b3]">task_alt</span>
            <p className="font-semibold text-[#1d1b18]">No submissions in this view</p>
            <p className="text-[13px] text-[#887366]">New custom breed inputs from onboarding will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredItems.map((item) => {
              const isPending = item.status === 'pending'
              const isApproved = item.status === 'approved'
              const isRejected = item.status === 'rejected'

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  style={{ borderColor: '#ede8e1' }}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                        style={{
                          background:
                            item.submission_type === 'breed'
                              ? 'rgba(232,132,58,0.15)'
                              : item.submission_type === 'pet_type'
                              ? 'rgba(71,101,88,0.15)'
                              : 'rgba(147,51,234,0.15)',
                          color:
                            item.submission_type === 'breed'
                              ? '#974900'
                              : item.submission_type === 'pet_type'
                              ? '#476558'
                              : '#7e22ce',
                        }}
                      >
                        {item.submission_type === 'breed'
                          ? `Breed (${item.pet_type})`
                          : item.submission_type === 'pet_type'
                          ? 'Pet Type'
                          : 'Personality Tag'}
                      </span>

                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                        style={{
                          background: isApproved ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
                          color: isApproved ? '#166534' : isRejected ? '#991b1b' : '#92400e',
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-[18px] font-bold text-[#1d1b18]">{item.name}</h3>

                    {item.pets && (
                      <p className="text-[13px] text-[#887366]">
                        Submitted for pet <strong className="text-[#1d1b18]">{item.pets.name}</strong> (@{item.pets.username})
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        disabled={actionLoadingId === item.id}
                        className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                        style={{ background: '#476558' }}
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        Approve & Add
                      </button>

                      <button
                        onClick={() => handleReject(item.id)}
                        disabled={actionLoadingId === item.id}
                        className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all border hover:bg-[#fef2f2] active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                        style={{ borderColor: '#fca5a5', color: '#991b1b' }}
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
