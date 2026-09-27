import type { Pet } from '@/store/useAuthStore'

export function ownProfileHref(activePet: Pet | null | undefined, userId?: string | null) {
  if (activePet?.username) return `/pet/${activePet.username}`
  if (activePet?.id) return `/pet/${activePet.id}`
  if (userId) return '/profile'
  return '/join'
}

export function isOwnProfilePath(
  pathname: string,
  activePet: Pet | null | undefined,
  userId?: string | null
) {
  if (!pathname) return false
  const candidates = [
    activePet?.username ? `/pet/${activePet.username}` : '',
    activePet?.id ? `/pet/${activePet.id}` : '',
    activePet?.username ? `/p/${activePet.username}` : '',
    activePet?.id ? `/profile/${activePet.id}` : '',
    activePet?.id ? `/profiles/${activePet.id}` : '',
    !activePet && userId ? '/profile' : '',
  ].filter(Boolean)
  return candidates.includes(pathname)
}

/** Routes that keep the phone tab bar, matching the Expo tabs navigator. */
export function showsMobileTabBar(
  pathname: string,
  activePet: Pet | null | undefined,
  userId?: string | null
) {
  if (!pathname) return false
  if (pathname === '/feed' || pathname === '/packs' || pathname === '/create') return true
  if (pathname === '/qa' || pathname === '/notifications') return true
  return isOwnProfilePath(pathname, activePet, userId)
}
