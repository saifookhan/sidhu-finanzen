/**
 * Smooth iframe height animator for WordPress embed pages.
 *
 * Usage:
 *   var resize = window.SidhuIframeResize.createAnimator(iframe, { durationMs: 350 })
 *   resize.setHeight(2400)
 */
;(function (global) {
  var DEFAULT_DURATION_MS = 350
  var MIN_DELTA_PX = 4

  /**
   * Cubic ease-out curve for height transitions.
   *
   * @param {number} progress Linear progress from 0 to 1.
   * @returns {number} Eased progress from 0 to 1.
   */
  var easeOutCubic = function (progress) {
    return 1 - Math.pow(1 - progress, 3)
  }

  /**
   * Creates a height animator for a target iframe element.
   *
   * @param {HTMLIFrameElement} iframe Embedded app iframe.
   * @param {{ durationMs?: number }} options Animation options.
   * @returns {{ setHeight: (height: number) => void }}
   */
  var createAnimator = function (iframe, options) {
    var durationMs = (options && options.durationMs) || DEFAULT_DURATION_MS
    var targetHeight = 0
    var fromHeight = 0
    var startTime = 0
    var frameId = 0

    /**
     * Applies the current animated height to the iframe.
     *
     * @param {number} height Target pixel height for this frame.
     */
    var applyHeight = function (height) {
      iframe.style.height = Math.max(1, Math.round(height)) + 'px'
    }

    /**
     * Reads the iframe's current rendered height.
     *
     * @returns {number} Current height in pixels.
     */
    var getCurrentHeight = function () {
      return iframe.getBoundingClientRect().height || 1
    }

    /**
     * Runs one animation frame until the target height is reached.
     *
     * @param {number} timestamp Current animation frame timestamp.
     */
    var tick = function (timestamp) {
      if (!startTime) {
        startTime = timestamp
      }

      var elapsed = timestamp - startTime
      var progress = Math.min(1, elapsed / durationMs)
      var easedProgress = easeOutCubic(progress)
      var nextHeight = fromHeight + (targetHeight - fromHeight) * easedProgress

      applyHeight(nextHeight)

      if (progress < 1) {
        frameId = global.requestAnimationFrame(tick)
        return
      }

      applyHeight(targetHeight)
      frameId = 0
      startTime = 0
    }

    /**
     * Animates the iframe to the requested content height.
     *
     * @param {number} nextHeight Measured iframe content height.
     */
    var setHeight = function (nextHeight) {
      if (!Number.isFinite(nextHeight) || nextHeight <= 0) {
        return
      }

      if (Math.abs(nextHeight - targetHeight) < MIN_DELTA_PX && frameId) {
        return
      }

      if (!frameId && Math.abs(nextHeight - getCurrentHeight()) < MIN_DELTA_PX) {
        return
      }

      targetHeight = nextHeight

      if (frameId) {
        global.cancelAnimationFrame(frameId)
      }

      fromHeight = getCurrentHeight()
      startTime = 0
      frameId = global.requestAnimationFrame(tick)
    }

    return {
      setHeight: setHeight,
    }
  }

  global.SidhuIframeResize = {
    createAnimator: createAnimator,
  }
})(window)

;(function (global) {
  var script = document.currentScript
  var appOrigin = 'https://sidhu-finanzen.vercel.app'

  if (script && script.src) {
    try {
      appOrigin = new URL(script.src).origin
    } catch (error) {
      appOrigin = 'https://sidhu-finanzen.vercel.app'
    }
  }

  if (global.SidhuIframeLightbox && global.SidhuIframeLightbox.autoInit) {
    global.SidhuIframeLightbox.autoInit(appOrigin)
    return
  }

  var lightboxScript = document.createElement('script')
  lightboxScript.src = appOrigin + '/wordpress/sidhu-iframe-lightbox.js?v=2'
  lightboxScript.async = false
  document.head.appendChild(lightboxScript)
})(window)
