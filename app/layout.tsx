import type { Metadata } from 'next'
import { AuthProvider, UIProvider, PortalProvider } from '@/lib/context'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Ravok Studios',
  description: 'Venture studio for entertainment, film, and media innovation',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AuthProvider>
          <UIProvider>
            <PortalProvider>
              {children}
            </PortalProvider>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
