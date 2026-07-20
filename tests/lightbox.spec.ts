import { expect, test } from '@playwright/test'

test.describe('WordPress iframe lightbox', () => {
  test('does not auto-open on page load', async ({ page }) => {
    await page.goto('https://sidhu-finanzen.de/immobilien-kaufen/?immobilie=53', {
      waitUntil: 'networkidle',
      timeout: 120_000,
    })

    await page.waitForTimeout(12_000)

    await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)
  })

  test('stays closed after manual close without reopening', async ({ page }) => {
    await page.goto('https://sidhu-finanzen.de/immobilien-kaufen/?immobilie=53', {
      waitUntil: 'networkidle',
      timeout: 120_000,
    })

    await page.waitForTimeout(12_000)

    const iframe = page.frameLocator('#sidhu-properties-kaufen')
    await iframe.locator('button[aria-label*="Bild"]').first().click({ timeout: 60_000 })
    await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(1)

    await page.locator('#sidhu-parent-lightbox-host').first().evaluate((el) => {
      el.shadowRoot?.querySelector('.close')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )
    })

    await page.waitForTimeout(2_000)
    await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)

    await page.waitForTimeout(3_000)
    await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)
  })

  test('does not reopen after backdrop close', async ({ page }) => {
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

    await page.locator('#sidhu-parent-lightbox-host').first().evaluate((el) => {
      el.shadowRoot?.querySelector('.overlay')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )
    })

    for (const delay of [500, 1000, 2000, 3000]) {
      await page.waitForTimeout(delay)
      await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)
    }
  })
})
