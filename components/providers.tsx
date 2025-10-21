"use client"

import { TonConnectUIProvider } from "@tonconnect/ui-react"
import { TelegramProvider } from "@/components/telegram-provider"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/next"
import { useEffect, useState } from "react"

const manifestUrl = "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("Providers mounted, TON Connect initializing...")
  }, [])

  // Always render children, but delay TON Connect initialization
  return (
    <>
      {mounted ? (
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
          <TelegramProvider>
            {children}
          </TelegramProvider>
        </TonConnectUIProvider>
      ) : (
        <TelegramProvider>
          {children}
        </TelegramProvider>
      )}
      <Toaster position="top-center" theme="dark" />
      <Analytics />
    </>
  )
}