import { PropertyListingTile } from '@/components/property-listing-tile'
import type { Property } from '@/types/property'

type PropertyCardProps = {
  property: Property
}

/**
 * Compact card used in the property list view.
 *
 * @param property Single active property.
 */
export const PropertyCard = ({ property }: PropertyCardProps) => {
  return <PropertyListingTile property={property} />
}
