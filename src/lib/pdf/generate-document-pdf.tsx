import { renderToBuffer } from '@react-pdf/renderer'

import { DocumentLetterTemplate } from '@/lib/pdf/document-letter-template'
import { getLogoDataUri } from '@/lib/pdf/logo-path'
import type { DocumentTemplate } from '@/types/document-template'

/**
 * Generates a PDF buffer for a financing document template.
 *
 * @param template Document content to render.
 */
export const generateDocumentPdf = async (
  template: DocumentTemplate
): Promise<Buffer> => {
  const logoSrc = getLogoDataUri()

  return renderToBuffer(
    <DocumentLetterTemplate template={template} logoSrc={logoSrc} />
  )
}
