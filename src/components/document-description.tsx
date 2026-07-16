import type { DocumentTemplate } from '@/types/document-template'

import { DOCUMENT_CLOSING } from '@/lib/document-templates'

type DocumentDescriptionProps = {
  template: DocumentTemplate
}

/**
 * Renders the expandable document preview content on the documents page.
 *
 * @param template Financing document template data.
 */
export const DocumentDescription = ({ template }: DocumentDescriptionProps) => (
  <div className='space-y-4 text-sm text-zinc-700'>
    <div className='font-medium text-zinc-500'>
      {template.recipient.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
    <h3 className='text-lg font-bold text-[#18181b]'>{template.heading}</h3>
    <p>Sehr geehrte Damen und Herren,</p>
    <p>
      folgende Unterlagen werden dringend für den Finanzierungsantrag
      benötigt:
    </p>
    <ul className='list-disc space-y-1.5 pl-5'>
      {template.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
    <p>{DOCUMENT_CLOSING.instruction}</p>
    <p>
      {DOCUMENT_CLOSING.greeting}
      <br />
      <span className='font-semibold text-[#18181b]'>
        {DOCUMENT_CLOSING.signature}
      </span>
    </p>
  </div>
)

/**
 * Builds the API URL for dynamically generated document PDFs.
 *
 * @param slug Document template slug.
 */
export const getDocumentPdfUrl = (slug: string): string => {
  return `/api/documents/${slug}`
}
