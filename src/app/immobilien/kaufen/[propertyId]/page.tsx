import { notFound } from 'next/navigation'

import { ImmobilienDetailView } from '@/components/immobilien-detail-view'
import { getActiveProperties, getPropertyById } from '@/lib/onoffice'
import type { Property } from '@/types/property'

type DetailsPageProps = {
  params: Promise<{ propertyId: string }>
}

/**
 * Kaufimmobilie detail page.
 *
 * @param params Dynamic route params containing property id.
 */
const KaufenDetailPage = async ({ params }: DetailsPageProps) => {
  const { propertyId } = await params
  let property = null
  let relatedProperties: Property[] = []

  try {
    const [loadedProperty, activeProperties] = await Promise.all([
      getPropertyById(propertyId, 'kaufen'),
      getActiveProperties({ listingSegment: 'kaufen' }),
    ])

    property = loadedProperty
    relatedProperties = activeProperties.filter((entry) => entry.id !== propertyId)
  } catch (error) {
    console.error('Failed to render kaufen property details page', error)
  }

  if (!property) {
    notFound()
  }

  return (
    <ImmobilienDetailView
      listingSegment='kaufen'
      property={property}
      relatedProperties={relatedProperties}
    />
  )
}

export default KaufenDetailPage
