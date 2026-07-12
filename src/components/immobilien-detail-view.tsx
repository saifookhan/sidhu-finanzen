import Link from 'next/link'

import { PropertyCarousel } from '@/components/property-carousel'
import { PropertyGallery } from '@/components/property-gallery'
import {
  buildListingListPath,
  LISTING_PRICE_LABELS,
  type ListingSegment,
} from '@/lib/listing'
import type { Property } from '@/types/property'

type ImmobilienDetailViewProps = {
  listingSegment: ListingSegment
  property: Property
  relatedProperties: Property[]
}

/**
 * Shared detail layout for kaufen and mieten property pages.
 *
 * @param listingSegment Active listing segment for the page.
 * @param property Loaded property details.
 * @param relatedProperties Related listings in the same segment.
 */
export const ImmobilienDetailView = ({
  listingSegment,
  property,
  relatedProperties,
}: ImmobilienDetailViewProps) => {
  return (
    <main className='bg-[#f1efe9] px-4 py-8 text-[#14202c]'>
      <div className='mx-auto max-w-4xl space-y-6'>
        <Link
          href={buildListingListPath(listingSegment)}
          className='inline-flex rounded-md border border-[#24313d] px-3 py-1.5 text-sm font-medium text-[#24313d] transition hover:bg-[#24313d] hover:text-white'
        >
          Zurück zur Liste
        </Link>

        <article className='overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_10px_36px_rgba(0,0,0,0.1)]'>
          <PropertyGallery images={property.images} propertyTitle={property.title} />

          <div className='space-y-5 p-6'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-extrabold text-[#0d1a27]'>{property.title}</h1>
              <p className='text-sm text-zinc-700'>
                {property.address}, {property.zipCode} {property.city}
              </p>
            </div>

            <div className='grid grid-cols-2 gap-3 rounded-lg bg-[#f7f8fa] p-4 text-sm md:grid-cols-4'>
              <div>
                <p className='text-zinc-500'>{LISTING_PRICE_LABELS[listingSegment]}</p>
                <p className='font-medium text-zinc-900'>
                  {property.price.toLocaleString('de-DE')} {property.currency}
                </p>
              </div>
              <div>
                <p className='text-zinc-500'>Fläche</p>
                <p className='font-medium text-zinc-900'>{property.areaSqm} m2</p>
              </div>
              <div>
                <p className='text-zinc-500'>Zimmer</p>
                <p className='font-medium text-zinc-900'>{property.rooms}</p>
              </div>
              <div>
                <p className='text-zinc-500'>Schlafzimmer</p>
                <p className='font-medium text-zinc-900'>{property.bedrooms}</p>
              </div>
            </div>

            <section className='space-y-2'>
              <h2 className='text-lg font-bold text-[#14202c]'>Beschreibung</h2>
              <p className='whitespace-pre-line text-sm leading-6 text-zinc-700'>
                {property.description || 'Keine Beschreibung vorhanden.'}
              </p>
            </section>

            <PropertyCarousel
              listingSegment={listingSegment}
              properties={relatedProperties}
            />
          </div>
        </article>
      </div>
    </main>
  )
}
