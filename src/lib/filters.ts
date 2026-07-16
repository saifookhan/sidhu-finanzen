import { z } from 'zod'

import { isPropertyAreaType } from '@/lib/filter-options'
import { isListingSegment } from '@/lib/listing'
import type { ListingSegment } from '@/lib/listing'
import type { PropertyFilters } from '@/types/property'

const filterSchema = z.object({
  objectType: z.string().trim().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minArea: z.coerce.number().nonnegative().optional(),
  areaType: z.string().trim().min(1).optional(),
  minRooms: z.coerce.number().nonnegative().optional(),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, 'zipCode must be a 5-digit German postal code')
    .optional(),
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

  const areaType =
    parsed.data.areaType && isPropertyAreaType(parsed.data.areaType)
      ? parsed.data.areaType
      : undefined

  return {
    listingSegment,
    objectType: parsed.data.objectType,
    location: parsed.data.location,
    minPrice: parsed.data.minPrice,
    maxPrice: parsed.data.maxPrice,
    minArea: parsed.data.minArea,
    areaType,
    minRooms: parsed.data.minRooms,
    zipCode: parsed.data.zipCode,
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
