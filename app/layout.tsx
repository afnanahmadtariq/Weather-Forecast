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
          :root {
            --app-bg-image: url('https://images.unsplash.com/photo-1613488329064-aafbeb1e4db1?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
          }
        `}</style>
      </head>
    <body>
      <div
        className="min-h-screen bg-fixed bg-cover bg-center text-white p-6"
        style={{ backgroundImage: "var(--app-bg-image)" }}
      >
        <WeatherProvider>
          <Navigation />
          <div className="ml-[5.5rem]">{children}</div>
          <Toaster />
        </WeatherProvider>
      </div>
    </body>
    </html>
  )
}
