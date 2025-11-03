import type { Metadata } from "next"
import { Inter, Poppins } from 'next/font/google'
import Script from "next/script"
import "./globals.css"
import { Providers } from "@/components/providers"

// Premium font for body text - Inter (clean, modern, highly legible)
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

// Premium font for headings - Poppins (bold, contemporary, designer feel)
const poppins = Poppins({ 
  subsets: ["latin"],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: "PIMPANANAS - Premium Web3 Gaming Portal",
  description: "Play the best WebGL games with your TON wallet. Premium gaming experience with $PIMP rewards.",
  keywords: "Web3 gaming, TON wallet, blockchain games, play to earn, PIMPANANAS",
  authors: [{ name: "PIMPANANAS Team" }],
  openGraph: {
    title: "PIMPANANAS - Premium Web3 Gaming Portal",
    description: "Play premium WebGL games and earn $PIMP coins",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${poppins.variable}`}>
      <head>
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body className="antialiased font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}