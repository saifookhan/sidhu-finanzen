'use client'

import { useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import type { PropertyImage } from '@/types/property'

type PropertyGalleryProps = {
  images: PropertyImage[]
  propertyTitle: string
}

/**
 * Property image gallery with inline navigation and fullscreen lightbox.
 *
 * @param images All images for the current property.
 * @param propertyTitle Title used for image alt text.
 */
export const PropertyGallery = ({ images, propertyTitle }: PropertyGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const totalImages = images.length
  const activeImage = images[activeIndex]

  /**
   * Moves to another image by offset, wrapping at the ends.
   *
   * @param offset Step direction relative to current index.
   */
  const goToOffset = useCallback(
    (offset: number) => {
      if (totalImages === 0) {
        return
      }

      setActiveIndex((current) => {
        return (current + offset + totalImages) % totalImages
      })
    },
    [totalImages]
  )

  /**
   * Opens the lightbox on the selected image index.
   *
   * @param index Image index to display in the popup.
   */
  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index)
    setIsLightboxOpen(true)
  }, [])

  /**
   * Closes the fullscreen lightbox popup.
   */
  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false)
  }, [])

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

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeLightbox, goToOffset, isLightboxOpen])

  if (!activeImage) {
    return (
      <div className='flex h-72 w-full items-center justify-center bg-gradient-to-r from-[#dde3ea] to-[#f0f3f6] text-sm text-zinc-600'>
        Keine Bilder verfuegbar
      </div>
    )
  }

  return (
    <>
      <section className='space-y-3'>
        <div className='group relative h-72 w-full overflow-hidden bg-gradient-to-r from-[#dde3ea] to-[#f0f3f6]'>
          <button
            type='button'
            onClick={() => openLightbox(activeIndex)}
            className='h-full w-full cursor-zoom-in'
            aria-label='Bild in Vollbild oeffnen'
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.url}
              alt={activeImage.title || propertyTitle}
              className='h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]'
            />
          </button>

          {totalImages > 1 ? (
            <>
              <button
                type='button'
                aria-label='Vorheriges Bild'
                onClick={() => goToOffset(-1)}
                className={cn(
                  'absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center',
                  'rounded-full bg-white/90 text-lg text-[#24313d] shadow-md transition hover:bg-white'
                )}
              >
                ←
              </button>
              <button
                type='button'
                aria-label='Naechstes Bild'
                onClick={() => goToOffset(1)}
                className={cn(
                  'absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center',
                  'rounded-full bg-white/90 text-lg text-[#24313d] shadow-md transition hover:bg-white'
                )}
              >
                →
              </button>
              <span className='absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white'>
                {activeIndex + 1} / {totalImages}
              </span>
            </>
          ) : null}
        </div>

        {totalImages > 1 ? (
          <div
            className={cn(
              'flex gap-2 overflow-x-auto pb-1',
              '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            )}
          >
            {images.map((image, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={`${image.url}-${index}`}
                  type='button'
                  onClick={() => setActiveIndex(index)}
                  onDoubleClick={() => openLightbox(index)}
                  aria-label={`Bild ${index + 1} anzeigen`}
                  className={cn(
                    'h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition',
                    isActive ? 'border-[#24313d]' : 'border-transparent opacity-75 hover:opacity-100'
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.title || `${propertyTitle} ${index + 1}`}
                    className='h-full w-full object-cover'
                    loading='lazy'
                  />
                </button>
              )
            })}
          </div>
        ) : null}
      </section>

      {isLightboxOpen ? (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4'
          role='dialog'
          aria-modal='true'
          aria-label='Bildergalerie Vollbild'
          onClick={closeLightbox}
        >
          <button
            type='button'
            aria-label='Galerie schliessen'
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
                aria-label='Naechstes Bild'
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
            className='flex max-h-[90vh] max-w-5xl flex-col items-center gap-3'
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.url}
              alt={activeImage.title || propertyTitle}
              className='max-h-[80vh] w-auto max-w-full rounded-lg object-contain'
            />
            <p className='text-sm text-white/80'>
              {activeImage.title || propertyTitle} · {activeIndex + 1} / {totalImages}
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}
