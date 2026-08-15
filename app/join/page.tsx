'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'
import { getWebmailInfo } from '@/lib/email-helpers'

type AuthMode = 'signup' | 'signin'

function JoinContent() {
  const searchParams = useSearchParams()
  const modeParam = searchParams.get('mode')
  const [mode, setMode] = useState<AuthMode>(modeParam === 'signup' ? 'signup' : 'signin')

  useEffect(() => {
    if (modeParam === 'signup') {
      setMode('signup')
    } else if (modeParam === 'signin') {
      setMode('signin')
    }
  }, [modeParam])
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verification state
  const [verificationPending, setVerificationPending] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(false)

  const router = useRouter()
  const { setUser, setActivePet, setOnboardingData } = useAuthStore()

  const isSignup = mode === 'signup'
  const webmailInfo = getWebmailInfo(pendingEmail)

  // Poll for verification status every 4 seconds when in verification pending state
  useEffect(() => {
    if (!verificationPending || !pendingEmail) return

    let isMounted = true
    const interval = setInterval(async () => {
      try {
        const res = await apiFetch(`/auth/check-verification?email=${encodeURIComponent(pendingEmail)}`)
        if (isMounted && res.verified) {
          clearInterval(interval)
          let authenticated = false

          // 1. Check if session cookies are established
          try {
            const meRes = await apiFetch('/auth/me')
            if (meRes && meRes.user) {
              setUser(meRes.user)
              setActivePet(meRes.activePet)
              authenticated = true
            }
          } catch (e) {
            console.log('[join] Session update on verify check:', e)
          }

          // 2. Auto-login fallback if cookies were not automatically transferred across tabs
          if (!authenticated) {
            const currentStore = useAuthStore.getState()
            const savedEmail = currentStore.onboardingData?.email || pendingEmail
            const savedPassword = currentStore.onboardingData?.password
            if (savedEmail && savedPassword) {
              try {
                const loginRes = await apiFetch('/auth/login', {
                  method: 'POST',
                  json: { email: savedEmail, password: savedPassword },
                })
                if (loginRes && loginRes.user) {
                  setUser(loginRes.user)
                  setActivePet(loginRes.activePet)
                  authenticated = true
                }
              } catch (loginErr) {
                console.error('[join] Auto-login fallback failed:', loginErr)
              }
            }
          }

          router.push('/join/select')
        }
      } catch (err) {
        // Silent poll error handling
      }
    }, 4000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [verificationPending, pendingEmail, router, setUser, setActivePet])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignup) {
        // Save temp credentials to store
        setOnboardingData({ email, password })

        // Trigger sign-up email check in backend
        const res = await apiFetch('/auth/signup', {
          method: 'POST',
          json: { email, password },
        })

        if (res.requiresVerification || !res.session) {
          setPendingEmail(email)
          setVerificationPending(true)
        } else {
          // Direct login if email verification not required by DB
          if (res.user) {
            setUser(res.user)
          }
          router.push('/join/select')
        }
      } else {
        const res = await apiFetch('/auth/login', {
          method: 'POST',
          json: { email, password },
        })

        setUser(res.user)
        setActivePet(res.activePet)
        if (res.activePet) {
          router.push('/feed')
        } else {
          router.push('/join/select')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleManualCheckVerification = async () => {
    if (!pendingEmail || checkingStatus) return
    setCheckingStatus(true)
    setError(null)

    try {
      const res = await apiFetch(`/auth/check-verification?email=${encodeURIComponent(pendingEmail)}`)
      if (res.verified) {
        try {
          const meRes = await apiFetch('/auth/me')
          if (meRes.user) {
            setUser(meRes.user)
            setActivePet(meRes.activePet)
          }
        } catch (e) {
          console.log('[join] Session me check:', e)
        }
        router.push('/join/select')
      } else {
        setError('Email not confirmed yet. Please check your inbox and click the verification link.')
      }
    } catch (err: any) {
      setError(err.message || 'Could not verify status. Please try clicking the link in your email.')
    } finally {
      setCheckingStatus(false)
    }
  }

  const handleResendEmail = async () => {
    if (!pendingEmail || resendLoading) return
    setResendLoading(true)
    setError(null)
    setResendSuccess(false)

    try {
      await apiFetch('/auth/resend-confirmation', {
        method: 'POST',
        json: { email: pendingEmail },
      })
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 5000)
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email.')
    } finally {
      setResendLoading(false)
    }
  }

  const inputStyle = {
    background: '#fef9f3',
    borderColor: '#dbc1b3',
    color: '#1d1b18',
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#fef9f3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[8%] right-[4%] w-72 h-72 rounded-full"
          style={{ background: '#ffb688', filter: 'blur(110px)', opacity: 0.25 }}
        />
        <div
          className="absolute bottom-[15%] left-[6%] w-80 h-80 rounded-full"
          style={{ background: '#adcebe', filter: 'blur(130px)', opacity: 0.22 }}
        />
      </div>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-6">
        <div
          className="w-full max-w-[440px] rounded-[24px] border overflow-hidden relative transition-all duration-300"
          style={{
            background: '#fef9f3',
            borderColor: '#dbc1b3',
            boxShadow: '0 8px 32px rgba(28,35,41,0.08)',
          }}
        >
          {/* EMAIL VERIFICATION PENDING SCREEN */}
          {verificationPending ? (
            <div className="p-6 md:p-8 flex flex-col gap-6 items-center text-center">
              {/* Header Icon */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#fff8f3] border border-[#dbc1b3] text-[#974900]">
                <span className="material-symbols-outlined text-[32px]">
                  mark_email_unread
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-2">
                <h1
                  className="text-[22px] font-bold text-[#1d1b18]"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Verify your email address 📩
                </h1>
                <p className="text-[14px] text-[#554338] leading-relaxed">
                  We've sent a verification link to{' '}
                  <span className="font-semibold text-[#974900] break-all">{pendingEmail}</span>.
                </p>
                <p className="text-[13px] text-[#887366]">
                  Click the link in your email to unlock your profile creation.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div
                  className="w-full p-3 rounded-xl border flex items-start gap-2 text-[13px] leading-relaxed text-left"
                  style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b' }}
                >
                  <span className="material-symbols-outlined text-[18px] text-[#ef4444] shrink-0">
                    error
                  </span>
                  <span>{error}</span>
                </div>
              )}

              {/* Resend Success Banner */}
              {resendSuccess && (
                <div
                  className="w-full p-3 rounded-xl border flex items-center gap-2 text-[13px] text-left"
                  style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}
                >
                  <span className="material-symbols-outlined text-[18px] text-[#10b981]">
                    check_circle
                  </span>
                  <span>Confirmation link resent! Check your inbox.</span>
                </div>
              )}

              {/* Dynamic Webmail Link CTA */}
              <div className="w-full flex flex-col gap-3">
                <a
                  id="btn-open-webmail"
                  href={webmailInfo.webmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-full text-[15px] font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                  style={{ background: '#974900', fontFamily: 'Outfit, sans-serif' }}
                >
                  <span>Open {webmailInfo.providerName}</span>
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </a>

                {/* Mailto link */}
                <a
                  href={webmailInfo.mailtoUrl}
                  className="text-[13px] text-[#887366] hover:text-[#974900] underline underline-offset-2 transition-colors"
                >
                  Open in desktop email client ↗
                </a>
              </div>

              <div className="w-full h-px" style={{ background: 'rgba(219,193,179,0.5)' }} />

              {/* Check Verification & Resend options */}
              <div className="w-full flex flex-col gap-2.5">
                <button
                  id="btn-check-verified"
                  onClick={handleManualCheckVerification}
                  disabled={checkingStatus}
                  className="w-full py-2.5 rounded-full border border-[#dbc1b3] text-[14px] font-medium text-[#1d1b18] hover:bg-[#f8f3ed] transition-all flex items-center justify-center gap-2"
                >
                  {checkingStatus ? (
                    <>
                      <span className="material-symbols-outlined text-[16px]" style={{ animation: 'spin 1s linear infinite' }}>
                        progress_activity
                      </span>
                      Checking status…
                    </>
                  ) : (
                    <>
                      <span>I've confirmed my email</span>
                      <span className="material-symbols-outlined text-[18px] text-[#974900]">arrow_forward</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[13px] px-1 text-[#554338]">
                  <span>Didn't get the email?</span>
                  <button
                    id="btn-resend"
                    onClick={handleResendEmail}
                    disabled={resendLoading}
                    className="text-[#974900] font-semibold hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? 'Resending…' : 'Resend link'}
                  </button>
                </div>
              </div>

              {/* Return link */}
              <button
                onClick={() => {
                  setVerificationPending(false)
                  setError(null)
                }}
                className="text-[13px] text-[#887366] hover:text-[#1d1b18] transition-colors mt-2"
              >
                ← Use a different email address
              </button>
            </div>
          ) : (
            /* STANDARD SIGNUP / LOGIN FORM */
            <div className="p-6 md:p-8 flex flex-col gap-6">
              {/* Logo + Tabs */}
              <div className="flex flex-col items-center gap-4">
                <Link href="/" className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: '#E8843A', fontVariationSettings: "'FILL' 1", fontSize: '26px' }}
                  >
                    pets
                  </span>
                  <span
                    className="text-[22px] font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif', color: '#974900' }}
                  >
                    furlo
                  </span>
                </Link>

                {/* Tab switcher */}
                <div
                  className="flex w-full rounded-full p-1 border"
                  style={{ background: '#f8f3ed', borderColor: 'rgba(219,193,179,0.3)' }}
                >
                  <button
                    id="tab-signup"
                    onClick={() => { setMode('signup'); setError(null) }}
                    className="flex-1 py-2 rounded-full text-[14px] font-medium transition-all duration-200"
                    style={{
                      background: isSignup ? '#974900' : 'transparent',
                      color: isSignup ? '#fff' : '#554338',
                    }}
                  >
                    New here
                  </button>
                  <button
                    id="tab-signin"
                    onClick={() => { setMode('signin'); setError(null) }}
                    className="flex-1 py-2 rounded-full text-[14px] font-medium transition-all duration-200"
                    style={{
                      background: !isSignup ? '#974900' : 'transparent',
                      color: !isSignup ? '#fff' : '#554338',
                    }}
                  >
                    Pack Member
                  </button>
                </div>
              </div>

              {/* Headline */}
              <div className="text-center">
                <h1
                  className="text-[20px] font-semibold text-[#1d1b18] transition-all duration-300"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {isSignup ? 'Create your Furlo account' : 'Welcome back to Furlo 🐾'}
                </h1>
                <p className="text-[14px] text-[#554338] mt-1">
                  {isSignup ? "Your pet's social life starts here 🐾" : 'Your pack missed you.'}
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div
                  className="p-3.5 rounded-xl border flex items-start gap-2.5 text-[13px] leading-relaxed"
                  style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b' }}
                >
                  <span
                    className="material-symbols-outlined text-[18px] text-[#ef4444]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    error
                  </span>
                  <span className="flex-1 font-medium">{error}</span>
                </div>
              )}

              {/* Google button */}
              <button
                id="btn-google"
                className="flex items-center justify-center gap-4 w-full py-3 px-6 rounded-full border border-[#dbc1b3] hover:bg-[#f8f3ed] transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-[14px] font-medium text-[#1d1b18]">Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-grow" style={{ background: 'rgba(219,193,179,0.5)' }} />
                <span className="text-[11px] font-medium text-[#887366] uppercase tracking-wider">or connect with email</span>
                <div className="h-px flex-grow" style={{ background: 'rgba(219,193,179,0.5)' }} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#476558] ml-1">Email</label>
                  <input
                    id="input-email"
                    type="email"
                    placeholder="alex@furlo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl py-3 px-4 border text-[16px] outline-none transition-all placeholder:text-[#dbc1b3]"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#974900'; e.target.style.boxShadow = '0 0 0 1px #974900' }}
                    onBlur={(e) => { e.target.style.borderColor = '#dbc1b3'; e.target.style.boxShadow = 'none' }}
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#476558] ml-1">Paw-sword</label>
                  <div className="relative">
                    <input
                      id="input-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-xl py-3 px-4 pr-12 border text-[16px] outline-none transition-all placeholder:text-[#dbc1b3]"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#974900'; e.target.style.boxShadow = '0 0 0 1px #974900' }}
                      onBlur={(e) => { e.target.style.borderColor = '#dbc1b3'; e.target.style.boxShadow = 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#dbc1b3] hover:text-[#974900] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {/* Forgot password */}
                  {!isSignup && (
                    <div className="flex justify-end mt-1">
                      <Link
                        href="/forgot-password"
                        className="text-[12px] text-[#974900] hover:underline"
                      >
                        Forgot Paw-sword?
                      </Link>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  id="btn-submit"
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full py-3 rounded-full text-[15px] font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: '#974900', fontFamily: 'Outfit, sans-serif' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]" style={{ animation: 'spin 1s linear infinite' }}>
                        progress_activity
                      </span>
                      {isSignup ? 'Creating account…' : 'Signing in…'}
                    </span>
                  ) : (
                    <span>{isSignup ? 'Join the Pack →' : 'Find Your Pack →'}</span>
                  )}
                </button>
              </form>

              {/* Switch mode */}
              <p className="text-center text-[14px] text-[#554338]">
                {isSignup ? 'Already a Pack Member?' : 'Need to bark first?'}{' '}
                <button
                  id="btn-switch"
                  onClick={() => { setMode(isSignup ? 'signin' : 'signup'); setError(null) }}
                  className="text-[#974900] font-semibold hover:underline ml-1"
                >
                  {isSignup ? 'Find Your Pack' : 'Join the Pack'}
                </button>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="w-full px-4 md:px-6 py-8 flex flex-col md:flex-row justify-between gap-4"
        style={{ background: '#476558', color: '#fff' }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            <span className="text-[20px] font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>furlo</span>
          </div>
          <p className="text-[14px] opacity-80">© 2026 FURLO. Where Pets Belong.</p>
        </div>
        <nav className="flex flex-wrap gap-6 items-center">
          {['The Yard', 'Sniff Around', 'Paw Print', 'Pack Members'].map((item) => (
            <a key={item} href="#" className="text-[14px] opacity-80 hover:opacity-100 transition-opacity">
              {item}
            </a>
          ))}
        </nav>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fef9f3] text-[#887366] font-medium text-[14px]">
          Loading Furlo...
        </div>
      }
    >
      <JoinContent />
    </Suspense>
  )
}
