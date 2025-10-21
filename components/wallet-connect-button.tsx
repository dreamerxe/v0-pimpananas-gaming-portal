"use client"

import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function WalletConnectButton() {
  const address = useTonAddress()
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Debug: Log connection state
    console.log("[WalletButton] Connection State:", {
      address,
      wallet: wallet ? "Connected" : "Not connected",
      walletName: wallet?.name,
      walletAccount: wallet?.account
    })

    // Update connection status
    const connected = !!wallet && !!address
    setIsConnected(connected)

    // Listen to connection changes
    if (tonConnectUI) {
      const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
        console.log("[WalletButton] Status changed:", walletInfo)
        const newConnected = !!walletInfo && !!address
        setIsConnected(newConnected)
      })

      return () => {
        unsubscribe()
      }
    }
  }, [tonConnectUI, address, wallet])

  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  const handleConnect = async () => {
    console.log("[WalletButton] Opening modal...")
    if (tonConnectUI) {
      try {
        await tonConnectUI.openModal()
      } catch (error) {
        console.error("[WalletButton] Error opening modal:", error)
      }
    }
  }

  const handleProfileClick = () => {
    console.log("[WalletButton] Navigating to profile...")
    router.push("/profile")
  }

  // Debug: Show current state
  console.log("[WalletButton] Render state:", { isConnected, hasAddress: !!address, hasWallet: !!wallet })

  if (isConnected && address) {
    // Show connected state - clicking goes to profile
    return (
      <Button
        size="sm"
        onClick={handleProfileClick}
        className="h-8 px-2.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
      >
        <Wallet className="mr-1 h-3.5 w-3.5" />
        {formatAddress(address)}
      </Button>
    )
  }

  // Show connect button when not connected
  return (
    <Button
      size="sm"
      onClick={handleConnect}
      className="h-8 px-2.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
    >
      <Wallet className="mr-1 h-3.5 w-3.5" />
      Connect
    </Button>
  )
}