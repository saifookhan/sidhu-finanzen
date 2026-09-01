'use client'

import { useState } from 'react'
import { Collapse } from 'antd'

import {
  DocumentDescription,
  getDocumentPdfUrl,
} from '@/components/document-description'
import { DOCUMENT_TEMPLATES } from '@/lib/document-templates'

export default function FinanceServices() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (slug: string) => {
    setOpenItems(() => ({
      [slug]: !openItems[slug],
    }))
  }

  return (
    <section
      className='relative min-h-screen w-full bg-cover bg-center bg-no-repeat py-20'
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className='absolute inset-0 bg-white/85' />

      <div className='relative mx-auto max-w-7xl px-6'>
        <div className='mb-12 text-center'>
          <h1 className='text-4xl font-light tracking-wide text-gray-900'>
            Unsere Dienstleistungen
          </h1>
          <p className='mt-4 text-gray-600'>
            Finden Sie passende Lösungen für Ihre Finanzierung
          </p>
        </div>

        <div className='columns-1 gap-6 space-y-6 md:columns-2'>
          {DOCUMENT_TEMPLATES.map((template) => {
            const isOpen = !!openItems[template.slug]

            return (
              <div key={template.slug} className='break-inside-avoid'>
                <Collapse
                  bordered={false}
                  activeKey={isOpen ? [template.slug] : []}
                  onChange={() => toggleItem(template.slug)}
                  className='bg-white shadow-sm'
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                  }}
                  items={[
                    {
                      key: template.slug,
                      label: (
                        <div className='flex w-full items-center justify-between gap-4 py-2 text-left'>
                          <h2 className='text-lg font-medium text-gray-900'>
                            {template.title}
                          </h2>
                        </div>
                      ),
                      children: (
                        /* Scrollbar disabled on mobile, active only on medium+ screens */
                        <div className='max-h-none overflow-visible space-y-5 px-1 pb-4 md:max-h-[45vh] md:overflow-y-auto md:pr-3'>
                          <div className='leading-6'>
                            <DocumentDescription template={template} />
                          </div>

                          <a
                            href={getDocumentPdfUrl(template.slug)}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex rounded-lg px-6 py-3 text-sm font-medium text-white transition hover:opacity-90'
                            style={{ backgroundColor: '#00C950' }}
                          >
                            Als PDF anzeigen
                          </a>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}