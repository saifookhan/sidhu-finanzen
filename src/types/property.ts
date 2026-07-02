/**
 * One image attached to a property listing.
 */
export type PropertyImage = {
  url: string
  title: string
  type: string
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
  price: number
  currency: string
  areaSqm: number
  rooms: number
  bedrooms: number
  imageUrl: string | null
  images: PropertyImage[]
  description: string
  status: 'active' | 'inactive' | 'unknown'
}

/**
 * Query filters exposed in the iframe list page.
 */
export type PropertyFilters = {
  city?: string
  minPrice?: number
  maxPrice?: number
  minRooms?: number
  maxRooms?: number
}
