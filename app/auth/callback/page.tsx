'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'

function AuthCallbackContent() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser, setActivePet } = useAuthStore()

  useEffect(() => {
    let isMounted = true

    async function handleVerification() {
      try {
        const code = searchParams.get('code')
        const tokenHash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        const errorParam = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (errorParam || errorDescription) {
          throw new Error(errorDescription || errorParam || 'Email verification link is invalid or expired.')
        }

        // 1. If code or token_hash parameter is present, call backend callback or check session
        if (code || tokenHash) {
          const endpoint = tokenHash && type
            ? `/auth/callback?token_hash=${encodeURIComponent(tokenHash)}&type=${encodeURIComponent(type)}`
            : `/auth/callback?code=${encodeURIComponent(code || '')}`

          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/backend'
          window.location.href = `${apiBaseUrl}${endpoint}`
          return
        }

        // 2. Check hash fragments if Supabase passed access_token directly in URL hash
        if (typeof window !== 'undefined' && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')

          if (accessToken) {
            const res = await apiFetch('/auth/verify-session', {
              method: 'POST',
              json: { access_token: accessToken, refresh_token: refreshToken },
            })

            if (res.context) {
              setUser(res.context.user)
              setActivePet(res.context.activePet)
            }

            if (isMounted) {
              setStatus('success')
              setTimeout(() => {
                if (res.context?.activePet) {
                  router.push('/feed')
                } else {
                  router.push('/join/select')
                }
              }, 1200)
            }
            return
          }
        }

        // 3. Fallback: check session /me directly
        const meData = await apiFetch('/auth/me')
        if (meData && meData.user) {
          setUser(meData.user)
          setActivePet(meData.activePet)
          if (isMounted) {
            setStatus('success')
            setTimeout(() => {
              if (meData.activePet) {
                router.push('/feed')
              } else {
                router.push('/join/select')
              }
            }, 1200)
          }
        } else {
          throw new Error('Verification session not found. Please log in or request a new confirmation email.')
        }
      } catch (err: any) {
        console.error('[AuthCallback] Error:', err)
        if (isMounted) {
          setStatus('error')
          setErrorMessage(err.message || 'Email verification failed. Please try logging in.')
        }
      }
    }

    handleVerification()

    return () => {
      isMounted = false
    }
  }, [searchParams, router, setUser, setActivePet])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6"
      style={{ background: '#fef9f3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[10%] right-[10%] w-80 h-80 rounded-full"
          style={{ background: '#ffb688', filter: 'blur(120px)', opacity: 0.25 }}
        />
        <div
          className="absolute bottom-[10%] left-[10%] w-96 h-96 rounded-full"
          style={{ background: '#adcebe', filter: 'blur(140px)', opacity: 0.22 }}
        />
      </div>

      {/* Main card */}
      <div
        className="w-full max-w-[440px] rounded-[24px] border p-8 flex flex-col items-center text-center gap-6"
        style={{
          background: '#fef9f3',
          borderColor: '#dbc1b3',
          boxShadow: '0 8px 32px rgba(28,35,41,0.08)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <span
            className="material-symbols-outlined"
            style={{ color: '#E8843A', fontVariationSettings: "'FILL' 1", fontSize: '28px' }}
          >
            pets
          </span>
          <span
            className="text-[24px] font-bold"
            style={{ fontFamily: 'Outfit, sans-serif', color: '#974900' }}
          >
            furlo
          </span>
        </Link>

        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#fff8f3] border border-[#dbc1b3]">
              <span
                className="material-symbols-outlined text-[32px] text-[#974900]"
                style={{ animation: 'spin 1.5s linear infinite' }}
              >
                progress_activity
              </span>
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#1d1b18]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Verifying your email…
              </h1>
              <p className="text-[14px] text-[#554338] mt-1">
                Hold tight while we get your Paw Print ready 🐾
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#ecfdf5] border border-[#a7f3d0]">
              <span
                className="material-symbols-outlined text-[36px] text-[#059669]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#1d1b18]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Email Verified! 🎉
              </h1>
              <p className="text-[14px] text-[#554338] mt-1">
                Taking you to profile setup…
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#fef2f2] border border-[#fca5a5]">
              <span
                className="material-symbols-outlined text-[36px] text-[#dc2626]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                mark_email_unread
              </span>
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#1d1b18]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Verification Link Expired
              </h1>
              <p className="text-[14px] text-[#554338] mt-1 leading-relaxed">
                {errorMessage || 'This verification link is no longer valid or has already been used.'}
              </p>
            </div>

            <Link
              href="/join"
              className="mt-2 w-full py-3 rounded-full text-[15px] font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: '#974900', fontFamily: 'Outfit, sans-serif' }}
            >
              Return to Join Furlo →
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fef9f3] text-[#887366] font-medium text-[14px]">
          Connecting authentication...
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
