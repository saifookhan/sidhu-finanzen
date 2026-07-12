import type { PropertyCoordinates } from '@/types/property'

type NominatimResult = {
  lat?: string
  lon?: string
}

/**
 * Fetches coordinates for one address query from OpenStreetMap Nominatim.
 *
 * @param query Address string used for geocoding.
 */
export const fetchNominatimCoordinates = async (
  query: string
): Promise<PropertyCoordinates | null> => {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return null
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'de')
  url.searchParams.set('q', trimmedQuery)

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'gagan-immobilien-app/1.0',
    },
  })

  if (!response.ok) {
    return null
  }

  const results = (await response.json()) as NominatimResult[]
  const firstResult = results[0]
  if (!firstResult?.lat || !firstResult.lon) {
    return null
  }

  const latitude = Number(firstResult.lat)
  const longitude = Number(firstResult.lon)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  return { latitude, longitude }
}

/**
 * Tries multiple geocoding queries until one resolves to coordinates.
 *
 * @param queries Address queries in priority order.
 */
export const resolveCoordinatesFromQueries = async (
  queries: string[]
): Promise<PropertyCoordinates | null> => {
  for (const query of queries) {
    const coordinates = await fetchNominatimCoordinates(query)
    if (coordinates) {
      return coordinates
    }
  }

  return null
}
