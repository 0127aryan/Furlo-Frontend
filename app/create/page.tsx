'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/feed/AppSidebar'
import { CreatePostModal } from '@/components/feed/CreatePostModal'
import { apiFetch } from '@/lib/api'
import { getPetSpecies, getPostVerb } from '@/lib/petVerbMap'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from '@/lib/toast'

interface Community {
  id: string
  name: string
}

export default function CreatePage() {
  const router = useRouter()
  const activePet = useAuthStore((s) => s.activePet)
  const verb = getPostVerb(getPetSpecies(activePet)).toLowerCase()
  const [communities, setCommunities] = useState<Community[]>([])

  useEffect(() => {
    apiFetch<Community[]>('/auth/communities')
      .then((data) => {
        if (Array.isArray(data)) setCommunities(data)
      })
      .catch(() => setCommunities([]))
  }, [])

  const leave = () => router.push('/feed')

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#FEF9F3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      <AppSidebar />
      <main className="flex-1 px-0 md:px-6 pt-0 md:pt-6 pb-24 mx-auto w-full">
        <CreatePostModal
          isOpen
          presentation="page"
          communities={communities}
          onClose={leave}
          onSuccess={() => {
            toast.success(`Your ${verb} is in The Yard.`)
            leave()
          }}
        />
      </main>
    </div>
  )
}
