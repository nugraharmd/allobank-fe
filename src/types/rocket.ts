/** Domain types for Launch Library 2 (v2.2.0) launcher-config endpoints. */

export interface RocketManufacturer {
  id: number
  name: string
  /** ISO country code, e.g. "USA". May be missing. */
  country_code?: string | null
}

export interface Rocket {
  id: number | string
  name?: string | null
  full_name?: string | null
  description?: string | null
  image_url?: string | null
  /** Cost per launch as a numeric string, e.g. "52000000". May be null. */
  launch_cost?: string | null
  /** ISO date, e.g. "2018-05-11". May be null. */
  maiden_flight?: string | null
  family?: string | null
  variant?: string | null
  active?: boolean | null
  reusable?: boolean | null
  manufacturer?: RocketManufacturer | null
  /** Locally-added rockets never hit the API. */
  isLocal?: boolean
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export type RocketStatus = 'idle' | 'loading' | 'success' | 'error'

export interface RocketFilter {
  query: string
  family: string | null
  activeOnly: boolean
  sort: 'name-asc' | 'name-desc' | 'cost-asc' | 'cost-desc' | 'flight-asc' | 'flight-desc'
}
