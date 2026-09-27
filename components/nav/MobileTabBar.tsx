'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { getPetSpecies, getPostVerb } from '@/lib/petVerbMap'
import { isOwnProfilePath, ownProfileHref, showsMobileTabBar } from '@/lib/mobileNav'

export function MobileTabBar() {
  const pathname = usePathname() || ''
  const { activePet, user } = useAuthStore()
  const verb = getPostVerb(getPetSpecies(activePet))
  const profileHref = ownProfileHref(activePet, user?.id)

  if (!showsMobileTabBar(pathname, activePet, user?.id)) return null

  const items = [
    { label: 'The Yard', href: '/feed', icon: 'home', match: (path: string) => path === '/feed' },
    { label: 'Discover Packs', href: '/packs', icon: 'groups', match: (path: string) => path.startsWith('/packs') },
    { label: `Post ${verb}`, href: '/create', icon: 'add_circle', match: (path: string) => path === '/create' },
    { label: 'Q&A', href: '/qa', icon: 'help', match: (path: string) => path === '/qa' },
    {
      label: 'My Paw Print',
      href: profileHref,
      icon: 'person',
      match: (path: string) => isOwnProfilePath(path, activePet, user?.id),
    },
  ]

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#dbc1b3] bg-[#fef9f3] pb-[env(safe-area-inset-bottom)]"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      <ul className="grid grid-cols-5 min-h-[52px]">
        {items.map((item) => {
          const active = item.match(pathname)
          const color = active ? '#E8843A' : '#554338'
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 min-h-[52px]"
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{
                    color,
                    fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                <span
                  className="w-full text-[10px] leading-[1.15] text-center font-medium line-clamp-2"
                  style={{ color }}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
