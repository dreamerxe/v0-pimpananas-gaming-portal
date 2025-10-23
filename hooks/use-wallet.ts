// ...existing code...
"use client"

import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"
import { useMemo } from "react"

export function useWallet() {
  const address = useTonAddress()
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()

  // derive connection status directly so it never goes stale
  const isConnected = useMemo(() => Boolean(wallet && address), [wallet, address])

  const connect = async () => {
    try {
      if (!tonConnectUI?.openModal) {
        console.warn("[v0] tonConnectUI not ready")
        return
      }
      await tonConnectUI.openModal()
    } catch (error) {
      console.error("[v0] Error connecting wallet:", error)
    }
  }

  const disconnect = async () => {
    try {
      if (!tonConnectUI?.disconnect) {
        console.warn("[v0] tonConnectUI not ready")
        return
      }
      await tonConnectUI.disconnect()
    } catch (error) {
      console.error("[v0] Error disconnecting wallet:", error)
    }
  }

  return {
    address,
    wallet,
    isConnected,
    connect,
    disconnect,
  }
}
// ...existing code...