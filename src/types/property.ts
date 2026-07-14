import type { PropertyAreaType } from '@/lib/filter-options'
import type { ListingSegment } from '@/lib/listing'

/**
 * One image attached to a property listing.
 */
export type PropertyImage = {
  url: string
  title: string
  type: string
}

/**
 * One amenity row shown in the Ausstattung section.
 */
export type PropertyAmenity = {
  label: string
  value: string
}

/**
 * One label/value row in the Objektdaten table.
 */
export type PropertyDetailField = {
  label: string
  value: string
}

/**
 * Geographic coordinates for map display.
 */
export type PropertyCoordinates = {
  latitude: number
  longitude: number
}

/**
 * UI-level property shape used by list and detail pages.
 */
export type Property = {
  id: string
  title: string
  city: string
  zipCode: string
  address: string
  country: string
  price: number
  currency: string
  areaSqm: number
  plotAreaSqm: number
  rooms: number
  bedrooms: number
  bathrooms: number
  terraces: number
  parkingSpaces: number
  yearBuilt: number | null
  condition: string
  objectType: string
  objectCategory: string
  usageType: string
  buyerCommission: string
  availability: string
  energyCertificateType: string
  energyCertificateValidUntil: string
  energyConsumption: string
  imageUrl: string | null
  images: PropertyImage[]
  description: string
  locationDescription: string
  equipmentDescription: string
  additionalDescription: string
  amenities: PropertyAmenity[]
  status: 'active' | 'inactive' | 'unknown'
  listingSegment: ListingSegment
  coordinates: PropertyCoordinates | null
}

/**
 * Query filters exposed in the iframe list page.
 */
export type PropertyFilters = {
  listingSegment: ListingSegment
  objectType?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  minArea?: number
  areaType?: PropertyAreaType
  minRooms?: number
  zipCode?: string
}
