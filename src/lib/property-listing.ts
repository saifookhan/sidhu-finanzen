import { LOCATION_OPTIONS } from '@/lib/filter-options'
import type { Property } from '@/types/property'

/**
 * Formats a square-meter value for listing tiles.
 *
 * @param value Area in square meters.
 */
export const formatListingArea = (value: number): string => {
  if (value <= 0) {
    return ''
  }

  return `${value.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} m²`
}

/**
 * Formats a listing price for German locale display.
 *
 * @param property Property with price and currency.
 */
export const formatListingPrice = (property: Property): string => {
  return `${property.price.toLocaleString('de-DE')} ${property.currency}`
}

/**
 * Resolves the location label shown on listing tiles.
 *
 * @param city Raw city value from OnOffice.
 */
export const resolvePropertyLocationLabel = (city: string): string => {
  const normalized = city.trim()
  if (!normalized) {
    return ''
  }

  const match = LOCATION_OPTIONS.find((entry) => {
    if (!entry.ortSearch) {
      return false
    }

    const cityLower = normalized.toLowerCase()
    const searchLower = entry.ortSearch.toLowerCase()

    return cityLower === searchLower || cityLower.includes(searchLower)
  })

  return match?.label ?? normalized
}

/**
 * Builds the availability badge label for one listing tile.
 *
 * @param property Property with availability text.
 */
export const resolveAvailabilityBadgeLabel = (property: Property): string => {
  const availability = property.availability.trim()
  return availability.length > 0 ? availability : 'Verfügbar'
}
