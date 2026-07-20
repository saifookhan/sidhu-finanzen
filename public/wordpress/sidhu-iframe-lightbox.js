/**
 * Parent-page lightbox for Sidhu iframe embeds.
 *
 * Renders fullscreen image overlays on the WordPress page so images stay centered
 * in the browser viewport instead of the iframe document.
 */
;(function (global) {
  var LIGHTBOX_MESSAGE_TYPE = 'sidhu-iframe-lightbox'
  var LIGHTBOX_CLOSE_MESSAGE_TYPE = 'sidhu-iframe-lightbox-close'
  var LIGHTBOX_HOST_ID = 'sidhu-parent-lightbox-host'

  var LIGHTBOX_STYLES = [
    ':host { all: initial; }',
    '.overlay {',
    '  position: fixed;',
    '  inset: 0;',
    '  z-index: 2147483646;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  background: rgba(0, 0, 0, 0.85);',
    '  padding: 16px;',
    '  box-sizing: border-box;',
    '}',
    '.content {',
    '  display: flex;',
    '  max-height: 90vh;',
    '  max-width: min(1024px, 100%);',
    '  flex-direction: column;',
    '  align-items: center;',
    '  gap: 12px;',
    '}',
    '.image {',
    '  max-height: 80vh;',
    '  width: auto;',
    '  max-width: 100%;',
    '  border-radius: 8px;',
    '  object-fit: contain;',
    '}',
    '.caption {',
    '  margin: 0;',
    '  font: 400 14px/1.4 Arial, Helvetica, sans-serif;',
    '  color: rgba(255, 255, 255, 0.8);',
    '}',
    '.control {',
    '  all: unset;',
    '  box-sizing: border-box;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  cursor: pointer;',
    '  border-radius: 9999px;',
    '  background: rgba(255, 255, 255, 0.15);',
    '  color: #fff;',
    '  transition: background 0.15s ease;',
    '}',
    '.control:hover { background: rgba(255, 255, 255, 0.25); }',
    '.close {',
    '  position: absolute;',
    '  top: 16px;',
    '  right: 16px;',
    '  width: 40px;',
    '  height: 40px;',
    '  font: 400 28px/1 Arial, Helvetica, sans-serif;',
    '}',
    '.previous, .next {',
    '  position: absolute;',
    '  top: 50%;',
    '  transform: translateY(-50%);',
    '  width: 48px;',
    '  height: 48px;',
    '  font: 400 24px/1 Arial, Helvetica, sans-serif;',
    '}',
    '.previous { left: 16px; }',
    '.next { right: 16px; }',
  ].join('')

  /**
   * Locks or restores scrolling on the parent WordPress page.
   *
   * @param {boolean} isLocked Whether page scrolling should be disabled.
   */
  var setParentScrollLock = function (isLocked) {
    document.documentElement.style.overflow = isLocked ? 'hidden' : ''
    document.body.style.overflow = isLocked ? 'hidden' : ''
  }

  /**
   * Creates a parent-page lightbox controller for one iframe embed.
   *
   * @param {HTMLIFrameElement} iframe Embedded app iframe.
   * @param {string} appOrigin Trusted iframe app origin.
   * @returns {{ destroy: () => void }}
   */
  var createController = function (iframe, appOrigin) {
    var host = null
    var shadowRoot = null
    var overlay = null
    var keydownHandler = null
    var isClosing = false
    var state = {
      images: [],
      activeIndex: 0,
      propertyTitle: '',
    }

    /**
     * Enables or disables pointer interaction with the embedded iframe.
     *
     * @param {boolean} enabled Whether the iframe should receive pointer events.
     */
    var setIframePointerEvents = function (enabled) {
      iframe.style.pointerEvents = enabled ? '' : 'none'
    }

    /**
     * Removes the parent lightbox overlay from the DOM.
     */
    var removeOverlay = function () {
      if (keydownHandler) {
        document.removeEventListener('keydown', keydownHandler)
        keydownHandler = null
      }

      if (host) {
        host.remove()
        host = null
      }

      shadowRoot = null
      overlay = null
      setParentScrollLock(false)
      setIframePointerEvents(true)
      isClosing = false
    }

    /**
     * Notifies the iframe app that the parent lightbox was closed.
     */
    var notifyIframeClosed = function () {
      if (!iframe.contentWindow) {
        return
      }

      iframe.contentWindow.postMessage(
        {
          type: LIGHTBOX_CLOSE_MESSAGE_TYPE,
        },
        appOrigin
      )
    }

    /**
     * Closes the parent lightbox and syncs state back to the iframe.
     */
    var closeLightbox = function () {
      if (isClosing || !overlay) {
        return
      }

      isClosing = true
      notifyIframeClosed()

      global.requestAnimationFrame(function () {
        global.requestAnimationFrame(function () {
          removeOverlay()
        })
      })
    }

    /**
     * Renders the active image inside the parent lightbox overlay.
     */
    var renderActiveImage = function () {
      if (!overlay) {
        return
      }

      var imageElement = overlay.querySelector('[data-sidhu-lightbox-image]')
      var captionElement = overlay.querySelector('[data-sidhu-lightbox-caption]')
      var activeImage = state.images[state.activeIndex]

      if (!(imageElement instanceof HTMLImageElement) || !activeImage) {
        return
      }

      imageElement.src = activeImage.url
      imageElement.alt = activeImage.title || state.propertyTitle

      if (captionElement) {
        var label = activeImage.title || state.propertyTitle
        captionElement.textContent =
          label + ' · ' + (state.activeIndex + 1) + ' / ' + state.images.length
      }
    }

    /**
     * Moves to another image by offset, wrapping at the ends.
     *
     * @param {number} offset Step direction relative to the current index.
     */
    var goToOffset = function (offset) {
      if (state.images.length <= 1) {
        return
      }

      state.activeIndex =
        (state.activeIndex + offset + state.images.length) % state.images.length
      renderActiveImage()
    }

    /**
     * Creates a circular lightbox control button inside the shadow root.
     *
     * @param {string} label Accessible button label.
     * @param {string} content Button content.
     * @param {string} className Lightbox control class name.
     * @returns {HTMLButtonElement} Configured button element.
     */
    var createButton = function (label, content, className) {
      var button = document.createElement('button')
      button.type = 'button'
      button.setAttribute('aria-label', label)
      button.className = 'control ' + className
      button.innerHTML = content
      return button
    }

    /**
     * Builds and mounts the parent lightbox overlay.
     */
    var renderOverlay = function () {
      removeOverlay()
      setParentScrollLock(true)
      setIframePointerEvents(false)

      host = document.createElement('div')
      host.id = LIGHTBOX_HOST_ID
      host.style.cssText = 'position: fixed; inset: 0; z-index: 2147483646;'
      shadowRoot = host.attachShadow({ mode: 'open' })

      var styleElement = document.createElement('style')
      styleElement.textContent = LIGHTBOX_STYLES
      shadowRoot.appendChild(styleElement)

      overlay = document.createElement('div')
      overlay.className = 'overlay'
      overlay.setAttribute('role', 'dialog')
      overlay.setAttribute('aria-modal', 'true')
      overlay.setAttribute('aria-label', 'Bildergalerie Vollbild')
      overlay.addEventListener('click', closeLightbox)

      var closeButton = createButton('Galerie schließen', '&times;', 'close')
      closeButton.addEventListener('click', function (event) {
        event.stopPropagation()
        closeLightbox()
      })
      overlay.appendChild(closeButton)

      if (state.images.length > 1) {
        var previousButton = createButton('Vorheriges Bild', '&#8592;', 'previous')
        previousButton.addEventListener('click', function (event) {
          event.stopPropagation()
          goToOffset(-1)
        })
        overlay.appendChild(previousButton)

        var nextButton = createButton('Nächstes Bild', '&#8594;', 'next')
        nextButton.addEventListener('click', function (event) {
          event.stopPropagation()
          goToOffset(1)
        })
        overlay.appendChild(nextButton)
      }

      var content = document.createElement('div')
      content.className = 'content'
      content.addEventListener('click', function (event) {
        event.stopPropagation()
      })

      var imageElement = document.createElement('img')
      imageElement.className = 'image'
      imageElement.setAttribute('data-sidhu-lightbox-image', 'true')
      content.appendChild(imageElement)

      var captionElement = document.createElement('p')
      captionElement.className = 'caption'
      captionElement.setAttribute('data-sidhu-lightbox-caption', 'true')
      content.appendChild(captionElement)

      overlay.appendChild(content)
      shadowRoot.appendChild(overlay)
      document.body.appendChild(host)
      renderActiveImage()

      /**
       * Handles keyboard navigation inside the parent lightbox.
       *
       * @param {KeyboardEvent} event Keyboard event from the parent document.
       */
      keydownHandler = function (event) {
        if (!overlay) {
          return
        }

        if (event.key === 'Escape') {
          closeLightbox()
        }

        if (event.key === 'ArrowLeft') {
          goToOffset(-1)
        }

        if (event.key === 'ArrowRight') {
          goToOffset(1)
        }
      }

      document.addEventListener('keydown', keydownHandler)
    }

    /**
     * Handles lightbox open and close messages from the iframe app.
     *
     * @param {MessageEvent} event Cross-window message event.
     */
    var handleMessage = function (event) {
      if (event.origin !== appOrigin || !event.data) {
        return
      }

      if (event.data.type !== LIGHTBOX_MESSAGE_TYPE) {
        return
      }

      if (!event.data.isOpen) {
        removeOverlay()
        return
      }

      state.images = Array.isArray(event.data.images) ? event.data.images : []
      state.activeIndex = Number(event.data.activeIndex) || 0
      state.propertyTitle = event.data.propertyTitle || ''

      if (state.images.length === 0) {
        return
      }

      if (overlay) {
        renderActiveImage()
        return
      }

      renderOverlay()
    }

    global.addEventListener('message', handleMessage)

    return {
      destroy: function () {
        global.removeEventListener('message', handleMessage)
        removeOverlay()
      },
    }
  }

  /**
   * Initializes parent lightbox controllers for Sidhu iframe embeds on the page.
   *
   * @param {string} appOrigin Trusted iframe app origin.
   */
  var autoInit = function (appOrigin) {
    var iframes = document.querySelectorAll('iframe[src*="' + appOrigin + '"]')

    for (var index = 0; index < iframes.length; index += 1) {
      var iframe = iframes[index]

      if (!(iframe instanceof HTMLIFrameElement)) {
        continue
      }

      if (iframe.dataset.sidhuLightboxInit === 'true') {
        continue
      }

      iframe.dataset.sidhuLightboxInit = 'true'
      createController(iframe, appOrigin)
    }
  }

  global.SidhuIframeLightbox = {
    createController: createController,
    autoInit: autoInit,
  }

  autoInit('https://sidhu-finanzen.vercel.app')
})(window)
