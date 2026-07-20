import { z } from 'zod'

import { isPropertyAreaType } from '@/lib/filter-options'
import { isListingSegment } from '@/lib/listing'
import type { ListingSegment } from '@/lib/listing'
import type { PropertyFilters } from '@/types/property'

/**
 * Normalizes empty query values to undefined before Zod parsing.
 *
 * @param value Raw query value.
 */
const emptyToUndefined = (value: unknown): unknown => {
  if (typeof value === 'string' && value.trim().length === 0) {
    return undefined
  }

  return value
}

const optionalStringParam = z.preprocess(
  emptyToUndefined,
  z.string().trim().min(1).optional()
)

const optionalNumberParam = z.preprocess(
  emptyToUndefined,
  z.coerce.number().nonnegative().optional()
)

const filterSchema = z.object({
  objectType: optionalStringParam,
  location: optionalStringParam,
  minPrice: optionalNumberParam,
  maxPrice: optionalNumberParam,
  minArea: optionalNumberParam,
  areaType: optionalStringParam,
  minRooms: optionalNumberParam,
  zipCode: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .regex(/^\d{5}$/, 'zipCode must be a 5-digit German postal code')
      .optional()
  ),
})

type ParsedFilterValues = z.infer<typeof filterSchema>

/**
 * Flattens Next.js search params into one string map for Zod parsing.
 *
 * @param searchParams Raw URL search params from Next.js pages/routes.
 */
const flattenSearchParams = (
  searchParams: Record<string, string | string[] | undefined>
): Record<string, string> => {
  const flatInput: Record<string, string> = {}

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      const firstValue = value.find(
        (entry): entry is string => typeof entry === 'string' && entry.trim().length > 0
      )

      if (firstValue) {
        flatInput[key] = firstValue
      }
    } else if (typeof value === 'string') {
      flatInput[key] = value
    }
  }

  return flatInput
}

/**
 * Maps validated filter values into the shared PropertyFilters shape.
 *
 * @param listingSegment Listing segment from the route.
 * @param data Parsed filter values.
 */
const buildPropertyFilters = (
  listingSegment: ListingSegment,
  data: ParsedFilterValues
): PropertyFilters => {
  const areaType =
    data.areaType && isPropertyAreaType(data.areaType) ? data.areaType : undefined

  return {
    listingSegment,
    objectType: data.objectType,
    location: data.location,
    minPrice: data.minPrice,
    maxPrice: data.maxPrice,
    minArea: data.minArea,
    areaType,
    minRooms: data.minRooms,
    zipCode: data.zipCode,
  }
}

/**
 * Builds URL search params from a submitted filter form.
 *
 * @param formData Submitted filter form values.
 */
export const buildFilterSearchParams = (formData: FormData): URLSearchParams => {
  const minArea = formData.get('minArea')?.toString().trim()
  const params = new URLSearchParams()

  formData.forEach((value, key) => {
    if (key === 'areaType' && !minArea) {
      return
    }

    const normalized = value.toString().trim()
    if (normalized) {
      params.set(key, normalized)
    }
  })

  return params
}

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
  const flatInput = flattenSearchParams(searchParams)
  const parsed = filterSchema.safeParse(flatInput)

  if (parsed.success) {
    return buildPropertyFilters(listingSegment, parsed.data)
  }

  const { zipCode: _zipCode, ...rest } = flatInput
  const retry = filterSchema.safeParse(rest)

  if (retry.success) {
    return buildPropertyFilters(listingSegment, retry.data)
  }

  return { listingSegment }
}

/**
 * Type guard for supported listing route segments.
 *
 * @param value Unknown route segment.
 */
export const parseListingSegment = (value: string): ListingSegment | null => {
  return isListingSegment(value) ? value : null
}
