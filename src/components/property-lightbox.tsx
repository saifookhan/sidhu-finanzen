'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { useVisualViewportRect } from '@/hooks/use-visual-viewport-rect'
import { postIframeLightboxState } from '@/lib/iframe-embed'

type PropertyLightboxProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  ariaLabel?: string
}

/**
 * Viewport-locked lightbox rendered via portal for iframe-safe fullscreen display.
 *
 * @param isOpen Whether the lightbox is visible.
 * @param onClose Callback fired when the backdrop is clicked.
 * @param children Lightbox content.
 * @param ariaLabel Accessible label for the dialog.
 */
export const PropertyLightbox = ({
  isOpen,
  onClose,
  children,
  ariaLabel = 'Bildergalerie Vollbild',
}: PropertyLightboxProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const viewportRect = useVisualViewportRect(isOpen)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    postIframeLightboxState(true)

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
      postIframeLightboxState(false)
    }
  }, [isOpen])

  if (!isMounted || !isOpen) {
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
