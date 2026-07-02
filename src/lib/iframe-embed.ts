export const IFRAME_RESIZE_MESSAGE_TYPE = 'sidhu-iframe-resize'
export const IFRAME_NAVIGATE_MESSAGE_TYPE = 'sidhu-iframe-navigate'

export const IMMOBILIEN_LIST_PATH = '/immobilien'

export const IFRAME_PARENT_ORIGINS = [
  'https://sidhu-finanzen.de',
  'https://www.sidhu-finanzen.de',
] as const

export const IFRAME_HEIGHT_REPORT_DELAYS_MS = [0, 50, 150, 300, 600, 1000, 2000] as const

const immobilienDetailPathPattern = /^\/immobilien\/([^/]+)$/

/**
 * Builds the detail path for one property.
 *
 * @param propertyId OnOffice property id.
 */
export const buildImmobilienDetailPath = (propertyId: string): string => {
  return `${IMMOBILIEN_LIST_PATH}/${propertyId}`
}

/**
 * Extracts a property id from an immobilien detail pathname.
 *
 * @param pathname Current immobilien pathname.
 */
export const parseImmobilienPropertyId = (pathname: string): string | null => {
  const match = pathname.match(immobilienDetailPathPattern)
  return match?.[1] ?? null
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
  postToParentFrames({
    type: IFRAME_RESIZE_MESSAGE_TYPE,
    height: getIframeDocumentHeight(),
  })
}

/**
 * Sends the current immobilien path to the WordPress parent for URL syncing.
 *
 * @param pathname Current immobilien pathname.
 */
export const postIframeNavigation = (pathname: string): void => {
  const propertyId = parseImmobilienPropertyId(pathname)

  postToParentFrames({
    type: IFRAME_NAVIGATE_MESSAGE_TYPE,
    path: pathname,
    propertyId,
    url: `${window.location.origin}${pathname}`,
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
