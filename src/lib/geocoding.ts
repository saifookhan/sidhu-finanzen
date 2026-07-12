import 'server-only'

import { resolveCoordinatesFromQueries } from '@/lib/nominatim'
import type { PropertyCoordinates } from '@/types/property'

/**
 * Resolves coordinates for property address queries via OpenStreetMap Nominatim.
 *
 * @param queries Address queries in priority order.
 */
export const geocodeAddress = async (
  queries: string | string[]
): Promise<PropertyCoordinates | null> => {
  const queryList = Array.isArray(queries) ? queries : [queries]
  const normalizedQueries = queryList
    .map((query) => query.trim())
    .filter((query) => query.length > 0)

  if (normalizedQueries.length === 0) {
    return null
  }

  try {
    return await resolveCoordinatesFromQueries(normalizedQueries)
  } catch (error) {
    console.warn('Failed to geocode property address', error)
    return null
  }
}
