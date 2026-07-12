import {
  LISTING_PRICE_LABELS,
  LISTING_SEGMENT_LABELS,
  type ListingSegment,
} from '@/lib/listing'
import type { Property, PropertyAmenity, PropertyDetailField } from '@/types/property'

/**
 * Formats a numeric area value for German locale display.
 *
 * @param value Area in square meters.
 */
const formatArea = (value: number): string => {
  if (value <= 0) {
    return ''
  }

  return `ca. ${value.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} m²`
}

/**
 * Formats a count value when greater than zero.
 *
 * @param value Numeric count.
 */
const formatCount = (value: number): string => {
  return value > 0 ? String(value) : ''
}

/**
 * Formats a free-text field when present.
 *
 * @param value Raw text value.
 */
const formatText = (value: string): string => {
  return value.trim()
}

/**
 * Builds the location line shown below the property title.
 *
 * @param property Loaded property details.
 */
export const buildPropertyLocationLine = (property: Property): string => {
  const parts = [property.zipCode, property.city].filter(Boolean)
  if (property.address) {
    parts.push(property.address)
  }

  return parts.join(' / ')
}

/**
 * Builds amenity rows for the Ausstattung section.
 *
 * @param property Loaded property details.
 */
export const buildPropertyAmenities = (property: Property): PropertyAmenity[] => {
  return property.amenities.filter((entry) => entry.value.trim().length > 0)
}

/**
 * Builds Objektdaten rows in the same order as the reference layout.
 *
 * @param property Loaded property details.
 * @param listingSegment Active listing segment for the page.
 */
export const buildPropertyDetailFields = (
  property: Property,
  listingSegment: ListingSegment
): PropertyDetailField[] => {
  const rows: PropertyDetailField[] = [
    { label: 'Standort', value: buildPropertyLocationLine(property) },
    { label: 'Wohnfläche', value: formatArea(property.areaSqm) },
    { label: 'Grundstück', value: formatArea(property.plotAreaSqm) },
    { label: 'Anzahl Zimmer', value: formatCount(property.rooms) },
    { label: 'Anzahl Badezimmer', value: formatCount(property.bathrooms) },
    { label: 'Anzahl Terrassen', value: formatCount(property.terraces) },
    { label: 'Anzahl Stellplätze', value: formatCount(property.parkingSpaces) },
    {
      label: LISTING_PRICE_LABELS[listingSegment],
      value:
        property.price > 0
          ? `${property.price.toLocaleString('de-DE')} ${property.currency}`
          : '',
    },
    { label: 'Käuferprovision', value: formatText(property.buyerCommission) },
    { label: 'Objekttyp', value: formatText(property.objectType) },
    { label: 'Nutzungstyp', value: formatText(property.usageType) },
    { label: 'Verfügbarkeit', value: formatText(property.availability) },
    {
      label: 'Vermarktungstyp',
      value: LISTING_SEGMENT_LABELS[property.listingSegment],
    },
    {
      label: 'Baujahr',
      value: property.yearBuilt ? String(property.yearBuilt) : '',
    },
    { label: 'Zustand', value: formatText(property.condition) },
  ]

  return rows.filter((row) => row.value.length > 0)
}

/**
 * Builds fallback address queries used for geocoding.
 *
 * @param property Loaded property details.
 */
export const buildPropertyGeocodeQueries = (property: Property): string[] => {
  const fullAddress = [property.address, property.zipCode, property.city, 'Deutschland']
    .filter(Boolean)
    .join(', ')
  const zipCity = [property.zipCode, property.city, 'Deutschland'].filter(Boolean).join(', ')
  const cityOnly = [property.city, 'Deutschland'].filter(Boolean).join(', ')

  return [fullAddress, zipCity, cityOnly].filter(
    (query, index, queries) => query.length > 0 && queries.indexOf(query) === index
  )
}

/**
 * Builds the address string used for geocoding when coordinates are missing.
 *
 * @param property Loaded property details.
 */
export const buildPropertyGeocodeQuery = (property: Property): string => {
  return buildPropertyGeocodeQueries(property)[0] ?? ''
}
