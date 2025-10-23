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
        const webApp = window.Telegram.WebApp
        
        webApp.ready()
        webApp.expand()
        webApp.enableClosingConfirmation()
        
        // Set header color to match your app
        webApp.setHeaderColor('#000000')
        webApp.setBackgroundColor('#000000')
        
        console.log("[Providers] Telegram WebApp initialized", {
          platform: webApp.platform,
          version: webApp.version,
          initDataUnsafe: webApp.initDataUnsafe,
          colorScheme: webApp.colorScheme
        })
      }
      setIsTelegramReady(true)
    }
  }, [])

  // Don't render anything until we're on the client
  if (!isTelegramReady) {
    return null
  }

  // Get the Telegram bot username from the URL or environment
  const getTelegramBotName = () => {
    if (typeof window !== 'undefined') {
      // Try to extract from initData
      const initData = window.Telegram?.WebApp?.initDataUnsafe
      if (initData?.start_param) {
        return initData.start_param
      }
    }
    // Fallback - replace with your actual bot username
    return "YourBotUsername"
  }

  const botName = getTelegramBotName()

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
            universalLink: "https://t.me/wallet?attach=wallet",
            jsBridgeKey: "telegram-wallet"
          },
          {
            appName: "tonkeeper",
            name: "Tonkeeper",
            imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png",
            aboutUrl: "https://tonkeeper.com",
            universalLink: "https://app.tonkeeper.com/ton-connect",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android", "chrome", "firefox"],
            jsBridgeKey: "tonkeeper"
          }
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: `https://t.me/${botName}`,
        returnStrategy: 'back',
        skipRedirectToWallet: 'never'
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