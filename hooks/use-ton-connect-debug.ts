"use client"

import { useTonConnectUI } from "@tonconnect/ui-react"
import { useEffect } from "react"
import { toast } from "sonner"

export function useTonConnectDebug() {
  const [tonConnectUI] = useTonConnectUI()

  useEffect(() => {
    if (!tonConnectUI) return

    // Listen to connection status changes
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        console.log("Wallet connected:", wallet)
        toast.success(`🍌 Wallet connected: ${wallet.account.address.slice(0, 6)}...`)
      } else {
        console.log("Wallet disconnected")
        toast.info("🍌 Wallet disconnected")
      }
    })

    // Check modal state
    tonConnectUI.onModalStateChange((state) => {
      console.log("Modal state changed:", state)
      if (state.status === "opened") {
        console.log("Modal opened successfully")
      } else if (state.status === "closed") {
        console.log("Modal closed, closeReason:", state.closeReason)
        if (state.closeReason === "user-closes-modal") {
          toast.info("🍌 Connection cancelled")
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [tonConnectUI])
}

// Component to add to your app
export function TonConnectDebugger() {
  useTonConnectDebug()
  return null
}