import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PropertyCarousel } from '@/components/property-carousel'
import { getActiveProperties, getPropertyById } from '@/lib/onoffice'
import type { Property } from '@/types/property'

type DetailsPageProps = {
  params: Promise<{ propertyId: string }>
}

/**
 * Iframe-friendly property details page.
 *
 * @param params Dynamic route params containing property id.
 */
const EmbedPropertyDetailsPage = async ({ params }: DetailsPageProps) => {
  const { propertyId } = await params
  let property = null
  let relatedProperties: Property[] = []

  try {
    const [loadedProperty, activeProperties] = await Promise.all([
      getPropertyById(propertyId),
      getActiveProperties({}),
    ])

    property = loadedProperty
    relatedProperties = activeProperties.filter((entry) => entry.id !== propertyId)
  } catch (error) {
    console.error('Failed to render property details page', error)
  }

  if (!property) {
    notFound()
  }

  return (
    <main className='min-h-screen bg-[#f1efe9] px-4 py-8 text-[#14202c]'>
      <div className='mx-auto max-w-4xl space-y-6'>
        <Link
          href='/embed/properties'
          className='inline-flex rounded-md border border-[#24313d] px-3 py-1.5 text-sm font-semibold text-[#24313d] transition hover:bg-[#24313d] hover:text-white'
        >
          Zurück zur Liste
        </Link>

        <article className='overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_10px_36px_rgba(0,0,0,0.1)]'>
          <div className='h-72 w-full bg-gradient-to-r from-[#dde3ea] to-[#f0f3f6]'>
            {property.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={property.imageUrl}
                alt={property.title}
                className='h-full w-full object-cover'
              />
            ) : null}
          </div>

          <div className='space-y-5 p-6'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-semibold text-[#0d1a27]'>{property.title}</h1>
              <p className='text-sm text-zinc-700'>
                {property.address}, {property.zipCode} {property.city}
              </p>
            </div>

            <div className='grid grid-cols-2 gap-3 rounded-lg bg-[#f7f8fa] p-4 text-sm md:grid-cols-4'>
              <div>
                <p className='text-zinc-500'>Preis</p>
                <p className='font-semibold text-zinc-900'>
                  {property.price.toLocaleString('de-DE')} {property.currency}
                </p>
              </div>
              <div>
                <p className='text-zinc-500'>Fläche</p>
                <p className='font-semibold text-zinc-900'>{property.areaSqm} m2</p>
              </div>
              <div>
                <p className='text-zinc-500'>Zimmer</p>
                <p className='font-semibold text-zinc-900'>{property.rooms}</p>
              </div>
              <div>
                <p className='text-zinc-500'>Schlafzimmer</p>
                <p className='font-semibold text-zinc-900'>{property.bedrooms}</p>
              </div>
            </div>

            <section className='space-y-2'>
              <h2 className='text-lg font-semibold text-[#14202c]'>Beschreibung</h2>
              <p className='whitespace-pre-line text-sm leading-6 text-zinc-700'>
                {property.description || 'Keine Beschreibung vorhanden.'}
              </p>
            </section>

            <PropertyCarousel properties={relatedProperties} />
          </div>
        </article>
      </div>
    </main>
  )
}

export default EmbedPropertyDetailsPage
