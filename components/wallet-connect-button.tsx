"use client"

import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"
import { toast } from "sonner"
import { useEffect, useState } from "react"

export function WalletConnectButton() {
  const [mounted, setMounted] = useState(false)
  const address = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && tonConnectUI) {
      console.log("TonConnectUI status:", {
        initialized: !!tonConnectUI,
        connected: !!address,
        address: address
      })
    }
  }, [tonConnectUI, address, mounted])

  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  const handleConnect = async () => {
    try {
      if (!tonConnectUI) {
        toast.error("🍌 Wallet connection is loading...")
        console.error("TonConnectUI not initialized")
        return
      }
      
      console.log("Opening TON Connect modal...")
      
      // For Telegram Mini Apps, use the modal method
      await tonConnectUI.openModal()
      
    } catch (error) {
      console.error("Error opening TON Connect modal:", error)
      toast.error("🍌 Failed to open wallet connection")
    }
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <Button
        size="sm"
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 text-xs px-2.5 h-8 whitespace-nowrap"
        disabled
      >
        <Wallet className="mr-1 h-3 w-3" />
        Connect
      </Button>
    )
  }

  if (address) {
    return (
      <Button
        size="sm"
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 text-xs px-2 h-8"
        onClick={handleConnect}
      >
        <Wallet className="mr-1 h-3 w-3" />
        {formatAddress(address)}
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 text-xs px-2.5 h-8 whitespace-nowrap"
      onClick={handleConnect}
    >
      <Wallet className="mr-1 h-3 w-3" />
      Connect
    </Button>
  )
}