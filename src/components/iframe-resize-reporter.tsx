'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { postIframeHeight } from '@/lib/iframe-resize'

/**
 * Reports embed page height to the WordPress parent frame via postMessage.
 */
export const IframeResizeReporter = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (window.self === window.top) {
      return
    }

    let frameId = 0

    /**
     * Schedules one height report on the next animation frame.
     */
    const scheduleHeightReport = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => {
        postIframeHeight()
      })
    }

    scheduleHeightReport()

    const resizeObserver = new ResizeObserver(scheduleHeightReport)
    resizeObserver.observe(document.documentElement)

    const mutationObserver = new MutationObserver(scheduleHeightReport)
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    window.addEventListener('resize', scheduleHeightReport)
    window.addEventListener('load', scheduleHeightReport, true)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('resize', scheduleHeightReport)
      window.removeEventListener('load', scheduleHeightReport, true)
    }
  }, [pathname])

  return null
}
