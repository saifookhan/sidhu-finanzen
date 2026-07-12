'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import type { PropertyImage } from '@/types/property'

const AUTO_SLIDE_DELAY_MS = 3500

type PropertyListingTileImagesProps = {
  images: PropertyImage[]
  fallbackImageUrl: string | null
  propertyTitle: string
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
 * Auto-advancing image stack for listing tiles.
 *
 * @param images Property images from OnOffice.
 * @param fallbackImageUrl Single cover image fallback.
 * @param propertyTitle Title used for image alt text.
 */
export const PropertyListingTileImages = ({
  images,
  fallbackImageUrl,
  propertyTitle,
}: PropertyListingTileImagesProps) => {
  const slides = resolveTileImages(images, fallbackImageUrl, propertyTitle)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (slides.length <= 1 || isPaused) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, AUTO_SLIDE_DELAY_MS)

    return () => {
      window.clearInterval(timer)
    }
  }, [isPaused, slides.length])

  return (
    <div
      className='aspect-[3/2] w-full overflow-hidden bg-gradient-to-r from-sidhu-border to-background'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
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
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
                  index === activeIndex ? 'opacity-100' : 'opacity-0'
                )}
                loading={index === 0 ? 'lazy' : 'lazy'}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
