"use client"

import { TonConnectUIProvider } from "@tonconnect/ui-react"
import type React from "react"
import { useEffect, useState } from "react"

export function TonConnectProvider({ children }: { children: React.ReactNode }) {
  const [manifestUrl, setManifestUrl] = useState<string>("")

  useEffect(() => {
    // Create a dynamic manifest URL based on your domain
    // For development, you can use a test manifest
    const isDev = process.env.NODE_ENV === "development"
    
    if (isDev) {
      // Use the test manifest for development
      setManifestUrl(
        "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json"
      )
    } else {
      // In production, use your own manifest hosted on your domain
      // You need to create a tonconnect-manifest.json file in your public folder
      setManifestUrl(`${window.location.origin}/tonconnect-manifest.json`)
    }
  }, [])

  if (!manifestUrl) {
    return <>{children}</>
  }

  return (
    <TonConnectUIProvider 
      manifestUrl={manifestUrl}
      actionsConfiguration={{
        twaReturnUrl: typeof window !== "undefined" ? window.location.origin : undefined
      }}
    >
      {children}
    </TonConnectUIProvider>
  )
}