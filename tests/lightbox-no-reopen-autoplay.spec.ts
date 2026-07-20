import { expect, test } from '@playwright/test'

test('stays closed while slideshow autoplay runs', async ({ page }) => {
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

  if (closeBox) {
    await page.mouse.click(closeBox.x, closeBox.y)
  }

  await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)

  // Allow slideshow autoplay / iframe resize events to fire
  await page.waitForTimeout(10_000)
  await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)
})
