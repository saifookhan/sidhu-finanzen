export type ListingSegment = 'kaufen' | 'mieten'

export type OnOfficeMarketingType = 'kauf' | 'miete'

export const LISTING_SEGMENT_LABELS: Record<ListingSegment, string> = {
  kaufen: 'Kaufen',
  mieten: 'Mieten',
}

export const LISTING_SEGMENT_HEADINGS: Record<ListingSegment, string> = {
  kaufen: 'Immobilie kaufen',
  mieten: 'Immobilie mieten',
}

export const LISTING_PRICE_LABELS: Record<ListingSegment, string> = {
  kaufen: 'Kaufpreis',
  mieten: 'Kaltmiete',
}

export const LISTING_TYPE_BADGE_LABELS: Record<ListingSegment, string> = {
  kaufen: 'Kauf',
  mieten: 'Miete',
}

export const LISTING_MIN_PRICE_PLACEHOLDERS: Record<ListingSegment, string> = {
  kaufen: 'Mindestpreis',
  mieten: 'Mindestmiete',
}

export const LISTING_MAX_PRICE_PLACEHOLDERS: Record<ListingSegment, string> = {
  kaufen: 'Höchstpreis',
  mieten: 'Höchstmiete',
}

/**
 * Maps a public route segment to the OnOffice marketing type.
 *
 * @param segment Public listing segment from the URL.
 */
export const toOnOfficeMarketingType = (
  segment: ListingSegment
): OnOfficeMarketingType => {
  return segment === 'kaufen' ? 'kauf' : 'miete'
}

/**
 * Maps an OnOffice marketing type to the public listing segment.
 *
 * @param marketingType Raw OnOffice vermarktungsart value.
 */
export const toListingSegment = (
  marketingType: string
): ListingSegment | null => {
  const normalized = marketingType.trim().toLowerCase()

  if (normalized === 'kauf') {
    return 'kaufen'
  }

  if (normalized === 'miete') {
    return 'mieten'
  }

  return null
}

/**
 * Builds the list path for one listing segment.
 *
 * @param segment Public listing segment.
 */
export const buildListingListPath = (segment: ListingSegment): string => {
  return `/immobilien/${segment}`
}

/**
 * Builds the detail path for one listing segment and property id.
 *
 * @param segment Public listing segment.
 * @param propertyId OnOffice property id.
 */
export const buildListingDetailPath = (
  segment: ListingSegment,
  propertyId: string
): string => {
  return `/immobilien/${segment}/${propertyId}`
}

/**
 * Type guard for supported listing route segments.
 *
 * @param value Unknown route segment.
 */
export const isListingSegment = (value: string): value is ListingSegment => {
  return value === 'kaufen' || value === 'mieten'
}
