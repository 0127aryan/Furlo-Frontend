'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { toast } from '@/lib/toast'
import { PAGE_SIZE } from '@/lib/pagination'
import { AdminPager } from '@/components/ui/AdminPager'

interface BannerItem {
  id: string
  text: string
  link_url?: string
  cta_text?: string
  style_type: 'orange' | 'emerald' | 'amber'
  is_active: boolean
  created_at: string
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [text, setText] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [ctaText, setCtaText] = useState('View Details')
  const [styleType, setStyleType] = useState<'orange' | 'emerald' | 'amber'>('orange')
  const [isActive, setIsActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const res = await apiFetch<{ banners: BannerItem[]; totalCount?: number }>(
        `/admin/banners?page=${page}&limit=${PAGE_SIZE}`,
      )
      if (res && res.banners) {
        setBanners(res.banners)
        setTotalCount(res.totalCount || 0)
      }
    } catch (err) {
      console.error('[AdminBanners] Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [page])

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || submitting) return

    setSubmitting(true)
    try {
      const res = await apiFetch<{ success: boolean; banner: BannerItem }>('/admin/banners', {
        method: 'POST',
        json: {
          text: text.trim(),
          linkUrl: linkUrl.trim(),
          ctaText: ctaText.trim() || 'View Details',
          styleType,
          isActive,
        },
      })

      if (res && res.banner) {
        toast.success('Announcement banner published! 📢')
        setBanners((prev) => [res.banner, ...prev])
        setText('')
        setLinkUrl('')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create banner')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleBanner = async (id: string, currentActive: boolean) => {
    const nextActive = !currentActive
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_active: nextActive } : b))
    )

    try {
      const res = await apiFetch<{ success: boolean; banner: BannerItem }>(
        `/admin/banners/${id}/toggle`,
        {
          method: 'POST',
          json: { isActive: nextActive },
        }
      )
      if (res && res.success) {
        toast.success(nextActive ? 'Banner activated ✓' : 'Banner deactivated')
      }
    } catch (err: any) {
      setBanners((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_active: currentActive } : b))
      )
      toast.error(err?.message || 'Failed to toggle banner status')
    }
  }

  const handleDeleteBanner = async (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id))

    try {
      const res = await apiFetch<{ success: boolean }>(`/admin/banners/${id}`, {
        method: 'DELETE',
      })
      if (res && res.success) {
        toast.success('Announcement banner removed 🗑️')
      }
    } catch (err: any) {
      fetchBanners()
      toast.error(err?.message || 'Failed to delete banner')
    }
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1
          className="text-[28px] sm:text-[32px] font-bold text-[#011E14] tracking-tight"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Global Announcement Banners
        </h1>
        <p className="text-xs text-[#727974] mt-1">
          Configure site-wide top announcement banners for events, community alerts, and platform news.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Form & Live Preview */}
        <div className="space-y-6">
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EDE8E1] shadow-2xs space-y-6">
            <h2
              className="text-[18px] font-bold text-[#011E14]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Create New Banner
            </h2>

            <form onSubmit={handleCreateBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#011E14] mb-1.5">
                  Banner Text Announcement
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. 🐾 Bangalore Off-Leash Dog Social this Saturday at Cubbon Park!"
                  required
                  className="w-full h-11 px-4 bg-[#FAF7F2] border border-[#EDE8E1] focus:border-[#E8843A] rounded-2xl text-xs text-[#011E14] focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#011E14] mb-1.5">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Register Now"
                    className="w-full h-11 px-4 bg-[#FAF7F2] border border-[#EDE8E1] focus:border-[#E8843A] rounded-2xl text-xs text-[#011E14] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#011E14] mb-1.5">
                    Action Link URL
                  </label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="e.g. /c/bangalore-dogs or https://..."
                    className="w-full h-11 px-4 bg-[#FAF7F2] border border-[#EDE8E1] focus:border-[#E8843A] rounded-2xl text-xs text-[#011E14] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Style Type Picker */}
              <div>
                <label className="block text-xs font-bold text-[#011E14] mb-2">
                  Banner Style Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'orange', label: 'Terracotta', bg: 'bg-[#E8843A]' },
                    { id: 'emerald', label: 'Forest Green', bg: 'bg-[#163328]' },
                    { id: 'amber', label: 'Amber Alert', bg: 'bg-[#D97706]' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setStyleType(style.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                        styleType === style.id
                          ? 'border-[#011E14] bg-[#FAF7F2] ring-2 ring-[#011E14]/10'
                          : 'border-[#EDE8E1] bg-white hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span>{style.label}</span>
                      <span className={`w-3.5 h-3.5 rounded-full ${style.bg}`} />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className={`w-full h-11 bg-[#E8843A] hover:bg-[#974900] text-white font-bold text-xs rounded-full transition-colors shadow-xs flex items-center justify-center gap-2 ${
                  submitting || !text.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">campaign</span>
                    <span>Publish Banner 📢</span>
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Live Preview Card */}
          <section className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-[#727974] uppercase tracking-wider">
              Live Mockup Preview
            </h3>

            <div
              className={`p-4 rounded-2xl text-white flex items-center justify-between shadow-2xs transition-all ${
                styleType === 'orange'
                  ? 'bg-[#E8843A]'
                  : styleType === 'emerald'
                  ? 'bg-[#163328]'
                  : 'bg-[#D97706]'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">campaign</span>
                <span>{text || 'Your announcement banner text will render here.'}</span>
              </div>

              <span className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] whitespace-nowrap">
                {ctaText || 'View Details'} →
              </span>
            </div>
          </section>
        </div>

        {/* Right Column: Existing Banners List */}
        <section className="bg-white rounded-3xl border border-[#EDE8E1] shadow-2xs overflow-hidden h-fit">
          <div className="p-6 border-b border-[#EDE8E1] flex items-center justify-between">
            <h2
              className="text-[18px] font-bold text-[#011E14]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Active Announcement History
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EDE8E1] text-[11px] font-bold text-[#727974]">
              {banners.length} {banners.length === 1 ? 'banner' : 'banners'}
            </span>
          </div>

          <div className="divide-y divide-[#EDE8E1]">
            {loading ? (
              <div className="p-12 text-center text-[#727974] text-xs font-bold">
                Loading banners list...
              </div>
            ) : banners.length === 0 ? (
              <div className="p-12 text-center text-[#727974] text-xs font-bold">
                No announcement banners created yet.
              </div>
            ) : (
              banners.map((b) => (
                <div key={b.id} className="p-5 hover:bg-[#FAF7F2] transition-colors space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] text-white uppercase ${
                          b.style_type === 'orange'
                            ? 'bg-[#E8843A]'
                            : b.style_type === 'emerald'
                            ? 'bg-[#163328]'
                            : 'bg-[#D97706]'
                        }`}
                      >
                        {b.style_type}
                      </span>
                      {b.is_active ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold text-[10px]">
                          ✓ Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EDE8E1] text-[#727974] font-medium text-[10px]">
                          Inactive
                        </span>
                      )}
                    </div>

                    <span className="text-[#727974] text-[11px]">
                      {new Date(b.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="font-bold text-[#011E14] text-[13px]">{b.text}</p>
                  {b.link_url && (
                    <p className="text-[11px] text-[#727974]">Link: {b.link_url}</p>
                  )}

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#EDE8E1]/60">
                    <button
                      onClick={() => handleToggleBanner(b.id, b.is_active)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all active:scale-95 border ${
                        b.is_active
                          ? 'bg-white border-[#EDE8E1] text-[#727974] hover:bg-[#FAF7F2]'
                          : 'bg-[#15803D] border-[#15803D] text-white hover:bg-[#166534]'
                      }`}
                    >
                      {b.is_active ? 'Deactivate' : 'Activate ✓'}
                    </button>

                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="px-3 py-1 rounded-full bg-white hover:bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] text-[11px] font-bold transition-colors active:scale-95 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      <span>Remove Banner</span>
                    </button>
                  </div>
                </div>
              ))
            )}
            <AdminPager page={page} totalCount={totalCount} onPage={setPage} />
          </div>
        </section>
      </div>
    </div>
  )
}
