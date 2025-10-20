"use client"

import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"

export function useWallet() {
  const address = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()

  const isConnected = !!address

  const connect = async () => {
    await tonConnectUI.openModal()
  }

  const disconnect = async () => {
    await tonConnectUI.disconnect()
  }

  return {
    address,
    isConnected,
    connect,
    disconnect,
  }
}
