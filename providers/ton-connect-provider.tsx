"use client"

import { TonConnectUIProvider } from "@tonconnect/ui-react"
import type React from "react"

const manifestUrl =
  "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json"

export function TonConnectProvider({ children }: { children: React.ReactNode }) {
  return <TonConnectUIProvider manifestUrl={manifestUrl}>{children}</TonConnectUIProvider>
}
