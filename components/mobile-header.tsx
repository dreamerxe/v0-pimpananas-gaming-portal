"use client"

import { Bell, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { Badge } from "@/components/ui/badge"

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 backdrop-blur-xl bg-background/80 shadow-xl shadow-primary/5">
      <div className="px-4 py-3 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          {/* Logo with premium styling */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
              <span className="relative text-3xl drop-shadow-[0_0_12px_rgba(255,226,71,0.6)] animate-pulse-glow">
                🍌
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <h1 className="text-lg sm:text-xl font-black bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent tracking-tight">
                PIMPANANAS
              </h1>
              <div className="flex items-center gap-1 mt-0.5">
                <Badge variant="secondary" className="text-[8px] px-1.5 py-0 h-auto font-bold">
                  PREMIUM
                </Badge>
                <Sparkles className="h-2.5 w-2.5 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-9 w-9 relative group hover:bg-primary/10 transition-all"
              onClick={() => console.log("Notifications clicked")}
            >
              <Bell className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              {/* Notification dot */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border border-background animate-pulse" />
            </Button>

            <WalletConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}