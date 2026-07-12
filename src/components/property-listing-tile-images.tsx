'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import type { PropertyImage } from '@/types/property'

const MIN_AUTO_SLIDE_DELAY_MS = 1400
const MAX_AUTO_SLIDE_DELAY_MS = 2600

type PropertyListingTileImagesProps = {
  images: PropertyImage[]
  fallbackImageUrl: string | null
  propertyTitle: string
  detailPath: string
}

/**
 * Picks a random delay for the next automatic slide transition.
 */
const getRandomSlideDelay = (): number => {
  return (
    MIN_AUTO_SLIDE_DELAY_MS +
    Math.floor(Math.random() * (MAX_AUTO_SLIDE_DELAY_MS - MIN_AUTO_SLIDE_DELAY_MS + 1))
  )
}

/**
 * Resolves the image slides shown in one listing tile.
 *
 * @param images Property images from OnOffice.
 * @param fallbackImageUrl Single cover image fallback.
 * @param propertyTitle Title used when image metadata is missing.
 */
const resolveTileImages = (
  images: PropertyImage[],
  fallbackImageUrl: string | null,
  propertyTitle: string
): PropertyImage[] => {
  if (images.length > 0) {
    return images
  }

  if (fallbackImageUrl) {
    return [{ url: fallbackImageUrl, title: propertyTitle, type: 'photo' }]
  }

  return []
}

/**
 * Auto-advancing image stack for listing tiles with manual controls.
 *
 * @param images Property images from OnOffice.
 * @param fallbackImageUrl Single cover image fallback.
 * @param propertyTitle Title used for image alt text.
 * @param detailPath Detail page path for the image link.
 */
export const PropertyListingTileImages = ({
  images,
  fallbackImageUrl,
  propertyTitle,
  detailPath,
}: PropertyListingTileImagesProps) => {
  const slides = resolveTileImages(images, fallbackImageUrl, propertyTitle)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [slideToken, setSlideToken] = useState(0)
  const hasMultipleSlides = slides.length > 1

  /**
   * Advances or rewinds the visible slide and resets autoplay timing.
   *
   * @param offset Direction to move within the slide list.
   */
  const goToOffset = useCallback(
    (offset: number) => {
      if (!hasMultipleSlides) {
        return
      }

      setActiveIndex((current) => {
        return (current + offset + slides.length) % slides.length
      })
      setSlideToken((current) => current + 1)
    },
    [hasMultipleSlides, slides.length]
  )

  useEffect(() => {
    if (!hasMultipleSlides || isPaused) {
      return
    }

    const delay = getRandomSlideDelay()
    const timeoutId = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, delay)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [hasMultipleSlides, isPaused, slides.length, activeIndex, slideToken])

  return (
    <div
      className='group/image relative aspect-[3/2] w-full overflow-hidden bg-gradient-to-r from-sidhu-border to-background'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Link
        href={detailPath}
        aria-label={propertyTitle}
        className='absolute inset-0 z-0'
      />

      {slides.length > 0 ? (
        <div className='relative h-full w-full transition-transform duration-500 group-hover:scale-105'>
          {slides.map((image, index) => {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${image.url}-${index}`}
                src={image.url}
                alt={image.title || propertyTitle}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
                  index === activeIndex ? 'opacity-100' : 'opacity-0'
                )}
                loading={index === 0 ? 'lazy' : 'lazy'}
              />
            )
          })}
        </div>
      ) : null}

      {hasMultipleSlides ? (
        <>
          <button
            type='button'
            aria-label='Vorheriges Bild'
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              goToOffset(-1)
            }}
            className={cn(
              'absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center',
              'rounded-full bg-white/90 text-sm text-sidhu-dark shadow-md transition',
              'opacity-0 hover:bg-white group-hover/image:opacity-100'
            )}
          >
            ‹
          </button>
          <button
            type='button'
            aria-label='Nächstes Bild'
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              goToOffset(1)
            }}
            className={cn(
              'absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center',
              'rounded-full bg-white/90 text-sm text-sidhu-dark shadow-md transition',
              'opacity-0 hover:bg-white group-hover/image:opacity-100'
            )}
          >
            ›
          </button>
        </>
      ) : null}
    </div>
  )
}
