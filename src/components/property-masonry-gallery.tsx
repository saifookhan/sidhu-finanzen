'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { PropertyLightbox } from '@/components/property-lightbox'
import { isIframeEmbedded, isIframeLightboxOpenSuppressed, suppressIframeLightboxOpen } from '@/lib/iframe-embed'
import { cn } from '@/lib/utils'
import type { PropertyImage } from '@/types/property'

type PropertyMasonryGalleryProps = {
  images: PropertyImage[]
  propertyTitle: string
}

/**
 * Masonry image grid matching the Elementor gallery layout on the reference site.
 *
 * @param images All images for the current property.
 * @param propertyTitle Title used for image alt text.
 */
export const PropertyMasonryGallery = ({
  images,
  propertyTitle,
}: PropertyMasonryGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const totalImages = images.length
  const activeImage = activeIndex === null ? null : images[activeIndex]
  const iframeImages = useMemo(
    () =>
      images.map((image) => ({
        url: image.url,
        title: image.title,
      })),
    [images]
  )

  /**
   * Moves to another image by offset, wrapping at the ends.
   *
   * @param offset Step direction relative to current index.
   */
  const goToOffset = useCallback(
    (offset: number) => {
      if (activeIndex === null || totalImages === 0) {
        return
      }

      setActiveIndex((current) => {
        if (current === null) {
          return 0
        }

        return (current + offset + totalImages) % totalImages
      })
    },
    [activeIndex, totalImages]
  )

  /**
   * Opens the lightbox on the selected image index.
   *
   * @param index Image index to display in the popup.
   */
  const openLightbox = useCallback((index: number) => {
    if (isIframeLightboxOpenSuppressed()) {
      return
    }

    setActiveIndex(index)
  }, [])

  /**
   * Closes the fullscreen lightbox popup.
   */
  const closeLightbox = useCallback(() => {
    suppressIframeLightboxOpen()
    setActiveIndex(null)
  }, [])

  useEffect(() => {
    if (activeIndex === null || isIframeEmbedded()) {
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
  }, [activeIndex, closeLightbox, goToOffset])

  if (totalImages === 0) {
    return null
  }

  return (
    <>
      <section className="border-t border-black/10 pt-6">
        <div
          className={cn(
            "columns-2 gap-3 sm:columns-3",
            "[&>button]:mb-3 [&>button]:break-inside-avoid",
          )}
        >
          {images.map((image, index) => {
            return (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => openLightbox(index)}
                aria-label={image.title || `Bild ${index + 1} anzeigen`}
                className={cn(
                  "group relative w-full overflow-hidden rounded-lg",
                  "cursor-zoom-in bg-[#f4f4f5] transition hover:opacity-95",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.title || `${propertyTitle} ${index + 1}`}
                  className="h-auto w-full object-cover transition duration-1500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                {image.title ? (
                  <span
                    className={cn(
                      "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent",
                      "px-3 py-2 text-left text-xs font-medium text-white opacity-0",
                      "transition group-hover:opacity-100",
                    )}
                  >
                    {image.title}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      {activeImage && activeIndex !== null ? (
        <PropertyLightbox
          isOpen={activeIndex !== null}
          onClose={closeLightbox}
          iframeImages={iframeImages}
          iframeActiveIndex={activeIndex}
          iframePropertyTitle={propertyTitle}
        >
          <button
            type="button"
            aria-label="Galerie schließen"
            onClick={closeLightbox}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25"
          >
            ×
          </button>

          {totalImages > 1 ? (
            <>
              <button
                type="button"
                aria-label="Vorheriges Bild"
                onClick={(event) => {
                  event.stopPropagation();
                  goToOffset(-1);
                }}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Nächstes Bild"
                onClick={(event) => {
                  event.stopPropagation();
                  goToOffset(1);
                }}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          ) : null}

          <div
            className="flex max-h-[90dvh] max-w-5xl flex-col items-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.url}
              alt={activeImage.title || propertyTitle}
              className="max-h-[80dvh] w-auto max-w-full rounded-lg object-contain"
            />
            <p className="text-sm text-white/80">
              {activeImage.title || propertyTitle} · {activeIndex + 1} /{" "}
              {totalImages}
            </p>
          </div>
        </PropertyLightbox>
      ) : null}
    </>
  );
}
