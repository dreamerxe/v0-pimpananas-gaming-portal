"use client"

import { Bell, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"
import { toast } from "sonner"

export function MobileHeader() {
  const address = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()

  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  const handleConnect = async () => {
    try {
      if (!tonConnectUI) {
        toast.error("TON Connect is not initialized")
        return
      }
      
      // Check if already connected
      if (address) {
        // Show wallet info or disconnect options
        tonConnectUI.openModal()
        return
      }

      // Open the modal to connect
      await tonConnectUI.openModal()
    } catch (error) {
      console.error("Error opening TON Connect modal:", error)
      toast.error("Failed to open wallet connection")
    }
  }

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
            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/10">
              <Bell className="h-4 w-4" />
            </Button>

            {address ? (
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 text-xs px-2 h-8"
                onClick={handleConnect}
              >
                <Wallet className="mr-1 h-3 w-3" />
                {formatAddress(address)}
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 text-xs px-2.5 h-8 whitespace-nowrap"
                onClick={handleConnect}
              >
                <Wallet className="mr-1 h-3 w-3" />
                Connect
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}