'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import {
  postIframeHeight,
  postIframeHeightBurst,
  postIframeNavigation,
} from '@/lib/iframe-embed'

/**
 * Syncs embed navigation and document height with the WordPress parent frame.
 */
export const IframeEmbedBridge = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  useEffect(() => {
    document.documentElement.classList.add('embed-root')
    document.body.classList.add('embed-root')

    return () => {
      document.documentElement.classList.remove('embed-root')
      document.body.classList.remove('embed-root')
    }
  }, [])

  useEffect(() => {
    if (window.self === window.top) {
      return
    }

    window.scrollTo(0, 0)

    postIframeNavigation(pathname)
    postIframeHeightBurst()

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

    const mainElement = document.querySelector('main')

    const resizeObserver = new ResizeObserver(scheduleHeightReport)
    if (mainElement instanceof HTMLElement) {
      resizeObserver.observe(mainElement)
    } else {
      resizeObserver.observe(document.body)
    }

    const mutationObserver = new MutationObserver(scheduleHeightReport)
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    /**
     * Reports height again once lazy-loaded media finishes loading.
     *
     * @param event Load event from an image or iframe element.
     */
    const handleMediaLoad = (event: Event) => {
      const target = event.target
      if (target instanceof HTMLImageElement || target instanceof HTMLIFrameElement) {
        scheduleHeightReport()
      }
    }

    window.addEventListener('resize', scheduleHeightReport)
    window.addEventListener('load', scheduleHeightReport, true)
    document.addEventListener('load', handleMediaLoad, true)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('resize', scheduleHeightReport)
      window.removeEventListener('load', scheduleHeightReport, true)
      document.removeEventListener('load', handleMediaLoad, true)
    }
  }, [pathname, query])

  return null
}
