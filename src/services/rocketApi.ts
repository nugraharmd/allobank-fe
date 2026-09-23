import type { Rocket, RocketListResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'
const LIST_URL = `${BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`

async function handleResponse<T> (res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const res = await fetch(LIST_URL, { signal })
  const data = await handleResponse<RocketListResponse>(res)
  return data.results ?? []
}

export async function fetchRocketById (id: number | string, signal?: AbortSignal): Promise<Rocket> {
  const res = await fetch(`${BASE_URL}/${id}/`, { signal })
  return handleResponse<Rocket>(res)
}
