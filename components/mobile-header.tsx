"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTelegram } from "@/hooks/use-telegram"
import { useWallet } from "@/hooks/use-wallet"
import { useUserBalance } from "@/hooks/use-user-balance"
import { useRouter } from "next/navigation"
import { Coins } from "lucide-react"

export function MobileHeader() {
  const { user, isTelegram } = useTelegram()
  const { address, isConnected } = useWallet()
  const { balance, isLoading } = useUserBalance()
  const router = useRouter()

  const displayName = isTelegram && user 
    ? user.username || user.first_name 
    : address 
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "Guest"

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80">
      <div className="px-4 py-3 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          {/* Profile Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-lg">
              <AvatarImage src={user?.photo_url} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-yellow-400 text-primary-foreground font-bold">
                {isTelegram && user ? user.first_name?.[0] || "G" : "G"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                {isTelegram && user?.username ? `@${user.username}` : "Welcome"}
              </span>
              <span className="text-sm font-bold text-foreground">
                {isTelegram && user?.first_name || "Guest"}
              </span>
            </div>
          </div>

          {/* Coins Display */}
          <div className="flex items-center gap-2">
            {/* Coins Badge */}
            <div 
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push("/shop")}
            >
              <Coins className="h-4 w-4" />
              <span className="text-sm font-bold">
                {isLoading ? "..." : balance.toLocaleString()}
              </span>
            </div>

            {/* How to earn link */}
            <button 
              className="text-xs text-blue-500 font-medium hover:underline"
              onClick={() => router.push("/shop")}
            >
              How to earn?
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
