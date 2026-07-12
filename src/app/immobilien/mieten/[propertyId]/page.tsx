import { notFound } from 'next/navigation'

import { ImmobilienDetailView } from '@/components/immobilien-detail-view'
import { getActiveProperties, getPropertyById } from '@/lib/onoffice'
import type { Property } from '@/types/property'

type DetailsPageProps = {
  params: Promise<{ propertyId: string }>
}

/**
 * Mietimmobilie detail page.
 *
 * @param params Dynamic route params containing property id.
 */
const MietenDetailPage = async ({ params }: DetailsPageProps) => {
  const { propertyId } = await params
  let property = null
  let relatedProperties: Property[] = []

  try {
    const [loadedProperty, activeProperties] = await Promise.all([
      getPropertyById(propertyId, 'mieten'),
      getActiveProperties({ listingSegment: 'mieten' }),
    ])

    property = loadedProperty
    relatedProperties = activeProperties.filter((entry) => entry.id !== propertyId)
  } catch (error) {
    console.error('Failed to render mieten property details page', error)
  }

  if (!property) {
    notFound()
  }

  return (
    <ImmobilienDetailView
      listingSegment='mieten'
      property={property}
      relatedProperties={relatedProperties}
    />
  )
}

export default MietenDetailPage
