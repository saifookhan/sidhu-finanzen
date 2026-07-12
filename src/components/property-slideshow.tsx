'use client'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { PropertyLightbox } from '@/components/property-lightbox'
import type { PropertyImage } from '@/types/property'

const AUTO_SLIDE_DELAY_MS = 3500
const VISIBLE_SLIDE_COUNT = 3

type PropertySlideshowProps = {
  images: PropertyImage[]
  propertyTitle: string
}

/**
 * Auto-advancing full-width property slideshow showing three images at a time.
 *
 * @param images All images for the current property.
 * @param propertyTitle Title used for image alt text.
 */
export const PropertySlideshow = ({
  images,
  propertyTitle,
}: PropertySlideshowProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 18 },
    [
      Autoplay({
        delay: AUTO_SLIDE_DELAY_MS,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  )

  const totalImages = images.length
  const visibleSlideCount = Math.min(VISIBLE_SLIDE_COUNT, totalImages)
  const activeImage = images[activeIndex]

  /**
   * Moves to another image by offset, wrapping at the ends.
   *
   * @param offset Step direction relative to current index.
   */
  const goToOffset = useCallback(
    (offset: number) => {
      if (!emblaApi || totalImages === 0) {
        return
      }

      if (offset < 0) {
        emblaApi.scrollPrev()
        return
      }

      emblaApi.scrollNext()
    },
    [emblaApi, totalImages]
  )

  /**
   * Opens the lightbox on the selected image index.
   *
   * @param index Image index to display in the popup.
   */
  const openLightbox = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
      setActiveIndex(index)
      setIsLightboxOpen(true)
    },
    [emblaApi]
  )

  /**
   * Closes the fullscreen lightbox popup.
   */
  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false)
  }, [])

  useEffect(() => {
    if (!emblaApi) {
      return
    }

    /**
     * Syncs the active index when the carousel slide changes.
     */
    const handleSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', handleSelect)
    handleSelect()

    return () => {
      emblaApi.off('select', handleSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!isLightboxOpen) {
      return
    }

    /**
     * Handles keyboard navigation inside the lightbox.
     *
     * @param event Keyboard event from the document.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox()
      }

      if (event.key === 'ArrowLeft') {
        goToOffset(-1)
      }

      if (event.key === 'ArrowRight') {
        goToOffset(1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeLightbox, goToOffset, isLightboxOpen])

  if (!activeImage) {
    return (
      <div className='flex aspect-video w-full items-center justify-center bg-gradient-to-r from-[#e4e4e7] to-[#f4f4f5] text-sm text-zinc-600'>
        Keine Bilder verfügbar
      </div>
    )
  }

  return (
    <>
      <section className='relative w-full overflow-hidden bg-[#27272a]'>
        <div className='overflow-hidden' ref={emblaRef}>
          <div className='flex gap-2'>
            {images.map((image, index) => {
              return (
                <div
                  key={`${image.url}-${index}`}
                  className={cn(
                    'relative min-w-0 shrink-0',
                    visibleSlideCount === 3 && 'flex-[0_0_calc((100%-1rem)/3)]',
                    visibleSlideCount === 2 && 'flex-[0_0_calc((100%-0.5rem)/2)]',
                    visibleSlideCount === 1 && 'flex-[0_0_100%]'
                  )}
                >
                  <div className='relative aspect-[4/3] w-full'>
                    <button
                      type='button'
                      onClick={() => openLightbox(index)}
                      className='h-full w-full cursor-zoom-in'
                      aria-label='Bild in Vollbild öffnen'
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={image.title || propertyTitle}
                        className='h-full w-full object-cover'
                      />
                    </button>

                    {image.title ? (
                      <p className='pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm font-medium text-white'>
                        {image.title}
                      </p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {totalImages > visibleSlideCount ? (
          <>
            <button
              type='button'
              aria-label='Vorheriges Bild'
              onClick={() => goToOffset(-1)}
              className={cn(
                'absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center',
                'rounded-full bg-white/90 text-lg text-[#52525b] shadow-md transition hover:bg-white'
              )}
            >
              ←
            </button>
            <button
              type='button'
              aria-label='Nächstes Bild'
              onClick={() => goToOffset(1)}
              className={cn(
                'absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center',
                'rounded-full bg-white/90 text-lg text-[#52525b] shadow-md transition hover:bg-white'
              )}
            >
              →
            </button>
            <span className='absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white'>
              {activeIndex + 1} / {totalImages}
            </span>
          </>
        ) : null}
      </section>

      {isLightboxOpen ? (
        <PropertyLightbox isOpen={isLightboxOpen} onClose={closeLightbox}>
          <button
            type='button'
            aria-label='Galerie schließen'
            onClick={closeLightbox}
            className='absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25'
          >
            ×
          </button>

          {totalImages > 1 ? (
            <>
              <button
                type='button'
                aria-label='Vorheriges Bild'
                onClick={(event) => {
                  event.stopPropagation()
                  goToOffset(-1)
                }}
                className='absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25'
              >
                ←
              </button>
              <button
                type='button'
                aria-label='Nächstes Bild'
                onClick={(event) => {
                  event.stopPropagation()
                  goToOffset(1)
                }}
                className='absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25'
              >
                →
              </button>
            </>
          ) : null}

          <div
            className='flex max-h-[90dvh] max-w-5xl flex-col items-center gap-3'
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.url}
              alt={activeImage.title || propertyTitle}
              className='max-h-[80dvh] w-auto max-w-full rounded-lg object-contain'
            />
            <p className='text-sm text-white/80'>
              {activeImage.title || propertyTitle} · {activeIndex + 1} / {totalImages}
            </p>
          </div>
        </PropertyLightbox>
      ) : null}
    </>
  )
}
