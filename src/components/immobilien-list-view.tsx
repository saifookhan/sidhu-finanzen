import { ListingHero } from '@/components/listing-hero'
import { PropertyCard } from '@/components/property-card'
import { PropertyFilterForm } from '@/components/property-filter-form'
import type { ListingSegment } from '@/lib/listing'
import type { Property, PropertyFilters } from '@/types/property'

type ImmobilienListViewProps = {
  listingSegment: ListingSegment
  filters: PropertyFilters
  properties: Property[]
  hasLoadError: boolean
}

/**
 * Shared list layout for kaufen and mieten listing pages.
 *
 * @param listingSegment Active listing segment for the page.
 * @param filters Active filter values from the URL.
 * @param properties Properties returned from OnOffice.
 * @param hasLoadError Whether the OnOffice request failed.
 */
export const ImmobilienListView = ({
  listingSegment,
  filters,
  properties,
  hasLoadError,
}: ImmobilienListViewProps) => {
  const emptyLabel =
    listingSegment === 'kaufen'
      ? 'Keine Kaufimmobilien für die gewählten Filter gefunden.'
      : 'Keine Mietimmobilien für die gewählten Filter gefunden.'

  return (
    <main className='bg-background text-foreground'>
      <ListingHero listingSegment={listingSegment} />

      <div className='px-4 py-8'>
        <div className='mx-auto max-w-6xl space-y-6'>
          <PropertyFilterForm filters={filters} />

          {hasLoadError ? (
            <p className='rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900'>
              Immobilien konnten nicht aus OnOffice geladen werden. Prüfe deine
              API-Basis-URL und Zugangsdaten in `.env`.
            </p>
          ) : null}

          <section className='grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {properties.map((property) => {
              return <PropertyCard key={property.id} property={property} />
            })}
          </section>

          {properties.length === 0 ? (
            <p className='rounded-xl border border-sidhu-border bg-white p-6 text-sm text-sidhu-meta'>
              {emptyLabel}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  )
}
