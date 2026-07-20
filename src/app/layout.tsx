import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
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
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className='flex min-h-full flex-col'>{children}</body> 
    </html>
  )
}
