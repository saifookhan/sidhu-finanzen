import { ImmobilienListView } from '@/components/immobilien-list-view'
import { parseFilters } from '@/lib/filters'
import { getActiveProperties } from '@/lib/onoffice'
import type { Property } from '@/types/property'

type ListPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

/**
 * Kaufimmobilien list with server-side filters.
 *
 * @param searchParams URL query values used for filtering.
 */
const KaufenListPage = async ({ searchParams }: ListPageProps) => {
  const rawSearchParams = (await searchParams) ?? {}
  const filters = parseFilters('kaufen', rawSearchParams)
  let properties: Property[] = []
  let hasLoadError = false

  try {
    properties = await getActiveProperties(filters)
  } catch (error) {
    hasLoadError = true
    console.error('Failed to render kaufen property list page', error)
  }

  return (
    <ImmobilienListView
      listingSegment='kaufen'
      filters={filters}
      properties={properties}
      hasLoadError={hasLoadError}
    />
  )
}

export default KaufenListPage
