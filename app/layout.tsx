import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { TonConnectProvider } from "@/providers/ton-connect-provider"
import { TelegramProvider } from "@/components/telegram-provider"
import { Toaster } from "sonner"
import Script from "next/script"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PIMPANANAS - Web3 Gaming Portal",
  description: "Play the best WebGL games with your TON wallet. Neon-powered gaming paradise.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={`font-sans antialiased`}>
        <TelegramProvider>
          <TonConnectProvider>
            {children}
            <Toaster position="top-center" theme="dark" />
            <Analytics />
          </TonConnectProvider>
        </TelegramProvider>
      </body>
    </html>
  )
}
