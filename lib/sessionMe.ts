import { apiFetch } from '@/lib/api'

let inflight: Promise<any> | null = null

export function fetchMe() {
  if (inflight) return inflight
  inflight = apiFetch('/auth/me').finally(() => {
    inflight = null
  })
  return inflight
}
