"use client"

import { TonConnectUIProvider } from "@tonconnect/ui-react"
import { TelegramProvider } from "@/components/telegram-provider"
import { TonConnectDebugger } from "@/hooks/use-ton-connect-debug"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/next"
import { useEffect, useState } from "react"

const manifestUrl = "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering TON Connect on server
  if (!mounted) {
    return (
      <TelegramProvider>
        {children}
        <Toaster position="top-center" theme="dark" />
      </TelegramProvider>
    )
  }

  return (
    <TonConnectUIProvider 
      manifestUrl={manifestUrl}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "tonkeeper",
            name: "Tonkeeper",
            imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png",
            aboutUrl: "https://tonkeeper.com",
            universalLink: "https://app.tonkeeper.com/ton-connect",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android", "chrome", "firefox"]
          },
          {
            appName: "tonhub",
            name: "Tonhub",
            imageUrl: "https://tonhub.com/tonconnect_logo.png",
            aboutUrl: "https://tonhub.com",
            universalLink: "https://tonhub.com/ton-connect",
            bridgeUrl: "https://connect.tonhubapi.com/tonconnect",
            platforms: ["ios", "android"]
          },
          {
            appName: "telegram-wallet",
            name: "Wallet",
            imageUrl: "https://wallet.tg/images/logo-288.png",
            aboutUrl: "https://wallet.tg/",
            bridgeUrl: "https://bridge.ton.space/bridge",
            platforms: ["ios", "android", "macos", "windows", "linux"],
            universalLink: "https://t.me/wallet/start"
          }
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: typeof window !== "undefined" ? window.location.origin : undefined
      }}
    >
      <TelegramProvider>
        <TonConnectDebugger />
        {children}
        <Toaster position="top-center" theme="dark" />
        <Analytics />
      </TelegramProvider>
    </TonConnectUIProvider>
  )
}