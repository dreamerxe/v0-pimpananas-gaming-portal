"use client"

import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"
import { toast } from "sonner"
import { useEffect } from "react"

export function WalletConnectButton() {
  const address = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()

  useEffect(() => {
    console.log("TonConnectUI status:", {
      initialized: !!tonConnectUI,
      connected: !!address,
      address: address
    })
  }, [tonConnectUI, address])

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
      await tonConnectUI.openModal()
    } catch (error) {
      console.error("Error opening TON Connect modal:", error)
      toast.error("🍌 Failed to open wallet connection")
    }
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