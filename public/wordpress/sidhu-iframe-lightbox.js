/**
 * Parent-page lightbox for Sidhu iframe embeds.
 *
 * Renders fullscreen image overlays on the WordPress page so images stay centered
 * in the browser viewport instead of the iframe document.
 */
;(function (global) {
  var LIGHTBOX_MESSAGE_TYPE = 'sidhu-iframe-lightbox'
  var LIGHTBOX_CLOSE_MESSAGE_TYPE = 'sidhu-iframe-lightbox-close'

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
    var overlay = null
    var state = {
      images: [],
      activeIndex: 0,
      propertyTitle: '',
    }

    /**
     * Removes the parent lightbox overlay from the DOM.
     */
    var removeOverlay = function () {
      if (!overlay) {
        return
      }

      overlay.remove()
      overlay = null
      setParentScrollLock(false)
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
      removeOverlay()
      notifyIframeClosed()
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
     * Creates a circular lightbox control button.
     *
     * @param {string} label Accessible button label.
     * @param {string} content Button content.
     * @param {string} className Additional CSS classes.
     * @returns {HTMLButtonElement} Configured button element.
     */
    var createButton = function (label, content, className) {
      var button = document.createElement('button')
      button.type = 'button'
      button.setAttribute('aria-label', label)
      button.className = className
      button.innerHTML = content
      return button
    }

    /**
     * Builds and mounts the parent lightbox overlay.
     */
    var renderOverlay = function () {
      removeOverlay()
      setParentScrollLock(true)

      overlay = document.createElement('div')
      overlay.setAttribute('role', 'dialog')
      overlay.setAttribute('aria-modal', 'true')
      overlay.setAttribute('aria-label', 'Bildergalerie Vollbild')
      overlay.style.cssText = [
        'position:fixed',
        'inset:0',
        'z-index:999999',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'background:rgba(0,0,0,0.85)',
        'padding:16px',
        'box-sizing:border-box',
      ].join(';')

      overlay.addEventListener('click', closeLightbox)

      var closeButton = createButton(
        'Galerie schließen',
        '&times;',
        'position:absolute;top:16px;right:16px;width:40px;height:40px;border:0;border-radius:9999px;background:rgba(255,255,255,0.15);color:#fff;font-size:28px;line-height:1;cursor:pointer;'
      )
      closeButton.addEventListener('click', function (event) {
        event.stopPropagation()
        closeLightbox()
      })
      overlay.appendChild(closeButton)

      if (state.images.length > 1) {
        var previousButton = createButton(
          'Vorheriges Bild',
          '&#8592;',
          'position:absolute;left:16px;top:50%;transform:translateY(-50%);width:48px;height:48px;border:0;border-radius:9999px;background:rgba(255,255,255,0.15);color:#fff;font-size:24px;cursor:pointer;'
        )
        previousButton.addEventListener('click', function (event) {
          event.stopPropagation()
          goToOffset(-1)
        })
        overlay.appendChild(previousButton)

        var nextButton = createButton(
          'Nächstes Bild',
          '&#8594;',
          'position:absolute;right:16px;top:50%;transform:translateY(-50%);width:48px;height:48px;border:0;border-radius:9999px;background:rgba(255,255,255,0.15);color:#fff;font-size:24px;cursor:pointer;'
        )
        nextButton.addEventListener('click', function (event) {
          event.stopPropagation()
          goToOffset(1)
        })
        overlay.appendChild(nextButton)
      }

      var content = document.createElement('div')
      content.style.cssText =
        'display:flex;max-height:90vh;max-width:min(1024px,100%);flex-direction:column;align-items:center;gap:12px;'
      content.addEventListener('click', function (event) {
        event.stopPropagation()
      })

      var imageElement = document.createElement('img')
      imageElement.setAttribute('data-sidhu-lightbox-image', 'true')
      imageElement.style.cssText =
        'max-height:80vh;width:auto;max-width:100%;border-radius:8px;object-fit:contain;'
      content.appendChild(imageElement)

      var captionElement = document.createElement('p')
      captionElement.setAttribute('data-sidhu-lightbox-caption', 'true')
      captionElement.style.cssText = 'margin:0;font-size:14px;color:rgba(255,255,255,0.8);'
      content.appendChild(captionElement)

      overlay.appendChild(content)
      document.body.appendChild(overlay)
      renderActiveImage()

      /**
       * Handles keyboard navigation inside the parent lightbox.
       *
       * @param {KeyboardEvent} event Keyboard event from the parent document.
       */
      var handleKeyDown = function (event) {
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

      document.addEventListener('keydown', handleKeyDown)
      overlay.dataset.keydownAttached = 'true'
      overlay.sidhuKeydownHandler = handleKeyDown
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
        if (overlay && overlay.sidhuKeydownHandler) {
          document.removeEventListener('keydown', overlay.sidhuKeydownHandler)
        }
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

        if (overlay && overlay.sidhuKeydownHandler) {
          document.removeEventListener('keydown', overlay.sidhuKeydownHandler)
        }

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
