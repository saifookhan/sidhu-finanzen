import type { Metadata } from 'next'
import { Lora, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'OnOffice Immobilien',
  description: 'Sichere iframe-fähige Immobilienlisten und Detailseiten',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='de'
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
    >
      <body className='flex min-h-full flex-col'>{children}</body>
    </html>
  )
}
