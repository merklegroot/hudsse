import type { Metadata } from 'next'
import Navigation from '../components/Navigation'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'SSE App',
  description: 'Server-Sent Events application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
