'use client'

import Link from 'next/link'
import { useCallback, useRef } from 'react'

import { cn } from '@/lib/utils'
import type { Property } from '@/types/property'

type PropertyCarouselProps = {
  properties: Property[]
}

/**
 * Horizontal carousel of property cards with scroll controls.
 *
 * @param properties Related properties to display (excluding current).
 */
export const PropertyCarousel = ({ properties }: PropertyCarouselProps) => {
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
          <h2 className='text-lg font-bold text-[#14202c]'>Weitere Immobilien</h2>
          <p className='text-sm text-zinc-600'>Entdecke weitere aktive Angebote</p>
        </div>

        <div className='flex shrink-0 gap-2'>
          <button
            type='button'
            aria-label='Vorherige Immobilie'
            onClick={() => scrollByCard('prev')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border border-[#24313d]',
              'text-[#24313d] transition hover:bg-[#24313d] hover:text-white'
            )}
          >
            ←
          </button>
          <button
            type='button'
            aria-label='Naechste Immobilie'
            onClick={() => scrollByCard('next')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border border-[#24313d]',
              'text-[#24313d] transition hover:bg-[#24313d] hover:text-white'
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
            <article
              key={property.id}
              className={cn(
                'w-[min(100%,280px)] shrink-0 snap-start overflow-hidden rounded-xl',
                'border border-black/10 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]',
                'transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)]'
              )}
            >
              <div className='h-36 w-full bg-gradient-to-r from-[#dde3ea] to-[#f0f3f6]'>
                {property.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={property.imageUrl}
                    alt={property.title || 'Immobilie'}
                    className='h-full w-full object-cover'
                    loading='lazy'
                  />
                ) : null}
              </div>

              <div className='space-y-2 p-4'>
                <h3 className='line-clamp-2 min-h-[2.5rem] text-base font-bold text-[#14202c]'>
                  {property.title || 'Immobilie'}
                </h3>
                <p className='text-xs text-zinc-700'>
                  {property.zipCode} {property.city}
                </p>
                <p className='text-xs text-zinc-700'>
                  {property.areaSqm} m2 · {property.rooms} Zimmer
                </p>
                <div className='flex items-center justify-between pt-1'>
                  <strong className='text-sm text-[#0d1a27]'>
                    {property.price.toLocaleString('de-DE')} {property.currency}
                  </strong>
                  <Link
                    href={`/immobilien/${property.id}`}
                    className='rounded-md border border-[#24313d] px-2.5 py-1 text-xs font-medium text-[#24313d] transition hover:bg-[#24313d] hover:text-white'
                  >
                    Ansehen
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
