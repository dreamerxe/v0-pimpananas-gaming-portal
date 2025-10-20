import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { TonConnectProvider } from "@/providers/ton-connect-provider"
import { Toaster } from "sonner"
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
      <body className={`font-sans antialiased`}>
        <TonConnectProvider>
          {children}
          <Toaster position="top-center" theme="dark" />
          <Analytics />
        </TonConnectProvider>
      </body>
    </html>
  )
}
