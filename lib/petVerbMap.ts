import { apiFetch } from '@/lib/api'

export interface SpeciesVerbItem {
  id?: string
  species: string
  label: string
  verb: string
  icon?: string
  is_active?: boolean
}

// Fallback in-memory map
let dynamicVerbMap: Record<string, string> = {
  dog: 'Bark',
  dogs: 'Bark',
  cat: 'Meow',
  cats: 'Meow',
  rabbit: 'Thump',
  rabbits: 'Thump',
  bird: 'Chirp',
  birds: 'Chirp',
  fish: 'Bubble',
  fishes: 'Bubble',
  hamster: 'Squeak',
  hamsters: 'Squeak',
  parrot: 'Squawk',
  parrots: 'Squawk',
  turtle: 'Nudge',
  turtles: 'Nudge',
  guinea_pig: 'Wheek',
  guinea_pigs: 'Wheek',
  other: 'Woof',
  unknown: 'Woof',
}

let isFetched = false

/**
 * Fetch latest species verb mappings from backend database
 */
export async function loadSpeciesVerbsFromDB(): Promise<Record<string, string>> {
  try {
    const data = await apiFetch('/auth/species-verbs')
    if (Array.isArray(data) && data.length > 0) {
      const newMap: Record<string, string> = { ...dynamicVerbMap }
      data.forEach((item: SpeciesVerbItem) => {
        if (item.species && item.verb) {
          const key = item.species.toLowerCase().trim()
          newMap[key] = item.verb
          // plural helper key
          newMap[`${key}s`] = item.verb
        }
      })
      dynamicVerbMap = newMap
      isFetched = true
    }
  } catch (err) {
    console.error('[petVerbMap] Failed to load species verbs from DB:', err)
  }
  return dynamicVerbMap
}

// Trigger background fetch once on load
if (typeof window !== 'undefined' && !isFetched) {
  loadSpeciesVerbsFromDB()
}

export const DEFAULT_COMMENT_VERB = 'Woof'

export function getCommentVerb(species: string | null | undefined): string {
  if (!species) return DEFAULT_COMMENT_VERB
  const normalized = species.toLowerCase().trim()
  return dynamicVerbMap[normalized] ?? DEFAULT_COMMENT_VERB
}

export function getCommentVerbPlural(
  species: string | null | undefined,
  count: number
): string {
  const verb = getCommentVerb(species)
  if (count === 1) return verb
  return `${verb}s`
}
