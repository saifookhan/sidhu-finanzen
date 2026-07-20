'use client'

import { useEffect, useState } from 'react'

export type VisualViewportRect = {
  top: number
  left: number
  width: number
  height: number
}

/**
 * Returns the browser-visible viewport rectangle for iframe-safe fixed overlays.
 *
 * @param isActive Whether viewport tracking should run.
 */
export const useVisualViewportRect = (isActive: boolean): VisualViewportRect => {
  const [rect, setRect] = useState<VisualViewportRect>(() => ({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  }))

  useEffect(() => {
    if (!isActive) {
      return
    }

    /**
     * Syncs overlay bounds with the currently visible viewport area.
     */
    const updateRect = () => {
      const visualViewport = window.visualViewport

      if (!visualViewport) {
        setRect({
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        })
        return
      }

      setRect({
        top: visualViewport.offsetTop,
        left: visualViewport.offsetLeft,
        width: visualViewport.width,
        height: visualViewport.height,
      })
    }

    updateRect()

    const visualViewport = window.visualViewport
    visualViewport?.addEventListener('resize', updateRect)
    visualViewport?.addEventListener('scroll', updateRect)
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    return () => {
      visualViewport?.removeEventListener('resize', updateRect)
      visualViewport?.removeEventListener('scroll', updateRect)
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [isActive])

  return rect
}
