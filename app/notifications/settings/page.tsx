'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppSidebar } from '@/components/feed/AppSidebar'
import { RightSidebar } from '@/components/feed/RightSidebar'
import { apiFetch } from '@/lib/api'
import { toast } from '@/lib/toast'
import {
  getWebPushPermissionStatus,
  isWebPushSupported,
  registerWebPushToken,
  requestWebPushPermission,
  unregisterWebPushToken,
} from '@/lib/webPushNotifications'

interface NotificationSettings {
  master_push_enabled: boolean
  qa_answers_enabled: boolean
  qa_best_answer_enabled: boolean
  treats_enabled: boolean
  comments_enabled: boolean
  followers_enabled: boolean
  pack_announcements_enabled: boolean
  email_digest_enabled: boolean
  quiet_hours_enabled?: boolean
  quiet_hours_start?: string
  quiet_hours_end?: string
  timezone?: string
}

const TIME_OPTIONS = ['21:00', '22:00', '23:00', '07:00', '07:30', '08:00']

const DEFAULT_SETTINGS: NotificationSettings = {
  master_push_enabled: true,
  qa_answers_enabled: true,
  qa_best_answer_enabled: true,
  treats_enabled: true,
  comments_enabled: true,
  followers_enabled: true,
  pack_announcements_enabled: true,
  email_digest_enabled: false,
  quiet_hours_enabled: false,
  quiet_hours_start: '22:00',
  quiet_hours_end: '07:00',
  timezone: 'UTC',
}

