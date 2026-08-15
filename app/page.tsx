'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import '../components/landing/landing.css'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { CTASection } from '@/components/landing/CTASection'
import { ComingSoonStrip, Footer } from '@/components/landing/Footer'

export default function Home() {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/feed')
    }
  }, [user, router])

  return (
    <div suppressHydrationWarning style={{ background: '#fef9f3', minHeight: '100vh' }}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <ComingSoonStrip />
      <Footer />
    </div>
  )
}
