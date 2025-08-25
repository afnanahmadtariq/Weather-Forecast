import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { Toaster } from '@/components/ui/toaster'
import { WeatherProvider } from '@/components/weather-provider'

export const metadata: Metadata = {
  title: 'Weather Forecast',
  description: 'A simple weather forecast application'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/weather/partly-cloudy.png" />
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>
    <body className="min-h-screen bg-[url('/rain.png')] text-white p-6">
        <WeatherProvider>
          <Navigation />
          <div className="ml-[5.5rem]">{children}</div>
          <Toaster />
        </WeatherProvider>
    </body>
    </html>
  )
}
