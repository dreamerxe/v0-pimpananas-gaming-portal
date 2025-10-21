"use client"

import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"
import { useEffect, useState } from "react"

export function useWallet() {
  const address = useTonAddress()
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Update connection status
    setIsConnected(!!wallet && !!address)
  }, [wallet, address])

  const connect = async () => {
    try {
      await tonConnectUI.openModal()
    } catch (error) {
      console.error("[v0] Error connecting wallet:", error)
    }
  }

  const disconnect = async () => {
    try {
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