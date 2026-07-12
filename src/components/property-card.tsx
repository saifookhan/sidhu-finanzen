import Link from 'next/link'

import { buildListingDetailPath } from '@/lib/listing'
import { cn } from '@/lib/utils'
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
  return (
    <article
      className={cn(
        'overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
        'transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)]'
      )}
    >
      <div className='h-44 w-full bg-gradient-to-r from-[#dde3ea] to-[#f0f3f6]'>
        {property.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.imageUrl}
            alt={property.title}
            className='h-full w-full object-cover'
            loading='lazy'
          />
        ) : null}
      </div>

      <div className='space-y-2 p-4'>
        <h2 className='line-clamp-1 text-lg font-bold text-[#14202c]'>
          {property.title}
        </h2>
        <p className='text-sm text-zinc-700'>
          {property.zipCode} {property.city}
        </p>
        <p className='text-sm text-zinc-700'>
          {property.areaSqm} m2 · {property.rooms} Zimmer · {property.bedrooms} Schlafzimmer
        </p>
        <div className='flex items-center justify-between pt-2'>
          <strong className='text-lg text-[#0d1a27]'>
            {property.price.toLocaleString('de-DE')} {property.currency}
          </strong>
          <Link
            href={buildListingDetailPath(property.listingSegment, property.id)}
            className='rounded-md border border-[#24313d] px-3 py-1.5 text-sm font-medium text-[#24313d] transition hover:bg-[#24313d] hover:text-white'
          >
            Mehr erfahren
          </Link>
        </div>
      </div>
    </article>
  )
}
