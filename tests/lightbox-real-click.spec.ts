import { expect, test } from '@playwright/test'

test.describe('WordPress iframe lightbox – real clicks', () => {
  test('masonry image: real mouse close does not reopen', async ({ page }) => {
    await page.goto('https://sidhu-finanzen.de/immobilien-kaufen/?immobilie=53', {
      waitUntil: 'networkidle',
      timeout: 120_000,
    })
    await page.waitForTimeout(12_000)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(2_000)

    const iframe = page.frameLocator('#sidhu-properties-kaufen')
    const masonryButton = iframe.locator('button[aria-label^="Bild "]').last()
    await masonryButton.click({ timeout: 60_000, force: true })
    await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(1)

    const hostBox = await page.locator('#sidhu-parent-lightbox-host').boundingBox()
    expect(hostBox).toBeTruthy()

    // Real mouse click on backdrop area (not on image center)
    if (hostBox) {
      await page.mouse.click(hostBox.x + 20, hostBox.y + hostBox.height / 2)
    }

    await page.waitForTimeout(500)
    await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)

    await page.waitForTimeout(3_000)
    const hostCount = await page.locator('#sidhu-parent-lightbox-host').count()
    expect(hostCount).toBe(0)
  })

  test('slideshow: real mouse close via X button does not reopen', async ({ page }) => {
    await page.goto('https://sidhu-finanzen.de/immobilien-kaufen/?immobilie=53', {
      waitUntil: 'networkidle',
      timeout: 120_000,
    })
    await page.waitForTimeout(12_000)

    const iframe = page.frameLocator('#sidhu-properties-kaufen')
    await iframe.locator('button[aria-label="Bild in Vollbild öffnen"]').first().click({
      timeout: 60_000,
    })
    await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(1)

    const closeBox = await page.locator('#sidhu-parent-lightbox-host').first().evaluate((el) => {
      const btn = el.shadowRoot?.querySelector('.close')
      if (!(btn instanceof HTMLElement)) return null
      const rect = btn.getBoundingClientRect()
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
    })

    expect(closeBox).toBeTruthy()
    if (closeBox) {
      await page.mouse.click(closeBox.x, closeBox.y)
    }

    await page.waitForTimeout(500)
    await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)

    await page.waitForTimeout(3_000)
    await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)
  })

  test('only one lightbox script initializer is active', async ({ page }) => {
    await page.goto('https://sidhu-finanzen.de/immobilien-kaufen/?immobilie=53', {
      waitUntil: 'networkidle',
      timeout: 120_000,
    })
    await page.waitForTimeout(8_000)

    const initFlag = await page.evaluate(() => {
      return (window as Window & { __sidhuIframeLightboxInitialized?: boolean })
        .__sidhuIframeLightboxInitialized
    })
    expect(initFlag).toBe(true)

    const scriptCount = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[src*="sidhu-iframe-lightbox"]')).length
    })
    expect(scriptCount).toBeGreaterThan(0)
  })
})
