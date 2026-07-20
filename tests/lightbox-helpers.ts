import type { Page } from '@playwright/test'

/**
 * Clicks the parent lightbox close button via real mouse coordinates.
 *
 * @param page Playwright page handle.
 */
export const clickParentLightboxClose = async (page: Page): Promise<void> => {
  const closeBox = await page.locator('#sidhu-parent-lightbox-host').first().evaluate((el) => {
    const btn = el.shadowRoot?.querySelector('.close')
    if (!(btn instanceof HTMLElement)) {
      return null
    }

    const rect = btn.getBoundingClientRect()
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
  })

  if (closeBox) {
    await page.mouse.click(closeBox.x, closeBox.y)
  }
}

/**
 * Clicks an empty backdrop area on the parent lightbox overlay.
 *
 * @param page Playwright page handle.
 */
export const clickParentLightboxBackdrop = async (page: Page): Promise<void> => {
  const hostBox = await page.locator('#sidhu-parent-lightbox-host').boundingBox()

  if (!hostBox) {
    return
  }

  // Top-left padding avoids previous/next nav buttons positioned at mid-height.
  await page.mouse.click(hostBox.x + 8, hostBox.y + 8)
}
