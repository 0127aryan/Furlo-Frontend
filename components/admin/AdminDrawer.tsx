'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface AdminNavItem {
  id: string
  href: string
  label: string
  icon: string
  exact?: boolean
  badge?: number
  badgeColor?: string
}

export function AdminDrawer({
  open,
  onClose,
  items,
  name,
  email,
}: {
  open: boolean
  onClose: () => void
  items: AdminNavItem[]
  name?: string
  email?: string
}) {
  const pathname = usePathname() || ''
  if (!open) return null

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-[rgba(1,30,20,0.45)]" onClick={onClose}>
      <aside
        className="h-full w-[86%] max-w-[320px] bg-[#011E14] text-white px-4 pt-6 pb-4 flex flex-col"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[#163328]">
          <div className="w-9 h-9 rounded-xl bg-[#E8843A] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px] text-white">verified_user</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[18px] font-bold leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Furlo Ops
            </p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#476457]">Super Admin</p>
          </div>
          <Link
            href="/feed"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#163328] text-[#A3B8B0] flex items-center justify-center"
            title="Return to App"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </Link>
        </div>

        <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#476457]">
          Operations Navigation
        </p>
        <nav className="flex-1 overflow-y-auto space-y-1">
          {items.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                  isActive ? 'bg-[#1B4D3E] text-white' : 'text-[#A3B8B0]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ color: isActive ? '#E8843A' : '#476457' }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white ${
                      item.badgeColor || 'bg-[#E8843A]'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </nav>

        <div className="pt-4 mt-4 border-t border-[#163328] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1B4D3E] flex items-center justify-center text-xs font-bold uppercase">
            {(name?.[0] || email?.[0] || 'A').toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold truncate">{name || 'Super Admin'}</p>
            <p className="text-[10px] text-[#A3B8B0] truncate">{email}</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
