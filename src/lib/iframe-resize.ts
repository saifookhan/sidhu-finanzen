export const IFRAME_RESIZE_MESSAGE_TYPE = 'sidhu-iframe-resize'

export const IFRAME_PARENT_ORIGINS = [
  'https://sidhu-finanzen.de',
  'https://www.sidhu-finanzen.de',
] as const

/**
 * Returns the full document height for iframe auto-resize messaging.
 */
export const getIframeDocumentHeight = (): number => {
  return Math.ceil(document.documentElement.scrollHeight)
}

/**
 * Sends the current document height to allowed WordPress parent frames.
 */
export const postIframeHeight = (): void => {
  if (typeof window === 'undefined' || window.self === window.top) {
    return
  }

  const message = {
    type: IFRAME_RESIZE_MESSAGE_TYPE,
    height: getIframeDocumentHeight(),
  }

  for (const origin of IFRAME_PARENT_ORIGINS) {
    window.parent.postMessage(message, origin)
  }
}
