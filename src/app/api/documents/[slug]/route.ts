import { NextResponse } from 'next/server'

import { getDocumentTemplate } from '@/lib/document-templates'
import { generateDocumentPdf } from '@/lib/pdf/generate-document-pdf'

type RouteParams = {
  params: Promise<{ slug: string }>
}

/**
 * Generates and returns a financing document PDF for the given slug.
 *
 * @param _request Incoming request.
 * @param params Route params containing the document slug.
 */
export const GET = async (_request: Request, { params }: RouteParams) => {
  const { slug } = await params
  const template = getDocumentTemplate(slug)

  if (!template) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  try {
    const pdfBuffer = await generateDocumentPdf(template)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${template.filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error(`Failed to generate PDF for "${slug}"`, error)
    return NextResponse.json(
      { error: 'Failed to generate document PDF' },
      { status: 500 }
    )
  }
}
