'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { useVisualViewportRect } from '@/hooks/use-visual-viewport-rect'
import {
  IFRAME_LIGHTBOX_CLOSE_MESSAGE_TYPE,
  IFRAME_PARENT_ORIGINS,
  type IframeLightboxImage,
  isIframeEmbedded,
  postIframeLightboxState,
  suppressIframeLightboxOpen,
} from '@/lib/iframe-embed'

type PropertyLightboxProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  ariaLabel?: string
  iframeImages?: IframeLightboxImage[]
  iframeActiveIndex?: number
  iframePropertyTitle?: string
}

/**
 * Builds a stable postMessage key for parent lightbox state deduplication.
 *
 * @param isOpen Whether the lightbox is open.
 * @param iframeImages Serializable gallery images.
 * @param iframeActiveIndex Active image index.
 * @param iframePropertyTitle Property title for captions.
 */
const buildLightboxPostKey = (
  isOpen: boolean,
  iframeImages: IframeLightboxImage[] | undefined,
  iframeActiveIndex: number,
  iframePropertyTitle: string
): string => {
  if (!isOpen) {
    return 'closed'
  }

  return JSON.stringify({
    activeIndex: iframeActiveIndex,
    images: iframeImages ?? [],
    propertyTitle: iframePropertyTitle,
  })
}

/**
 * Viewport-locked lightbox rendered via portal for iframe-safe fullscreen display.
 *
 * @param isOpen Whether the lightbox is visible.
 * @param onClose Callback fired when the backdrop is clicked.
 * @param children Lightbox content.
 * @param ariaLabel Accessible label for the dialog.
 * @param iframeImages Serializable gallery images for parent-page lightbox mode.
 * @param iframeActiveIndex Active image index for parent-page lightbox mode.
 * @param iframePropertyTitle Property title used in parent-page lightbox captions.
 */
export const PropertyLightbox = ({
  isOpen,
  onClose,
  children,
  ariaLabel = 'Bildergalerie Vollbild',
  iframeImages,
  iframeActiveIndex = 0,
  iframePropertyTitle = '',
}: PropertyLightboxProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isEmbedded] = useState(isIframeEmbedded)
  const lastPostedKeyRef = useRef<string | null>(null)
  const viewportRect = useVisualViewportRect(isOpen && !isEmbedded)
  const usesParentLightbox =
    isEmbedded && Array.isArray(iframeImages) && iframeImages.length > 0

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!usesParentLightbox) {
      return
    }

    const nextKey = buildLightboxPostKey(
      isOpen,
      iframeImages,
      iframeActiveIndex,
      iframePropertyTitle
    )

    if (lastPostedKeyRef.current === nextKey) {
      return
    }

    lastPostedKeyRef.current = nextKey

    if (!isOpen) {
      postIframeLightboxState({ isOpen: false })
      return
    }

    postIframeLightboxState({
      isOpen: true,
      images: iframeImages,
      activeIndex: iframeActiveIndex,
      propertyTitle: iframePropertyTitle,
    })
  }, [
    iframeActiveIndex,
    iframeImages,
    iframePropertyTitle,
    isOpen,
    usesParentLightbox,
  ])

  useEffect(() => {
    if (!usesParentLightbox) {
      return
    }

    return () => {
      lastPostedKeyRef.current = 'closed'
      postIframeLightboxState({ isOpen: false })
    }
  }, [usesParentLightbox])

  useEffect(() => {
    if (!usesParentLightbox) {
      return
    }

    /**
     * Syncs iframe lightbox state when the parent overlay closes.
     *
     * @param event Cross-window message from the WordPress parent page.
     */
    const handleMessage = (event: MessageEvent) => {
      if (
        !IFRAME_PARENT_ORIGINS.includes(
          event.origin as (typeof IFRAME_PARENT_ORIGINS)[number]
        )
      ) {
        return
      }

      if (
        typeof event.data !== 'object' ||
        event.data === null ||
        !('type' in event.data) ||
        event.data.type !== IFRAME_LIGHTBOX_CLOSE_MESSAGE_TYPE
      ) {
        return
      }

      lastPostedKeyRef.current = 'closed'
      suppressIframeLightboxOpen(700)
      onClose()
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [onClose, usesParentLightbox])

  useEffect(() => {
    if (!isOpen || usesParentLightbox || isEmbedded) {
      return
    }

    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [isEmbedded, isOpen, usesParentLightbox])

  if (!isMounted || !isOpen || usesParentLightbox || isEmbedded) {
    return null
  }

  const overlayStyle: CSSProperties = {
    top: viewportRect.top,
    left: viewportRect.left,
    width: viewportRect.width || '100vw',
    height: viewportRect.height || '100dvh',
  }

  return createPortal(
    <div
      className='fixed z-[9999] flex items-center justify-center bg-black/85 p-4'
      style={overlayStyle}
      role='dialog'
      aria-modal='true'
      aria-label={ariaLabel}
      onClick={onClose}
    >
      {children}
    </div>,
    document.body
  )
}
