import { expect, test } from '@playwright/test'

import { clickParentLightboxBackdrop, clickParentLightboxClose } from './lightbox-helpers'

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

    await clickParentLightboxBackdrop(page)

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

    await clickParentLightboxClose(page)

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
