import { readFileSync } from 'node:fs'
import path from 'node:path'

/** Absolute path to the Sidhu Finanzen logo used in PDF generation. */
export const SIDHU_LOGO_PATH = path.join(
  process.cwd(),
  'public/sidhu-finanzen-logo.png'
)

/**
 * Loads the Sidhu Finanzen logo as a base64 data URI for react-pdf.
 */
export const getLogoDataUri = (): string => {
  const logoBuffer = readFileSync(SIDHU_LOGO_PATH)
  return `data:image/png;base64,${logoBuffer.toString('base64')}`
}
