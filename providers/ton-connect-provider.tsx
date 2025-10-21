"use client"

import { TonConnectUIProvider } from "@tonconnect/ui-react"
import type React from "react"

const manifestUrl =
  typeof window !== "undefined"
    ? `${window.location.origin}/tonconnect-manifest.json`
    : "https://v0-pimpananas-gaming-portal-kohl.vercel.app/tonconnect-manifest.json"

export function TonConnectProvider({ children }: { children: React.ReactNode }) {
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
          }
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: typeof window !== "undefined" ? window.location.origin : undefined
      }}
    >
      {children}
    </TonConnectUIProvider>
  )
}