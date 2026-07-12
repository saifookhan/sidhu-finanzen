import { z } from 'zod'

import { isListingSegment } from '@/lib/listing'
import type { ListingSegment } from '@/lib/listing'
import type { PropertyFilters } from '@/types/property'

const filterSchema = z.object({
  city: z.string().trim().min(1).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minRooms: z.coerce.number().nonnegative().optional(),
  maxRooms: z.coerce.number().nonnegative().optional(),
})

/**
 * Parses search params into safe filter values for one listing segment.
 *
 * @param listingSegment Listing segment from the route.
 * @param searchParams Raw URL search params from Next.js pages/routes.
 */
export const parseFilters = (
  listingSegment: ListingSegment,
  searchParams: Record<string, string | string[] | undefined>
): PropertyFilters => {
  const flatInput: Record<string, string> = {}

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      flatInput[key] = value
    }
  }

  const parsed = filterSchema.safeParse(flatInput)
  if (!parsed.success) {
    return { listingSegment }
  }

  return {
    listingSegment,
    ...parsed.data,
  }
}

/**
 * Type guard for supported listing route segments.
 *
 * @param value Unknown route segment.
 */
export const parseListingSegment = (value: string): ListingSegment | null => {
  return isListingSegment(value) ? value : null
}
