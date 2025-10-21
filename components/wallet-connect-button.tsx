"use client"

import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useRouter } from "next/navigation"

export function WalletConnectButton() {
  const address = useTonAddress()
  const router = useRouter()
  const isConnected = !!address

  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  if (isConnected) {
    // Show connected state - clicking goes to profile
    return (
      <Button
        size="sm"
        onClick={() => router.push("/profile")}
        className="h-8 px-2.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
      >
        <Wallet className="mr-1 h-3.5 w-3.5" />
        {formatAddress(address)}
      </Button>
    )
  }

  // Show TON Connect button when not connected
  return (
    <div className="ton-connect-button-mobile">
      <TonConnectButton />
    </div>
  )
}