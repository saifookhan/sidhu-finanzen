'use client'

import { useCallback, useRef } from 'react'

import { PropertyListingTile } from '@/components/property-listing-tile'
import { type ListingSegment } from '@/lib/listing'
import { cn } from '@/lib/utils'
import type { Property } from '@/types/property'

type PropertyCarouselProps = {
  listingSegment: ListingSegment
  properties: Property[]
}

/**
 * Horizontal carousel of property cards with scroll controls.
 *
 * @param properties Related properties to display (excluding current).
 */
export const PropertyCarousel = ({
  listingSegment,
  properties,
}: PropertyCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null)

  /**
   * Scrolls the carousel track by one card width.
   *
   * @param direction Scroll direction relative to current view.
   */
  const scrollByCard = useCallback((direction: 'prev' | 'next') => {
    const track = trackRef.current
    if (!track) {
      return
    }

    const cardWidth = track.querySelector('article')?.clientWidth ?? 320
    const gap = 16
    const offset = direction === 'next' ? cardWidth + gap : -(cardWidth + gap)

    track.scrollBy({ left: offset, behavior: 'smooth' })
  }, [])

  if (properties.length === 0) {
    return null
  }

  return (
    <section className='space-y-4 border-t border-black/10 pt-6'>
      <div className='flex items-end justify-between gap-4'>
        <div className='space-y-1'>
          <h2 className='text-lg font-bold text-[#18181b]'>Weitere Immobilien</h2>
          <p className='text-sm text-zinc-600'>Entdecke weitere aktive Angebote</p>
        </div>

        <div className='flex shrink-0 gap-2'>
          <button
            type='button'
            aria-label='Vorherige Immobilie'
            onClick={() => scrollByCard('prev')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border border-[#52525b]',
              'text-[#52525b] transition hover:bg-[#52525b] hover:text-white'
            )}
          >
            ←
          </button>
          <button
            type='button'
            aria-label='Naechste Immobilie'
            onClick={() => scrollByCard('next')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border border-[#52525b]',
              'text-[#52525b] transition hover:bg-[#52525b] hover:text-white'
            )}
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className={cn(
          'flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        )}
      >
        {properties.map((property) => {
          return (
            <PropertyListingTile
              key={property.id}
              property={{ ...property, listingSegment }}
              className='w-[min(100%,320px)] shrink-0 snap-start'
            />
          )
        })}
      </div>
    </section>
  )
}