function nextTime(current: string) {
  const idx = TIME_OPTIONS.indexOf(current)
  return TIME_OPTIONS[(idx + 1) % TIME_OPTIONS.length]
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS)
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>('default')
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(true)

  useEffect(() => {
    void getWebPushPermissionStatus().then(setPushPermission)

    apiFetch<{ settings: NotificationSettings }>('/notifications/settings')
      .then((res) => {
        if (res && res.settings) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...res.settings,
          })
        }
      })
      .catch((err) => console.error('[NotificationSettings] Fetch error:', err))
  }, [])

  const saveSettingsToBackend = async (updated: NotificationSettings) => {
    setSaving(true)
    setSavedSuccess(false)
    try {
      const payload = {
        ...updated,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      }
      await apiFetch('/notifications/settings', {
        method: 'POST',
        json: payload,
      })
      setSavedSuccess(true)
    } catch {
      toast.error('Failed to auto-save preferences')
    } finally {
      setSaving(false)
    }
  }

  const toggleMasterPush = async () => {
    const nextEnabled = !settings.master_push_enabled
    let updated: NotificationSettings

    if (!nextEnabled) {
      await unregisterWebPushToken()
      updated = {
        master_push_enabled: false,
        qa_answers_enabled: false,
        qa_best_answer_enabled: false,
        treats_enabled: false,
        comments_enabled: false,
        followers_enabled: false,
        pack_announcements_enabled: false,
        email_digest_enabled: settings.email_digest_enabled,
        quiet_hours_enabled: settings.quiet_hours_enabled,
        quiet_hours_start: settings.quiet_hours_start,
        quiet_hours_end: settings.quiet_hours_end,
        timezone: settings.timezone,
      }
    } else {
      if (!isWebPushSupported()) {
        toast.error('Push notifications are not supported in this browser')
        return
      }
      const permission =
        pushPermission === 'granted' ? 'granted' : await requestWebPushPermission()
      setPushPermission(permission)
      if (permission !== 'granted') {
        toast.info('Allow browser notifications to enable push alerts')
        return
      }
      await registerWebPushToken()
      updated = {
        ...DEFAULT_SETTINGS,
        master_push_enabled: true,
        email_digest_enabled: settings.email_digest_enabled,
        quiet_hours_enabled: settings.quiet_hours_enabled,
        quiet_hours_start: settings.quiet_hours_start,
        quiet_hours_end: settings.quiet_hours_end,
        timezone: settings.timezone,
      }
    }

    setSettings(updated)
    await saveSettingsToBackend(updated)
  }

  const toggleSetting = (key: keyof NotificationSettings) => {
    if (key === 'master_push_enabled') {
      void toggleMasterPush()
      return
    }

    setSettings((prev) => {
      const nextValue = !prev[key]
      const updated = { ...prev, [key]: nextValue }
      saveSettingsToBackend(updated)
      return updated
    })
  }

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
    saveSettingsToBackend(DEFAULT_SETTINGS)
    toast.success('Reset to default preferences 🐾')
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#FAF7F2', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      <div className="flex-1 flex justify-center">
        <AppSidebar />

        <main className="flex-1 max-w-[880px] px-4 pt-6 pb-32 space-y-6 mx-auto">
          {/* Top Contextual Navigation & Breadcrumb */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/notifications"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#727974] hover:text-[#011E14] transition-colors py-1 pr-3 rounded-full"
            >
              <span className="w-8 h-8 rounded-full bg-[#F5F2ED] hover:bg-[#EDE8E1] flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </span>
              <span>Back to Notifications</span>
            </Link>
          </div>

          {/* Header Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E8843A] uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Account & Pack Alerts</span>
            </div>
            <h1
              className="text-[28px] sm:text-[32px] font-bold text-[#011E14] tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Notification Preferences
            </h1>
            <p className="text-xs sm:text-[13px] text-[#727974] leading-relaxed max-w-2xl">
              Choose how and when Furlo keeps you and your pack informed across local community updates, vet advice, and playdates.
            </p>
          </div>

          {/* Master Push Highlight Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9F2] via-[#FEF3E2] to-[#FCEAD2] p-6 sm:p-7 shadow-xs">
            {/* Decorative Organic Paw Watermark */}
            <div className="absolute -right-8 -bottom-10 pointer-events-none opacity-10">
              <svg className="text-[#E8843A]" fill="currentColor" height="200" viewBox="0 0 100 100" width="200">
                <circle cx="28" cy="32" r="10" />
                <circle cx="50" cy="22" r="10.5" />
                <circle cx="72" cy="32" r="10" />
                <circle cx="16" cy="52" r="8" />
                <path d="M50 44 C34 44 26 58 26 72 C26 84 38 88 50 88 C62 88 74 84 74 72 C74 58 66 44 50 44 Z" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                {/* Illustrated Icon Badge */}
                <div className="relative w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-[#E8843A] shrink-0">
                  <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    notifications_active
                  </span>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#E8843A] items-center justify-center text-[9px] text-white font-bold">
                      ✓
                    </span>
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[17px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Push Notifications
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#476457] text-[11px] font-bold shadow-2xs">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          settings.master_push_enabled && pushPermission === 'granted'
                            ? 'bg-[#476457]'
                            : 'bg-[#C1C8C3]'
                        }`}
                      />
                      {settings.master_push_enabled && pushPermission === 'granted'
                        ? 'Active on this browser'
                        : pushPermission === 'denied'
                          ? 'Blocked in browser settings'
                          : 'Not enabled on this browser'}
                    </span>
                  </div>
                  <p className="text-xs text-[#727974] leading-relaxed max-w-lg">
                    Stay in the loop with your Pack — receive real-time alerts on treats, answers from verified parents, and playgroup invitations.
                  </p>
                </div>
              </div>

              {/* Master Switch Control */}
              <div className="shrink-0 flex items-center justify-between sm:justify-end">
                <span className="text-xs font-bold text-[#727974] sm:hidden">Master alerts</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.master_push_enabled}
                  onClick={() => toggleSetting('master_push_enabled')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.master_push_enabled ? 'bg-[#E8843A]' : 'bg-[#C1C8C3]'
                  }`}
                >
                  <span
                    className={`inline-block h-7 w-7 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-out ${
                      settings.master_push_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Granular Preference Cards */}
          <div className="space-y-6">
            {/* SECTION 1: Q&A & Advice */}
            <section className="rounded-3xl bg-white border border-[#EDE8E1] p-6 shadow-2xs space-y-4">
              <div className="flex items-start gap-3 pb-2 border-b border-[#EDE8E1]">
                <div className="w-10 h-10 rounded-2xl bg-[#F5F2ED] flex items-center justify-center text-[#011E14] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Q&A & Advice
                  </h2>
                  <p className="text-xs text-[#727974]">
                    Stay updated on pet care discussions, emergency remedies, and questions you follow.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Row 1A */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5F2ED] transition-colors">
                  <div className="space-y-0.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[13px] text-[#011E14]">Answers to your questions</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#E8843A]/10 text-[#E8843A] text-[10px] font-bold">
                        High Priority
                      </span>
                    </div>
                    <p className="text-xs text-[#727974]">
                      Get notified when another pet parent or verified veterinary professional answers your queries.
                    </p>
                  </div>

                  <ToggleSwitch
                    checked={settings.qa_answers_enabled}
                    onChange={() => toggleSetting('qa_answers_enabled')}
                  />
                </div>

                {/* Row 1B */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5F2ED] transition-colors">
                  <div className="space-y-0.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[13px] text-[#011E14]">When your answer is marked Best Answer</span>
                      <span className="material-symbols-outlined text-[16px] text-[#15803D]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        stars
                      </span>
                    </div>
                    <p className="text-xs text-[#727974]">
                      Celebrated with a verified green star badge and community pet karma recognition points.
                    </p>
                  </div>

                  <ToggleSwitch
                    checked={settings.qa_best_answer_enabled}
                    onChange={() => toggleSetting('qa_best_answer_enabled')}
                  />
                </div>
              </div>
            </section>

            {/* SECTION 2: Interactions & Treats */}
            <section className="rounded-3xl bg-white border border-[#EDE8E1] p-6 shadow-2xs space-y-4">
              <div className="flex items-start gap-3 pb-2 border-b border-[#EDE8E1]">
                <div className="w-10 h-10 rounded-2xl bg-[#FFDBC7] flex items-center justify-center text-[#974900] shrink-0">
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    pets
                  </span>
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Interactions & Treats
                  </h2>
                  <p className="text-xs text-[#727974]">
                    Warm appreciation, comments, and replies on your pet’s photos, logs, and memories.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Row 2A */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5F2ED] transition-colors">
                  <div className="space-y-0.5 max-w-xl">
                    <span className="font-bold text-[13px] text-[#011E14]">Treats (Likes) on your posts</span>
                    <p className="text-xs text-[#727974]">
                      Alerts when community members and fellow pet owners send treats to your pet’s timeline.
                    </p>
                  </div>

                  <ToggleSwitch
                    checked={settings.treats_enabled}
                    onChange={() => toggleSetting('treats_enabled')}
                  />
                </div>

                {/* Row 2B */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5F2ED] transition-colors">
                  <div className="space-y-0.5 max-w-xl">
                    <span className="font-bold text-[13px] text-[#011E14]">Comments & Replies</span>
                    <p className="text-xs text-[#727974]">
                      Direct conversations, replies, and photo threads started beneath your shared updates.
                    </p>
                  </div>

                  <ToggleSwitch
                    checked={settings.comments_enabled}
                    onChange={() => toggleSetting('comments_enabled')}
                  />
                </div>
              </div>
            </section>

            {/* SECTION 3: Pack & Followers */}
            <section className="rounded-3xl bg-white border border-[#EDE8E1] p-6 shadow-2xs space-y-4">
              <div className="flex items-start gap-3 pb-2 border-b border-[#EDE8E1]">
                <div className="w-10 h-10 rounded-2xl bg-[#C9EAD9] flex items-center justify-center text-[#163328] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">diversity_2</span>
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Pack & Followers
                  </h2>
                  <p className="text-xs text-[#727974]">
                    Local neighborhood pack alerts, playgroup invitations, and new canine buddies.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Row 3A */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5F2ED] transition-colors">
                  <div className="space-y-0.5 max-w-xl">
                    <span className="font-bold text-[13px] text-[#011E14]">New followers & wags</span>
                    <p className="text-xs text-[#727974]">
                      When nearby pet owners follow your pack or send a greeting wag to initiate contact.
                    </p>
                  </div>

                  <ToggleSwitch
                    checked={settings.followers_enabled}
                    onChange={() => toggleSetting('followers_enabled')}
                  />
                </div>

                {/* Row 3B */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5F2ED] transition-colors">
                  <div className="space-y-0.5 max-w-xl">
                    <span className="font-bold text-[13px] text-[#011E14]">Pack announcements</span>
                    <p className="text-xs text-[#727974]">
                      Official pack alerts, weekend meetup times at the dog park, and organizer notices.
                    </p>
                  </div>

                  <ToggleSwitch
                    checked={settings.pack_announcements_enabled}
                    onChange={() => toggleSetting('pack_announcements_enabled')}
                  />
                </div>
              </div>
            </section>

            {/* SECTION 4: Email Digest */}
            <section className="rounded-3xl bg-white border border-[#EDE8E1] p-6 shadow-2xs space-y-4">
              <div className="flex items-start gap-3 pb-2 border-b border-[#EDE8E1]">
                <div className="w-10 h-10 rounded-2xl bg-[#F5F2ED] flex items-center justify-center text-[#011E14] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">mark_email_read</span>
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Email Digest
                  </h2>
                  <p className="text-xs text-[#727974]">
                    Curated weekly recaps and thoughtful reading delivered straight to your inbox.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5F2ED] transition-colors">
                  <div className="space-y-0.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[13px] text-[#011E14]">Weekly Pet Care Digest & Q&A Highlights</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#E5E2DD] text-[#727974] text-[10px] font-bold">
                        Sundays
                      </span>
                    </div>
                    <p className="text-xs text-[#727974]">
                      A calm summary of top discussions, seasonal vet tips, and local pack highlights from your neighborhood.
                    </p>
                  </div>

                  <ToggleSwitch
                    checked={settings.email_digest_enabled}
                    onChange={() => toggleSetting('email_digest_enabled')}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Quiet Hours */}
          <section className="rounded-3xl bg-white border border-[#EDE8E1] p-6 shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F5F2ED] flex items-center justify-center text-[#476457] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">bedtime</span>
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Paws & Rest Quiet Hours
                  </h2>
                  <p className="text-xs text-[#727974]">
                    Silence non-urgent push alerts during rest time. In-app notifications still arrive.
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={Boolean(settings.quiet_hours_enabled)}
                onChange={() => {
                  const updated = {
                    ...settings,
                    quiet_hours_enabled: !settings.quiet_hours_enabled,
                  }
                  setSettings(updated)
                  saveSettingsToBackend(updated)
                }}
              />
            </div>

            {settings.quiet_hours_enabled ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...settings,
                      quiet_hours_start: nextTime(settings.quiet_hours_start || '22:00'),
                    }
                    setSettings(updated)
                    saveSettingsToBackend(updated)
                  }}
                  className="rounded-2xl border border-[#EDE8E1] bg-[#FAF7F2] px-4 py-3 text-left"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#727974]">Start</p>
                  <p className="text-[15px] font-bold text-[#011E14]">{settings.quiet_hours_start || '22:00'}</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...settings,
                      quiet_hours_end: nextTime(settings.quiet_hours_end || '07:00'),
                    }
                    setSettings(updated)
                    saveSettingsToBackend(updated)
                  }}
                  className="rounded-2xl border border-[#EDE8E1] bg-[#FAF7F2] px-4 py-3 text-left"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#727974]">End</p>
                  <p className="text-[15px] font-bold text-[#011E14]">{settings.quiet_hours_end || '07:00'}</p>
                </button>
              </div>
            ) : null}
          </section>

          {/* Sticky Bottom Auto-Save Status Bar */}
          <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EDE8E1] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#476457]">
              {saving ? (
                <>
                  <span className="material-symbols-outlined text-[18px] text-[#E8843A] animate-spin">
                    sync
                  </span>
                  <span className="text-[#011E14]">Saving changes...</span>
                </>
              ) : savedSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[18px] text-[#476457]">
                    check_circle
                  </span>
                  <span>Preferences auto-saved to cloud</span>
                </>
              ) : null}
            </div>

            <button
              onClick={handleResetDefaults}
              className="text-xs font-bold text-[#727974] hover:text-[#011E14] transition-colors"
            >
              Reset to default recommendations
            </button>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  )
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ease-in-out shrink-0 focus:outline-none ${
        checked ? 'bg-[#E8843A]' : 'bg-[#C1C8C3]'
      }`}
    >
      <span
        className={`inline-block h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-out ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
