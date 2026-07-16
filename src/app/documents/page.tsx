'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import {
  DocumentDescription,
  getDocumentPdfUrl,
} from '@/components/document-description'
import { DOCUMENT_TEMPLATES } from '@/lib/document-templates'

export default function FinanceServices() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section
      className='relative min-h-[700px] bg-cover bg-center py-20'
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

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {DOCUMENT_TEMPLATES.map((template) => {
            const isOpen = active === template.title

            return (
              <div
                key={template.slug}
                className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
              >
                <button
                  onClick={() => setActive(isOpen ? null : template.title)}
                  className='flex w-full items-center justify-between gap-4 p-6 text-left'
                >
                  <h2 className='text-lg font-medium text-gray-900'>
                    {template.title}
                  </h2>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-700 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-500 ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className='overflow-hidden'>
                    <div className='px-6 pb-6'>
                      <div className='mb-5 leading-6'>
                        <DocumentDescription template={template} />
                      </div>

                      <a
                        href={getDocumentPdfUrl(template.slug)}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex rounded-lg bg-green-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-600'
                      >
                        Als PDF anzeigen
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
