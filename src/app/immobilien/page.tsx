import { PropertyCard } from '@/components/property-card'
import { PropertyFilterForm } from '@/components/property-filter-form'
import { parseFilters } from '@/lib/filters'
import { getActiveProperties } from '@/lib/onoffice'
import type { Property } from '@/types/property'

type ListPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

/**
 * Iframe-friendly property list with server-side filters.
 *
 * @param searchParams URL query values used for filtering.
 */
const ImmobilienListPage = async ({ searchParams }: ListPageProps) => {
  const rawSearchParams = (await searchParams) ?? {}
  const filters = parseFilters(rawSearchParams)
  let properties: Property[] = []
  let hasLoadError = false

  try {
    properties = await getActiveProperties(filters)
  } catch (error) {
    hasLoadError = true
    console.error('Failed to render property list page', error)
  }

  return (
    <main className='bg-[#f1efe9] px-4 py-8 text-[#14202c]'>
      <div className='mx-auto max-w-6xl space-y-6'>
        <header className='space-y-2'>
          <p className='text-xs font-medium uppercase tracking-[0.15em] text-[#43586c]'>
            Immobilien im Sidhu-Stil
          </p>
          <h1 className='text-3xl font-extrabold md:text-4xl'>Aktive Immobilien</h1>
          <p className='text-sm text-zinc-700'>
            Strukturierte Listenansicht zur Einbettung als Mikro-Frontend.
          </p>
        </header>

        <PropertyFilterForm filters={filters} />

        {hasLoadError ? (
          <p className='rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900'>
            Immobilien konnten nicht aus OnOffice geladen werden. Prüfe deine API-Basis-URL und
            Zugangsdaten in `.env`.
          </p>
        ) : null}

        <section className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {properties.map((property) => {
            return <PropertyCard key={property.id} property={property} />
          })}
        </section>

        {properties.length === 0 ? (
          <p className='rounded-xl border border-black/10 bg-white p-6 text-sm text-zinc-700'>
            Keine aktiven Immobilien für die gewählten Filter gefunden.
          </p>
        ) : null}
      </div>
    </main>
  )
}

export default ImmobilienListPage
