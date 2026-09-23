import type { Rocket } from '@/types/rocket'

export const MISSING_TEXT = '—'

export function rocketName (rocket: Rocket): string {
  return rocket.full_name?.trim() || rocket.name?.trim() || 'Unnamed rocket'
}

export function rocketDescription (rocket: Rocket): string {
  return rocket.description?.trim() || 'No description available for this rocket.'
}

export function rocketCountry (rocket: Rocket): string | null {
  return rocket.manufacturer?.country_code?.trim() || null
}

export function formatLaunchCost (cost: Rocket['launch_cost']): string | null {
  if (cost === null || cost === undefined || cost === '') return null
  const value = Number(cost)
  if (Number.isNaN(value)) return String(cost)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatFlightDate (isoDate: Rocket['maiden_flight']): string | null {
  if (!isoDate) return null
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function costAsNumber (cost: Rocket['launch_cost']): number | null {
  if (cost === null || cost === undefined || cost === '') return null
  const value = Number(cost)
  return Number.isNaN(value) ? null : value
}
