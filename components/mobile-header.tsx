"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useTonAddress } from "@tonconnect/ui-react"

export function MobileHeader() {
  const address = useTonAddress()
  const isConnected = !!address

  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 backdrop-blur-md bg-background/95 shadow-lg shadow-primary/5">
      <div className="px-3 py-2.5 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between gap-2">
          {/* Logo with neon glow */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,226,71,0.5)]">🍌</span>
            <h1 className="text-base sm:text-xl font-black text-primary tracking-tight">PIMPANANAS</h1>
          </div>

          {/* Wallet & Notifications */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-primary hover:bg-primary/10"
              onClick={() => console.log("Notifications clicked")}
            >
              <Bell className="h-4 w-4" />
            </Button>

            {!isConnected && <WalletConnectButton />}
          </div>
        </div>
      </div>
    </header>
  )
}