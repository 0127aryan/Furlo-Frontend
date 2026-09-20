'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { toast } from '@/lib/toast'
import { PAGE_SIZE } from '@/lib/pagination'
import { AdminPager } from '@/components/ui/AdminPager'

interface BroadcastHistoryItem {
  id: string
  title: string
  body: string
  linkUrl?: string
  targetAudience?: string
  recipientCount: number
  created_at: string
}

export default function AdminBroadcastPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [targetAudience, setTargetAudience] = useState('all')

  // History State
  const [history, setHistory] = useState<BroadcastHistoryItem[]>([])
  const [historyPage, setHistoryPage] = useState(1)
  const [historyTotal, setHistoryTotal] = useState(0)
  const [loadingHistory, setLoadingHistory] = useState(true)

  // Modal & Loading State
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [sending, setSending] = useState(false)

  const fetchHistory = async () => {
    setLoadingHistory(true)
    try {
      const res = await apiFetch<{ history: BroadcastHistoryItem[]; totalCount?: number }>(
        `/admin/broadcast/history?page=${historyPage}&limit=${PAGE_SIZE}`
      )
      if (res && res.history) {
        setHistory(res.history)
        setHistoryTotal(res.totalCount || 0)
      }
    } catch (err) {
      console.error('[AdminBroadcast] History fetch error:', err)
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [historyPage])

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) {
      toast.error('Title and Body are required for broadcast')
      return
    }
    setShowConfirmModal(true)
  }

  const handleExecuteBroadcast = async () => {
    if (sending) return
    setSending(true)

    try {
      const res = await apiFetch<{ success: boolean; recipientCount: number; message: string }>(
        '/admin/broadcast',
        {
          method: 'POST',
          json: {
            title: title.trim(),
            body: body.trim(),
            linkUrl: linkUrl.trim(),
            targetAudience,
          },
        }
      )

      if (res && res.success) {
        toast.success(`Broadcast sent to ${res.recipientCount.toLocaleString()} pet parents! 🚀`)
        setShowConfirmModal(false)
        setTitle('')
        setBody('')
        setLinkUrl('')
        fetchHistory()
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send broadcast notification')
    } finally {
      setSending(false)
    }
  }

  const handleRevokeBroadcast = async (id: string, broadcastTitle: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))

    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/admin/broadcast/${id}`,
        { method: 'DELETE' }
      )
      if (res && res.success) {
        toast.success(`Broadcast "${broadcastTitle}" revoked from user inboxes 🗑️`)
      }
    } catch (err: any) {
      fetchHistory()
      toast.error(err?.message || 'Failed to revoke broadcast')
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title Bar */}
      <div>
        <h1
          className="text-[28px] sm:text-[32px] font-bold text-[#011E14] tracking-tight"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Platform Notification Broadcast
        </h1>
        <p className="text-xs text-[#727974] mt-1">
          Send real-time platform-wide in-app activity notifications and mobile push alerts to registered pet parents.
        </p>
      </div>

      {/* Broadcast Composer Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#EDE8E1]">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF9F2] text-[#E8843A] flex items-center justify-center border border-[#FDE8D3]">
            <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
          </div>
          <div>
            <h2
              className="text-[18px] font-bold text-[#011E14]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Broadcast Composer
            </h2>
            <p className="text-xs text-[#727974]">
              Notifications are fanout to all active user activity feeds instantly.
            </p>
          </div>
        </div>

        <form onSubmit={handleOpenConfirm} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#011E14] mb-1.5">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ⭐ Community Q&A Advice Hub is Live!"
              required
              className="w-full h-11 px-4 bg-[#FAF7F2] border border-[#EDE8E1] focus:border-[#E8843A] rounded-2xl text-xs text-[#011E14] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#011E14] mb-1.5">
              Notification Body Text
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="e.g. Have puppy health, diet, or behavior questions? Ask experienced pet parents and vet techs now in the Q&A Hub."
              rows={4}
              required
              className="w-full p-4 bg-[#FAF7F2] border border-[#EDE8E1] focus:border-[#E8843A] rounded-2xl text-xs text-[#011E14] focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#011E14] mb-1.5">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full h-11 px-4 bg-[#FAF7F2] border border-[#EDE8E1] focus:border-[#E8843A] rounded-2xl text-xs text-[#011E14] focus:outline-none transition-colors font-medium"
              >
                <option value="all">All Users (Platform-Wide)</option>
                <option value="pet_parents">All Pet Parents</option>
                <option value="pet_lovers">All Pet Lovers</option>
                <option value="founding_pets">Founding Pets Only</option>
                <option value="verified_pets">Verified Pets Only</option>
                <option value="unverified_pets">Unverified Pets Only</option>
                <option value="non_founding_pets">Non Founding Pets Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#011E14] mb-1.5">
                Action Link URL (Optional)
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="e.g. /qa or /packs"
                className="w-full h-11 px-4 bg-[#FAF7F2] border border-[#EDE8E1] focus:border-[#E8843A] rounded-2xl text-xs text-[#011E14] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!title.trim() || !body.trim()}
              className={`w-full h-12 bg-[#E8843A] hover:bg-[#974900] text-white font-bold text-xs rounded-full transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 ${
                !title.trim() || !body.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Send Broadcast Notification 🚀</span>
            </button>
          </div>
        </form>
      </section>

      {/* Broadcast History & Revoke Table */}
      <section className="bg-white rounded-3xl border border-[#EDE8E1] shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-[#EDE8E1] flex items-center justify-between">
          <div>
            <h2
              className="text-[18px] font-bold text-[#011E14]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Recent Sent Broadcasts
            </h2>
            <p className="text-xs text-[#727974] mt-0.5">
              Review sent platform notifications and revoke/pull notifications sent by error.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EDE8E1] text-[11px] font-bold text-[#727974]">
            {history.length} {history.length === 1 ? 'broadcast' : 'broadcasts'}
          </span>
        </div>

        <div className="divide-y divide-[#EDE8E1]">
          {loadingHistory ? (
            <div className="p-12 text-center text-[#727974] text-xs font-bold">
              Loading broadcast history...
            </div>
          ) : history.length === 0 ? (
            <div className="p-12 text-center text-[#727974] text-xs font-bold">
              No platform broadcasts sent yet.
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="p-5 hover:bg-[#FAF7F2] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#FFF9F2] text-[#E8843A] border border-[#FDE8D3] font-bold text-[10px]">
                      🚀 Broadcast
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#476457] border border-[#EDE8E1] font-bold text-[10px] capitalize">
                      🎯 Audience: {item.targetAudience?.replace(/_/g, ' ') || 'All Users'}
                    </span>
                    <span className="text-[#727974] text-[11px]">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                    <span className="text-[#15803D] font-bold text-[10px] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                      Sent to {item.recipientCount.toLocaleString()} inboxes
                    </span>
                  </div>
                  <p className="font-bold text-[#011E14] text-[13px]">{item.title}</p>
                  <p className="text-[#727974] line-clamp-2">{item.body}</p>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => handleRevokeBroadcast(item.id, item.title)}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] text-[11px] font-bold transition-colors active:scale-95 flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">remove_done</span>
                    <span>Revoke / Pull Notification</span>
                  </button>
                </div>
              </div>
            ))
          )}
          <div className="px-4 pb-4">
            <AdminPager page={historyPage} totalCount={historyTotal} onPage={setHistoryPage} />
          </div>
        </div>
      </section>

      {/* Weighty Broadcast Confirmation Modal (Motion Spec #4) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EDE8E1] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#FFF9F2] text-[#E8843A] border border-[#FDE8D3] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">campaign</span>
            </div>

            <div className="text-center space-y-2">
              <h3
                className="text-[20px] font-bold text-[#011E14]"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Confirm Platform Broadcast
              </h3>
              <p className="text-xs text-[#727974] leading-relaxed">
                You are about to fanout this notification to all registered pet parents across the platform.
              </p>
            </div>

            {/* Notification Preview Card */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE8E1] space-y-1 text-xs text-left">
              <p className="font-bold text-[#011E14]">{title}</p>
              <p className="text-[#727974] leading-normal">{body}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={sending}
                className="px-5 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5F2ED] text-[#011E14] text-xs font-bold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteBroadcast}
                disabled={sending}
                className="px-6 py-2.5 rounded-full bg-[#E8843A] hover:bg-[#974900] text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 min-w-[140px] justify-center"
              >
                {sending ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Confirm & Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
