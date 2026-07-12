import { NextResponse } from 'next/server'

import { parseFilters, parseListingSegment } from '@/lib/filters'
import { getActiveProperties } from '@/lib/onoffice'

/**
 * Returns active properties with optional query-based filtering.
 *
 * @param request Incoming request with search params.
 */
export const GET = async (request: Request) => {
  try {
    const url = new URL(request.url)
    const filterInput = Object.fromEntries(url.searchParams.entries())
    const listingSegment =
      parseListingSegment(url.searchParams.get('segment') ?? 'kaufen') ?? 'kaufen'
    const filters = parseFilters(listingSegment, filterInput)
    const properties = await getActiveProperties(filters)
    return NextResponse.json({ data: properties })
  } catch (error) {
    console.error('Failed to load active properties', error)
    return NextResponse.json(
      { error: 'Failed to load active properties' },
      { status: 502 }
    )
  }
}
