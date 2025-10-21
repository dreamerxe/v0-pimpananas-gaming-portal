"use client"

import { TonConnectUIProvider } from "@tonconnect/ui-react"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/next"
import { useEffect, useState } from "react"

const manifestUrl =
  typeof window !== "undefined"
    ? `${window.location.origin}/tonconnect-manifest.json`
    : "https://v0-pimpananas-gaming-portal-kohl.vercel.app/tonconnect-manifest.json"


export function Providers({ children }: { children: React.ReactNode }) {
  const [isTelegramReady, setIsTelegramReady] = useState(false)

  useEffect(() => {
    // Wait for Telegram WebApp to be ready
    if (typeof window !== "undefined") {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready()
        window.Telegram.WebApp.expand()
      }
      setIsTelegramReady(true)
    }
  }, [])

  // Don't render anything until we're on the client
  if (!isTelegramReady) {
    return null
  }

  return (
    <TonConnectUIProvider 
      manifestUrl={manifestUrl}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "telegram-wallet",
            name: "Wallet",
            imageUrl: "https://wallet.tg/images/logo-288.png",
            aboutUrl: "https://wallet.tg/",
            bridgeUrl: "https://bridge.ton.space/bridge",
            platforms: ["ios", "android", "macos", "windows", "linux"],
            universalLink: "https://t.me/wallet/start"
          },
          {
            appName: "tonkeeper",
            name: "Tonkeeper",
            imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png",
            aboutUrl: "https://tonkeeper.com",
            universalLink: "https://app.tonkeeper.com/ton-connect",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android", "chrome", "firefox"]
          }
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: typeof window !== "undefined" ? window.location.origin : undefined
      }}
    >
      {children}
      <Toaster position="top-center" theme="dark" />
      <Analytics />
    </TonConnectUIProvider>
  )
}

// Add TypeScript declaration for Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp: any
    }
  }
}