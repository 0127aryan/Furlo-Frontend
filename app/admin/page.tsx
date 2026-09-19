'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { subscribeModerationQueue } from '@/lib/subscribeModerationQueue'

interface StatsData {
  totalUsers: number
  totalPets: number
  totalPosts: number
  totalCommunities: number
  pendingApprovals: number
  openReports: number
}

interface RecentPet {
  id: string
  name: string
  username: string
  breed?: string
  profile_image_url: string
  created_at: string
  owner_id?: string
  email?: string
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalPets: 0,
    totalPosts: 0,
    totalCommunities: 0,
    pendingApprovals: 0,
    openReports: 0,
  })
  const [recentPets, setRecentPets] = useState<RecentPet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    apiFetch<{ stats: StatsData; recentPets: RecentPet[] }>('/admin/stats')
      .then((res) => {
        if (res) {
          if (res.stats) setStats(res.stats)
          if (res.recentPets) setRecentPets(res.recentPets)
        }
      })
      .catch((err) => {
        console.error('[AdminOverview] Fetch error:', err)
      })
      .finally(() => {
        setLoading(false)
      })

    const unsub = subscribeModerationQueue((payload) => {
      if (payload.type === 'report_created') {
        setStats((prev) => (prev ? { ...prev, openReports: prev.openReports + 1 } : prev))
      } else if (payload.type === 'report_action') {
        setStats((prev) => (prev ? { ...prev, openReports: Math.max(0, prev.openReports - 1) } : prev))
      }
    })

    return () => unsub()
  }, [])

  return (
    <div className="space-y-8">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-[28px] sm:text-[32px] font-bold text-[#011E14] tracking-tight"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Platform Overview
          </h1>
          <p className="text-xs text-[#727974] mt-1">
            Real-time platform metrics, pet registrations, and active operations shortcuts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/broadcast"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E8843A] hover:bg-[#974900] text-white text-xs font-bold transition-all shadow-2xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>Broadcast Notification</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Total Users */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#727974] uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#F5F2ED] text-[#011E14] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
          </div>
          <div>
            <div
              className="text-[32px] font-bold text-[#011E14] tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {loading ? '...' : stats.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-[#15803D]">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>Registered Users</span>
            </div>
          </div>
        </div>

        {/* Card 2: Registered Pets */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#727974] uppercase tracking-wider">
              Registered Pets
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FFF9F2] text-[#E8843A] flex items-center justify-center border border-[#FDE8D3]">
              <span className="material-symbols-outlined text-[20px]">pets</span>
            </div>
          </div>
          <div>
            <div
              className="text-[32px] font-bold text-[#011E14] tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {loading ? '...' : stats.totalPets.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-[#887366]">
              <span>Active Pup Profiles</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Barks / Posts */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#727974] uppercase tracking-wider">
              Total Barks / Posts
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#F5F2ED] text-[#011E14] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
            </div>
          </div>
          <div>
            <div
              className="text-[32px] font-bold text-[#011E14] tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {loading ? '...' : stats.totalPosts.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-[#887366]">
              <span>Published content</span>
            </div>
          </div>
        </div>

        {/* Card 4: Active Communities */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#727974] uppercase tracking-wider">
              Active Communities
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#E4F5EB] text-[#166534] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
          </div>
          <div>
            <div
              className="text-[32px] font-bold text-[#011E14] tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {loading ? '...' : stats.totalCommunities.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-[#C2410C]">
              {stats.pendingApprovals > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#E8843A] animate-pulse"></span>
                  <span>{stats.pendingApprovals} Pending Approval</span>
                </>
              ) : (
                <span className="text-[#727974]">All Packs Approved</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 5: Pending Pack Approvals */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#727974] uppercase tracking-wider">
              Pending Pack Approvals
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FFF7ED] text-[#C2410C] flex items-center justify-center border border-[#FFEDD5]">
              <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
            </div>
          </div>
          <div>
            <div
              className="text-[32px] font-bold text-[#011E14] tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {loading ? '...' : stats.pendingApprovals.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-[#C2410C]">
              {stats.pendingApprovals > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#E8843A] animate-pulse"></span>
                  <span>Action Required</span>
                </>
              ) : (
                <span className="text-[#727974]">Queue clear</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 6: Open Moderation Reports */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#727974] uppercase tracking-wider">
              Moderation Reports
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
          </div>
          <div>
            <div
              className="text-[32px] font-bold text-[#011E14] tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {loading ? '...' : stats.openReports.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-[#DC2626]">
              {stats.openReports > 0 ? (
                <span>Action Required</span>
              ) : (
                <span className="text-[#15803D]">Clean Queue</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Panel */}
      <section className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-2xs space-y-4">
        <h2
          className="text-[18px] font-bold text-[#011E14]"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Quick Operations Shortcuts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/communities"
            className="p-5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5F2ED] border border-[#EDE8E1] transition-all group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#E8843A]">groups</span>
                <h3 className="text-xs font-bold text-[#011E14]">Approve Communities</h3>
              </div>
              <p className="text-[11px] text-[#727974]">
                Review queue of pending pet packs submitted by users.
              </p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#727974] group-hover:text-[#011E14] group-hover:translate-x-1 transition-all">
              arrow_forward
            </span>
          </Link>

          <Link
            href="/admin/pets"
            className="p-5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5F2ED] border border-[#EDE8E1] transition-all group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#15803D]">verified</span>
                <h3 className="text-xs font-bold text-[#011E14]">Manage Pet Badges</h3>
              </div>
              <p className="text-[11px] text-[#727974]">
                Issue Verified Checkmarks & Founding Pet crowns.
              </p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#727974] group-hover:text-[#011E14] group-hover:translate-x-1 transition-all">
              arrow_forward
            </span>
          </Link>

          <Link
            href="/admin/banners"
            className="p-5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5F2ED] border border-[#EDE8E1] transition-all group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#011E14]">campaign</span>
                <h3 className="text-xs font-bold text-[#011E14]">Create Announcement</h3>
              </div>
              <p className="text-[11px] text-[#727974]">
                Publish top site-wide announcement banners.
              </p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#727974] group-hover:text-[#011E14] group-hover:translate-x-1 transition-all">
              arrow_forward
            </span>
          </Link>
        </div>
      </section>

      {/* Recent Registrations Table */}
      <section className="bg-white rounded-3xl border border-[#EDE8E1] shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-[#EDE8E1] flex items-center justify-between">
          <div>
            <h2
              className="text-[18px] font-bold text-[#011E14]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Recent Pet Registrations
            </h2>
            <p className="text-xs text-[#727974] mt-0.5">
              Latest pet profiles added to the Furlo network.
            </p>
          </div>

          <Link
            href="/admin/pets"
            className="text-xs font-bold text-[#E8843A] hover:underline inline-flex items-center gap-1"
          >
            <span>View All Directory</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#EDE8E1] text-[#727974] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Pet Profile</th>
                <th className="py-3.5 px-6">Owner Email</th>
                <th className="py-3.5 px-6">Breed</th>
                <th className="py-3.5 px-6">Registered Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE8E1]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#727974]">
                    Loading recent registrations...
                  </td>
                </tr>
              ) : recentPets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#727974]">
                    No recent pet registrations found.
                  </td>
                </tr>
              ) : (
                recentPets.map((pet) => (
                  <tr
                    key={pet.id}
                    className="hover:bg-[#FAF7F2] transition-colors duration-100"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {pet.profile_image_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={pet.profile_image_url}
                            alt={pet.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#EDE8E1]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EDE8E1] flex items-center justify-center text-[#E8843A]">
                            <span className="material-symbols-outlined text-[18px]">pets</span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#011E14] leading-tight">{pet.name}</p>
                          <p className="text-[11px] text-[#727974]">@{pet.username || 'pet'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-[#011E14] font-mono text-[11px]">
                      {pet.email || '—'}
                    </td>

                    <td className="py-4 px-6 text-[#011E14] font-medium">
                      {pet.breed || 'Dog'}
                    </td>

                    <td className="py-4 px-6 text-[#727974]">
                      {new Date(pet.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/pets?search=${encodeURIComponent(pet.name)}`}
                        className="px-3 py-1.5 rounded-full bg-[#F5F2ED] hover:bg-[#EDE8E1] text-[#011E14] font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <span>Manage Badges</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
