export const IFRAME_RESIZE_MESSAGE_TYPE = 'sidhu-iframe-resize'
export const IFRAME_NAVIGATE_MESSAGE_TYPE = 'sidhu-iframe-navigate'
export const IFRAME_LIGHTBOX_MESSAGE_TYPE = 'sidhu-iframe-lightbox'
export const IFRAME_LIGHTBOX_CLOSE_MESSAGE_TYPE = 'sidhu-iframe-lightbox-close'

export type IframeLightboxImage = {
  url: string
  title?: string
}

export type IframeLightboxPayload = {
  isOpen: boolean
  images?: IframeLightboxImage[]
  activeIndex?: number
  propertyTitle?: string
}

export const IFRAME_PARENT_ORIGINS = [
  'https://sidhu-finanzen.de',
  'https://www.sidhu-finanzen.de',
] as const

export const IFRAME_HEIGHT_REPORT_DELAYS_MS = [0, 50, 150, 300, 600, 1000, 2000] as const

let lastReportedHeight = 0

const immobilienDetailPathPattern = /^\/immobilien\/(kaufen|mieten)\/([^/]+)$/

export type IframeNavigationState = {
  listingSegment: 'kaufen' | 'mieten' | null
  propertyId: string | null
}

/**
 * Parses listing navigation state from an app pathname.
 *
 * @param pathname Current immobilien pathname.
 */
export const parseIframeNavigationState = (pathname: string): IframeNavigationState => {
  const match = pathname.match(immobilienDetailPathPattern)

  if (!match) {
    return {
      listingSegment: null,
      propertyId: null,
    }
  }

  const listingSegment = match[1]
  const propertyId = match[2]

  if (listingSegment !== 'kaufen' && listingSegment !== 'mieten') {
    return {
      listingSegment: null,
      propertyId: null,
    }
  }

  return {
    listingSegment,
    propertyId,
  }
}

/**
 * Returns the visible content height for iframe auto-resize messaging.
 */
export const getIframeDocumentHeight = (): number => {
  const main = document.querySelector('main')

  if (main instanceof HTMLElement) {
    const styles = window.getComputedStyle(main)
    const marginBottom = Number.parseFloat(styles.marginBottom) || 0
    return Math.ceil(main.offsetTop + main.offsetHeight + marginBottom)
  }

  return Math.ceil(document.documentElement.scrollHeight)
}

/**
 * Sends a postMessage payload to allowed WordPress parent frames.
 *
 * @param message Serializable iframe bridge payload.
 */
const postToParentFrames = (message: Record<string, unknown>): void => {
  if (typeof window === 'undefined' || window.self === window.top) {
    return
  }

  for (const origin of IFRAME_PARENT_ORIGINS) {
    window.parent.postMessage(message, origin)
  }
}

/**
 * Sends the current document height to allowed WordPress parent frames.
 */
export const postIframeHeight = (): void => {
  const height = getIframeDocumentHeight()

  if (height === lastReportedHeight) {
    return
  }

  lastReportedHeight = height

  postToParentFrames({
    type: IFRAME_RESIZE_MESSAGE_TYPE,
    height,
  })
}

/**
 * Sends the current immobilien path to the WordPress parent for URL syncing.
 *
 * @param pathname Current immobilien pathname.
 */
export const postIframeNavigation = (pathname: string): void => {
  const navigation = parseIframeNavigationState(pathname)

  postToParentFrames({
    type: IFRAME_NAVIGATE_MESSAGE_TYPE,
    path: pathname,
    listingSegment: navigation.listingSegment,
    propertyId: navigation.propertyId,
    url: `${window.location.origin}${pathname}`,
  })
}

/**
 * Returns whether the app is running inside an allowed WordPress iframe embed.
 */
export const isIframeEmbedded = (): boolean => {
  if (typeof window === 'undefined' || window.self === window.top) {
    return false
  }

  if (typeof document === 'undefined' || document.referrer === '') {
    return true
  }

  try {
    const referrerOrigin = new URL(document.referrer).origin
    return IFRAME_PARENT_ORIGINS.includes(
      referrerOrigin as (typeof IFRAME_PARENT_ORIGINS)[number]
    )
  } catch {
    return true
  }
}

/**
 * Notifies the WordPress parent when a fullscreen lightbox opens or closes.
 *
 * @param payload Serializable lightbox state for the parent overlay.
 */
export const postIframeLightboxState = (payload: IframeLightboxPayload): void => {
  postToParentFrames({
    type: IFRAME_LIGHTBOX_MESSAGE_TYPE,
    ...payload,
  })
}

/**
 * Schedules multiple height reports to catch post-navigation layout shifts.
 */
export const postIframeHeightBurst = (): void => {
  for (const delay of IFRAME_HEIGHT_REPORT_DELAYS_MS) {
    window.setTimeout(() => {
      postIframeHeight()
    }, delay)
  }
}
