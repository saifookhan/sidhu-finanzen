import { expect, test } from '@playwright/test'

test('backdrop corner click closes and stays closed', async ({ page }) => {
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

  const hostBox = await page.locator('#sidhu-parent-lightbox-host').boundingBox()
  expect(hostBox).toBeTruthy()

  if (hostBox) {
    await page.mouse.click(hostBox.x + 8, hostBox.y + 8)
  }

  await page.waitForTimeout(300)
  await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)

  await page.waitForTimeout(3_000)
  await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)
})

test('close then immediate gallery click must not reopen lightbox', async ({ page }) => {
  await page.goto('https://sidhu-finanzen.de/immobilien-kaufen/?immobilie=53', {
    waitUntil: 'networkidle',
    timeout: 120_000,
  })
  await page.waitForTimeout(12_000)

  const iframe = page.frameLocator('#sidhu-properties-kaufen')
  const openButton = iframe.locator('button[aria-label="Bild in Vollbild öffnen"]').first()
  const buttonBox = await openButton.boundingBox()

  await openButton.click({ timeout: 60_000 })
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

  await page.waitForTimeout(100)
  await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)

  // Same click location as open button — simulates click-through
  if (buttonBox) {
    await page.mouse.click(
      buttonBox.x + buttonBox.width / 2,
      buttonBox.y + buttonBox.height / 2
    )
  }

  await page.waitForTimeout(500)
  const reopened = await page.locator('#sidhu-parent-lightbox-host').count()
  expect(reopened).toBe(0)
})
