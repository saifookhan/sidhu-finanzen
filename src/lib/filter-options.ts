import type { ListingSegment } from '@/lib/listing'

/**
 * One selectable object type in the Objekttyp filter.
 */
export type ObjectTypeOption = {
  value: string
  label: string
}

/**
 * One selectable location in the Standort filter.
 */
export type LocationOption = {
  value: string
  label: string
  ortSearch: string
}

/**
 * Supported area field keys for the Fläche filter.
 */
export type PropertyAreaType =
  | 'wohnflaeche'
  | 'grundstuecksflaeche'
  | 'nutzflaeche'
  | 'gesamtflaeche'

/**
 * One selectable area type in the Fläche filter.
 */
export type AreaTypeOption = {
  value: PropertyAreaType
  label: string
}

export const LISTING_PRICE_MAX: Record<ListingSegment, number> = {
  kaufen: 2_000_000,
  mieten: 5_000,
}

export const LISTING_PRICE_STEP: Record<ListingSegment, number> = {
  kaufen: 10_000,
  mieten: 50,
}

export const OBJECT_TYPE_OPTIONS: ObjectTypeOption[] = [
  { value: '', label: 'Alle Objekttypen' },
  { value: 'buero_praxen', label: 'Büro/Praxis' },
  { value: 'bueroflaeche', label: '— Bürofläche' },
  { value: 'einzelhandel', label: 'Einzelhandel' },
  { value: 'verkaufsflaeche', label: '— Verkaufsfläche' },
  { value: 'gastgewerbe', label: 'Gastgewerbe' },
  { value: 'gastronomie', label: '— Gastronomie' },
  { value: 'haus', label: 'Haus' },
  { value: 'einfamilienhaus', label: '— Einfamilienhaus' },
  { value: 'haus_mehrfamilienhaus', label: '— Mehrfamilienhaus' },
]

export const LOCATION_OPTIONS: LocationOption[] = [
  { value: '', label: 'Alle Orte', ortSearch: '' },
  {
    value: 'beverungen-amelunxen',
    label: 'Beverungen / Amelunxen',
    ortSearch: 'Beverungen',
  },
  { value: 'boffzen', label: 'Boffzen', ortSearch: 'Boffzen' },
  {
    value: 'brakel-gehrden',
    label: 'Brakel / Gehrden',
    ortSearch: 'Brakel',
  },
  { value: 'hoexter', label: 'Höxter', ortSearch: 'Höxter' },
  {
    value: 'marienmuenster-bredenborn',
    label: 'Marienmünster / Bredenborn',
    ortSearch: 'Marienmünster',
  },
  {
    value: 'stadtoldendorf',
    label: 'Stadtoldendorf',
    ortSearch: 'Stadtoldendorf',
  },
]

export const AREA_TYPE_OPTIONS: AreaTypeOption[] = [
  { value: 'wohnflaeche', label: 'Wohnfläche' },
  { value: 'grundstuecksflaeche', label: 'Grundstücksfläche' },
  { value: 'nutzflaeche', label: 'Nutzfläche' },
  { value: 'gesamtflaeche', label: 'Gesamtfläche' },
]

/**
 * Resolves a location filter value to its OnOffice ort search term.
 *
 * @param location Location slug from the filter form.
 */
export const getLocationOrtSearch = (location: string): string | null => {
  const option = LOCATION_OPTIONS.find((entry) => entry.value === location)
  if (!option || !option.ortSearch) {
    return null
  }

  return option.ortSearch
}

/**
 * Type guard for supported area type values.
 *
 * @param value Unknown area type from query params.
 */
export const isPropertyAreaType = (value: string): value is PropertyAreaType => {
  return AREA_TYPE_OPTIONS.some((entry) => entry.value === value)
}
