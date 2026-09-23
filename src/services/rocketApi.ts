import axios from 'axios'
import type { Rocket, RocketListResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

/**
 * Shared axios client for the Launch Library 2 launcher-config endpoints.
 * `mode=detailed` + `limit=20` are sent on the list call: without them the
 * API omits description/detail fields and falls back to its default page
 * size of 10 (only 10 of the 13 SpaceX rockets + a `next` page).
 */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
})

export async function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const { data } = await api.get<RocketListResponse>('/', {
    signal,
    params: {
      manufacturer__name: 'SpaceX',
      mode: 'detailed',
      limit: 20,
    },
  })
  return data.results ?? []
}

export async function fetchRocketById (id: number | string, signal?: AbortSignal): Promise<Rocket> {
  const { data } = await api.get<Rocket>(`/${id}/`, { signal })
  return data
}
