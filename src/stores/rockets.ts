import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRocketById, fetchRockets } from '@/services/rocketApi'
import { costAsNumber, rocketName } from '@/utils/format'
import type { Rocket, RocketFilter, RocketStatus } from '@/types/rocket'

let localId = 0

function toComparableName (rocket: Rocket): string {
  return rocketName(rocket).toLocaleLowerCase()
}

/**
 * Aborted (superseded) requests stay silent so the newer request owns the UI.
 * Only axios cancellations (`ERR_CANCELED`, from our AbortController) and
 * native `AbortError`s qualify — timeouts (`ECONNABORTED`) are real errors
 * and must reach the Fail/Retry UI.
 */
function isAbortError (error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') return true
  if (typeof error === 'object' && error !== null) {
    return (error as { code?: unknown }).code === 'ERR_CANCELED'
  }
  return false
}

export const useRocketsStore = defineStore('rockets', () => {
  // --- state ---
  const rockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const detailCache = ref<Record<string, Rocket>>({})
  const listStatus = ref<RocketStatus>('idle')
  const listError = ref<string | null>(null)
  const detailStatus = ref<RocketStatus>('idle')
  const detailError = ref<string | null>(null)
  const detailId = ref<string | null>(null)

  const filter = ref<RocketFilter>({
    query: '',
    family: null,
    activeOnly: false,
    sort: 'name-asc',
  })

  let listController: AbortController | null = null
  let detailController: AbortController | null = null

  // --- getters ---
  const allRockets = computed<Rocket[]>(() => [...localRockets.value, ...rockets.value])

  const families = computed<string[]>(() => {
    const set = new Set<string>()
    for (const rocket of allRockets.value) {
      if (rocket.family?.trim()) set.add(rocket.family.trim())
    }
    return [...set].sort((a, b) => a.localeCompare(b))
  })

  const filteredRockets = computed<Rocket[]>(() => {
    const query = filter.value.query.trim().toLocaleLowerCase()
    let result = allRockets.value.filter(rocket => {
      if (filter.value.activeOnly && !rocket.active) return false
      if (filter.value.family && rocket.family !== filter.value.family) return false
      if (!query) return true
      const haystack = `${rocketName(rocket)} ${rocket.description ?? ''} ${rocket.family ?? ''}`.toLocaleLowerCase()
      return haystack.includes(query)
    })

    result = [...result].sort((a, b) => {
      switch (filter.value.sort) {
        case 'name-desc':
          return toComparableName(b).localeCompare(toComparableName(a))
        case 'cost-asc':
          return (costAsNumber(a.launch_cost) ?? Number.POSITIVE_INFINITY) - (costAsNumber(b.launch_cost) ?? Number.POSITIVE_INFINITY)
        case 'cost-desc':
          return (costAsNumber(b.launch_cost) ?? -1) - (costAsNumber(a.launch_cost) ?? -1)
        case 'flight-asc':
          return (a.maiden_flight ?? 'zzzz').localeCompare(b.maiden_flight ?? 'zzzz')
        case 'flight-desc':
          return (b.maiden_flight ?? '').localeCompare(a.maiden_flight ?? '')
        case 'name-asc':
        default:
          return toComparableName(a).localeCompare(toComparableName(b))
      }
    })

    return result
  })

  const activeDetail = computed<Rocket | null>(() => {
    if (!detailId.value) return null
    return detailCache.value[detailId.value] ?? null
  })

  // --- actions ---
  async function loadRockets (): Promise<void> {
    if (listStatus.value === 'loading') return
    listController?.abort()
    listController = new AbortController()
    listStatus.value = 'loading'
    listError.value = null
    try {
      const data = await fetchRockets(listController.signal)
      rockets.value = data
      for (const rocket of data) {
        detailCache.value[String(rocket.id)] = rocket
      }
      listStatus.value = 'success'
    } catch (error) {
      if (isAbortError(error)) return
      listError.value = error instanceof Error ? error.message : 'Failed to load rockets.'
      listStatus.value = 'error'
    }
  }

  async function loadRocketDetail (id: number | string): Promise<void> {
    const key = String(id)
    detailId.value = key

    // Locally-added rockets and already-cached API rockets resolve instantly.
    const local = [...localRockets.value, ...rockets.value].find(r => String(r.id) === key)
    if (local) {
      detailCache.value[key] = local
      detailStatus.value = 'success'
      detailError.value = null
      return
    }
    if (detailCache.value[key]) {
      detailStatus.value = 'success'
      detailError.value = null
      return
    }

    detailController?.abort()
    detailController = new AbortController()
    detailStatus.value = 'loading'
    detailError.value = null
    try {
      const data = await fetchRocketById(id, detailController.signal)
      detailCache.value[key] = data
      detailStatus.value = 'success'
    } catch (error) {
      if (isAbortError(error)) return
      detailError.value = error instanceof Error ? error.message : 'Failed to load rocket details.'
      detailStatus.value = 'error'
    }
  }

  function addRocket (input: {
    name: string
    description: string
    image_url?: string | null
    launch_cost?: string | null
    country_code?: string | null
    maiden_flight?: string | null
    family?: string | null
  }): Rocket {
    localId += 1
    const rocket: Rocket = {
      id: `local-${Date.now()}-${localId}`,
      name: input.name.trim(),
      full_name: input.name.trim(),
      description: input.description.trim(),
      image_url: input.image_url?.trim() || null,
      launch_cost: input.launch_cost?.trim() || null,
      maiden_flight: input.maiden_flight?.trim() || null,
      family: input.family?.trim() || 'Custom',
      variant: null,
      active: true,
      reusable: null,
      manufacturer: input.country_code?.trim()
        ? { id: -1, name: 'Custom', country_code: input.country_code.trim() }
        : null,
      isLocal: true,
    }
    localRockets.value = [rocket, ...localRockets.value]
    detailCache.value[String(rocket.id)] = rocket
    return rocket
  }

  function setFilter (patch: Partial<RocketFilter>): void {
    filter.value = { ...filter.value, ...patch }
  }

  function resetFilter (): void {
    filter.value = { query: '', family: null, activeOnly: false, sort: 'name-asc' }
  }

  function $resetDetail (): void {
    detailStatus.value = 'idle'
    detailError.value = null
    detailId.value = null
  }

  return {
    rockets,
    localRockets,
    allRockets,
    families,
    filteredRockets,
    filter,
    listStatus,
    listError,
    detailStatus,
    detailError,
    detailId,
    activeDetail,
    loadRockets,
    loadRocketDetail,
    addRocket,
    setFilter,
    resetFilter,
    $resetDetail,
  }
})
