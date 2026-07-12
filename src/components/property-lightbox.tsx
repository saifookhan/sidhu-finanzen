'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

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

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [isOpen])

  if (!isMounted || !isOpen) {
    return null
  }

  return createPortal(
    <div
      className='fixed inset-0 z-[9999] flex h-[100dvh] w-screen items-center justify-center bg-black/85 p-4'
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
