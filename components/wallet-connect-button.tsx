"use client"

import { useEffect, useState } from "react"
import { TonConnectButton } from "@tonconnect/ui-react"

export function WalletConnectButton() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-8 w-20 bg-primary/20 animate-pulse rounded-md" />
    )
  }

  return (
    <div className="ton-connect-button-mobile">
      <TonConnectButton />
    </div>
  )
}