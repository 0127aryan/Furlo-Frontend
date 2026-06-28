'use client'

import { useState } from 'react'
import Link from 'next/link'

type RecoveryState = 'form' | 'sent'

export default function ForgotPasswordPage() {
  const [state, setState] = useState<RecoveryState>('form')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [resendEnabled, setResendEnabled] = useState(false)
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null)

  const startCountdown = () => {
    setCountdown(60)
    setResendEnabled(false)

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setResendEnabled(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    setTimerRef(interval)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setState('sent')
    startCountdown()
  }

  const handleResend = () => {
    if (!resendEnabled) return
    if (timerRef) clearInterval(timerRef)
    startCountdown()
  }

  const handleGoBack = () => {
    if (timerRef) clearInterval(timerRef)
    setState('form')
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
      style={{ background: '#fef9f3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[8%] right-[4%] w-64 h-64 rounded-full"
          style={{ background: '#ffb688', filter: 'blur(100px)', opacity: 0.3 }}
        />
        <div
          className="absolute bottom-[18%] left-[8%] w-80 h-80 rounded-full"
          style={{ background: '#adcebe', filter: 'blur(120px)', opacity: 0.3 }}
        />
      </div>

      {/* Auth card */}
      <main
        className="w-full max-w-[420px] rounded-[16px] border border-[#dbc1b3] p-6 md:p-8 relative overflow-hidden"
        style={{
          background: '#fef9f3',
          boxShadow: '0 8px 32px rgba(28,35,41,0.08)',
        }}
      >
        {/* ── State A: Form ── */}
        {state === 'form' && (
          <div className="flex flex-col items-center w-full" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
            {/* Go back */}
            <div className="w-full flex justify-start mb-5">
              <Link
                href="/join"
                className="flex items-center gap-1 text-[#476558] hover:text-[#974900] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                <span className="text-[14px] font-medium">Go back</span>
              </Link>
            </div>

            {/* Paw icon */}
            <div
              className="rounded-full p-4 mb-5"
              style={{ background: '#c9ead9' }}
            >
              <span
                className="material-symbols-outlined text-[48px]"
                style={{ color: '#2D4A3E', fontVariationSettings: "'FILL' 1" }}
              >
                pets
              </span>
            </div>

            {/* Headline */}
            <div className="text-center mb-8">
              <h1
                className="text-[22px] font-bold text-[#1d1b18] mb-2"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Forgot your Paw-sword?
              </h1>
              <p className="text-[15px] text-[#554338] leading-relaxed">
                No sweat! Enter your email below and we&apos;ll sniff out a reset link for you.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="recovery-email"
                  className="text-[12px] font-medium text-[#476558] ml-1"
                >
                  Recovery Email
                </label>
                <input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. bark@furlo.com"
                  required
                  className="w-full h-12 px-4 border border-[#dbc1b3] rounded-lg text-[16px] text-[#1d1b18] outline-none transition-all placeholder:text-[#dbc1b3]"
                  style={{ background: '#fff' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#974900'
                    e.target.style.boxShadow = '0 0 0 1px #974900'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#dbc1b3'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <button
                id="btn-send-reset"
                type="submit"
                disabled={loading || !email}
                className="w-full h-[52px] rounded-full flex items-center justify-center text-[18px] font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: '#E8843A', fontFamily: 'Outfit, sans-serif' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Sniffing…
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </div>
        )}

        {/* ── State B: Sent confirmation ── */}
        {state === 'sent' && (
          <div
            className="flex flex-col items-center w-full"
            style={{ animation: 'fadeSlideIn 0.4s ease-out' }}
          >
            {/* Animated paw SVG */}
            <div className="mb-6">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  className="paw-stroke-anim"
                  d="M12 22C12 22 10 19.5 8 18C6 16.5 4 17 4 17C4 17 3 15 4.5 13C6 11 9 11 12 11C15 11 18 11 19.5 13C21 15 20 17 20 17C20 17 18 16.5 16 18C14 19.5 12 22 12 22Z"
                  stroke="#974900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
                <path className="paw-stroke-anim" d="M7 9C8.65685 9 10 7.65685 10 6C10 4.34315 8.65685 3 7 3C5.34315 3 4 4.34315 4 6C4 7.65685 5.34315 9 7 9Z" stroke="#974900" strokeWidth="1.5"/>
                <path className="paw-stroke-anim" d="M17 9C18.6569 9 20 7.65685 20 6C20 4.34315 18.6569 3 17 3C15.3431 3 14 4.34315 14 6C14 7.65685 15.3431 9 17 9Z" stroke="#974900" strokeWidth="1.5"/>
                <path className="paw-stroke-anim" d="M3.5 13C4.32843 13 5 12.3284 5 11.5C5 10.6716 4.32843 10 3.5 10C2.67157 10 2 10.6716 2 11.5C2 12.3284 2.67157 13 3.5 13Z" stroke="#974900" strokeWidth="1.5"/>
                <path className="paw-stroke-anim" d="M20.5 13C21.3284 13 22 12.3284 22 11.5C22 10.6716 21.3284 10 20.5 10C19.6716 10 19 10.6716 19 11.5C19 12.3284 19.6716 13 20.5 13Z" stroke="#974900" strokeWidth="1.5"/>
              </svg>
            </div>

            {/* Text */}
            <div className="text-center mb-8">
              <h1
                className="text-[22px] font-bold text-[#1d1b18] mb-2"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Check your inbox 🐾
              </h1>
              <p className="text-[15px] text-[#554338] leading-relaxed">
                We&apos;ve sent a recovery link to your registered email. Don&apos;t forget to check your spam folder!
              </p>
            </div>

            {/* Resend + back */}
            <div className="w-full flex flex-col items-center gap-6">
              <div className="text-center">
                {!resendEnabled && countdown > 0 && (
                  <p className="text-[13px] text-[#887366] mb-2">
                    Didn&apos;t get it? Resend Email in{' '}
                    <span className="font-bold text-[#974900]">{countdown}</span>s
                  </p>
                )}
                <button
                  id="btn-resend"
                  onClick={handleResend}
                  disabled={!resendEnabled}
                  className="text-[#476558] font-bold text-[14px] transition-all hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Resend Email
                </button>
              </div>

              <div className="pt-6 border-t border-[#dbc1b3] w-full flex justify-center">
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-1 text-[#476558] hover:text-[#974900] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">keyboard_backspace</span>
                  <span className="text-[14px] font-medium">Wrong email? Go back</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Inline animation styles */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawPaw {
          to { stroke-dashoffset: 0; }
        }
        .paw-stroke-anim {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawPaw 2s ease-out forwards;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
